/* ADVANCED GENERATIVE SUNFLOWERS & FAUNA
   Menggunakan HTML5 Canvas API.
   Menggambar bunga, kumbang, dan lebah secara prosedural.
*/

const canvas = document.getElementById('flower-canvas');
const ctx = canvas.getContext('2d');

let width, height;
// Array untuk menyimpan objek bunga dan fauna
let flowers = [];
let fauna = [];

// Setup Canvas Size
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- 1. KELAS BUNGA (The Flower Object) ---
// (Kode ini sama dengan sebelumnya, tidak berubah)
class Flower {
    constructor(x, targetHeight) {
        this.x = x;
        this.y = height;
        this.targetY = height - targetHeight;
        this.growProgress = 0;
        this.growSpeed = 0.5 + Math.random() * 0.5;
        this.stemColor = `hsl(100, ${30 + Math.random() * 20}%, ${20 + Math.random() * 10}%)`;
        this.petalColor = `hsl(${45 + Math.random() * 15}, 100%, ${50 + Math.random() * 20}%)`;
        this.centerColor = `hsl(25, ${70 + Math.random() * 20}%, ${15 + Math.random() * 10}%)`;
        this.size = 15 + Math.random() * 15;
        this.angle = (Math.random() - 0.5) * 0.5;
        this.windOffset = 0;
        this.windSpeed = 0.02 + Math.random() * 0.03;
    }

    update() {
        if (this.growProgress < 100) this.growProgress += this.growSpeed;
        this.windOffset = Math.sin(Date.now() * 0.001 * this.windSpeed + this.x) * 10;
    }

    draw() {
        const currentHeight = (height - this.targetY) * (this.growProgress / 100);
        const currentY = height - currentHeight;
        const endX = this.x + Math.sin(this.angle) * currentHeight + this.windOffset;

        ctx.save();
        // Batang
        ctx.beginPath();
        ctx.moveTo(this.x, height);
        ctx.quadraticCurveTo(this.x, height - currentHeight / 2, endX, currentY);
        ctx.strokeStyle = this.stemColor;
        ctx.lineWidth = this.size / 4;
        ctx.lineCap = "round";
        ctx.stroke();

        // Kepala Bunga
        if (this.growProgress > 50) {
            const bloomScale = (this.growProgress - 50) / 50;
            ctx.translate(endX, currentY);
            ctx.rotate(this.angle + (this.windOffset * 0.02));
            ctx.scale(bloomScale, bloomScale);

            // Kelopak
            const petalCount = 12 + Math.floor(Math.random() * 8);
            for (let i = 0; i < petalCount; i++) {
                ctx.save();
                ctx.rotate((Math.PI * 2 * i) / petalCount);
                ctx.beginPath();
                ctx.fillStyle = this.petalColor;
                ctx.ellipse(0, -this.size, this.size / 3, this.size, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            // Pusat
            ctx.beginPath();
            ctx.fillStyle = this.centerColor;
            ctx.arc(0, 0, this.size / 1.5, 0, Math.PI * 2);
            ctx.fill();
            // Bintik Detail
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            for(let j=0; j<5; j++){
                ctx.beginPath();
                ctx.arc((Math.random()-0.5)*10, (Math.random()-0.5)*10, 2, 0, Math.PI*2);
                ctx.fill();
            }
        }
        ctx.restore();
    }
}

// --- 2. KELAS KUMBANG (Ladybug) ---
// Merayap di bagian bawah layar
class Ladybug {
    constructor() {
        this.x = Math.random() * width;
        this.y = height - Math.random() * 50; // Dekat tanah
        this.size = 6 + Math.random() * 4;
        this.speed = 0.3 + Math.random() * 0.5;
        this.direction = Math.random() > 0.5 ? 1 : -1; // Kiri atau kanan
        this.wobble = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.speed * this.direction;
        this.wobble += 0.1;
        this.y += Math.sin(this.wobble) * 0.3; // Gerakan merayap bergelombang

        // Putar balik jika kena pinggir layar
        if (this.x < 0 || this.x > width) this.direction *= -1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        // Badan Merah
        ctx.fillStyle = '#d32f2f';
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Kepala Hitam
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(this.direction * this.size/2, 0, this.size/1.5, 0, Math.PI*2);
        ctx.fill();

        // Garis Punggung & Bintik
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -this.size+1); ctx.lineTo(0, this.size-1);
        ctx.stroke();
        
        // Bintik hitam (Dots)
        ctx.fillStyle = '#222';
        [[0.5, -0.4], [-0.5, 0.4], [0.2, 0.6], [-0.2, -0.6]].forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.arc(dx * this.size, dy * this.size, this.size/5, 0, Math.PI*2);
            ctx.fill();
        });

