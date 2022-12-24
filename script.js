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
    let data = '';
    if (this.id == undefined) {
        if (e.key >= 0 && e.key <10 || e.key == '.') data = e.key;
        else return;
    } else data = this.id;
    if (data == '.') periodButton.disabled = true;
    if (tempInput) allClear();
    if (!first) {
        if (data == 'X') {
            input1 = deleteLast(input1);
            displayValue = input1;
            return;
        }
        input1 ? input1 += data : input1 = data;
        displayValue = input1;
        display.textContent = input1;
        } else {
            if (data == 'X') {
                input2 = deleteLast(input2);
                displayValue = input2;
                return;
            }
            input2 ? input2 += data : input2 = data;
            displayValue = input2;
            display.textContent = input2;
        }
    lastClick = null;
}

function changeClick(e) {
    let data = '';
    data = this.id;
    if (tempInput) {
        input1 = tempInput;
        tempInput = null;
    }
    switch (data) {
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
    let data = '';
    data = this.id;
    
    if (lastClick == data) return;
    lastClick = data;
    periodButton.disabled = false;
    if (tempInput) {
        input1 = tempInput;
        tempInput = null;
    }
    switch (data) {
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
        if (data === 'equal') {
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

function deleteLast(str) {
    if (str.toString().length == 1) return 0;
    let ans = str.slice(0, -1);
    updateDisplay(ans);
    return ans;
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
function updateKbd(e) {
    numberClick(e);
}

window.addEventListener('keydown', updateKbd);

let operator;
let nextOperator = add;
let first = false;
let input1 = 0;
let input2 = 0;
let tempInput;
let displayValue = 0;
display.textContent = displayValue;
let lastClick = null;
