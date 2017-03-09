/* Задание
 *
 * 1. Добавить управление
 * 2. Каждая из сторон при пресечении должна перемещать на противоположенную
 * 3. Добавить рандомное появление еды (подсказка: надо навешивать на ячейки класс food)
 * 4. Размер змейки должен увеличиваться
 * 5*. Научиться увеличивать сокрость игры при увеличении количества очков
 * 6**. Придумать новую фичу и реализовать
 * 
 */

var snakeGame = (function () {
    //Константы оформляются в особом стиле
    const WIDTH = 10;
    const HEIGHT = 10;

	let score = 0;
    let headX = 0;
    let headY = 0;
    let dx = 1;
    let dy = 0;
    let currentStep = 1;
	let mainDir = [1,0];
	let amOfFood = 0;
	let foodPos = [0,0];
	
	let teleport = (dir,step) => {
		if(dir > 9)
			dir = 0;
		if(dir < 0)
			dir = 9;
		return dir;
	}

    let playStep = () => {
		mainDir = changeDir();
		dx = mainDir[0];
		dy = mainDir[1];
		headX += dx;
		headX = teleport(headX);
        headY += dy;
		headY = teleport(headY);
        let newHeadCell = getCell(headX, headY);

        removeSnakeCells();      
        addSnakeToCell(newHeadCell);
        setCellStep(newHeadCell, currentStep);
		if(amOfFood < 1){
			foodPos[0]=Math.floor(Math.random()*WIDTH);
			foodPos[1]=Math.floor(Math.random()*HEIGHT);
			let newFoodCell = getCell(foodPos[0],foodPos[1]);
			addFoodToCell(newFoodCell);
			amOfFood++;
		}
		
		eating();
		
        currentStep++;
        return true;
    }
	
	let eating = () => {
		if((headX == foodPos[0]) && (headY == foodPos[1]))
		{
			let foodCell = getCell(foodPos[0],foodPos[1]);
			removeFoodFromCell(foodCell);
			amOfFood--;
			score++;
			speed=speed-50;
		}
	}
	
	let removeFoodFromCell = cell => {
        cell.className = cell.className.replace('food', '');
    }

    let removeSnakeCells = () => {
        for (let snakeCell of getSnakeCells())
            removeSnakeFromCell(snakeCell);
    }

    let getCell = (x, y) => {
        // Можно находить элементы DOM по id
        return document.getElementById(y + '_' + x);
    }

    let getSnakeCells = () => {
        // Можно находить элементы DOM по классу
        return document.getElementsByClassName('snake');
    }

    let addSnakeToCell = cell => {
        // Строчка className может включать несколько классов, например "class1 class2".
        // Поэтому добавляем пробел.
        cell.className += ' snake';
    }
	
	let addFoodToCell = cell => {
		//Добавим еду
        cell.className += ' food';
    }

    let removeSnakeFromCell = cell => {
        cell.className = cell.className.replace('snake', '');
    }

    let setCellStep = (cell, step) => {
        // Есть соглашение, что пользовательские атрибуты называются с префикса "data-".
        cell.setAttribute('data-step', step);
    }

    let getCellStep = cell =>  {
        // Явное преобразование строки к числу через объект-обертку.
        return new Number(cell.getAttribute('data-step'));
    }

    // Только этот объект будет доступен извне.
    return {
        getScore: score,
        playStep: playStep
    }
})(); // Используем IIFE (Immediately Invoked Function Expression) для изоляции.

var changeDir = function(){
	if (down)
		return [0,1];
	if (up)
		return [0,-1];
	if (left)
		return [-1,0];
	if (right)
		return [1,0];
}
var speed = 500;
// Главный цикл игры.
let timer = setInterval(function () {
    if (!snakeGame.playStep())
    {
        // Игра закончена - останавливаем цикл.
        clearInterval(timer);
        alert('Game Over! Score: ' + snakeGame.getScore());
    }
}, speed);

var up = false;
var down = false;
var left = false;
var right = true;

// Обработка действий пользователя.
document.onkeydown = e => {
    switch (e.keyCode)
    {
		case 38:
		down = false;
		up = true;
		left = false;
		right = false;
		break;

		case 40:
		down = true;
		up = false;
		left = false;
		right = false;
		break;
		
		case 37:
		down = false;
		up = false;
		left = true;
		right = false;
		break;

		case 39:
		down = false;
		up = false;
		left = false;
		right = true;
		break;
		
		default:
		
		break;
        // http://keycode.info/
    }
}