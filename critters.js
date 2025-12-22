/* ADVANCED FLYING CRITTERS (Hero Section)
   Menggunakan Canvas API untuk gerakan alami
*/

const heroCanvas = document.getElementById('hero-critters');
const hCtx = heroCanvas.getContext('2d');

let hW, hH;
let critters = [];

function resizeHero() {
    // Ambil ukuran asli elemen .hero
    const heroRect = document.querySelector('.hero').getBoundingClientRect();
    hW = heroCanvas.width = heroRect.width;
    hH = heroCanvas.height = heroRect.height;
}
window.addEventListener('resize', resizeHero);
// Panggil sekali di awal setelah loading
setTimeout(resizeHero, 100); 

class Critter {
    constructor(type) {
        this.type = type; // 'bee' atau 'butterfly'
        this.x = Math.random() * hW;
        this.y = Math.random() * hH;
        // Kecepatan dasar
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 0.8;
        // Untuk gerakan bergelombang (tidak lurus kaku)
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = 0.02 + Math.random() * 0.03;
        // Untuk animasi sayap
        this.wingState = 0;
        this.flapSpeed = type === 'bee' ? 0.8 : 0.2; // Lebah ngepak lebih cepat
        
        // Warna & Ukuran
        this.size = 4 + Math.random() * 3;
        if(type === 'butterfly') {
            const colors = ['#FFB6C1', '#FFD700', '#87CEFA', '#DDA0DD'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
    }

    update() {
        // Gerakan alami menggunakan Sinus/Cosinus agar meliuk
        this.angle += this.angleSpeed;
        this.x += this.vx + Math.cos(this.angle) * 0.5;
        this.y += this.vy + Math.sin(this.angle) * 0.3;

        // Pantulan di pinggir layar
        if(this.x < -20) this.x = hW + 20;
        if(this.x > hW + 20) this.x = -20;
        if(this.y < -20) this.y = hH + 20;
        if(this.y > hH + 20) this.y = -20;

        // Animasi sayap (naik turun)
        this.wingState += this.flapSpeed;
    }

    draw() {
        hCtx.save();
        hCtx.translate(this.x, this.y);
        // Rotasi sedikit berdasarkan arah terbang horizontal
        hCtx.rotate(this.vx * 0.2);

        if(this.type === 'bee') {
            this.drawBee();
        } else {
            this.drawButterfly();
        }
        hCtx.restore();
    }

    drawBee() {
        const wingFlap = Math.abs(Math.sin(this.wingState)) * 0.5 + 0.5;
        
        // Sayap (Transparan putih)
        hCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
        hCtx.beginPath();
        // Sayap kiri
        hCtx.ellipse(-this.size/2, -this.size/2, this.size, this.size/2 * wingFlap, Math.PI/4, 0, Math.PI*2);
        // Sayap kanan
        hCtx.ellipse(this.size/2, -this.size/2, this.size, this.size/2 * wingFlap, -Math.PI/4, 0, Math.PI*2);
        hCtx.fill();

        // Badan (Kuning lonjong)
        hCtx.fillStyle = "#FFD700";
        hCtx.beginPath();
        hCtx.ellipse(0, 0, this.size, this.size/1.5, 0, 0, Math.PI*2);
        hCtx.fill();
        
        // Garis belang hitam (simple stripes)
        hCtx.strokeStyle = "#333";
        hCtx.lineWidth = 1.5;
        hCtx.beginPath();
        hCtx.moveTo(-this.size/2, -this.size/3); hCtx.lineTo(-this.size/2, this.size/3);
        hCtx.moveTo(0, -this.size/2); hCtx.lineTo(0, this.size/2);
        hCtx.moveTo(this.size/2, -this.size/3); hCtx.lineTo(this.size/2, this.size/3);
        hCtx.stroke();
    }

    drawButterfly() {
        const wingFlap = Math.sin(this.wingState); // Mengepak penuh naik turun
        
        hCtx.fillStyle = this.color;
        // Sayap kiri
        hCtx.beginPath();
        hCtx.moveTo(0, 0);
        // Kurva bezier untuk bentuk sayap
        hCtx.quadraticCurveTo(-this.size*3, -this.size*2 * wingFlap, -this.size*2, this.size*2 * wingFlap);
        hCtx.lineTo(0,0);
        hCtx.fill();

         // Sayap kanan (mirror)
        hCtx.beginPath();
        hCtx.moveTo(0, 0);
        hCtx.quadraticCurveTo(this.size*3, -this.size*2 * wingFlap, this.size*2, this.size*2 * wingFlap);
        hCtx.lineTo(0,0);
        hCtx.fill();

        // Badan tipis
        hCtx.fillStyle = "#555";
        hCtx.fillRect(-1, -this.size/2, 2, this.size);
    }
}

function animateCritters() {
    hCtx.clearRect(0, 0, hW, hH);
    critters.forEach(c => {
        c.update();
        c.draw();
    });
    requestAnimationFrame(animateCritters);
}

function initCritters() {
    resizeHero(); // Pastikan ukuran pas saat mulai
    // Tambah 8 Lebah
    for(let i=0; i<8; i++) critters.push(new Critter('bee'));
    // Tambah 6 Kupu-kupu
    for(let i=0; i<6; i++) critters.push(new Critter('butterfly'));
    
    animateCritters();
}

// Mulai animasi saat file dimuat
initCritters();