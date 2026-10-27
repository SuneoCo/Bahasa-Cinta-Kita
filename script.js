"use strict";

const $ = (selector) => document.querySelector(selector);

const LOVE_LANGUAGES = {
  words: {
    name: "Words of Affirmation",
    indo: "Kata-kata yang menguatkan",
    description:
      "Kamu merasa disayang saat ada apresiasi, kata-kata tulus, dukungan, dan ungkapan perasaan yang jelas."
  },
  time: {
    name: "Quality Time",
    indo: "Waktu berkualitas",
    description:
      "Kamu merasa dekat saat mendapat perhatian penuh, ngobrol dari hati ke hati, atau menikmati waktu bersama."
  },
  gifts: {
    name: "Receiving Gifts",
    indo: "Hadiah penuh makna",
    description:
      "Bukan soal mahalnya barang. Kamu menghargai hadiah kecil yang menunjukkan kalau seseorang ingat dan memikirkanmu."
  },
  service: {
    name: "Acts of Service",
    indo: "Tindakan nyata",
    description:
      "Kamu merasa diperhatikan saat seseorang membantu, meringankan bebanmu, atau melakukan hal kecil tanpa harus diminta."
  },
  touch: {
    name: "Physical Touch",
    indo: "Sentuhan fisik",
    description:
      "Pelukan, gandengan tangan, atau sentuhan hangat yang kamu nyaman terima bisa membuatmu merasa dekat dan aman."
  }
};

const QUESTIONS = [
  {
    question: "Kalau kamu lagi capek banget, mana yang paling bikin kamu merasa disayang?",
    answers: [
      { text: "Dikasih kata-kata yang bikin aku semangat", type: "words" },
      { text: "Ditemenin dan didengerin tanpa distraksi", type: "time" },
      { text: "Dikasih sesuatu yang kecil tapi berkesan", type: "gifts" },
      { text: "Dibantu menyelesaikan hal yang bikin pusing", type: "service" },
      { text: "Dip peluk atau digenggam tangannya", type: "touch" }
    ]
  },
  {
    question: "Hal sederhana apa yang paling bikin kamu senyum?",
    answers: [
      { text: "Denger dia bilang kalau dia bangga sama aku", type: "words" },
      { text: "Dia sengaja meluangkan waktu buat aku", type: "time" },
      { text: "Dia ingat sesuatu yang pernah aku pengin", type: "gifts" },
      { text: "Dia bantu tanpa aku harus minta dulu", type: "service" },
      { text: "Dia mendekat dan menggenggam tanganku", type: "touch" }
    ]
  },
  {
    question: "Saat kita lagi berjauhan, apa yang paling bikin kamu merasa dekat?",
    answers: [
      { text: "Pesan manis atau ucapan yang tulus", type: "words" },
      { text: "Telepon atau video call dengan fokus satu sama lain", type: "time" },
      { text: "Kejutan kecil yang dikirim khusus buat aku", type: "gifts" },
      { text: "Dia membantu urus sesuatu dari jauh", type: "service" },
      { text: "Membayangkan pelukan saat nanti ketemu", type: "touch" }
    ]
  },
  {
    question: "Kalau ada satu hal yang pengin lebih sering kamu rasakan dalam hubungan, apa itu?",
    answers: [
      { text: "Lebih sering dengar apa yang dia rasakan tentang aku", type: "words" },
      { text: "Punya lebih banyak waktu berkualitas berdua", type: "time" },
      { text: "Kejutan kecil yang menunjukkan dia ingat aku", type: "gifts" },
      { text: "Saling membantu dalam hal-hal sehari-hari", type: "service" },
      { text: "Lebih banyak pelukan dan sentuhan yang nyaman", type: "touch" }
    ]
  },
  {
    question: "Menurut kamu, bentuk perhatian yang paling berkesan itu...",
    answers: [
      { text: "Dia jujur mengungkapkan rasa sayang dan apresiasinya", type: "words" },
      { text: "Dia benar-benar hadir saat kami bersama", type: "time" },
      { text: "Dia memberikan sesuatu yang punya cerita khusus", type: "gifts" },
      { text: "Dia membuktikan perhatian lewat perbuatan", type: "service" },
      { text: "Dia menunjukkan kedekatan lewat sentuhan yang aku suka", type: "touch" }
    ]
  }
];

const TYPES = Object.keys(LOVE_LANGUAGES);

