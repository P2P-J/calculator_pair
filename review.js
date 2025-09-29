class Calculator {
  #operators = new Map([
    ['+', { precedence: 1, operation: (a, b) => a + b }],
    ['-', { precedence: 1, operation: (a, b) => a - b }],
    ['*', { precedence: 2, operation: (a, b) => a * b }],
    ['/', { precedence: 2, operation: (a, b) => this.#validateDivision(a, b) }],
  ]);

  #expression = '';
  #displayElement;
  #resultElement;

  constructor(displayElement, resultElement) {
    this.#displayElement = displayElement;
    this.#resultElement = resultElement;
    this.clear();
  }

  #validateDivision(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }

  #validateExpression(expression) {
    if (!expression || typeof expression !== 'string') {
      throw new Error('Invalid expression');
    }

    const validTokenPattern = /^[\d+\-*/.]+$/;
    if (!validTokenPattern.test(expression)) {
      throw new Error('Expression contains invalid characters');
    }
  }

  #tokenizeExpression(expression) {
    return expression.match(/(\d+(\.\d+)?|[+\-*/])/g) || [];
  }

  #convertToPostfix(expression) {
    this.#validateExpression(expression);
    const tokens = this.#tokenizeExpression(expression);
    const stack = [];
    const postfix = [];

    tokens.forEach((token) => {
      if (this.#operators.has(token)) {
        const currentPrecedence = this.#operators.get(token).precedence;
        while (
          stack.length &&
          this.#operators.has(stack[stack.length - 1]) &&
          this.#operators.get(stack[stack.length - 1]).precedence >=
            currentPrecedence
        ) {
          postfix.push(stack.pop());
        }
        stack.push(token);
      } else {
        postfix.push(Number(token));
      }
    });

    return [...postfix, ...stack.reverse()];
  }

  #evaluatePostfix(postfixTokens) {
    const stack = [];

    postfixTokens.forEach((token) => {
      if (this.#operators.has(token)) {
        const [b, a] = [stack.pop(), stack.pop()];
        if (typeof a !== 'number' || typeof b !== 'number') {
          throw new Error('Invalid operands');
        }
        const result = this.#operators.get(token).operation(a, b);
        stack.push(result);
      } else {
        stack.push(token);
      }
    });

    if (stack.length !== 1) {
      throw new Error('Invalid expression format');
    }

    return stack[0];
  }

  appendDigit(digit) {
    if (!/^\d$/.test(digit)) return false;
    if (this.#expression === '0') {
      this.#expression = digit;
    } else {
      this.#expression += digit;
    }
    this.#updateDisplay();
    return true;
  }

  appendOperator(operator) {
    if (!this.#operators.has(operator)) return false;

    const lastChar = this.#expression.slice(-1);
    if (this.#operators.has(lastChar)) return false;

    this.#expression += operator;
    this.#updateDisplay();
    return true;
  }

  appendDecimal() {
    const numbers = this.#expression.split(/[+\-*/]/);
    const currentNumber = numbers[numbers.length - 1];

    if (currentNumber.includes('.')) return false;

    this.#expression += this.#expression.length === 0 ? '0.' : '.';
    this.#updateDisplay();
    return true;
  }

  calculate() {
    try {
      if (!this.#expression) return;

      const postfixTokens = this.#convertToPostfix(this.#expression);
      const result = this.#evaluatePostfix(postfixTokens);

      this.#displayElement.textContent = this.#expression;
      this.#resultElement.textContent = result.toLocaleString('ko-KR');
      this.#expression = String(result);
    } catch (error) {
      this.clear();
      this.#resultElement.textContent = 'Error';
    }
  }

  backspace() {
    this.#expression = this.#expression.slice(0, -1);
    this.#updateDisplay();
  }

  clear() {
    this.#expression = '';
    this.#displayElement.textContent = '';
    this.#resultElement.textContent = '0';
  }

  #updateDisplay() {
    this.#resultElement.textContent = this.#expression || '0';
  }
}

const calculator = new Calculator(
  document.querySelector('#expression'),
  document.querySelector('#result')
);

// 이벤트 리스너 설정
document.querySelector('#keypad').addEventListener('click', (event) => {
  const button = event.target.closest('.key');
  if (!button) return;

  const { key, code } = button.dataset;

  switch (code) {
    case 'Allclear':
      calculator.clear();
      break;
    case 'Backspace':
      calculator.backspace();
      break;
    case 'Equal':
      calculator.calculate();
      break;
    default:
      if (/^\d$/.test(key)) {
        calculator.appendDigit(key);
      } else if (/^[+\-*/]$/.test(key)) {
        calculator.appendOperator(key);
      } else if (key === '.') {
        calculator.appendDecimal();
      }
  }
});
