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
    // Cek dulu biar ga error kalau audio belum siap
    if (audio) {
        audio.volume = 0.6;
        audio.play().catch(e => console.log("Audio perlu interaksi user"));
    }

    // --- FIX LAYAR PUTIH ---
    // Paksa browser sadar kalau kita sedang melihat konten
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll')); // Pura-pura scroll
    }, 200); // Jalankan 0.2 detik setelah klik

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

// 6. REWRAP (RESET TOTAL - FIX BLANK)
function rewrapGift() {
    // 1. Pastikan kita kembali ke Tab Home secara sistem
    // (Tapi tanpa animasi fade in ulang biar ga kedip)
    if (typeof pages !== 'undefined' && pages.home) {
         // Manual set active class tanpa panggil switchPage full
         Object.values(pages).forEach(page => page.classList.remove('active'));
         pages.home.classList.add('active');
         
         // Reset tombol navbar jadi Home
         document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
         document.querySelector('.nav-item[onclick*="home"]').classList.add('active');
    }

    // 2. Scroll ke atas
    window.scrollTo({top: 0, behavior: 'smooth'});

    // 3. Reset Logika
    setTimeout(() => {
        // Tutup Amplop
        document.getElementById('overlay').classList.remove('swiped-up');
        
        // Reset Musik
        const audio = document.getElementById('musik');
        audio.pause(); 
        audio.currentTime = 0; 
        document.querySelector('.music-control').classList.add('paused');
        
        // Reset Teks Ketikan
        document.getElementById('typing-area').innerHTML = "";
        i = 0; isTyping = false;

        // Reset Taman (Penting!)
        if (typeof resetGardenUI === "function") {
            resetGardenUI();
        } else if (typeof clearGarden === "function") {
            clearGarden();
        }
        
        // Hapus status 'active' dari elemen scroll reveal
        // (Elemen jadi transparan lagi)
        document.querySelectorAll('.active, .aktif').forEach(el => {
            // JANGAN hapus class active punya page-section atau navbar
            if (!el.classList.contains('page-section') && !el.classList.contains('nav-item')) {
                el.classList.remove('active');
                el.classList.remove('aktif');
            }
        });

    }, 500);
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
    // 1. Hapus class 'active' dari semua halaman & tombol nav
    Object.values(pages).forEach(page => page.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));

    // 2. Tambahkan class 'active' ke halaman yang dipilih
    pages[pageName].classList.add('active');

    // 3. Update tombol nav
    const activeNavBtn = Array.from(navItems).find(item => item.getAttribute('onclick').includes(pageName));
    if(activeNavBtn) activeNavBtn.classList.add('active');

    // --- LOGIC NAVBAR REELS MODE (BARU) ---
    const navbar = document.querySelector('.bottom-navbar');
    
    if (pageName === 'reels') {
        // Jika masuk Reels -> Pakai baju gelap
        navbar.classList.add('reels-mode');
    } else {
        // Jika keluar Reels -> Lepas baju gelap (kembali ke putih/default)
        navbar.classList.remove('reels-mode');
    }
    // -------------------------------------


    // --- LOGIKA KHUSUS PER HALAMAN (YANG LAMA) ---
    if (pageName === 'reels') {
        // ... (kode resetGardenUI dll biarkan tetap ada) ...
        if (typeof resetGardenUI === "function") {
            resetGardenUI(); 
        } else {
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

        const bgMusic = document.getElementById('musik');
        if(!bgMusic.paused) toggleMusik();
        
        if (typeof playFirstReel === "function") playFirstReel();
    } 
    else {
        // Jika pindah KE Album atau Home
        if (typeof pauseAllReels === "function") pauseAllReels();
        const bgMusic = document.getElementById('musik');
         if(bgMusic.paused) toggleMusik();
    }

    if (pageName === 'home') {
        window.dispatchEvent(new Event('scroll'));
    }
}


/* --- REELS VIDEO LOGIC --- */

// 1. Observer untuk Auto-Play saat Scroll
const reelsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const reelItem = entry.target;
        const video = reelItem.querySelector('video');
        const btn = reelItem.querySelector('.video-control-btn');
        
        if (entry.isIntersecting) {
            // Video masuk layar -> PLAY
            // Kita reset waktu ke 0 biar mulus (opsional)
            // video.currentTime = 0; 
            
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Berhasil Play
                    reelItem.classList.add('playing');
                }).catch(error => {
                    console.log("Autoplay dicegah browser:", error);
                    // Jika gagal, munculkan tombol play manual (opsional)
                });
            }
        } else {
            // Video keluar layar -> PAUSE & MUTE kembali
            video.pause();
            reelItem.classList.remove('playing');
            // Opsional: Matikan suara lagi saat di-scroll lewat (biar pas balik ga kaget)
            video.muted = true;
            if(btn) {
                btn.innerText = "🔇";
                btn.classList.add('muted');
            }
        }
    });
}, { 
    threshold: 0.5 // Play saat 50% video terlihat (lebih responsif)
});

// 2. Pasang Logic ke Setiap Item
document.querySelectorAll('.reel-item').forEach(item => {
    reelsObserver.observe(item);
    
    const video = item.querySelector('video');
    const btn = item.querySelector('.video-control-btn');

    // FUNGSI UTAMA: Togle Suara & Play
    const toggleSound = () => {
        if (video.muted) {
            // NYALAKAN SUARA
            video.muted = false;
            btn.innerText = "🔊";
            btn.classList.remove('muted');
            
            // Matikan musik background website
            const bgMusic = document.getElementById('musik');
            if(!bgMusic.paused) toggleMusik();
            
        } else {
            // MATIKAN SUARA
            video.muted = true;
            btn.innerText = "🔇";
            btn.classList.add('muted');
        }
    };

    // Klik Tombol Mute
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Biar ga bentrok sama klik container
        toggleSound();
    });

    // Klik Layar Video (Cadangan) -> Juga bisa buat Play/Pause manual
    item.addEventListener('click', () => {
        if(video.paused) {
            video.play();
            toggleSound(); // Sekalian nyalain suara kalau di-tap
        } else {
            toggleSound(); // Kalau lagi play, tap buat nyalain/matiin suara
        }
    });
});

// 3. Helper: Pause Semua (Dipanggil saat pindah halaman)
function pauseAllReels() {
    document.querySelectorAll('.reel-item video').forEach(vid => {
        vid.pause();
        vid.muted = true; // Reset jadi bisu
    });
}

document.addEventListener('visibilitychange', function() {
    // Jika user meninggalkan halaman (Minimize Browser / Pindah Tab / Lock Screen)
    if (document.hidden) {
        console.log("User leaving - Killing all sound.");

        // 1. MATIKAN MUSIK BACKGROUND
        const bgMusic = document.getElementById('musik');
        const musicControl = document.querySelector('.music-control');
        
        if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
            if (musicControl) musicControl.classList.add('paused');
        }

        // 2. MATIKAN SEMUA VIDEO REELS (PENTING!)
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(vid => {
            if (!vid.paused) {
                vid.pause();
                // Opsional: Reset tombol mute di video tersebut jika perlu
                // tapi pause saja sudah cukup untuk menghentikan suara.
            }
        });
    }
});