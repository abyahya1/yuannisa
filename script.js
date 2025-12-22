/* SCRIPT UTAMA - Update Auto Hide Garden */

let isGardenActive = false; // Status apakah taman sedang aktif

// Listener untuk sinyal "Selesai Menyusut" dari garden.js
document.addEventListener('gardenCleared', () => {
    isGardenActive = false; // Status resmi non-aktif
    
    const btnTaman = document.getElementById('btn-taman');
    btnTaman.disabled = false;
    btnTaman.innerText = "Taman sederhana dari aku buat kamu 🌻"; 
    btnTaman.style.color = "";
    btnTaman.style.borderBottom = "1px solid #333";
});

// 1. INTRO
function bukaHadiah() {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('swiped-up');
    const audio = document.getElementById('musik');
    audio.volume = 0.6;
    audio.play().catch(e => console.log("Audio perlu izin"));
    setTimeout(ngetik, 800);
}

// 2. TYPING
const teks = "Selamat Ulang Tahun ke-18 Sayangg.";
let i = 0; let isTyping = false;
function ngetik() {
    if (!isTyping) { isTyping = true; return; }
    if (i < teks.length) { document.getElementById('typing-area').innerHTML += teks.charAt(i); i++; setTimeout(ngetik, 100); }
}
function mulaiNgetik() { isTyping = true; ngetik(); }

// 3. SCROLL REVEAL & SMOOTH SHRINK
window.addEventListener('scroll', () => {
    const wH = window.innerHeight;
    const triggerB = wH * 0.8; 
    const triggerT = wH * 0.2;

    // A. Animasi Content (Tetap sama)
    document.querySelectorAll('.reveal, .card, .big-image-container').forEach(el => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + (rect.height/2);
        if(center < triggerB && center > triggerT) { el.classList.add('active'); el.classList.add('aktif'); }
        else { el.classList.remove('active'); el.classList.remove('aktif'); }
    });

    // A. Animasi Content
    document.querySelectorAll('.reveal, .card, .big-image-container').forEach(el => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + (rect.height/2);
        if(center < triggerB && center > triggerT) { el.classList.add('active'); el.classList.add('aktif'); }
        else { el.classList.remove('active'); el.classList.remove('aktif'); }
    });

    // B. LOGIKA AUTO SHRINK (YANG BARU)
    if (isGardenActive) {
        const finalSection = document.querySelector('.final-area');
        const rect = finalSection.getBoundingClientRect();
        
        // Jika user scroll ke atas menjauh (top elemen final turun melebihi tinggi layar)
        // Dan kita belum dalam mode shrinking (mencegah panggil berkali-kali)
        if (rect.top > wH) { 
             // Panggil fungsi shrink di garden.js
             if (typeof shrinkGarden === "function") shrinkGarden();
             // Kita JANGAN reset tombol di sini. Tunggu animasi selesai.
        }
    }
});

// 4. TOMBOL TAMAN
document.getElementById('btn-taman').addEventListener('click', function() {
    this.style.borderBottom = "none"; 
    this.innerText = "Semoga kamuu sukaa sayangg..."; 
    this.style.color = "#999"; 
    this.disabled = true;
    
    isGardenActive = true; // Tandai aktif

    if (typeof startGarden === "function") startGarden(); 
});

// FUNGSI RESET UI (Dipisah agar bisa dipanggil scroll & tombol reset)
function resetGardenUI() {
    isGardenActive = false; // Tandai non-aktif

    // Hapus Taman
    if (typeof clearGarden === "function") clearGarden();

    // Reset Tombol ke Awal
    const btnTaman = document.getElementById('btn-taman');
    btnTaman.disabled = false;
    btnTaman.innerText = "Taman sederhana dari aku buat kamu 🌻"; 
    btnTaman.style.color = "";
    btnTaman.style.borderBottom = "1px solid #333";
}

