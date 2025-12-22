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
const teks = "Selamat Ulang Tahun ke-18.";
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
    this.innerText = "Semoga harimu indah..."; 
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