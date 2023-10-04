let displayValue = "";
let operators = ['+', '-', '*', '/'];

function appendToDisplay(value) {
    displayValue += value;
    document.getElementById("input").value = displayValue;
}

function clearDisplay() {
    displayValue = "";
    document.getElementById("input").value = "";
}

function calculateResult() {
    try {
        const result = evaluateExpression(displayValue);
        document.getElementById("input").value = result;
        displayValue = result.toString();
    } catch (error) {
        document.getElementById("input").value = "Error";
    }
}

function evaluateExpression(expression) {
    const tokens = tokenizeExpression(expression);
    const postfix = infixToPostfix(tokens);
    return evaluatePostfix(postfix);
}

function tokenizeExpression(expression) {
    const tokens = [];
    let currentToken = "";

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (operators.includes(char)) {
            if (currentToken !== "") {
                tokens.push(currentToken);
            }
            tokens.push(char);
            currentToken = "";
        } else {
            currentToken += char;
        }
    }

    if (currentToken !== "") {
        tokens.push(currentToken);
    }

    return tokens;
}

function infixToPostfix(tokens) {
    const output = [];
    const operatorStack = [];

    for (let token of tokens) {
        if (!operators.includes(token)) {
            output.push(token);
        } else {
            while (
                operatorStack.length > 0 &&
                operators.indexOf(operatorStack[operatorStack.length - 1]) >= operators.indexOf(token)
            ) {
                output.push(operatorStack.pop());
            }
            operatorStack.push(token);
        }
    }

    while (operatorStack.length > 0) {
        output.push(operatorStack.pop());
    }

    return output;
}

function evaluatePostfix(postfix) {
    const stack = [];

    for (let token of postfix) {
        if (!operators.includes(token)) {
            stack.push(parseFloat(token));
        } else {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    if (b === 0) {
                        throw new Error("Division by zero");
                    }
                    stack.push(a / b);
                    break;
            }
        }
    }

    if (stack.length !== 1) {
        throw new Error("Invalid expression");
    }

    return stack[0];
}