const state = {
  pre: { index: 0, answers: [], complete: false, started: false },
  post: { index: 0, answers: [], complete: false, started: false }
};

function getScores(answers) {
  const scores = Object.fromEntries(TYPES.map((type) => [type, 0]));
  answers.forEach((type) => {
    if (Object.hasOwn(scores, type)) scores[type] += 1;
  });
  return scores;
}

function getTopType(scores) {
  const highest = Math.max(...Object.values(scores));
  return TYPES.find((type) => scores[type] === highest) || TYPES[0];
}

function getRankedTypes(scores) {
  return [...TYPES].sort((a, b) => scores[b] - scores[a]);
}

function renderScores(scores) {
  return getRankedTypes(scores).map((type) => {
    const details = LOVE_LANGUAGES[type];
    const percent = (scores[type] / QUESTIONS.length) * 100;

    return `
      <div class="score-row">
        <div class="score-heading">
          <span>${details.indo}</span>
          <strong>${scores[type]}/${QUESTIONS.length}</strong>
        </div>
        <div class="score-track" role="img"
             aria-label="${details.indo}: ${scores[type]} dari ${QUESTIONS.length}">
          <div class="score-fill" style="width:${percent}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderResult(which) {
  const quiz = state[which];
  const scores = getScores(quiz.answers);
  const topType = getTopType(scores);
  const details = LOVE_LANGUAGES[topType];
  const result = $(`#${which}Result`);

  result.innerHTML = `
    <p class="result-kicker">HASIL ${which === "pre" ? "PRE-TEST" : "POST-TEST"}</p>
    <h4 class="result-name">${details.indo}</h4>
    <p><strong>${details.name}</strong></p>
    <p class="result-description">${details.description}</p>
    <h4>Jawaban kamu</h4>
    ${renderScores(scores)}
    <p class="muted">
      Hasil ini menunjukkan jawaban yang paling sering kamu pilih,
      bukan penilaian mutlak tentang dirimu.
    </p>
  `;

  result.hidden = false;
  return { scores, topType };
}

function renderQuestion(which) {
  const quiz = state[which];
  const number = quiz.index;
  const question = QUESTIONS[number];
  const prefix = which === "pre" ? "pre" : "post";

  $(`#${prefix}Title`).textContent = question.question;
  $(`#${prefix}Instruction`).textContent =
    `Pertanyaan ${number + 1} dari ${QUESTIONS.length}. Pilih jawaban yang paling kamu rasakan.`;

  $(`#${prefix}Progress`).textContent =
    `${number + 1} / ${QUESTIONS.length}`;

  const answersElement = $(`#${prefix}Answers`);
  answersElement.innerHTML = "";

  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.innerHTML = `<span>${answer.text}</span><span aria-hidden="true">♡</span>`;

    if (quiz.answers[number] === answer.type) {
      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.setAttribute("aria-pressed", "false");
    }

    button.addEventListener("click", () => {
      quiz.answers[number] = answer.type;
      renderQuestion(which);
      $(`#${prefix}NextBtn`).disabled = false;
    });

    answersElement.appendChild(button);
  });

  $(`#${prefix}BackBtn`).disabled = number === 0;
  $(`#${prefix}NextBtn`).disabled = !quiz.answers[number];
  $(`#${prefix}NextBtn`).textContent =
    number === QUESTIONS.length - 1 ? "Lihat hasil ♡" : "Berikutnya →";

  $(`#${prefix}Result`).hidden = true;
}

