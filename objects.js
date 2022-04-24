const objectTypes = {
    WALL: 'WALL',
}


class Wall {
    constructor(position) {
        this.position = position;
        this.type = objectTypes.WALL;
    }

    update() {

    }

    render() {
        g.fillStyle = '#999999';
        g.strokeStyle = "#777777";
        g.lineWidth = 8;
        g.fillRect((this.position % size) * tileSize, parseInt(this.position / size) * tileSize, tileSize, tileSize);
        g.strokeRect((this.position % size) * tileSize, parseInt(this.position / size) * tileSize, tileSize, tileSize);
    }
}

let objects = [new Wall(83), new Wall(275)];

function updateObjects() {
    for(let i = 0; i < objects.length; i++ ) {
        if(objects[i].position === snake[0]) {
            hp = hp - maxHP;
            addAnimation(objects[i].position, 'hp', `-${maxHP}`, 10, '#dd3E3B');
            addDamageAnimation(10);
            playSound('crash');
            shakeScreen();
        }
    }
}