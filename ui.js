const hpElement = document.getElementById('hp');
const hpBarElement = document.getElementById('hp-bar');
const scoreElement = document.getElementById('score');

const imgHP = new Image();
imgHP.src = 'icons/heart.svg';


let animations = [];

let damageIntensity = 0;
let renderDamageIntensity = 0;

let interval;

function updateUI() {
    scoreElement.innerHTML = snakeLength - 2;
    hpElement.innerHTML = `${hp} / ${maxHP}`;

    hpBarElement.style.width = `${(Math.max(hp / maxHP, 0)) * 200}px`;

    // debugger;
    for(let i = 0; i < animations.length; i++) {
        if(animations[i].lifeTime-- <= 0) animations.splice(i, i-- + 1);
    }

    renderDamageIntensity = damageIntensity--;
    if(damageIntensity < 0) damageIntensity = 0;

    checkForCheatCodes();
}

function renderUI() {
    
    for(let i = 0; i < animations.length; i++) {
        g.fillStyle = animations[i].color;
        g.globalAlpha = animations[i].lifeTime / animations[i].totalTime * 1.2;

        const textWidth = g.measureText(animations[i].text).width;
        const spacing = 2;
        const iconWidth = 12;

        const totalWidth = textWidth + spacing + iconWidth;

        g.fillText(animations[i].text, (animations[i].position % size) * tileSize + tileSize / 2 - totalWidth / 2, parseInt(animations[i].position / size) * tileSize + tileSize / 2 + 12 / 2 - 1)
        g.drawImage(imgHP, (animations[i].position % size) * tileSize + tileSize / 2 + totalWidth / 2 - 12, parseInt(animations[i].position / size) * tileSize + tileSize / 2 - 12 / 2, 12, 12)
    }
    g.globalAlpha = 1;

    if(damageIntensity) {
        g.globalAlpha = renderDamageIntensity / 20;
        g.fillStyle = '#dd3E3B';
        g.fillRect(0, 0, tileSize * size, tileSize * size);
    }
    g.globalAlpha = 1;
}

function addAnimation(position, icon, text, lifeTime, color = '#ffffff') {
    animations.push({position, icon, text, lifeTime, totalTime: lifeTime, color, nanoNow: window.performance.now()});
}

function addDamageAnimation(intensity) {
    if(damageIntensity === 0 && damageIntensity < intensity - 1) {
        damageIntensity = intensity;
    }
}

function showGameOverScreen() {
    document.getElementById('end-screen-score').innerHTML = snakeLength - 2;
    document.getElementById('end-screen').style.display = 'flex';
}

function hideGameOverScreen() {
    document.getElementById('end-screen').style.display = 'none';
}

function start() {
    clearInterval(interval);
    render();
    interval = setInterval(() => {
        update();
        render();
    }, 100)
}

function stop() {
    clearInterval(interval);
}

function reset() {
    maxHP = 30;
    hp = 30;
    snakeLength = 1;
    snake = [42];
    food = [42, 42, 42];
    direction = directions.RIGHT
    updateFood();
    animations = [];
    damageIntensity = 0;
    renderDamageIntensity = 0;
}

function gameOver() {
    stop();
    showGameOverScreen();
}


function playAgain() {
    reset();
    hideGameOverScreen();
    start();
}

const hurtAudio = new Audio('sounds/hurt.wav');
const pointAudio = new Audio('sounds/point.wav');
const deadAudio = new Audio('sounds/dead.wav');
const crashAudio = new Audio('sounds/crash.wav');

const sounds = {
    hurt: () => hurtAudio.cloneNode().play(),
    point: () => pointAudio.cloneNode().play(),
    dead: () => deadAudio.cloneNode().play(),
    crash: () => {let audio = crashAudio.cloneNode(); audio.volume = 0.4; audio.play();},

}

function playSound(type) {
    sounds[type]();
    // new Audio(`sounds/${type}.wav`).play()
}

function shakeScreen() {
    const newspaperSpinning = [
        { transform: 'translate(1px, 1px) rotate(0deg)' },
        { transform: 'translate(-1px, -2px) rotate(-1deg)' },
        { transform: 'translate(-3px, 0px) rotate(1deg)' },
        { transform: 'translate(3px, 2px) rotate(0deg)' },
        { transform: 'translate(1px, -1px) rotate(1deg)' },
        { transform: 'translate(-1px, 2px) rotate(-1deg)' },
        { transform: 'translate(-3px, 1px) rotate(0deg)' },
        { transform: 'translate(3px, 1px) rotate(-1deg)' },
        { transform: 'translate(-1px, -1px) rotate(1deg)' },
        { transform: 'translate(1px, 2px) rotate(0deg)' },
        { transform: 'translate(1px, -2px) rotate(-1deg)' },
      ];
      
      const newspaperTiming = {
        duration: 600,
        iterations: 1,
      }

    document.getElementById('game').animate(newspaperSpinning, newspaperTiming)
}

function swirlScreen() {
    const spinning = [
        { transform: 'rotate(0) scale(1)' },
        { transform: 'rotate(360deg) scale(0)' }
      ];
      
      const timing = {
        duration: 2000,
        iterations: 1,
      }

    document.getElementById('game').animate(newspaperSpinning, newspaperTiming)
}


let previousDirection = 'RIGHT';
let rickRollActivated = false;
let rickCounter = 0;

function checkForCheatCodes() {
    if(!rickRollActivated) checkRickRoll();
}

function checkRickRoll() {
    if((previousDirection === directions.RIGHT && direction === directions.LEFT) || (previousDirection === directions.LEFT && direction === directions.RIGHT)) rickCounter++;
    else rickCounter = Math.max(0, rickCounter - 1);
    previousDirection = direction;
    if(rickCounter > 4) {
        rickCounter = 0;
        initiateRickRoll();
    }
}

function initiateRickRoll() {
    //TODO: add try cath in case user doesnt give autoplay permissions
    if(rickRollActivated) return;
    rickRollActivated = true;
    let rickRoll = new Audio(parseInt(Math.random() * 20) === 4 ? 'sounds/rickroll2.mp3' : 'sounds/rickroll.mp3');
    // rickRoll.loop = true;
    rickRoll.volume = 0.1;
    rickRoll.play();
    rickRoll.addEventListener("ended", () => {
        rickRollActivated = false;
   });
}