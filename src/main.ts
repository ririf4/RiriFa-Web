import './styles/main.scss';

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d")!;

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Dot {
    x: number = 0;
    y: number = 0;
    speed: number = 0;
    angle: number = 0;
    size: number = 0;
    startX: number = 0;
    startY: number = 0;
    alpha: number = 0;

    constructor(isFirstSpawn: boolean = false) {
        this.reset(isFirstSpawn);
    }

    reset(isFirstSpawn: boolean = false) {
        if (isFirstSpawn) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.angle = Math.random() * Math.PI * 2;
        } else {
            const side = Math.floor(Math.random() * 4);
            switch (side) {
                case 0:
                    this.x = Math.random() * canvas.width;
                    this.y = -5;
                    this.angle = Math.random() * Math.PI; // 下向き
                    break;
                case 1:
                    this.x = canvas.width + 5;
                    this.y = Math.random() * canvas.height;
                    this.angle = Math.PI + Math.random() * Math.PI; // 左向き
                    break;
                case 2: // 下側
                    this.x = Math.random() * canvas.width;
                    this.y = canvas.height + 5;
                    this.angle = Math.PI + Math.random() * Math.PI; // 上向き
                    break;
                case 3: // 左側
                    this.x = -5;
                    this.y = Math.random() * canvas.height;
                    this.angle = Math.random() * Math.PI * 2; // 右向き
                    break;
            }
        }

        this.startX = this.x;
        this.startY = this.y;
        this.speed = 0.5 + Math.random();
        this.size = 1.1 + Math.random();
        this.alpha = 0.4;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // 画面外に出たらリセット（このときは端からにする）
        if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
            this.reset(false); // 端からリスポーン
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const dots: Dot[] = Array.from({ length: 100 }, () => new Dot(true));

let lastTime = 0;
const fpsInterval = 1000 / 45;

function animate(timestamp: number) {


    if (timestamp - lastTime < fpsInterval) {
        requestAnimationFrame(animate);
        return;
    }
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const dot of dots) {
        dot.update();
        dot.draw(ctx);
    }

    requestAnimationFrame(animate);
}

animate(0);
