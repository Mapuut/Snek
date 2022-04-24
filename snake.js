const canvas = document.getElementById('game');
const g = canvas.getContext('2d');

g.font = 'bold 12px -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif';

const size = 20;
const tileSize = 30;

const dirtColors = ['#4b2207', '#442009', '#4e2811', '#3f1d07', '#461b03'];
const mapColorsIndexes = Array(size * size);

let snake = [42];
let snakeLength = 1;
let maxHP = 30;
let hp = 30;


let food = [42, 42, 42];
updateFood();




const directions = {
    UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT',
}
let direction = directions.RIGHT;

generateMap();
addKeyboard();
render();


start();

document.getElementById('body').style.opacity = '1';



function update() {
    const currentHeadIndex = snake[0];

    const movments = {
        [directions.UP]: () => {
            let nextHeadIndex = currentHeadIndex - size;
            return nextHeadIndex < 0 ? nextHeadIndex + size ** 2 : nextHeadIndex;
        },
        [directions.DOWN]: () => {
            let nextHeadIndex = currentHeadIndex + size;
            return nextHeadIndex >= size ** 2 ? nextHeadIndex - size ** 2 : nextHeadIndex;
        },
        [directions.LEFT]: () => {
            let nextHeadIndex = currentHeadIndex - 1;
            return currentHeadIndex % size === 0 ? nextHeadIndex + size : nextHeadIndex;
        },
        [directions.RIGHT]: () => {
            let nextHeadIndex = currentHeadIndex + 1;
            return currentHeadIndex % size === size - 1 ? nextHeadIndex - size : nextHeadIndex;
        },
    }

    const nextHeadIndex = movments[direction]();
    if(snake.includes(nextHeadIndex)) {
        hp = hp - 3;
        addAnimation(nextHeadIndex, 'hp', '-3', 10, '#dd3E3B');
        addDamageAnimation(3);
        playSound('hurt');
    }
    snake.unshift(nextHeadIndex);

    updateObjects();
    updateFood();
    if(hp < 0) hp = 0;

    snake = snake.slice(0, snakeLength);
    updateUI();

    if(hp === 0) {
        gameOver();
        playSound('dead');
    }
}

function render() {
    for(let i = 0; i < size ** 2; i++) {
        g.fillStyle = dirtColors[mapColorsIndexes[i]];
        g.fillRect((i % size) * tileSize, parseInt(i / size) * tileSize, tileSize, tileSize)
    }

    for(let i = 0; i < objects.length; i++) {
        objects[i].render();
    }

    g.fillStyle = '#228822';
    for(let i = snake.length - 1; i >= 0; i--) {
        g.fillStyle = '#558050';
        g.fillRect((snake[i] % size) * tileSize, parseInt(snake[i] / size) * tileSize, tileSize, tileSize)
        const outlines = getOutline(i);

        g.fillStyle = '#357040';
        const outlineWidth = 4;
        if(outlines.top) g.fillRect((snake[i] % size) * tileSize, parseInt(snake[i] / size) * tileSize - outlineWidth / 2, tileSize, outlineWidth);
        if(outlines.bottom) g.fillRect((snake[i] % size) * tileSize, parseInt(snake[i] / size) * tileSize + tileSize - outlineWidth / 2, tileSize, outlineWidth);
        if(outlines.left) g.fillRect((snake[i] % size) * tileSize - outlineWidth / 2, parseInt(snake[i] / size) * tileSize, outlineWidth, tileSize);
        if(outlines.right) g.fillRect((snake[i] % size) * tileSize + tileSize - outlineWidth / 2, parseInt(snake[i] / size) * tileSize, outlineWidth, tileSize);
    }

    g.fillStyle = '#cc2222';
    const foodSize = tileSize / 3;
    for(let i = 0; i < food.length; i++) {
        g.fillRect((food[i] % size) * tileSize + tileSize / 2 - foodSize / 2, parseInt(food[i] / size) * tileSize + tileSize / 2 - foodSize / 2, foodSize, foodSize)
    }


    ////////EYES
    g.fillStyle = '#000000'
    const eyeSize = tileSize / 5;

    if(direction === directions.UP) {
        g.fillRect((snake[0] % size) * tileSize + tileSize / 2 - eyeSize / 2 + eyeSize, parseInt(snake[0] / size) * tileSize + tileSize / 2 - eyeSize / 2 - eyeSize, tileSize / 5, tileSize / 5);
        g.fillRect((snake[0] % size) * tileSize + tileSize / 2 - eyeSize / 2 - eyeSize, parseInt(snake[0] / size) * tileSize + tileSize / 2 - eyeSize / 2 - eyeSize, tileSize / 5, tileSize / 5);
    }
    else if(direction === directions.DOWN) {
        g.fillRect((snake[0] % size) * tileSize + tileSize / 2 - eyeSize / 2 + eyeSize, parseInt(snake[0] / size) * tileSize + tileSize / 2 - eyeSize / 2 + eyeSize, tileSize / 5, tileSize / 5);
        g.fillRect((snake[0] % size) * tileSize + tileSize / 2 - eyeSize / 2 - eyeSize, parseInt(snake[0] / size) * tileSize + tileSize / 2 - eyeSize / 2 + eyeSize, tileSize / 5, tileSize / 5);
    }
    else if(direction === directions.LEFT) {
        g.fillRect((snake[0] % size) * tileSize + tileSize / 2 - eyeSize / 2 - eyeSize, parseInt(snake[0] / size) * tileSize + tileSize / 2 - eyeSize / 2 + eyeSize, tileSize / 5, tileSize / 5);
        g.fillRect((snake[0] % size) * tileSize + tileSize / 2 - eyeSize / 2 - eyeSize, parseInt(snake[0] / size) * tileSize + tileSize / 2 - eyeSize / 2 - eyeSize, tileSize / 5, tileSize / 5);
    }
    else if(direction === directions.RIGHT) {
        g.fillRect((snake[0] % size) * tileSize + tileSize / 2 - eyeSize / 2 + eyeSize, parseInt(snake[0] / size) * tileSize + tileSize / 2 - eyeSize / 2 + eyeSize, tileSize / 5, tileSize / 5);
        g.fillRect((snake[0] % size) * tileSize + tileSize / 2 - eyeSize / 2 + eyeSize, parseInt(snake[0] / size) * tileSize + tileSize / 2 - eyeSize / 2 - eyeSize, tileSize / 5, tileSize / 5);
    }
    ////////

    renderUI();
    
}

