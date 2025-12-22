/* ADVANCED GARDEN + FIREFLIES (NIGHT MODE) */

const canvas = document.getElementById('flower-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let flowers = [];
let fauna = [];
let fireflies = []; // Array khusus kunang-kunang
let animationId;
let isShrinking = false;
let gardenOpacity = 1;
let isNight = false; // Status mode malam

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- KELAS BUNGA & FAUNA (Sama seperti sebelumnya) ---
class Flower {
    constructor(x, targetHeight) {
        this.x = x; this.y = height; this.targetY = height - targetHeight;
        this.growProgress = 0; this.growSpeed = 0.5 + Math.random() * 0.5;
        this.stemColor = `hsl(100, ${30 + Math.random() * 20}%, ${20 + Math.random() * 10}%)`;
        this.petalColor = `hsl(${45 + Math.random() * 15}, 100%, ${50 + Math.random() * 20}%)`;
        this.centerColor = `hsl(25, ${70 + Math.random() * 20}%, ${15 + Math.random() * 10}%)`;
        this.size = 15 + Math.random() * 15; this.angle = (Math.random() - 0.5) * 0.5;
        this.windOffset = 0; this.windSpeed = 0.02 + Math.random() * 0.03;
    }
    update() {
        if (isShrinking) this.growProgress -= this.growSpeed * 1.5;
        else if (this.growProgress < 100) this.growProgress += this.growSpeed;
        this.windOffset = Math.sin(Date.now() * 0.001 * this.windSpeed + this.x) * 10;
    }
    draw() {
        if (this.growProgress <= 0) return;
        const currentHeight = (height - this.targetY) * (this.growProgress / 100);
        const currentY = height - currentHeight;
        const endX = this.x + Math.sin(this.angle) * currentHeight + this.windOffset;
        ctx.save();
        ctx.beginPath(); ctx.moveTo(this.x, height);
        ctx.quadraticCurveTo(this.x, height - currentHeight / 2, endX, currentY);
        ctx.strokeStyle = this.stemColor; ctx.lineWidth = this.size / 4; ctx.lineCap = "round"; ctx.stroke();
        if (this.growProgress > 20) {
            let bloomScale = (this.growProgress > 50) ? (this.growProgress - 50) / 50 : 0;
            if (bloomScale > 1) bloomScale = 1; if (bloomScale < 0) bloomScale = 0;
            ctx.translate(endX, currentY); ctx.rotate(this.angle + (this.windOffset * 0.02)); ctx.scale(bloomScale, bloomScale);
            const petalCount = 12 + Math.floor(Math.random() * 8);
            for (let i = 0; i < petalCount; i++) {
                ctx.save(); ctx.rotate((Math.PI * 2 * i) / petalCount); ctx.beginPath();
                ctx.fillStyle = this.petalColor; ctx.ellipse(0, -this.size, this.size / 3, this.size, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            }
            ctx.beginPath(); ctx.fillStyle = this.centerColor; ctx.arc(0, 0, this.size / 1.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    }
}

class Ladybug {
    constructor() {
        this.x = Math.random() * width; this.y = height - Math.random() * 50;
        this.size = 6 + Math.random() * 4; this.speed = 0.3 + Math.random() * 0.5;
        this.direction = Math.random() > 0.5 ? 1 : -1; this.wobble = Math.random() * Math.PI * 2;
    }
    update() {
        this.x += this.speed * this.direction; this.wobble += 0.1; this.y += Math.sin(this.wobble) * 0.3;
        if (this.x < 0 || this.x > width) this.direction *= -1;
    }
    draw() {
        ctx.save(); ctx.globalAlpha = gardenOpacity; ctx.translate(this.x, this.y);
        ctx.fillStyle = '#d32f2f'; ctx.beginPath(); ctx.arc(0, 0, this.size, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(this.direction * this.size/2, 0, this.size/1.5, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }
}

class GardenBee {
    constructor() {
        this.x = Math.random() * width; this.y = height * 0.5 + Math.random() * height * 0.3;
        this.vx = (Math.random() - 0.5) * 2; this.vy = (Math.random() - 0.5) * 1;
        this.size = 5 + Math.random() * 3; this.wingAngle = 0;
    }
    update() {
        this.x += this.vx; this.y += this.vy; this.wingAngle += 0.8;
        if(Math.random() < 0.02) this.vx += (Math.random()-0.5)*0.5; if(Math.random() < 0.02) this.vy += (Math.random()-0.5)*0.5;
        if(this.x < 0) this.x = width; if(this.x > width) this.x = 0;
        if(this.y < height*0.3 || this.y > height) this.vy *= -1;
    }
    draw() {
        ctx.save(); ctx.globalAlpha = gardenOpacity; ctx.translate(this.x, this.y); ctx.rotate(this.vx * 0.1);
        const flap = Math.sin(this.wingAngle) * this.size/2;
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath();
        ctx.ellipse(-this.size/2, -flap, this.size, this.size/3, Math.PI/4, 0, Math.PI*2);
        ctx.ellipse(this.size/2, -flap, this.size, this.size/3, -Math.PI/4, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.ellipse(0, 0, this.size, this.size/1.8, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }
}

// --- KELAS BARU: KUNANG-KUNANG (FIREFLY) ---
class Firefly {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.alpha = 0; // Mulai transparan
        this.alphaSpeed = 0.01 + Math.random() * 0.02;
        this.alphaDir = 1;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        // Pantulan layar
        if(this.x < 0 || this.x > width) this.speedX *= -1;
        if(this.y < 0 || this.y > height) this.speedY *= -1;
        
        // Efek Kedip (Glowing Pulse)
        this.alpha += this.alphaSpeed * this.alphaDir;
        if(this.alpha > 1) { this.alpha = 1; this.alphaDir = -1; }
        if(this.alpha < 0) { this.alpha = 0; this.alphaDir = 1; }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = "#ffffaa"; // Kuning terang
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ffffaa"; // Efek glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// --- ANIMASI LOOP ---
function animateGarden() {
    ctx.clearRect(0, 0, width, height);
    
    // Logic Shrink
    let allGone = true;
    if (isShrinking) { if (gardenOpacity > 0) gardenOpacity -= 0.02; } 
    else { if (gardenOpacity < 1) gardenOpacity += 0.02; allGone = false; }

    flowers.forEach(f => { f.update(); f.draw(); if(f.growProgress > 0) allGone = false; });
    if (gardenOpacity > 0) fauna.forEach(c => { c.update(); c.draw(); });

    // UPDATE FIREFLIES (Hanya gambar jika Mode Malam ON)
    if (isNight) {
        // Jika array kosong tapi mode malam, isi fireflies
        if(fireflies.length === 0) for(let i=0; i<30; i++) fireflies.push(new Firefly());
        
        fireflies.forEach(f => { f.update(); f.draw(); });
    } else {
        fireflies = []; // Kosongkan jika siang
    }

    if (isShrinking && allGone) {
        cancelAnimationFrame(animationId); ctx.clearRect(0, 0, width, height); resetButtonExternal(); return;
    }
    animationId = requestAnimationFrame(animateGarden);
}

// --- FUNGSI EKSTERNAL ---
function startGarden() {
    if(animationId) cancelAnimationFrame(animationId);
    isShrinking = false; gardenOpacity = 1; flowers = []; fauna = [];
    for (let i = 0; i < 35; i++) flowers.push(new Flower(Math.random() * width, height * 0.2 + Math.random() * height * 0.3));
    for(let i=0; i<10; i++) fauna.push(new Ladybug());
    for(let i=0; i<15; i++) fauna.push(new GardenBee());
    
    // Pastikan loop jalan (terutama buat fireflies kalau taman belum tumbuh tapi night mode on)
    animateGarden();
}

function shrinkGarden() { isShrinking = true; }
function clearGarden() { if(animationId) cancelAnimationFrame(animationId); flowers = []; fauna = []; ctx.clearRect(0, 0, width, height); }
function resetButtonExternal() { document.dispatchEvent(new Event('gardenCleared')); }

// Trigger untuk ganti mode (dipanggil dari script.js)
function setNightMode(status) {
    isNight = status;
    // Jika animasi mati (karena taman belum tumbuh), nyalakan loop sebentar buat fireflies
    if(!animationId && isNight) animateGarden(); 
}