let display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let currentInput = "0";
let previousInput = "";
let operator = "";

// 1. 연산자 우선순위 비교하는 함수 하나
// 2. 중위표현식을 후위표현식으로 변환해주는 함수 하나
// 3. 후위표현식을 계산해주는 함수 하나 => 여기서 계산한 값을 display에 보여줌

// 5. 연산자 우선순위 비교하는 함수
function getOperatorPriority(operator) {
  switch (operator) {
    case "*":
    case "/":
      return 2;
    case "+":
    case "-":
      return 1;
  }
}

// 6. 중위표현식을 후위표현식으로 변환해주는 함수
function infixToPostfix(infix) {
  const operators = ["*", "/", "+", "-"];
  const stack = [];
  const postfix = [];

  infix.split("").forEach((token) => {
    if (operators.includes(token)) {
      let poped = stack.pop();
      if (getOperatorPriority(poped) > getOperatorPriority(token)) {
        postfix.push(poped);
      } else {
        stack.push(poped);
      }
      stack.push(token); //*+*
    } else {
      postfix.push(token); //2426
    }
  });
  while (stack.length !== 0) {
    postfix.push(stack.pop());
  }
  return postfix.join("");
}

console.log(infixToPostfix("10*10+10000/10")); //1010*1000010/+

function inputNumber(num) {
  console.log(num);

  if (currentInput === "0") {
    currentInput = num.toString();
  } else {
    currentInput += num;
  }
  updateDisplay();
}

function updateDisplay() {
  console.log(currentInput);

  display.textContent = currentInput;
}
buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    console.log(event.target.dataset.key);
  });
});

document.addEventListener("keydown", (e) => {
  console.log(e.key);
});

/*
1. 지금 현재 마우스랑 키보드로 클릭한 숫자들 이벤트 처리해줬어.
2. 그럼 이제 마우스랑 키보드로 클릭한 숫자들의 이벤트를 통합해줘야해.(왜냐면 마우스 클릭과 키보드 입력이 같은 방식으로 처리되어야 하니까)
3. 통합했으면, 이제 각각의 연산자들(기능들) 함수를 만들어서 이 연산자가 어떻게 처리를 해줄지 알려주고,

4. 그걸 가지고 엔터를 눌렀을때, display에 결과 보여줄 수 있도록 해야해.
4-1. 그리고 display에 식을 보여주는 것도 변수 만들어서 해줘야 하고,
5. 연산자 우선순위를 정하고, - hy
6. 연산자 우선순위를 정한 것을 통해서 중위 표현식을 후위 표현식으로 변환하는 함수를 만들어야해. - hy
7. 마지막으로 중위를 후위표현식으로 변환했으면 후위표현식을 계산하는 함수를 만들고,
8. 계산 다 햇으면 결과 값을 display에 보여주기
9. 리팩토링
*/
