// Для скрытия-показа элементов в зависимости от режима используй класс `.hidden`.

//## Обязательный уровень

// ### Режим тренировки (study)
//- По клику переворачиваются карточки (hint: добавь класс `.active` элементу `.flip-card`)
//- Карточки на одной стороне (`#card-front`) содержат иностранное слово, а на другой (`#card-back`) — его перевод и пример использования
//- С помощью стрелок можно листать карточки вперед-назад, будто слайдер (смотри [демо](https://github.com/CodegirlSchool/foreign-words-training/blob/main/README.md#%D0%B4%D0%B5%D0%BC%D0%BE%D0%BD%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B-%D0%BE%D0%B1%D0%B0-%D1%83%D1%80%D0%BE%D0%B2%D0%BD%D1%8F))
//- Если дошли до границы (к примеру, просматриваем первое или последнее слово), то стрелка вперед (или назад) блокируется
//- Отображается номер текущего слова (отсчет обязательно идет с единицы)
//- При клике на кнопку «Тестирование» осуществляется переход в режим проверки знаний

// ### Режим проверки знаний (exam)
//- Отображаются карточки слов и их переводов (определений) в **случайном** порядке «рубашками вверх»
//- Первая и вторая выбранные карточки подсвечиваются при клике
//- Первой карточке всегда добавляется класс `.correct`
//- Если карточки совпали (слово – перевод), они убираются с поля (добавляй обеим CSS-класс `.fade-out`)
//- Если пара подобрана неверно, вторая карточка на секунду подсвечивается красным (класс `.wrong`), и тестирование продолжается
//- Где-то через 500ms подсветка с неправильно подобранной пары должна пропасть
//- Когда все карточки пропадут с поля, пользователю должно показаться уведомление об успешном завершении проверки знаний (можно обойтись простым `alert`)

//## Продвинутый уровень 
//- Перемешивание карточек случайным образом в режиме тренировки (при клике на кнопку `#shuffle-words`)
//- Отображение времени тестирования в режиме проверки знаний (элемент `#timer`)
//- Отображение процента просмотренных слов в режиме тренировки (внутри `#study-mode` элемент `#words-progress`)
//- Отображение процента правильно отвеченных слов в режиме проверки знаний (внутри `#exam-mode` элементы `#correct-percent` и `#exam-progress`)
//- Отображение статистики каждого слова после проверки знаний (для показа результатов используй `#results-modal`, а чтобы вставить статистику по каждому слову задействуй `template#word-stats`)


const words = [
  { front: "sun", back: "солнце", example: "The sun is yellow.", attempts: 0 },
  { front: "sky", back: "небо", example: "The sky is blue.", attempts: 0 },
  { front: "apple", back: "яблоко", example: "The apple is red.", attempts: 0 },
  { front: "grass", back: "трава", example: "The grass is green.", attempts: 0 },
  { front: "orange", back: "апельсин", example: "Oranges are orange.", attempts: 0 }
];

let correctAnswers = 0;

// study mode 
// По клику переворачиваются карточки (hint: добавь класс `.active` элементу `.flip-card`)
const flipCard = document.querySelector(".flip-card"); // сама карточка, она должна переворачиваться
flipCard.addEventListener("click", () => {
  flipCard.classList.toggle("active");
});

// С помощью стрелок можно листать карточки вперед-назад, будто слайдер
let currentIndex = 0; //текущий индекс слова в массиве, начинаем с первого слова, поэтому 0

const nextButton = document.querySelector("#next");
nextButton.addEventListener("click", () => {
  if (currentIndex < words.length - 1) {
    currentIndex++;
    displayWord();
  }
});

const backButton = document.querySelector("#back");
backButton.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    displayWord();
  }
});

// Если дошли до границы (к примеру, просматриваем первое или последнее слово), то стрелка вперед (или назад) блокируется
function blockButtons() {
  backButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === words.length - 1;
}

// Отображение процента просмотренных слов в режиме тренировки (внутри `#study-mode` элемент `#words-progress`)
function showProgress() {
  const wordsProgress = document.querySelector("#words-progress"); // прогресс-бар во время обучения
  wordsProgress.value = ((currentIndex + 1) / words.length) * 100;
}

// Карточки на одной стороне (`#card-front`) содержат иностранное слово, а на другой (`#card-back`) — его перевод и пример использования
const cardFront = document.querySelector("#card-front h1");
const cardBack = document.querySelector("#card-back h1");
const exampleText = document.querySelector("#card-back span"); //The sun is yellow.  

function displayWord() {
  const word = words[currentIndex];
  cardFront.textContent = word.front;
  cardBack.textContent = word.back;
  exampleText.textContent = word.example;

  // Отображается номер текущего слова (отсчет обязательно идет с единицы)    
  const currentWordDisplay = document.querySelector("#current-word"); // Слово ... из 5    
  currentWordDisplay.textContent = currentIndex + 1;

  blockButtons();
  showProgress();
}

// При клике на кнопку «Тестирование» (exam) осуществляется переход в режим проверки знаний
const examButton = document.querySelector("#exam");
examButton.addEventListener("click", startExam);

// Перемешивание карточек случайным образом в режиме тренировки (при клике на кнопку `#shuffle-words`)
// Перемешивание массива слов - алгоритм Фишера-Йетса
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const shuffleButton = document.querySelector("#shuffle-words"); //кнопка Перемешать слова
shuffleButton.addEventListener("click", () => {
  shuffleArray(words);
  currentIndex = 0;
  displayWord();
});


