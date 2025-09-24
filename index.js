let display = document.getElementById('display')
let currentInput = '0'
let previousInput = ''
let operator = ''

console.log(display)

function inputNumber(num) {
  console.log(num)

  if (currentInput === '0') {
    currentInput = num.toString()
  } else {
    currentInput += num
  }
  updateDisplay()
}

function updateDisplay() {
  console.log(currentInput)

  display.textContent = currentInput
}
