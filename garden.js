/* ADVANCED GENERATIVE SUNFLOWERS & FAUNA
   Update: Smooth Reverse Animation (Shrink)
*/

const canvas = document.getElementById('flower-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let flowers = [];
let fauna = [];
let animationId;
let isShrinking = false; // Status apakah sedang mengecil
let gardenOpacity = 1;   // Untuk memudarkan serangga

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- KELAS BUNGA ---
class Flower {
    constructor(x, targetHeight) {
        this.x = x; this.y = height; this.targetY = height - targetHeight;
        this.growProgress = 0; 
        this.growSpeed = 0.5 + Math.random() * 0.5;
        this.stemColor = `hsl(100, ${30 + Math.random() * 20}%, ${20 + Math.random() * 10}%)`;
        this.petalColor = `hsl(${45 + Math.random() * 15}, 100%, ${50 + Math.random() * 20}%)`;
        this.centerColor = `hsl(25, ${70 + Math.random() * 20}%, ${15 + Math.random() * 10}%)`;
        this.size = 15 + Math.random() * 15; this.angle = (Math.random() - 0.5) * 0.5;
        this.windOffset = 0; this.windSpeed = 0.02 + Math.random() * 0.03;
    }
    
    update() {
        // LOGIKA UTAMA: Tumbuh vs Menyusut
        if (isShrinking) {
            // Mundur perlahan (lebih cepat dikit dari tumbuh biar responsif)
            this.growProgress -= this.growSpeed * 1.5; 
        } else {
            // Tumbuh normal
            if (this.growProgress < 100) this.growProgress += this.growSpeed;
        }

        this.windOffset = Math.sin(Date.now() * 0.001 * this.windSpeed + this.x) * 10;
    }

    draw() {
        // Jangan gambar jika sudah masuk tanah (progress <= 0)
        if (this.growProgress <= 0) return;

        const currentHeight = (height - this.targetY) * (this.growProgress / 100);
        const currentY = height - currentHeight;
        const endX = this.x + Math.sin(this.angle) * currentHeight + this.windOffset;

        ctx.save();
        ctx.beginPath(); ctx.moveTo(this.x, height);
        ctx.quadraticCurveTo(this.x, height - currentHeight / 2, endX, currentY);
        ctx.strokeStyle = this.stemColor; ctx.lineWidth = this.size / 4; ctx.lineCap = "round"; ctx.stroke();

        // Kepala Bunga (hanya muncul jika batang sudah cukup tinggi)
        if (this.growProgress > 20) {
            // Kalkulasi skala mekar agar halus saat mundur
            let bloomScale = 0;
            if (this.growProgress > 50) bloomScale = (this.growProgress - 50) / 50;
            
            // Batasi scale min/max
            if (bloomScale < 0) bloomScale = 0;
            if (bloomScale > 1) bloomScale = 1;

            ctx.translate(endX, currentY); 
            ctx.rotate(this.angle + (this.windOffset * 0.02)); 
            ctx.scale(bloomScale, bloomScale);

            const petalCount = 12 + Math.floor(Math.random() * 8);
            for (let i = 0; i < petalCount; i++) {
                ctx.save(); ctx.rotate((Math.PI * 2 * i) / petalCount); ctx.beginPath();
                ctx.fillStyle = this.petalColor; ctx.ellipse(0, -this.size, this.size / 3, this.size, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            }
            ctx.beginPath(); ctx.fillStyle = this.centerColor; ctx.arc(0, 0, this.size / 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            for(let j=0; j<5; j++){ ctx.beginPath(); ctx.arc((Math.random()-0.5)*10, (Math.random()-0.5)*10, 2, 0, Math.PI*2); ctx.fill(); }
        }
        ctx.restore();
    }
}

// --- KELAS FAUNA ---
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
        ctx.save(); 
        ctx.globalAlpha = gardenOpacity; // Ikut memudar saat shrinking
        ctx.translate(this.x, this.y);
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
        if(Math.random() < 0.02) this.vx += (Math.random()-0.5)*0.5;
        if(Math.random() < 0.02) this.vy += (Math.random()-0.5)*0.5;
        if(this.x < 0) this.x = width; if(this.x > width) this.x = 0;
        if(this.y < height*0.3 || this.y > height) this.vy *= -1;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = gardenOpacity; // Ikut memudar saat shrinking
        ctx.translate(this.x, this.y); ctx.rotate(this.vx * 0.1);
        const flap = Math.sin(this.wingAngle) * this.size/2;
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath();
        ctx.ellipse(-this.size/2, -flap, this.size, this.size/3, Math.PI/4, 0, Math.PI*2);
        ctx.ellipse(this.size/2, -flap, this.size, this.size/3, -Math.PI/4, 0, Math.PI*2); ctx.fill();
        const gradient = ctx.createLinearGradient(-this.size, 0, this.size, 0);
        gradient.addColorStop(0.2, '#FFD700'); gradient.addColorStop(0.5, '#222'); gradient.addColorStop(0.8, '#FFD700');
        ctx.fillStyle = gradient; ctx.beginPath(); ctx.ellipse(0, 0, this.size, this.size/1.8, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }
}

// --- ANIMASI UTAMA ---
function animateGarden() {
    ctx.clearRect(0, 0, width, height);
    
    // Logika Shrinking (Mengecil)
    let allGone = true;

    if (isShrinking) {
        // Kurangi opacity serangga
        if (gardenOpacity > 0) gardenOpacity -= 0.02;
    } else {
        // Kembalikan opacity jika tumbuh
        if (gardenOpacity < 1) gardenOpacity += 0.02;
        allGone = false; 
    }

    // Gambar Bunga
    flowers.forEach(f => { 
        f.update(); 
        f.draw();
        // Cek apakah masih ada bunga yang tersisa di layar
        if (f.growProgress > 0) allGone = false; 
    });

    // Gambar Fauna
    if (gardenOpacity > 0) {
        fauna.forEach(c => { c.update(); c.draw(); });
    }

    // --- CEK FINAL: Jika sedang shrinking DAN semua bunga sudah hilang ---
    if (isShrinking && allGone) {
        cancelAnimationFrame(animationId); // Stop animasi
        ctx.clearRect(0, 0, width, height); // Bersihkan sisa
        resetButtonExternal(); // Panggil fungsi reset tombol di script.js
        return; // Keluar loop
    }

    animationId = requestAnimationFrame(animateGarden);
}

// --- API UNTUK SCRIPT.JS ---
function startGarden() {
    if(animationId) cancelAnimationFrame(animationId);
    isShrinking = false; // Mode Tumbuh
    gardenOpacity = 1;
    flowers = []; fauna = [];
    
    for (let i = 0; i < 35; i++) flowers.push(new Flower(Math.random() * width, height * 0.2 + Math.random() * height * 0.3));
    for(let i=0; i<10; i++) fauna.push(new Ladybug());
    for(let i=0; i<15; i++) fauna.push(new GardenBee());
    
    animateGarden();
}

function shrinkGarden() {
    // Aktifkan mode menyusut, animasi akan menanganinya di loop animateGarden
    isShrinking = true; 
}

// Fungsi helper untuk reset tombol UI (akan didefinisikan di script.js)
function resetButtonExternal() {
    // Kita lempar event custom agar script.js tahu animasi sudah selesai
    const event = new Event('gardenCleared');
    document.dispatchEvent(event);
}

// Fungsi paksa bersih (untuk tombol rewrap)
function clearGarden() {
    if(animationId) cancelAnimationFrame(animationId);
    flowers = []; fauna = [];
    ctx.clearRect(0, 0, width, height);
}