function startQuiz(which) {
  const quiz = state[which];

  if (which === "post" && !state.pre.complete) {
    return;
  }

  quiz.started = true;
  quiz.index = 0;
  quiz.answers = [];
  quiz.complete = false;

  $(`#${which}Progress`).textContent = `1 / ${QUESTIONS.length}`;
  $(`#${which}Result`).hidden = true;
  renderQuestion(which);

  $(`#${which}Title`).scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function nextQuestion(which) {
  const quiz = state[which];

  if (!quiz.started || !quiz.answers[quiz.index]) return;

  if (quiz.index < QUESTIONS.length - 1) {
    quiz.index += 1;
    renderQuestion(which);
    return;
  }

  quiz.complete = true;
  $(`#${which}Title`).textContent =
    which === "pre" ? "Ini hasil awal kamu ♡" : "Ini hasil terbaru kamu ♡";

  $(`#${which}Instruction`).textContent =
    "Luangkan waktu sebentar untuk membaca hasilnya.";

  $(`#${which}Progress`).textContent = "Selesai!";
  $(`#${which}Answers`).innerHTML = "";
  $(`#${which}BackBtn`).disabled = true;
  $(`#${which}NextBtn`).disabled = true;
  $(`#${which}NextBtn`).textContent = "Selesai ♡";

  renderResult(which);

  if (which === "pre") {
    $(`#postNextBtn`).disabled = false;
    $(`#postInstruction`).textContent =
      "Kalau sudah siap, kamu bisa mulai post-test untuk membandingkan hasil.";
    $(`#postProgress`).textContent = "Siap dimulai";
  } else {
    renderComparison();
  }
}

function previousQuestion(which) {
  const quiz = state[which];

  if (!quiz.started || quiz.complete || quiz.index === 0) return;

  quiz.index -= 1;
  renderQuestion(which);
}

function renderComparison() {
  const preScores = getScores(state.pre.answers);
  const postScores = getScores(state.post.answers);
  const preTop = getTopType(preScores);
  const postTop = getTopType(postScores);
  const comparison = $("#comparison");
  const content = $("#comparisonContent");

  let summary;

  if (preTop === postTop) {
    summary =
      `Dari dua tes ini, kategori yang paling sering kamu pilih tetap ` +
      `<strong>${LOVE_LANGUAGES[preTop].indo}</strong>. Menarik buat jadi bahan ngobrol, ` +
      `tapi bukan berarti kebutuhanmu nggak bisa berubah.`;
  } else {
    summary =
      `Di pre-test, jawabanmu paling banyak mengarah ke ` +
      `<strong>${LOVE_LANGUAGES[preTop].indo}</strong>. Di post-test, ` +
      `jawabanmu paling banyak mengarah ke ` +
      `<strong>${LOVE_LANGUAGES[postTop].indo}</strong>. ` +
      `Mungkin ada hal baru yang kamu sadari, atau suasana saat menjawab berbeda.`;
  }

  content.innerHTML = `
    <div class="comparison-grid">
      <div class="comparison-item">
        <span>Awalnya · pre-test</span>
        <strong>${LOVE_LANGUAGES[preTop].indo}</strong>
        <span>${preScores[preTop]} dari ${QUESTIONS.length} jawaban</span>
      </div>
      <div class="comparison-item">
        <span>Sekarang · post-test</span>
        <strong>${LOVE_LANGUAGES[postTop].indo}</strong>
        <span>${postScores[postTop]} dari ${QUESTIONS.length} jawaban</span>
      </div>
    </div>
    <p class="comparison-summary">${summary}</p>
    <h4>Perbandingan semua kategori</h4>
    ${TYPES.map((type) => `
      <div class="score-row">
        <div class="score-heading">
          <span>${LOVE_LANGUAGES[type].indo}</span>
          <strong>${preScores[type]} → ${postScores[type]}</strong>
        </div>
        <div class="score-track" role="img"
             aria-label="${LOVE_LANGUAGES[type].indo}: pre-test ${preScores[type]}, post-test ${postScores[type]}">
          <div class="score-fill" style="width:${postScores[type] / QUESTIONS.length * 100}%"></div>
        </div>
      </div>
    `).join("")}
  `;

  comparison.hidden = false;
}

$("#preAnswers").addEventListener("click", (event) => {
  const button = event.target.closest("[data-start='pre']");
  if (button) startQuiz("pre");
});

$("#preNextBtn").addEventListener("click", () => nextQuestion("pre"));
$("#preBackBtn").addEventListener("click", () => previousQuestion("pre"));

$("#postNextBtn").addEventListener("click", () => {
  if (!state.pre.complete) return;

  if (!state.post.started || state.post.complete) {
    startQuiz("post");
  } else {
    nextQuestion("post");
  }
});

$("#postBackBtn").addEventListener("click", () => previousQuestion("post"));

$("#resetQuizBtn").addEventListener("click", () => {
  for (const which of ["pre", "post"]) {
    state[which] = {
      index: 0,
      answers: [],
      complete: false,
      started: false
    };
    $(`#${which}Result`).hidden = true;
  }

  $("#preTitle").textContent =
    "Menurut kamu, hal apa yang paling bikin kamu merasa disayang?";
  $("#preInstruction").textContent =
    "Pilih satu jawaban yang paling menggambarkan perasaan kamu.";
  $("#preProgress").textContent = "Belum dimulai";
  $("#preAnswers").innerHTML = `
    <button class="answer-option" type="button" data-start="pre">
      <span>Mulai jawab pertanyaan</span><span>→</span>
    </button>
  `;
  $("#preBackBtn").disabled = true;
  $("#preNextBtn").disabled = true;
  $("#preNextBtn").textContent = "Berikutnya →";

  $("#postTitle").textContent =
    "Sekarang, coba lihat lagi apa yang paling berarti buat kamu.";
  $("#postInstruction").textContent =
    "Selesaikan pre-test dulu, ya. Hasilnya akan jadi pembanding.";
  $("#postProgress").textContent = "Setelah kamu siap";
  $("#postAnswers").innerHTML =
    '<p class="muted">Selesaikan pre-test dulu, ya. Hasilnya akan jadi pembanding.</p>';
  $("#postBackBtn").disabled = true;
  $("#postNextBtn").disabled = true;
  $("#postNextBtn").textContent = "Mulai post-test →";
  $("#comparison").hidden = true;

  $("#preCard").scrollIntoView({ behavior: "smooth", block: "start" });
});

// Pesan kejutan
$("#surpriseBtn").addEventListener("click", () => {
  const message = $("#surpriseMessage");
  const isHidden = message.hidden;

  message.hidden = !isHidden;
  $("#surpriseBtn").textContent = isHidden
    ? "Tutup pesan ♡"
    : "Ada pesan buat kamu ♡";

  if (isHidden) {
    message.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
});

// Penghitung hari bersama
const startDateInput = $("#startDate");
const dayCount = $("#dayCount");
const counterCaption = $("#counterCaption");
const DATE_STORAGE_KEY = "untukSayangStartDate";

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(value) {
  const parts = value.split("-").map(Number);

  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
}

function updateDayCount() {
  if (!startDateInput.value) {
    dayCount.innerHTML = '— <span>hari</span>';
    counterCaption.textContent =
      "Pilih tanggal yang punya arti buat kalian ♡";
    return;
  }

  const start = parseLocalDate(startDateInput.value);
  const today = parseLocalDate(localDateString(new Date()));

  if (!start || !today) {
    dayCount.innerHTML = '— <span>hari</span>';
    counterCaption.textContent = "Tanggalnya belum valid, coba pilih lagi ya.";
    return;
  }

  if (start > today) {
    dayCount.innerHTML = '— <span>hari</span>';
    counterCaption.textContent =
      "Tanggalnya masih di masa depan. Coba cek lagi, ya.";
    return;
  }

  const daysApart = Math.floor((today - start) / 86400000);
  const daysTogether = daysApart + 1;

  dayCount.innerHTML = `${daysTogether.toLocaleString("id-ID")} <span>hari</span>`;
  counterCaption.textContent = daysApart === 0
    ? "Hari pertama kalian. Semoga jadi awal cerita yang baik ♡"
    : `Sudah ${daysApart.toLocaleString("id-ID")} hari sejak tanggal mulai kalian. Terus bikin cerita baik, ya.`;
}

$("#saveDateBtn").addEventListener("click", () => {
  if (!startDateInput.value) {
    counterCaption.textContent = "Pilih tanggalnya dulu, ya ♡";
    startDateInput.focus();
    return;
  }

  const chosen = parseLocalDate(startDateInput.value);
  const today = parseLocalDate(localDateString(new Date()));

  if (!chosen || chosen > today) {
    counterCaption.textContent =
      "Pilih tanggal yang valid dan bukan tanggal di masa depan, ya.";
    return;
  }

  try {
    localStorage.setItem(DATE_STORAGE_KEY, startDateInput.value);
  } catch (error) {
    // Website tetap berfungsi meskipun penyimpanan browser tidak tersedia.
  }

  updateDayCount();
  counterCaption.textContent =
    "Tanggalnya sudah disimpan di browser ini ♡";
});

startDateInput.addEventListener("change", updateDayCount);

try {
  const savedDate = localStorage.getItem(DATE_STORAGE_KEY);

  if (savedDate && parseLocalDate(savedDate)) {
    startDateInput.value = savedDate;
  }
} catch (error) {
  // Lewati penyimpanan lokal jika browser membatasinya.
}

startDateInput.max = localDateString(new Date());
updateDayCount();

// Foto yang belum tersedia diberi tampilan fallback yang tetap rapi.
document.querySelectorAll(".photo-card img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.objectFit = "contain";
    img.alt = "Tambahkan foto kalian ke folder photos";
  });
});
