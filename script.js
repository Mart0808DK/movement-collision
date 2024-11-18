window.addEventListener("load", init);

let lasttime = 0;
let lives = 100;
let gameover = false;

const player = {
    x: 0,
    y: 0,
    r: 16,
    speed: 200,
};

const enemy = {
    x: 250 - 16,
    y: 250 - 16,
    r: 16,
    speed: 200,
    direction: "down"
};

const controls = {
    up: false,
    down: false,
    left: false,
    right: false,
};

function init() {
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
    displayLives(lives);
    requestAnimationFrame(tick);
}

function tick(time) {
    if (gameover) return;
    requestAnimationFrame(tick);
    const deltatime = (time - lasttime) / 1000;
    lasttime = time;
    moveplayer(deltatime);
    moveenemy(deltatime);

    if (isColliding(player, enemy)) {
        lives--;
        displayLives(lives);
        enemy.collision = true;
        player.collision = true;
    } else {
        enemy.collision = false;
        player.collision = false;
    }

    if (lives <= 0) {
        displayGameOver();
        gameover = true;
    }

    displayPlayer();
    displayEnemy();
}

function displayPlayer() {
    const visualPlayer = document.querySelector("#player");
    visualPlayer.style.transform = `translate(${player.x}px, ${player.y}px)`;
    if (player.collision) {
        visualPlayer.classList.add("collision");
    } else {
        visualPlayer.classList.remove("collision");
    }
}

function displayEnemy() {
    const visualEnemy = document.querySelector("#enemy");
    visualEnemy.style.transform = `translate(${enemy.x}px, ${enemy.y}px)`;

    if (enemy.collision) {
        visualEnemy.classList.add("collision");
    } else {
        visualEnemy.classList.remove("collision");
    }
}

function isColliding(circleA, circleB) {
    const distance = Math.hypot(circleA.x - circleB.x, circleA.y - circleB.y);

    const combinedSize = circleA.r + circleB.r;

    return distance < combinedSize;
}

function keydown(event) {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            controls.up = true;
            break;
        case "ArrowDown":
        case "s":
            controls.down = true;
            break;
        case "ArrowLeft":
        case "a":
            controls.left = true;
            break;
        case "ArrowRight":
        case "d":
            controls.right = true;
            break;
        default:
            break;
    }
}

function keyup(event) {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            controls.up = false;
            break;
        case "ArrowDown":
        case "s":
            controls.down = false;
            break;
        case "ArrowLeft":
        case "a":
            controls.left = false;
            break;
        case "ArrowRight":
        case "d":
            controls.right = false;
            break;
        default:
            break;
    }
    
}

function moveplayer(deltatime) {
    const newPos = { x: player.x, y: player.y };

    if (controls.up) {
        newPos.y -= player.speed * deltatime;
    } else if (controls.down) {
        newPos.y += player.speed * deltatime;
    }

    if (controls.right) {
        newPos.x += player.speed * deltatime;
    } else if (controls.left) {
        newPos.x -= player.speed * deltatime;
    }

    if (validMove(newPos)) {
        player.x = newPos.x;
        player.y = newPos.y;
    }
}

function displayLives(lives) {
    const livesElement = document.querySelector("#lives");
    livesElement.textContent = `Lives: ${lives}`;
}

function displayGameOver() {
    console.log("Game Over");
    console.log(lives);
    
    
    const gameOverElement = document.querySelector("#gameover");
    gameOverElement.style.display = "block";
}

function moveenemy(deltatime) {
    const newPos = { x: enemy.x, y: enemy.y };

    if (enemy.direction === "up") {
        newPos.y -= enemy.speed * deltatime;
    } else if (enemy.direction === "down") {
        newPos.y += enemy.speed * deltatime;
    }

    if (validMove(newPos)) {
        enemy.x = newPos.x;
        enemy.y = newPos.y;
    } else {
        if (enemy.direction === "up") {
            enemy.direction = "down";
        } else if (enemy.direction === "down") {
            enemy.direction = "up";
        }
    }
}

function validMove(pos) {
    const field = document.querySelector("#gamefield");

    if (pos.y < 0 || pos.y > field.clientHeight - 40) {
        return false;
    }

    if (pos.x < 0 || pos.x > field.clientWidth - 32) {
        return false;
    }

    return true;
}
