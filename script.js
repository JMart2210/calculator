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
    
    let data = '';
    (e.key == undefined) ? data = this.id : data = e.key;
    
    // this just disables the "." once pressed. It's enabled if an operation
    // is pressed or if All Clear is run.
    
    if (data == '.') periodButton.disabled = true;
    
    // I assigned a tempInput variable if the answer is found using the 
    // equals key. This way if there is a tempInput, and you've reached
    // this point by hitting a number key, it will clear everything out
    // as if you are starting from scratch.
    
    if (tempInput) allClear();

    // First tells you if input1 has a value. So it will stay true 
    // because input1 receives the result of the calculation. It is only
    // cleared out when allClear is ran.

    if (!first) {

        // if backspace is hit, this deletes the last digit of input1.
        if (data == 'X' || data =='Backspace') {
            input1 = deleteLast(input1);
            displayValue = input1;
            return;
        }
        // this is for the first time around. If input1 doesn't exist
        // it sets it equal to the data, otherwise it appends the data 
        // to itself.
        input1 ? input1 += data : input1 = data;
        displayValue = input1;
        //I didn't use the updateDisplay func here because it limits the 
        // visible results and I wanted the user to be able to input as
        // much as they wanted to.
        display.textContent = input1;
        // This block of code is same as above, just for input2.
        } else {
            if (data == 'X' || data =='Backspace') {
                input2 = deleteLast(input2);
                displayValue = input2;
                return;
            }
            input2 ? input2 += data : input2 = data;
            displayValue = input2;
            display.textContent = input2;
        }
    // this empties lastClick, which is used to make sure operations aren't
    // pressed multiples times in a row.
    lastClick = null;
}

function changeClick(e) {
    let data = '';
    (e.key == undefined) ? data = this.id : data = e.key;
    // if there is tempInput, we want to ignore that, and treat it the same
    // as if it was regular input1. 
    if (tempInput) {
        input1 = tempInput;
        tempInput = null;
    }

    switch (data) {
        case 'all clear':
        case 'Escape':
            allClear();
            break;
        case 'negative':
            if (input2 === null) {
                input1 = -input1;
                displayValue = input1;
            } else {
                input2 = -input2;
                displayValue = input2;
            }
            break;
        case 'percent':
        case '%':
            if (input2 === null) {
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
    (e.key == undefined) ? data = this.id : data = e.key;
    
    // This used to help from hitting same operation over and over
    // but I haven't updated it since I added the keyboard strokes.
    // The data can be different and point to same operator.

    if (lastClick == data) return;
    lastClick = data;
    
    // This just enables the "." button again so the next number can use 
    // a decimal. 
    periodButton.disabled = false;

    // This treats tempInput the same as regular input1. tempInput is used
    // in the numberClick func to determine if we are using the answer 
    // that was just calculated, or inputting a new number to start from scratch.
    if (tempInput) {
        input1 = tempInput;
        tempInput = null;
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
    // This tells our numberClick func that input1 has a value.
    if (input1 != null) first = true;
    // if either input is still empty (so we aren't ready to execute)
    // this sets the operator to be next in line. 
    if (input1 == null || input2 == null) {
        operator = nextOperator;
    } 
    // this executes the operation.
    else {
        displayValue = operate(operator, input1, input2);
        operator = nextOperator;
        // After you hit equal, you want to be able to use the 
        // result of the calculation as the next input1 OR you want
        // to be able to input a new number to start from scratch.
        // tempInput gives you that functionality. 
        if (data === 'equal' || data == 'Enter') {
            tempInput = displayValue;
            input1 = null;
            input2 = null;
        } 
        // if we didn't get the answer from hitting the equal key,
        // then we just want to start the process over again by 
        // setting input1 equal to the displayValue we got from the 
        // operation.
        else { 
            input1 = displayValue;
            input2 = null;
        }
    }   
    updateDisplay(displayValue);            
    }


function allClear() {
    input1 = null;
    input2 = null;
    first = false;
    displayValue = input1;
    operator = null;
    tempInput = null;
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
let input1 = null;
let input2 = null;
let tempInput;
let displayValue = 0;
display.textContent = displayValue;
let lastClick = null;