        ctx.restore();
    }
}

// --- 3. KELAS LEBAH TAMAN (Garden Bee) ---
// Terbang di sekitar bunga (berbeda dengan lebah di Hero section)
class GardenBee {
    constructor() {
        this.x = Math.random() * width;
        this.y = height * 0.5 + Math.random() * height * 0.3;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = 5 + Math.random() * 3;
        this.wingAngle = 0;
    }

    update() {
        // Gerakan terbang acak (wandering)
        this.x += this.vx;
        this.y += this.vy;
        this.wingAngle += 0.8; // Kecepatan kepak sayap

        // Ubah arah secara acak sesekali
        if(Math.random() < 0.02) this.vx += (Math.random()-0.5)*0.5;
        if(Math.random() < 0.02) this.vy += (Math.random()-0.5)*0.5;

        // Jaga agar tetap di area taman
        if(this.x < 0) this.x = width; if(this.x > width) this.x = 0;
        if(this.y < height*0.3 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.vx * 0.1); // Miringkan badan sesuai arah terbang

        // Sayap (Transparan, mengepak)
        const flap = Math.sin(this.wingAngle) * this.size/2;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.ellipse(-this.size/2, -flap, this.size, this.size/3, Math.PI/4, 0, Math.PI*2);
        ctx.ellipse(this.size/2, -flap, this.size, this.size/3, -Math.PI/4, 0, Math.PI*2);
        ctx.fill();

        // Badan (Belang kuning hitam)
        const gradient = ctx.createLinearGradient(-this.size, 0, this.size, 0);
        gradient.addColorStop(0.2, '#FFD700');
        gradient.addColorStop(0.5, '#222');
        gradient.addColorStop(0.8, '#FFD700');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size/1.8, 0, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();
    }
}


// --- FUNGSI UTAMA: LOOP ANIMASI ---
function animateGarden() {
    ctx.clearRect(0, 0, width, height); // Hapus layar tiap frame
    
    // 1. Gambar Bunga Dulu (di belakang)
    flowers.forEach(flower => {
        flower.update();
        flower.draw();
    });

    // 2. Gambar Fauna (di depan bunga)
    fauna.forEach(critter => {
        critter.update();
        critter.draw();
    });

    requestAnimationFrame(animateGarden); // Loop terus menerus
}

// --- FUNGSI EKSTERNAL (Dipanggil oleh script.js) ---

// 1. Mulai Tumbuh (Tombol ditekan)
function startGarden() {
    // Tanam 35 Bunga
    for (let i = 0; i < 35; i++) {
        const x = Math.random() * width;
        const h = height * 0.2 + Math.random() * height * 0.3;
        flowers.push(new Flower(x, h));
    }

    // Tambah 10 Kumbang (Ladybugs)
    for(let i=0; i<10; i++) {
        fauna.push(new Ladybug());
    }

    // Tambah 15 Lebah Taman (Garden Bees)
    for(let i=0; i<15; i++) {
        fauna.push(new GardenBee());
    }
    
    animateGarden(); // Mulai loop
}

// 2. Reset (Tombol Rewrap ditekan)
function clearGarden() {
    flowers = [];
    fauna = []; // Kosongkan fauna juga
    ctx.clearRect(0, 0, width, height);
}