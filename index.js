const calculator = document.getElementById('calculator')
const keypad = calculator.querySelector('#keypad')
const displayGroup = calculator.querySelector('#display-group')
const expression = displayGroup.querySelector('#expression')
let result = displayGroup.querySelector('#result')
const allClear = keypad.querySelector('#all-clear')

const initializeEvents = () => {
  // 키보드 이벤트
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
  // 마우스 이벤트
  keypad.addEventListener('mousedown', onMouseDown)
  keypad.addEventListener('mouseup', onMouseUp)
}

const onKeyDown = (event) => {
  keypad.querySelector(`[data-code=${event.code}]`)?.classList.add('active')
}

const onKeyUp = (event) => {
  keypad.querySelector(`[data-code=${event.code}]`)?.classList.remove('active')
}

const onMouseDown = (event) => {
  event.target.closest('.key')?.classList.add('active')
}

let input = ''

const onMouseUp = (event) => {
  const keyButton = event.target.closest('button.key')

  const key = keyButton?.dataset.key
  const code = keyButton?.dataset.code

  switch (code) {
    case 'Allclear':
      result.innerHTML = '0'
      expression.innerHTML = ''
      input = ''
      break
    case 'Backspace':
      input = input.slice(0, -1)
      result.innerHTML = input
      break
    case 'Equal':
      const postfix = convertPostfix(input)
      // console.log('후위표현식 : ', postfix)
      const infix = convertInfix(postfix)
      // console.log('중위표현식 : ', infix)

      expression.innerHTML = input
      result.innerHTML = Number(infix).toLocaleString('ko-KR')
      input = ''
      break
    default:
      input += key
      // console.log(input)
      result.innerHTML = input
      break
  }

  keypad.querySelector('.active')?.classList.remove('active')
}

// 1. 연산자 우선순위 비교 함수
const operatorPrecedence = (operator) => {
  if (operator === '+' || operator === '-') return 1
  if (operator === '*' || operator === '/') return 2
  return 0
}

// 2. 중위표현식을 후위표현식으로 변환해주는 함수
// 10*10+10000/10 => 1010*1000010/+
// 20.3 * 5.6 + 4.75 / 10 => 20.3 5.6 * 4.75 10 / +
const convertPostfix = (expression) => {
  const operators = ['*', '/', '+', '-']
  const stack = []
  const postfix = []

  const infix = expression.match(/(\d+(\.\d+)?|[+\-*/])/g)

  infix.forEach((token) => {
    if (operators.includes(token)) {
      while (
        stack.length &&
        operatorPrecedence(stack[stack.length - 1]) >= operatorPrecedence(token)
      ) {
        postfix.push(stack.pop())
      }
      stack.push(token)
    } else {
      postfix.push(token)
    }
  })

  while (stack.length) {
    postfix.push(stack.pop())
  }

  return postfix.join(' ')
}

// 후위표현식을 중위표현식으로 변환 후 계산해주는 함수
// 10 10 * 10000 10 / + => 10*10+10000/10
const convertInfix = (expression) => {
  const operators = ['*', '/', '+', '-']
  const stack = []

  expression.split(' ').forEach((token) => {
    if (operators.includes(token)) {
      let preOperand = parseFloat(stack.pop())
      let postOperand = parseFloat(stack.pop())
      let temp

      if (token === '+') temp = postOperand + preOperand
      else if (token === '-') temp = postOperand - preOperand
      else if (token === '*') temp = postOperand * preOperand
      else if (token === '/') temp = postOperand / preOperand

      stack.push(temp)
    } else {
      stack.push(token)
    }
  })

  console.log(stack)

  return stack[0]
}

initializeEvents()
