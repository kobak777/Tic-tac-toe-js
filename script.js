const startBtn = document.querySelector("[data-start-btn]");
const cells = document.querySelectorAll("#field td");
const resultEl = document.querySelector("[data-result-text]");
const rulesBtn = document.querySelector("[data-rules-btn]");
const settingsBtn = document.querySelector("[data-settings-btn]");
const dialogRules = document.querySelector("[data-dialog-rules]");
const dialogSettings = document.querySelector("[data-dialog-settings]");
const headerEl = document.querySelector("[data-game-header]");
const rulesTextEl = document.querySelector(".rules-text");
const languageSelect = document.getElementById("language-select");
const themeSelect = document.getElementById("theme-select");
const labelLanguage = document.getElementById("label-language");
const labelTheme = document.getElementById("label-theme");

const translations = {
  en: {
    header: "Tic Tac Toe",
    result: "Let's play!",
    rulesText:
      "Players take turns placing signs on the empty cells of a 3×3 grid (one always crosses, the other always o's). The first player to arrange three of their pieces in a row, either vertically, horizontally, or diagonally, wins the game. If both players have filled all nine cells and there are no three matching signs in any row, column, or diagonal, the game ends in a draw. The player who places crosses makes the first move.",
    startBtn: "Start",
    winnerX: "X is winner",
    winnerO: "O is winner",
    draw: "Draw",
    themes: {
      bw: "Black & White",
      lavender: "Lavender",
      blue: "Blue",
      red: "Red",
      yellow: "Yellow",
      rainbow: "Rainbow",
    },
    settingsLanguage: "Language:",
    settingsTheme: "Theme:",
  },
  ru: {
    header: "Крестики-нолики",
    result: "Давайте играть!",
    rulesText:
      "Игроки по очереди ставят знаки в пустые клетки сетки 3×3 (один всегда крестики, другой — нолики). Первый, кто выстроит три своих знака по горизонтали, вертикали или диагонали, выигрывает. Если все 9 клеток заполнены и нет выигрышной линии, игра заканчивается ничьей. Крестики ходят первыми.",
    startBtn: "Начать",
    winnerX: "Победили крестики",
    winnerO: "Победили нолики",
    draw: "Ничья",
    themes: {
      bw: "Черно-белая",
      lavender: "Лавандовая",
      blue: "Синяя",
      red: "Красная",
      yellow: "Жёлтая",
      rainbow: "Разноцветная",
    },
    settingsLanguage: "Язык:",
    settingsTheme: "Тема:",
  },
};

let counter = 0;
let currentResultCode = "playing";

function updateLanguage(lang) {
  const t = translations[lang];
  headerEl.textContent = t.header;
  rulesTextEl.textContent = t.rulesText;
  startBtn.textContent = t.startBtn;
  labelLanguage.textContent = t.settingsLanguage;
  labelTheme.textContent = t.settingsTheme;

  if (counter === 0 && currentResultCode === "playing") {
    resultEl.textContent = t.result;
  } else {
    resultEl.textContent = t[currentResultCode] || t.result;
  }

  Object.entries(t.themes).forEach(([value, text]) => {
    const option = themeSelect.querySelector(`option[value="${value}"]`);
    if (option) option.textContent = text;
  });
}

languageSelect.addEventListener("change", (e) => {
  const lang = e.target.value;
  updateLanguage(lang);
  localStorage.setItem("ticTacToeLang", lang);
  saveGame();
});

function getWinningCombo() {
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const combo of combos) {
    if (
      cells[combo[0]].innerHTML === cells[combo[1]].innerHTML &&
      cells[combo[1]].innerHTML === cells[combo[2]].innerHTML &&
      cells[combo[0]].innerHTML !== ""
    ) {
      return combo;
    }
  }
  return null;
}

function saveGame() {
  const boardState = Array.from(cells).map((cell) => cell.innerHTML);
  localStorage.setItem("ticTacToeBoard", JSON.stringify(boardState));
  localStorage.setItem("ticTacToeCounter", counter);
  localStorage.setItem("ticTacToeResultCode", currentResultCode);
  localStorage.setItem("ticTacToeLang", languageSelect.value);
}

function tapCell(event) {
  if (counter % 2 === 0) {
    event.target.innerHTML = '<div class="cross"></div>';
  } else {
    event.target.innerHTML = '<div class="circle"></div>';
  }

  const winningCombo = getWinningCombo();
  if (winningCombo) {
    for (const cell of cells) {
      cell.removeEventListener("click", tapCell);
      cell.classList.remove("highlight");
    }
    winningCombo.forEach((index) => cells[index].classList.add("highlight"));

    const lang = languageSelect.value;
    if (counter % 2 === 0) {
      currentResultCode = "winnerX";
    } else {
      currentResultCode = "winnerO";
    }
    resultEl.textContent = translations[lang][currentResultCode];
  } else if (counter === 8) {
    currentResultCode = "draw";
    resultEl.textContent = translations[languageSelect.value].draw;
  } else {
    currentResultCode = "playing";
    resultEl.textContent = translations[languageSelect.value].result;
  }

  counter++;
  event.target.removeEventListener("click", tapCell);
  saveGame();
}

function startGame() {
  counter = 0;
  currentResultCode = "playing";
  for (const cell of cells) {
    cell.innerHTML = "";
    cell.classList.remove("highlight");
    cell.addEventListener("click", tapCell);
  }
  resultEl.textContent = translations[languageSelect.value].result;
  saveGame();
}

document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dialog = btn.closest("dialog");
    if (dialog) dialog.close();
  });
});

rulesBtn.addEventListener("click", () => {
  dialogRules.showModal();
});

settingsBtn.addEventListener("click", () => {
  dialogSettings.showModal();
});

startBtn.addEventListener("click", startGame);

document.addEventListener("DOMContentLoaded", () => {
  let savedTheme = localStorage.getItem("ticTacToeTheme");
  if (!savedTheme) {
    savedTheme = "bw"; 
    localStorage.setItem("ticTacToeTheme", savedTheme);
  }
  themeSelect.value = savedTheme;
  document.body.className = savedTheme;

  const savedLang = localStorage.getItem("ticTacToeLang");
  if (savedLang) {
    languageSelect.value = savedLang;
  }

  updateLanguage(languageSelect.value);
});


themeSelect.addEventListener("change", (e) => {
  const theme = e.target.value.toLowerCase();
  document.body.className = theme;
  localStorage.setItem("ticTacToeTheme", theme);
});
