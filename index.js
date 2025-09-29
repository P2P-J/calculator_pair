const calculator = document.getElementById('calculator');
const keypad = calculator.querySelector('#keypad');
const displayGroup = calculator.querySelector('#display-group');
const expression = displayGroup.querySelector('#expression');
let result = displayGroup.querySelector('#result');
const allClear = keypad.querySelector('#all-clear');

const initializeEvents = () => {
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  keypad.addEventListener('mousedown', onMouseDown);
  keypad.addEventListener('mouseup', onMouseUp);
};

let input = '';
const operators = ['*', '/', '+', '-'];

const onKeyDown = (event) => {
  const keyButton = keypad.querySelector(`[data-code=${event.code}]`);
  const key = keyButton?.dataset.key;

  if (event.code.startsWith('Digit')) {
    input += key;
    result.innerHTML = input;
  }

  if (event.code === 'Equal' || event.code === 'Enter') {
    equal();
  }

  if (event.code === 'Backspace') {
    backspace();
  }

  if (event.code === 'Minus') {
    input += key;
    result.innerHTML = input;
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

  const lastChar = input[input.length - 1];
  const operators = ['+', '-', '*', '/'];

  switch (code) {
    case 'Allclear':
      result.innerHTML = '0';
      expression.innerHTML = '';
      input = '';
      break;
    case 'Backspace':
      backspace();
      break;
    case 'Equal':
      equal();
      break;
    default:
      if (input === '' && operators.includes(key)) {
        input = '0' + key;
        result.innerHTML = input;
        break;
      }

      if (operators.includes(lastChar) && operators.includes(key)) break;

      // 소수점 연속 입력 방지
      if (lastChar === '.' && key === '.') break;

      // 현재 숫자에 소수점이 이미 있으면 방지
      if (key === '.') {
        const nums = input.split(/[+\-*/]/);
        if (nums[nums.length - 1].includes('.')) break;
      }

      if (key === '0') {
        if (input === '0') break; //처음에 00 방지
        const nums = input.split(/[+\-*/]/);
        const zero = nums[nums.length - 1];
        if (zero === '0') break;
      }

      if (key === '.') {
        if (input === '' || operators.includes(lastChar)) {
          input += '0.';
          result.innerHTML = input;
          break;
        }
      }

      input += key;
      result.innerHTML = input;
      break;
  }

  keypad.querySelector('.active')?.classList.remove('active');
};

// 1. 연산자 우선순위 비교 함수
const operatorPrecedence = (operator) => {
  if (operator === '+' || operator === '-') return 1;
  if (operator === '*' || operator === '/') return 2;
  return 0;
};

// 2. 중위표현식을 후위표현식으로 변환해주는 함수
const convertPostfix = (expression) => {
  const stack = [];
  const postfix = [];

  const infix = expression.match(/(\d+(\.\d+)?|[+\-*/])/g);

  infix.forEach((token) => {
    if (operators.includes(token)) {
      while (
        stack.length &&
        operatorPrecedence(stack[stack.length - 1]) >= operatorPrecedence(token)
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

// 후위표현식을 중위표현식으로 변환 후 계산해주는 함수
const convertInfix = (expression) => {
  const stack = [];

  expression.split(' ').forEach((token) => {
    if (operators.includes(token)) {
      let preOperand = parseFloat(stack.pop());
      let postOperand = parseFloat(stack.pop());
      let temp;

      if (token === '+') temp = postOperand + preOperand;
      else if (token === '-') temp = postOperand - preOperand;
      else if (token === '*') temp = postOperand * preOperand;
      else if (token === '/') temp = postOperand / preOperand;

      stack.push(temp);
    } else {
      stack.push(token);
    }
  });

  return stack[0];
};

function backspace() {
  if (input.length > 0) {
    input = input.slice(0, -1);
    result.innerHTML = input === '' ? '0' : input;
  } else {
    result.innerHTML = '0';
  }
}

function equal() {
  if (input === '') return;
  const postfix = convertPostfix(input);
  const infix = convertInfix(postfix);

  expression.innerHTML = input;
  result.innerHTML = Number(infix).toLocaleString('ko-KR');
  input = result.textContent;
}

initializeEvents();
