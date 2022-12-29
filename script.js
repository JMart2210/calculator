const add = (a, b) => +a + +b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

//This section creates an array from the classes and then adds a listener function when they are clicked.
// This is where I started on the project.
const numberButtons = Array.from(document.querySelectorAll('.number'));
numberButtons.forEach(button => button.addEventListener('click', numberClick))

const operationButtons = Array.from(document.querySelectorAll('.operator'));
operationButtons.forEach(button => button.addEventListener('click', operationClick))

const changeButtons = Array.from(document.querySelectorAll('.change'));
changeButtons.forEach(button => button.addEventListener('click', changeClick))

const periodButton = document.getElementById('.');
const display = document.querySelector('.display');


//function that is called when a number is clicked (or keyboard is pressed)

function numberClick(e) {
    // I created a data variable make it consistent whether it is coming
    // from the e.key(key stroke) or this.id (mouse click).
    
    const data = e.key || this.id;
    
    // this just disables the "." once pressed. It's enabled if an operation
    // is pressed or if All Clear is run.
    if (periodButton.disabled == true && data == '.') return;
    if (data == '.') periodButton.disabled = true;
    
    // I assigned a tempResult variable if the answer is found using the 
    // equals key. This way if there is a tempResult, and you've reached
    // this point by hitting a number key, it will clear everything out
    // as if you are starting from scratch.
    
    if (tempResult) allClear();

    // First tells you if firstOperand has a value. So it will stay true 
    // because firstOperand receives the result of the calculation. It is only
    // cleared out when allClear is ran.

    if (!first) {

        // if backspace is hit, this deletes the last digit of firstOperand.
        if (data == 'X' || data =='Backspace') {
            firstOperand = deleteLast(firstOperand);
            displayValue = firstOperand;
            return;
        }
        // this is for the first time around. If firstOperand doesn't exist
        // it sets it equal to the data, otherwise it appends the data 
        // to itself.
        firstOperand ? firstOperand += data : firstOperand = data;
        displayValue = firstOperand;
        // I didn't use the updateDisplay func here because it limits the 
        // visible results and I wanted the user to be able to input as
        // much as they wanted to.
        display.textContent = firstOperand;
        // This block of code is same as above, just for secondOperand.
        } else {
            if (data == 'X' || data =='Backspace') {
                secondOperand = deleteLast(secondOperand);
                displayValue = secondOperand;
                return;
            }
            secondOperand ? secondOperand += data : secondOperand = data;
            displayValue = secondOperand;
            display.textContent = secondOperand;
        }
    // this empties lastClick, which is used to make sure operations aren't
    // pressed multiples times in a row.
    lastClick = null;
}

function changeClick(e) {
    const data = e.key || this.id;
    // if there is tempResult, we want to ignore that, and treat it the same
    // as if it was regular firstOperand. 
    if (tempResult) {
        firstOperand = tempResult;
        tempResult = null;
    }

    switch (data) {
        case 'all clear':
        case 'Escape':
            allClear();
            break;
        case 'negative':
            if (secondOperand === null) {
                firstOperand = -firstOperand;
                displayValue = firstOperand;
            } else {
                secondOperand = -secondOperand;
                displayValue = secondOperand;
            }
            break;
        case 'percent':
        case '%':
            if (secondOperand === null) {
                firstOperand = divide(firstOperand, 100);
                displayValue = firstOperand;
            } else {
                secondOperand = divide(secondOperand, 100);
                displayValue = secondOperand;
            }
            break;
        }
    updateDisplay(displayValue);
}

function operationClick(e) {

    const data = e.key || this.id;
    
    // This used to help from hitting same operation over and over
    // but I haven't updated it since I added the keyboard strokes.
    // The data can be different and point to same operator.

    if (lastClick == data) return;
    lastClick = data;
    
    // This just enables the "." button again so the next number can use 
    // a decimal. 
    periodButton.disabled = false;

    // This treats tempResult the same as regular firstOperand. tempResult is used
    // in the numberClick func to determine if we are using the answer 
    // that was just calculated, or inputting a new number to start from scratch.
    if (tempResult) {
        firstOperand = tempResult;
        tempResult = null;
    }

    switch (data) {
        case 'add':
        case '+':
            nextOperator = add;
            break;
        case 'subtract':
        case '-':
            nextOperator = subtract;
            break;
        case 'multiply':
        case '*':
            nextOperator = multiply;
            break;
        case 'divide':
        case '/':
            nextOperator = divide;
            break;
    }
    // This tells our numberClick func that firstOperand has a value.
    if (firstOperand != null) first = true;
    // if either input is still empty (so we aren't ready to execute)
    // this sets the operator to be next in line. 
    if (firstOperand == null || secondOperand == null) {
        operator = nextOperator;
    } 
    // this executes the operation.
    else {
        displayValue = operate(operator, firstOperand, secondOperand);
        operator = nextOperator;
        // After you hit equal, you want to be able to use the 
        // result of the calculation as the next firstOperand OR you want
        // to be able to input a new number to start from scratch.
        // tempResult gives you that functionality. 
        if (data === 'equal' || data == 'Enter') {
            tempResult = displayValue;
            firstOperand = null;
            secondOperand = null;
        } 
        // if we didn't get the answer from hitting the equal key,
        // then we just want to start the process over again by 
        // setting firstOperand equal to the displayValue we got from the 
        // operation.
        else { 
            firstOperand = displayValue;
            secondOperand = null;
        }
    }   
    updateDisplay(displayValue);            
    }


function allClear() {
    firstOperand = null;
    secondOperand = null;
    first = false;
    displayValue = firstOperand;
    operator = null;
    tempResult = null;
    lastClick = null;
    periodButton.disabled = false;
}

function deleteLast(str) {
    let ans = str.slice(0, -1);
    updateDisplay(ans);
    return ans;
}

const operate = function(func, x, y) {
    // I added this line in because the first time around
    // there was no operator to use.
    if (!func) func = nextOperator;
    displayValue = func(x, y);
    return displayValue;
};

const updateDisplay = function(str) {
    if (str == 'Infinity') display.textContent = 'Snarky Error';
    else display.textContent = Math.round(str * 10000) / 10000;
}
function updateKbd(e) {
    e.preventDefault();
    switch (e.key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '.':
        case 'Backspace':
            numberClick(e);
            break;
        case '/':
        case '*':
        case '+':
        case '-':
        case 'Enter':
        case '=':
            operationClick(e);
            break;
        case '%':
        case 'Escape':
            changeClick(e);
            break;               
    }
}

document.addEventListener('keydown', updateKbd);

let operator;
let nextOperator = add;
let first = false;
let firstOperand = null;
let secondOperand = null;
let tempResult;
let displayValue = 0;
display.textContent = displayValue;
let lastClick = null;
