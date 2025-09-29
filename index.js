const calculator = document.getElementById('calculator');
const keypad = calculator.querySelector('#keypad');
const displayGroup = calculator.querySelector('#display-group');
const expressionDisplay = displayGroup.querySelector('#expression');
let resultDisplay = displayGroup.querySelector('#result');
const clearButton = keypad.querySelector('#all-clear');

const initializeEvents = () => {
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  keypad.addEventListener('mousedown', onMouseDown);
  keypad.addEventListener('mouseup', onMouseUp);
};

let currentInput = '';
const OPERATORS = ['*', '/', '+', '-'];

const onKeyDown = (event) => {
  const keyButton = keypad.querySelector(`[data-code=${event.code}]`);
  const key = keyButton?.dataset.key;

  switch (event.code) {
    case 'Backspace':
      backspace();
      break;
    case 'Equal':
    case 'Enter':
      equal();
      break;
    case 'Minus':
      currentInput += key;
      resultDisplay.innerHTML = currentInput;
      break;
    default:
      currentInput += key;
      resultDisplay.innerHTML = currentInput;
      break;
  }

  keypad.querySelector(`[data-code=${event.code}]`)?.classList.add('active');
};

const onKeyUp = (event) => {
  keypad.querySelector(`[data-code=${event.code}]`)?.classList.remove('active');
};

const onMouseDown = (event) => {
  event.target.closest('.key')?.classList.add('active');
};

const onMouseUp = (event) => {
  const keyButton = event.target.closest('button.key');

  const key = keyButton?.dataset.key;
  const code = keyButton?.dataset.code;

  const lastChar = currentInput[currentInput.length - 1];

  switch (code) {
    case 'Allclear':
      resultDisplay.innerHTML = '0';
      expressionDisplay.innerHTML = '';
      currentInput = '';
      break;
    case 'Backspace':
      backspace();
      break;
    case 'Equal':
      equal();
      break;
    default:
      if (currentInput === '' && OPERATORS.includes(key)) {
        currentInput = '0' + key;
        resultDisplay.innerHTML = currentInput;
        break;
      }

      if (OPERATORS.includes(lastChar) && OPERATORS.includes(key)) break;

      if (lastChar === '.' && key === '.') break;

      if (key === '.') {
        const nums = currentInput.split(/[+\-*/]/);
        if (nums[nums.length - 1].includes('.')) break;
      }

      if (key === '0') {
        if (currentInput === '0') break;
        const nums = currentInput.split(/[+\-*/]/);
        const zero = nums[nums.length - 1];
        if (zero === '0') break;
      }

      if (key === '.') {
        if (currentInput === '' || OPERATORS.includes(lastChar)) {
          currentInput += '0.';
          resultDisplay.innerHTML = currentInput;
          break;
        }
      }

      currentInput += key;
      resultDisplay.innerHTML = currentInput;
      break;
  }

  keypad.querySelector('.active')?.classList.remove('active');
};

const getOperatorPriority = (operator) => {
  if (operator === '+' || operator === '-') return 1;
  if (operator === '*' || operator === '/') return 2;
  return 0;
};

const convertToPostfix = (expression) => {
  const stack = [];
  const postfix = [];

  const infix = expression.match(/(\d+(\.\d+)?|[+\-*/])/g);

  infix.forEach((token) => {
    if (OPERATORS.includes(token)) {
      while (
        stack.length &&
        getOperatorPriority(stack[stack.length - 1]) >=
          getOperatorPriority(token)
      ) {
        postfix.push(stack.pop());
      }
      stack.push(token);
    } else {
      postfix.push(token);
    }
  });

  while (stack.length) {
    postfix.push(stack.pop());
  }

  return postfix.join(' ');
};

const calculateToInfix = (expression) => {
  const stack = [];

  expression.split(' ').forEach((token) => {
    if (OPERATORS.includes(token)) {
      let preOperand = parseFloat(stack.pop());
      let postOperand = parseFloat(stack.pop());
      let tempResult;

      if (token === '+') tempResult = postOperand + preOperand;
      else if (token === '-') tempResult = postOperand - preOperand;
      else if (token === '*') tempResult = postOperand * preOperand;
      else if (token === '/') tempResult = postOperand / preOperand;

      stack.push(tempResult);
    } else {
      stack.push(token);
    }
  });

  return stack[0];
};

function backspace() {
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    resultDisplay.innerHTML = currentInput === '' ? '0' : currentInput;
  } else {
    resultDisplay.innerHTML = '0';
  }
}

function equal() {
  if (currentInput === '') return;
  const postfix = convertToPostfix(currentInput);
  const infix = calculateToInfix(postfix);

  expressionDisplay.innerHTML = currentInput;
  resultDisplay.innerHTML = Number(infix).toLocaleString('ko-KR');
  currentInput = resultDisplay.textContent;
}

initializeEvents();
