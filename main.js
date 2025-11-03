// Alustetaan muuttujat
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const height = canvas.height = window.innerHeight;
const width = canvas.width = window.innerWidth;

// Palauttaa satunnaisen kokonaisluvun annetulta väliltä (min ja max)
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funktio generoi random rgb värin
function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Pallo luokka
class Ball {
    constructor(x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }

    // Piirtää pallon
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Päivittää pallos sijainnin canvasin sisälle ja muuttaa suuntaa jos osuu reunaan
    update() {
        if (this.x + this.size >= width) {
            this.velX = -this.velX;
        }

        if (this.x - this.size <= 0) {
            this.velX = -this.velX;
        }

        if (this.y + this.size >= height) {
            this.velY = -this.velY;
        }

        if (this.y - this.size <= 0) {
            this.velY = -this.velY;
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    // Funktio muuttaa pallon suuntaa ja väriä jos pallo osuu toiseen
    collisionDetect() {
        for (const ball of balls) {
            // Jos pallo osuu toiseen palloon !== varmistaa ettei pall oosu itseensä
            if (this !== ball) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Annetaan pallolle uuusi väri randomRGB() funktiolla
                if (distance < this.size + ball.size) {
                    ball.color = this.color = randomRGB();
                }
            }
        }
    }

}

const balls = [];
const ballsOnScreen = 20;

// Looppi piirtää uuden pallon niin kauan kun palloja alle "ballsOnScreen"
while (balls.length < ballsOnScreen) {
    const size = random(10, 20);
    const ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomRGB(),
        size,
    );

    balls.push(ball);
}

// Looppi kutsuu joka framella funktioita kutan draw, update, collisionDetect..
function loop() {
    ctx.fillStyle = "rgb(0 0 0 / 25%)";
    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
        ball.draw();
        ball.update();
        ball.collisionDetect();
    }

    requestAnimationFrame(loop);
}

loop();