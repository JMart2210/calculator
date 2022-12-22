const numberButtons = Array.from(document.querySelectorAll('.number'));
numberButtons.forEach(button => button.addEventListener('click', numberClick))

const operationButtons = Array.from(document.querySelectorAll('.operator'));
operationButtons.forEach(button => button.addEventListener('click', operationClick))

const changeButtons = Array.from(document.querySelectorAll('.change'));
changeButtons.forEach(button => button.addEventListener('click', changeClick))

const periodButton = document.getElementById('.');
const display = document.querySelector('.display');

const add = (a, b) => +a + +b;

const subtract = (a, b) => a - b;

const multiply = (a, b) => a * b;

const divide = (a, b) => a / b;

function numberClick(e) {
    if (e.target.id == '.') periodButton.disabled = true;
    if (tempInput) allClear();
    if (!first) {
        input1 ? input1 += e.target.id : input1 = e.target.id;
        displayValue = input1;
        display.textContent = input1;
        } else {
            input2 ? input2 += e.target.id : input2 = e.target.id;
            displayValue = input2;
            display.textContent = input2;
        }
    lastClick = null;
}

function changeClick(e) {
    if (tempInput) {
        input1 = tempInput;
        tempInput = null;
    }
    switch (e.target.id) {
        case 'all clear':
            allClear();
            break;
        case 'negative':
            if (input2 === 0) {
                input1 = -input1;
                displayValue = input1;
            } else {
                input2 = -input2;
                displayValue = input2;
            }
            break;
        case 'percent':
            if (input2 === 0) {
                input1 = divide(input1, 100);
                displayValue = input1;
            } else {
                input2 = divide(input2, 100);
                displayValue = input2;
            }
            break;
        }
    updateDisplay(displayValue);
}

function operationClick(e) {
    if (lastClick == e.target.id) return;
    lastClick = e.target.id;
    periodButton.disabled = false;
    if (tempInput) {
        input1 = tempInput;
        tempInput = null;
    }
    switch (e.target.id) {
        case 'add':
            nextOperator = add;
            break;
        case 'subtract':
            nextOperator = subtract;
            break;
        case 'multiply':
            nextOperator = multiply;
            break;
        case 'divide':
            nextOperator = divide;
            break;
    }
    if (input1) first = true;
    if (input1 === 0 || input2 === 0) {
        operator = nextOperator;
    } else {
        displayValue = operate(operator, input1, input2);
        operator = nextOperator;
        if (e.target.id === 'equal') {
            tempInput = displayValue;
            input1 = 0;
            input2 = 0;
        } else {
            input1 = displayValue;
            input2 = 0;
        }
    }   
    updateDisplay(displayValue);            
    }

function allClear() {
    input1 = 0;
    input2 = 0;
    first = false;
    displayValue = input1;
    operator = null;
    tempInput = null;
    lastClick = null;
    periodButton.disabled = false;
}

const operate = function(func, x, y) {
    if (!func) func = nextOperator;
    displayValue = func(x, y);
    return displayValue;
};

const updateDisplay = function(str) {
    if (str == 'Infinity') display.textContent = 'Snarky Error';
    else display.textContent = Math.round(str * 10000) / 10000;
}

let operator;
let nextOperator = add;
let first = false;
let input1 = 0;
let input2 = 0;
let tempInput;
let displayValue = 0;
display.textContent = displayValue;
let lastClick = null;
