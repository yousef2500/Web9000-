let songs = [
  "assets/music/song1.mp3",
  "assets/music/song2.mp3",
  "assets/music/song3.mp3"
  "assets/music/song4.mp3"
  "assets/music/song5.mp3" 
];

let currentSong = 0;
let audio = new Audio(songs[currentSong]);
audio.loop = false;

// 🎵 تشغيل الموسيقى
function playSong() {
  audio.play();
}

// ⛔ إيقاف الموسيقى
function pauseSong() {
  audio.pause();
}

// التالي
function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  audio.src = songs[currentSong];
  audio.play();
}

// السابق
function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  audio.src = songs[currentSong];
  audio.play();
}

// كتم الصوت
function mute() {
  audio.muted = !audio.muted;
}

// 🎥 فتح فيديو (مهم)
function openVideo(src) {
  pauseSong(); // ⛔ وقف الموسيقى

  let container = document.getElementById("videoContainer");

  container.innerHTML = `
    <video id="activeVideo" src="${src}" controls autoplay style="width:100%; border-radius:15px;"></video>
  `;

  let video = document.getElementById("activeVideo");

  video.onended = () => {
    playSong(); // 🎵 رجوع الموسيقى
  };
}
// فتح ألبوم
function openAlbum(name) {
  alert("Opening " + name + " ❤️");
}

// 🔐 الباسورد
function checkPassword() {
  let pass = document.getElementById("password").value;

  if (pass === "DODO") {
    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("app").classList.remove("hidden");

    startBanner();
    playSong();
  } else {
    document.getElementById("error").innerText = "Wrong password 💔";
  }
}

//
// 💌 شريط الرسائل
//
function startBanner() {
  const banner = document.getElementById("banner");

  const messages = [
    "Khadija, you are my moon ❤️",
    "Every moment with you is magic ✨",
    "I love you forever 🌙",
    "You are my happiness 💖",
    "You are my dream come true ❤️",
    "My heart belongs to you 💕"
  ];

  let i = 0;

  function showNext() {
    banner.style.opacity = 0;

    setTimeout(() => {
      banner.innerText = messages[i];
      banner.style.opacity = 1;

      i = (i + 1) % messages.length;
    }, 500);
  }

  showNext();
  setInterval(showNext, 4000);
}