// exam mode
let startTime; // переменная для хранения времени начала экзамена. Время записывается в миллисекундах с использованием Date.now().
let timerInterval;

const timerDisplay = document.querySelector("#time");

function toggleTimer(start) {
  if (start) {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const seconds = Math.floor((elapsedTime / 1000) % 60);
      const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
      timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
  } else {
    clearInterval(timerInterval);
  }
}

function startExam() {
  // скрываем элементы для режима обучения
  document.getElementById("study-mode").classList.add("hidden");
  document.getElementById("exam-mode").classList.remove("hidden");
  examButton.classList.add("hidden");
  backButton.classList.add("hidden");
  nextButton.classList.add("hidden");
  flipCard.classList.add("hidden");

  // Отображаются карточки слов и их переводов (определений) в **случайном** порядке «рубашками вверх»
  const cardPairs = []; // создаем новый массив, где будут только front и back стороны карточек 
  words.forEach((word, index) => {
    cardPairs.push({ text: word.front, isFront: true, pairId: index });
    cardPairs.push({ text: word.back, isFront: false, pairId: index }); // идентификатор пары pairId, равный текущему индексу, чтобы связать лицевую и обратную стороны карточки
  });
  const shuffledCards = shuffleArray(cardPairs); // перемешиваем карточки в новом массиве

  currentIndex = 0;
  correctAnswers = 0;

  toggleTimer(true);

  // Создание карточек для экзамена   
  const examCards = document.getElementById("exam-cards");
  examCards.innerHTML = "";

  shuffledCards.forEach((card) => {
    const cardElement = document.createElement("div"); // сама карточка
    cardElement.classList.add("card"); // карточка, может содержать как лицевую, так и обратную сторону
    if (card.isFront) {
      cardElement.classList.add("front");
    } else {
      cardElement.classList.add("back");
    }

    cardElement.textContent = card.text; // текст карточки в соответствии с ее содержимым (лицевая или обратная сторона).
    cardElement.dataset.pairId = card.pairId;
    examCards.appendChild(cardElement);
  });

  examCards.addEventListener("click", (event) => {
    const card = event.target; // кликаем на карточку

    card.classList.add("selected"); // Подсветка выбранной карточки

    // Найдем все выбранные карточки
    const selectedCards = Array.from(examCards.getElementsByClassName("selected"));

    if (selectedCards.length === 1) {
      // Если только одна карточка выбрана, ждем следующую
      selectedCards[0].classList.add("correct"); // Первой карточке добавляем класс .correct
      return;
    } else if (selectedCards.length === 2) {
      // Увеличиваем количество попыток для обоих выбранных карт
      words[parseInt(selectedCards[0].dataset.pairId)].attempts++;
      words[parseInt(selectedCards[1].dataset.pairId)].attempts++;

      // Проверяем, совпадают ли пары
      if (selectedCards[0].dataset.pairId === selectedCards[1].dataset.pairId) {
        // Обе карточки получают класс .correct
        selectedCards.forEach(card => card.classList.add("correct"));

        // Убираем обе карточки с поля, добавляя класс .fade-out
        selectedCards.forEach(card => card.classList.add("fade-out"));

        correctAnswers++;

        // Проверяем на завершение экзамена
        setTimeout(() => {
          selectedCards.forEach(card => card.remove()); // Удаляем карточки 

          // Обновляем отображение правильных ответов
          const correctPercentDisplay = document.querySelector("#correct-percent");
          const examProgress = document.querySelector("#exam-progress");
          correctPercentDisplay.textContent = `${((correctAnswers / words.length) * 100).toFixed(0)}%`;
          examProgress.value = (correctAnswers / words.length) * 100;

          if (!examCards.hasChildNodes()) {
            toggleTimer(false); // Останавливаем таймер
            alert("Поздравляем! Вы успешно завершили проверку знаний.");
            displayResults(); // Вызов функции для отображения результатов
          }
        }, 500);
      } else {
        // Если пары не совпадают, добавляем класс .wrong ко второй карточке
        selectedCards[1].classList.add("wrong");

        setTimeout(() => {
          // Убираем подсветку у второй карточки через 500 мс
          selectedCards[1].classList.remove("selected", "wrong");
        }, 500);

        // Убираем класс selected у первой карточки
        selectedCards[0].classList.remove("selected");
      }
    }
  });
}

// Отображение статистики каждого слова после проверки знаний (для показа результатов используй `#results-modal`, а чтобы вставить статистику по каждому слову задействуй `template#word-stats`)
function displayResults() {
  const resultsModal = document.querySelector(".results-modal");
  const resultsContent = document.querySelector(".results-content");
  const wordStatsTemplate = document.querySelector("#word-stats");

  resultsContent.innerHTML = ""; // Очистка предыдущего контента

  // Отображение статистики для каждого слова
  words.forEach((word) => {
    const wordStat = wordStatsTemplate.content.cloneNode(true);
    wordStat.querySelector(".word span").textContent = word.front; // Отображение слова
    wordStat.querySelector(".attempts span").textContent = word.attempts; // Отображение попыток
    resultsContent.appendChild(wordStat);
  });

  // Отображение времени прохождения экзамена
  const elapsedTime = Date.now() - startTime;
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  const timeDisplay = document.getElementById("timer");
  timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  resultsModal.classList.remove("hidden"); // Окно с результатами
}

displayWord(); // Инициализация первого слова