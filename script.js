const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const particles = [];

function Firework(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while(this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = Math.random() * 50 + 50;
    this.targetRadius = 1;
}

Firework.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if(this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    this.speed *= this.acceleration;

    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = Math.sqrt(Math.pow(this.x + vx - this.sx, 2) + Math.pow(this.y + vy - this.sy, 2));

    if(this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
    } else {
        this.x += vx;
        this.y += vy;
    }
}

Firework.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
}

function Particle(x, y, hue) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while(this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 10 + 1;
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = hue;
    this.brightness = Math.random() * 50 + 50;
    this.alpha = 1;
    this.decay = Math.random() * 0.03 + 0.015;
}

Particle.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if(this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
}

Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    ctx.stroke();
}

function createParticles(x, y) {
    const hue = Math.random() * 360;
    let particleCount = 100;
    while(particleCount--) {
        particles.push(new Particle(x, y, hue));
    }
}

function loop() {
    requestAnimationFrame(loop);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    let i = fireworks.length;
    while(i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    let j = particles.length;
    while(j--) {
        particles[j].draw();
        particles[j].update(j);
    }

    if(Math.random() < 0.05) {
        const startX = canvas.width / 2;
        const startY = canvas.height;
        const endX = Math.random() * canvas.width;
        const endY = Math.random() * canvas.height / 2;
        fireworks.push(new Firework(startX, startY, endX, endY));
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Bắt đầu vòng lặp
loop();

// Thêm một vài pháo hoa khi click chuột
canvas.addEventListener('click', function(e) {
    const startX = canvas.width / 2;
    const startY = canvas.height;
    fireworks.push(new Firework(startX, startY, e.clientX, e.clientY));
});
