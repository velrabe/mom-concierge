const solutionSlides = [
  {
    question: "Ребёнок плохо спит. Что делать?",
    answer: "AI быстро собирает контекст, отсеивает лишнее и предлагает понятные шаги на сегодня.",
    action: "Показать рекомендации",
    note: "Можно уточнить возраст, режим и симптомы",
    meta: "Ответ обновится под твою ситуацию",
  },
  {
    question: "Нужно разобраться глубже?",
    answer: "Консультант подключится к вопросу, задаст уточнения и поможет выбрать безопасное решение.",
    action: "Подключить консультанта",
    note: "Когда вопрос сложный или тревожный",
    meta: "Человек ответит в течение 1–3 часов",
  },
  {
    question: "Нужен специалист рядом?",
    answer: "Подберём проверенного врача, сервис или подходящий вариант по твоему запросу.",
    action: "Подобрать специалиста",
    note: "Рекомендации без бесконечного поиска",
    meta: "Учитываем задачу, район и срочность",
  },
];

const solutionTabs = Array.from(document.querySelectorAll("[data-solution-tab]"));
const solutionItems = Array.from(document.querySelectorAll(".solution-feature"));
const phoneScreen = document.querySelector(".solution-phone-screen");
const phoneQuestion = document.querySelector("[data-phone-question]");
const phoneAnswer = document.querySelector("[data-phone-answer]");
const phoneAction = document.querySelector("[data-phone-action]");
const phoneNote = document.querySelector("[data-phone-note]");
const phoneMeta = document.querySelector("[data-phone-meta]");

let activeSolutionSlide = 0;
let solutionTimer;

function renderSolutionSlide(index) {
  const slide = solutionSlides[index];

  activeSolutionSlide = index;
  phoneScreen?.classList.add("is-switching");

  window.setTimeout(() => {
    if (phoneQuestion) phoneQuestion.textContent = slide.question;
    if (phoneAnswer) phoneAnswer.textContent = slide.answer;
    if (phoneAction) phoneAction.textContent = slide.action;
    if (phoneNote) phoneNote.textContent = slide.note;
    if (phoneMeta) phoneMeta.textContent = slide.meta;

    solutionItems.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === index);
    });

    solutionTabs.forEach((tab, tabIndex) => {
      tab.setAttribute("aria-pressed", String(tabIndex === index));
    });

    phoneScreen?.classList.remove("is-switching");
  }, 160);
}

function startSolutionAutoplay() {
  window.clearInterval(solutionTimer);
  solutionTimer = window.setInterval(() => {
    renderSolutionSlide((activeSolutionSlide + 1) % solutionSlides.length);
  }, 4200);
}

solutionTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    renderSolutionSlide(Number(tab.dataset.solutionTab));
    startSolutionAutoplay();
  });
});

if (solutionTabs.length > 0) {
  startSolutionAutoplay();
}
