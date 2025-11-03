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

// Shape luokka
class Shape {
    constructor(x, y, velX, velY) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
    }
}

// Evil ball luokka inherit from Shape class
class EvilBall extends Shape {
    constructor(x, y) {
        super(x, y, 20, 20);
        this.color = "white";
        this.size = 10;

        // Lisää pallon liikuttamisen wasd:illa
        window.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "a":
                    this.x -= this.velX;
                    break;
                case "d":
                    this.x += this.velX;
                    break;
                case "w":
                    this.y -= this.velY;
                    break;
                case "s":
                    this.y += this.velY;
                    break;
            }
        });
    }

    // Piirtää evil pallon canvasille
    draw() {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // Tarkistaa ettei apllo mene canvasin reunan yli
    checkBounds() {
        if (this.x + this.size >= width) {
            this.x -= this.size;
        }

        if (this.x - this.size <= 0) {
            this.x += this.size;
        }

        if (this.y + this.size >= height) {
            this.y -= this.size;
        }

        if (this.y - this.size <= 0) {
            this.y += this.size;
        }
    }

    collisionDetect() {
        for (const ball of balls) {
            if (ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.exists = false;
                }
            }
        }
    }
}

// Pallo luokka, käyttämällä super() tehdään uusi instance parent classin "Shape" ja käytetään sen constructoria
class Ball extends Shape {
    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY, color, size);
        this.exists = true;
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
            if (!(this === ball) && ball.exists) {
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

const evilBall = new EvilBall(width / 2, height / 2);

// Looppi kutsuu joka framella funktioita kutan draw, update, collisionDetect..
function loop() {
    ctx.fillStyle = "rgb(0 0 0 / 25%)";
    ctx.fillRect(0, 0, width, height);

    evilBall.draw();
    evilBall.checkBounds();
    evilBall.collisionDetect();

    for (const ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
    }

    requestAnimationFrame(loop);
}

loop();