// 5. MUSIC
function toggleMusik() {
    const a=document.getElementById('musik'), c=document.querySelector('.music-control');
    if(a.paused){a.play(); c.classList.remove('paused');} else{a.pause(); c.classList.add('paused');}
}

// 6. REWRAP (RESET TOTAL)
function rewrapGift() {
    window.scrollTo({top:0, behavior:'smooth'});
    setTimeout(()=>{
        document.getElementById('overlay').classList.remove('swiped-up');
        const a=document.getElementById('musik'); a.pause(); a.currentTime=0; document.querySelector('.music-control').classList.add('paused');
        document.getElementById('typing-area').innerHTML=""; i=0; isTyping=false;
        
        // Paksa bersih instan jika tombol rewrap ditekan (tidak perlu animasi shrink)
        if (typeof clearGarden === "function") clearGarden();
        
        // Reset manual status tombol
        isGardenActive = false;
        const btnTaman = document.getElementById('btn-taman');
        btnTaman.disabled = false;
        btnTaman.innerText = "Taman sederhana dari aku buat kamu 🌻"; 
        btnTaman.style.color = "";
        btnTaman.style.borderBottom = "1px solid #333";

        document.querySelectorAll('.active, .aktif').forEach(el=>{el.classList.remove('active'); el.classList.remove('aktif');});
    },500);
}
document.querySelector('.btn-circle').addEventListener('click', ()=>{ isTyping=true; ngetik(); });

// --- LOGIC NIGHT MODE ---
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    const isDark = body.classList.contains('dark-mode');
    const iconMoon = document.getElementById('icon-moon');
    const iconSun = document.getElementById('icon-sun');

    // Ganti Ikon
    if (isDark) {
        iconMoon.style.display = 'none';
        iconSun.style.display = 'block';
    } else {
        iconMoon.style.display = 'block';
        iconSun.style.display = 'none';
    }

    // Beritahu garden.js untuk nyalakan/matikan Kunang-Kunang
    if (typeof setNightMode === "function") {
        setNightMode(isDark);
    }
}

/* --- MOBILE MAGIC TOUCH EFFECT --- */
let lastSparkleTime = 0;

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('touch-sparkle');
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    
    // Variasi ukuran acak biar natural
    const size = Math.random() * 10 + 5; 
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;

    document.body.appendChild(sparkle);

    // Hapus elemen setelah animasi selesai (800ms)
    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

// Event Listener untuk Layar Sentuh
window.addEventListener('touchmove', (e) => {
    // Batasi agar tidak terlalu banyak partikel (setiap 50ms)
    const now = Date.now();
    if (now - lastSparkleTime > 50) {
        // Ambil posisi jari pertama
        const touch = e.touches[0];
        createSparkle(touch.clientX, touch.clientY);
        lastSparkleTime = now;
    }
}, { passive: true });

// Efek saat diketuk (Tap)
window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    createSparkle(touch.clientX, touch.clientY);
    // Bikin 2 partikel tambahan biar efek 'burst' kecil
    setTimeout(() => createSparkle(touch.clientX + 10, touch.clientY + 10), 50);
    setTimeout(() => createSparkle(touch.clientX - 10, touch.clientY - 10), 100);
}, { passive: true });

/* --- NAVIGATION & PAGE SWITCHING LOGIC --- */

const pages = {
    home: document.getElementById('home-page'),
    reels: document.getElementById('reels-page'),
    album: document.getElementById('album-page')
};
const navItems = document.querySelectorAll('.nav-item');

