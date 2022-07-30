let canva = document.getElementById('canvas');
let cty = canva.getContext('2d');
canva.width = getWidth(canva.offsetParent.clientWidth)
canva.height = canva.width/2
let squereWidht = getWidth(canva.offsetParent.clientWidth)/10
let toRund = canva.width/squereWidht;
let mTo = 0; // перенос значения из КейЛистнер
let headX = randX();  // голова Х
let headY = randY(); // голова У
let eatSqX = randX(); // еда Х
let eatSqY = randY(); // еда У
let snakeBody = []; 
let tailValue = 0;  //кол-во хвоста
let timerID

function getWidth(wid){
    for(wid; wid > 0;wid--){
       if((wid/2)%20 === 0 && (wid/2)%2 === 0){
        return(wid/2)
       };              
    };    
};

function randX(){   
    return Math.floor(Math.random() * toRund);
};
function randY(){
    return Math.floor(Math.random() * toRund/2);
};
function randColor() {
    let r = Math.floor(Math.random() * (256)),
        g = Math.floor(Math.random() * (256)),
        b = Math.floor(Math.random() * (256));
    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
};

function newSquare(X,Y,color){
    if(tailValue >= 2){
        for (let n = 0; n <= snakeBody.length; n = n+2){ // не появляется в хвосте
            if(snakeBody[n] == eatSqX && snakeBody[n+1] == eatSqY){
                eatSqX = randX();
                eatSqY = randY();
                }                     
            }
    };
    cty.beginPath();
    cty.fillStyle = color;
    cty.strokeStyle = 'black'; 
    cty.lineWidth = 2; 
    cty.rect(X*squereWidht,Y*squereWidht, squereWidht, squereWidht);
    cty.stroke();
    cty.fill();
};

function reStart(){ 
        mTo = 0;
        tailValue = 0;
        snakeBody.length = 0;
        headX = randX();
        headY = randY();
        eatSqX = randX(); // еда Х
        eatSqY = randY(); // еда У  
}; 

function gameOver(x,y){
    for (let n = 0; n <= snakeBody.length; n = n+2){ // сам в себя
        if(snakeBody[n] == headX && snakeBody[n+1] == headY) reStart();
        };
    if(x > ((canva.width / squereWidht -1)) || x < 0 || y > (canva.height / squereWidht -1) || y < 0) reStart();   // в стену     
    
};
function motion(){
    (mTo == "left") ?  goTo(tailValue) & headX++ :
    (mTo == "Right") ? goTo(tailValue) & headX-- :
    (mTo == "Up") ?    goTo(tailValue) & headY-- :
    (mTo == "Down") ?  goTo(tailValue) & headY++ :
    'nothing';
};


function goTo(where){
    if (where > 0){
        snakeBody.unshift(headX,headY)
        for (let i = -2; i <= where; i=i+2){
            snakeBody.splice(i,2,snakeBody[i],snakeBody[i+1]);
            newSquare(snakeBody[i],snakeBody[i+1],'red')};
            snakeBody.splice(where,2);
    }
};

function growSneke(){   
    ((tailValue/2 + 1) % 15 == 0 ) ? newSquare(eatSqX,eatSqY,randColor()): newSquare(eatSqX,eatSqY,"blue");
    if (eatSqX == headX && eatSqY == headY){ // растёт хвост
            tailValue+= 2;            
                    eatSqX = randX();
                    eatSqY = randY();
        }
};

function startScreen(){
    let arr = [];
for (i = 0; i <= canva.width/squereWidht; i++) {
    arr[i] = [];   
        for (j = 0; j <= canva.height/squereWidht; j++) {
            arr[i].push(newSquare(i,j,randColor()));
        }
    }    
};

function preview (){
(mTo == 0) ? startScreen():clearInterval();
(mTo != 0) ? game() : clearInterval();
};

function game() {         
    cty.clearRect(0,0,canva.width,canva.height);  // очистить всё        
        motion();                                   // активация хода
            newSquare(headX,headY,"darkred");       // голова
                growSneke();                        // условия роста
                    gameOver(headX,headY);          // условия конца игры
};

function resWin(){
    squereWidht = getWidth(canva.offsetParent.clientWidth)/10
    canva.width = getWidth(canva.offsetParent.clientWidth)
    canva.height = canva.width/2
};

setInterval(preview,300);

window.addEventListener('resize', resWin);

window.addEventListener("keydown", function(){     // Чтение стрелок управления
    (event.keyCode == 39) ? mTo = "left":          // шаг в лево
    (event.keyCode == 37) ? mTo = "Right":      // шаг в право
    (event.keyCode == 38) ? mTo = "Up":       // шаг вверх
    (event.keyCode == 40) ? mTo = "Down":       // шаг вниз
    (event.keyCode == 32) ? mTo = 5: mTo = 0;       // пробел для удобства тестирования
    });
       
//для тачскрина
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
let xDown = null;
let yDown = null;
 
function getTouches(evt) {
return evt.touches 
};
 
function handleTouchStart(evt) {
const firstTouch = getTouches(evt)[0];
xDown = firstTouch.clientX;
yDown = firstTouch.clientY;
};
 
function handleTouchMove(evt) {
if ( ! xDown || ! yDown ) {
return;
}
 
let xUp = evt.touches[0].clientX;
let yUp = evt.touches[0].clientY;
 
let xDiff = xDown - xUp;
let yDiff = yDown - yUp;
 
if ( Math.abs(xDiff) > Math.abs(yDiff)) {
( xDiff > 0 ) ? mTo = "Right" : mTo = "left";
}
if ( Math.abs(xDiff) < Math.abs(yDiff)) {
( yDiff > 0 ) ? mTo = "Up" : mTo = "Down";
}

xDown = null;
yDown = null;
};
