let switch2 = false;

function updateDisplay(text:string){
    const element = document.querySelector('.display-num') as HTMLHeadingElement
    if(text === 'clear'){
        element.textContent = "";
        return;
    }
    if(element.textContent==='L plus ratio bozo'){
        clear()
    }
    text = text === ' * ' ? ' x ' : text
    element.textContent += text
}

let num1:string = "";
let num2:string = "";
let ops = ""
let test:string[] = [];


function formatNum(num:number) {
    const decimalCount = num.toString().split('.')[1]?.length || 0;
    return decimalCount > 2 ? Math.round(num * 100) / 100 : num;
}


function backspace(){
    const element = document.querySelector('.display-num') as HTMLHeadingElement
    
   
    if(!num2 && !ops){
        switch2 = false;
        num1 = num1.slice(0, -1)
        element.textContent = (element.textContent as string).slice(0, -1)
        
    }
    if(num2){
        num2 = num2.slice(0, -1)
        element.textContent = (element.textContent as string).slice(0, -1)


    }if(ops && !num2){
        ops = ops.slice(0, -1)
        element.textContent = (element.textContent as string).slice(0, -3)
    }

    console.log('nums1 = ',num1)
    console.log('nums2 = ',num2)
    console.log('operator = ',ops)
}

function clear(){
    switch2 = false;
    num1 = ""
    num2 =""
    ops= ""
    const element = document.querySelector('.display-num') as HTMLHeadingElement
    element.textContent = "";
}


const clearButton = document.querySelector('.wipe') as HTMLButtonElement
clearButton.addEventListener('click', clear)

const delButton = document.querySelector('.backspace') as HTMLButtonElement
clearButton.addEventListener('click', backspace)

function handleClick(e:MouseEvent | KeyboardEvent){
    const target = e.target as HTMLButtonElement
    if(target.classList[0] === 'backspace'){
        return backspace()
    }if(target.classList[0] === 'wipe'){
        return clear()
    }
    const validClicks:string[] = ['operand', 'number', 'equals']
    
    const validNumber:string = '1234567890.'
    const validOperator:string = '-+*/'
    const equals = '='
    const operators: { [key: string]: (num1: number, num2: number) => number }= {
        '+': (a:number, b:number) => a + b,
        '-': (a:number, b:number) => a - b,
        '÷': (a:number, b:number) => a / b,
        'x': (a:number, b:number) => a * b,
        '*':(a:number, b:number) => a * b
      };

    
    const whatToDo :{[key: string]: (a:string) => void} ={
        'number':(text:string) => {
            updateDisplay(text)
            switch2 ? num2 += text : num1 += text 
            
        },
        'operand':(text:string) => {
            let real = ` ${text} `
            console.log(text)
            if (ops.length > 0 && !num2){
                backspace()
                ops=text
                updateDisplay(real)
                return;
            }
            
            
            if (switch2) {
                num1 = `${operators[ops](parseFloat(num1), parseFloat(num2))}`;
                num2 = "";
                 // Set ops to the new operand
            }
            ops=text
            switch2 = true;
            updateDisplay(real);
        },
        'equals':(text:string) => {
            if(ops === '÷' && parseFloat(num2) === 0){
                console.log('afer meme the ops is = ', ops)

                clear()
                return updateDisplay(`L plus ratio bozo`)
            }
           if(num1 && num2){
            updateDisplay('clear')
            updateDisplay(`${formatNum(operators[ops](parseFloat(num1), parseFloat(num2)))}`)
           }
           if(num1 && !num2 || !num1 && !num2)return;

        },
        'default':(text:string) =>{
            console.error(`invalid  operator the operator ${ops} is not  in the calculator`)
        }
    }
    const numPressed = e instanceof KeyboardEvent && validNumber.indexOf(e.key)!== -1
    const operandPressed = e instanceof KeyboardEvent && validOperator.indexOf(e.key)!== -1
    const equalPressed = e instanceof KeyboardEvent && equals.indexOf(e.key)!== -1 ||  e instanceof KeyboardEvent && e.key.toLowerCase() === 'enter'
    if(numPressed)return whatToDo['number'](e.key);
    if(operandPressed)return whatToDo['operand'](e.key);
    if(equalPressed)return whatToDo['equals'](e.key);

    if(e instanceof MouseEvent){
        const targetClass = target.classList[0]
        const targetText = target.textContent as string
        if(validClicks.indexOf(targetClass) !== -1){
            return whatToDo[targetClass](targetText)
        }
        else{
            return whatToDo['default']('d')
        }
    }
    console.log('what it thinks ops is',ops)
}


document.addEventListener('click', handleClick)
document.addEventListener('keypress', handleClick)