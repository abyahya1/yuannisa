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

// 3. SCROLL REVEAL (TWO-WAY)
window.addEventListener('scroll', () => {
    const wH = window.innerHeight;
    const triggerB = wH * 0.8; 
    const triggerT = wH * 0.2;
    document.querySelectorAll('.reveal, .card, .big-image-container').forEach(el => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + (rect.height/2);
        if(center < triggerB && center > triggerT) { el.classList.add('active'); el.classList.add('aktif'); }
        else { el.classList.remove('active'); el.classList.remove('aktif'); }
    });
});

// 4. GARDEN ANIMATION (Panggil Engine Baru)
document.getElementById('btn-taman').addEventListener('click', function() {
    this.style.borderBottom = "none";
    this.innerText = "Semoga harimu indah...";
    this.style.color = "#999";
    this.disabled = true;

    // Panggil fungsi dari garden.js
    if (typeof startGarden === "function") {
        startGarden(); 
    }
});

// 5. MUSIC
function toggleMusik() {
    const a=document.getElementById('musik'), c=document.querySelector('.music-control');
    if(a.paused){a.play(); c.classList.remove('paused');} else{a.pause(); c.classList.add('paused');}
}

// 6. REWRAP (RESET) - Update bagian reset garden
function rewrapGift() {
    window.scrollTo({top: 0, behavior: 'smooth'});
    setTimeout(() => {
        // ... kode reset overlay & audio yang lama ...
        document.getElementById('overlay').classList.remove('swiped-up');
        const audio = document.getElementById('musik');
        audio.pause(); audio.currentTime = 0;
        document.querySelector('.music-control').classList.add('paused');
        document.getElementById('typing-area').innerHTML = "";
        i = 0; isTyping = false;

        // RESET GARDEN CANVAS
        if (typeof clearGarden === "function") {
            clearGarden(); // Panggil fungsi pembersih dari garden.js
        }
        
        const btnTaman = document.getElementById('btn-taman');
        btnTaman.disabled = false;
        btnTaman.innerText = "Taman sederhana dari aku buat kamu 🌻";
        btnTaman.style.color = "";
        btnTaman.style.borderBottom = "1px solid #333";
        
        document.querySelectorAll('.active, .aktif').forEach(el => {
            el.classList.remove('active');
            el.classList.remove('aktif');
        });
    }, 500);
}
document.querySelector('.btn-circle').addEventListener('click', ()=>{ isTyping=true; ngetik(); });