function switchPage(pageName) {
    // 1. Hapus class 'active' dari semua halaman dan tombol nav
    Object.values(pages).forEach(page => page.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));

    // 2. Tambahkan class 'active' ke halaman yang dipilih
    pages[pageName].classList.add('active');

    // 3. Tambahkan class 'active' ke tombol nav yang sesuai (cari berdasarkan onclick attribute)
    const activeNavBtn = Array.from(navItems).find(item => item.getAttribute('onclick').includes(pageName));
    if(activeNavBtn) activeNavBtn.classList.add('active');

    // --- LOGIKA KHUSUS PER HALAMAN ---
    
    // Jika pindah KE Reels
    if (pageName === 'reels') {
        
        if (typeof resetGardenUI === "function") {
            resetGardenUI(); 
        } else {
            // Backup manual jika fungsi resetGardenUI tidak terbaca
            if (typeof clearGarden === "function") clearGarden();
            isGardenActive = false;
            const btnTaman = document.getElementById('btn-taman');
            if(btnTaman) {
                btnTaman.disabled = false;
                btnTaman.innerText = "Taman sederhana dari aku buat kamu 🌻";
                btnTaman.style.color = "";
                btnTaman.style.borderBottom = "1px solid #333";
            }
        }

        // Pause musik background utama
        const bgMusic = document.getElementById('musik');
        if(!bgMusic.paused) {
             toggleMusik(); 
        }
        
        // Mulai putar video pertama (opsional)
        if (typeof playFirstReel === "function") playFirstReel();
    } 
    
    // Jika pindah KE Album atau Home
    else {
        // ... kode sisanya sama ...
        if (typeof pauseAllReels === "function") pauseAllReels();
        const bgMusic = document.getElementById('musik');
         if(bgMusic.paused) {
             toggleMusik();
        }
    }

    // Jika pindah KE Home, pastikan scroll reveal dicek ulang
    if (pageName === 'home') {
        window.dispatchEvent(new Event('scroll'));
    }
}


/* --- REELS VIDEO LOGIC --- */

// Fungsi untuk memutar/pause video saat diklik tombol tengahnya
function toggleVideo(button) {
    const reelItem = button.closest('.reel-item');
    const video = reelItem.querySelector('video');
    
    if (video.paused) {
        // Pause video lain dulu sebelum memutar yang ini
        pauseAllReels();
        video.play();
        reelItem.classList.add('playing');
        button.innerText = ""; // Hilangkan ikon play
    } else {
        video.pause();
        reelItem.classList.remove('playing');
        button.innerText = "▶"; // Munculkan ikon play
    }
    // Unmute video agar bersuara saat di-klik (browser memblokir autoplay bersuara)
    video.muted = false;
}

function pauseAllReels() {
    document.querySelectorAll('.reel-item video').forEach(vid => {
        vid.pause();
        vid.closest('.reel-item').classList.remove('playing');
        vid.nextElementSibling.nextElementSibling.innerText = "▶"; // Reset tombol play
    });
}

// (Opsional) Coba putar video pertama saat masuk halaman reels
function playFirstReel() {
     const firstVideo = document.querySelector('.reel-item video');
     if(firstVideo) {
         // Kita coba play muted dulu agar autoplay jalan
         firstVideo.muted = true; 
         firstVideo.play().then(() => {
             firstVideo.closest('.reel-item').classList.add('playing');
              firstVideo.nextElementSibling.nextElementSibling.innerText = "";
         }).catch(e => console.log("Autoplay reels diblokir browser, perlu interaksi user."));
     }
}

// Deteksi scroll di container reels untuk pause video yang keluar layar (Advanced)
// Untuk saat ini kita pakai klik manual dulu agar lebih stabil di berbagai HP.

/* --- FIX AUDIO BACKGROUND (Anti Ghost Sound) --- */
document.addEventListener('visibilitychange', function() {
    const audio = document.getElementById('musik');
    const musicControl = document.querySelector('.music-control');
    
    // Jika pengguna keluar dari tab/minimize browser
    if (document.hidden) {
        if (!audio.paused) {
            audio.pause();
            musicControl.classList.add('paused');
        }
    } 
    // Opsional: Jika ingin nyala lagi otomatis saat balik, hapus komentar di bawah
    // else {
    //     if (audio.paused && !isGardenActive) { audio.play(); musicControl.classList.remove('paused'); }
    // }
});