function generateMap() {
    for(let i = 0; i < size * size; i++) {
        mapColorsIndexes[i] = parseInt(Math.random() * dirtColors.length);
    }
}

function addKeyboard() {
    document.addEventListener('keydown', function(event) {
        if     ([37, 65].includes(event.keyCode)) direction = directions.LEFT;
        else if([38, 87].includes(event.keyCode)) direction = directions.UP;
        else if([39, 68].includes(event.keyCode)) direction = directions.RIGHT;
        else if([40, 83].includes(event.keyCode)) direction = directions.DOWN;
    })
}

function updateFood() {
    const eat = food.includes(snake[0]);
    if(eat) {
        playSound('point');
        snakeLength++;
        if(hp++ < maxHP) {
            addAnimation(snake[0], 'hp', '+1', 10)
        }
        if(hp >= maxHP) hp = maxHP;
    }
    const objectPositions = objects.map(o => o.position);
    for(let i = 0; i < food.length; i++) {
        if(snake.includes(food[i])) {
            let guess = parseInt(Math.random() * (size ** 2));
            while(snake.includes(guess) || food.includes(guess) || objectPositions.includes(guess)) {
                guess = parseInt(Math.random() * (size ** 2));
            }
            food[i] = guess;
        }

    }
}

function getOutline(snakeIndex) {
    let connections = [];
    if(snakeIndex !== 0) connections.push(snake[snakeIndex - 1]);
    if(snakeIndex !== snake.length - 1) connections.push(snake[snakeIndex + 1]);

    const currentHeadIndex = snake[snakeIndex];
    
    const movments = {
        top: () => {
            let nextHeadIndex = currentHeadIndex - size;
            return nextHeadIndex < 0 ? nextHeadIndex + size ** 2 : nextHeadIndex;
        },
        bottom: () => {
            let nextHeadIndex = currentHeadIndex + size;
            return nextHeadIndex > size ** 2 ? nextHeadIndex - size ** 2 : nextHeadIndex;
        },
        left: () => {
            let nextHeadIndex = currentHeadIndex - 1;
            return currentHeadIndex % size === 0 ? nextHeadIndex + size : nextHeadIndex;
        },
        right: () => {
            let nextHeadIndex = currentHeadIndex + 1;
            return currentHeadIndex % size === size - 1 ? nextHeadIndex - size : nextHeadIndex;
        },
    }

    let outlines = {
        top: !connections.includes(movments.top()), 
        bottom: !connections.includes(movments.bottom()), 
        left: !connections.includes(movments.left()), 
        right: !connections.includes(movments.right())
    };

    return outlines;
}
