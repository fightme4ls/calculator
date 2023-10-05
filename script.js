//initialize variables
let displayValue = "";
let operators = ['+', '-', '*', '/'];

//updates input field to display the value
function appendToDisplay(value) {
    displayValue += value;
    document.getElementById("input").value = displayValue;
}

//clears display
function clearDisplay() {
    displayValue = "";
    document.getElementById("input").value = "";
}

//calculation process
//calls evaluateExpression
//if evaluation is successful, displays the result. otherwise, error
function calculateResult() {
    try {
        const result = evaluateExpression(displayValue);
        document.getElementById("input").value = result;
        displayValue = result.toString();
    } catch (error) {
        document.getElementById("input").value = "Error";
    }
}

//evaluateExpression is called which calls tokenizeExpression first to create tokens
//then calls infixToPostfix with created tokens
//then calls evaluatePostfix with the created postfix notation
function evaluateExpression(expression) {
    const tokens = tokenizeExpression(expression);
    const postfix = infixToPostfix(tokens);
    return evaluatePostfix(postfix);
}

//tokenizeExpression splits the input into token (digits and operators)
//uses stack data structure to store tokens
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

//infixToPostfix turns basic expression into postfix notation, meaning 3 + 4 would become 3 4 +
//uses stack data structure to turn the tokenized expression into postfix notation
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


//evaluatePostfix takes the postfix notation and solves using switch statement
//throws an error if division by 0 occurs
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
