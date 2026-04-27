const solutionSlides = [
  {
    question: "Как быстро понять, почему ребёнок плохо спит?",
    questionTime: "11:24",
    answer: "Собрала короткий план проверки режима. Начнём с возраста, окон бодрствования и ритуала перед сном.",
    answerTime: "11:25",
    cardIcon: "AI",
    cardTitle: "План сна на сегодня",
    cardSubtitle: "3 шага: режим, ритуал, мягкое укладывание",
    cardMeta: "Обновлено под возраст 8 месяцев",
    primaryAction: "Открыть план",
    secondaryAction: "Уточнить",
    input: "Напишите сообщение...",
  },
  {
    question: "Температура держится второй день. Что делать до врача?",
    questionTime: "12:08",
    answer: "Передала вопрос консультанту. Он уточнит возраст, симптомы и подскажет безопасные шаги до очного осмотра.",
    answerTime: "12:09",
    cardIcon: "К",
    cardTitle: "Анна М., консультант",
    cardSubtitle: "Педиатрический триаж, 9 лет опыта",
    cardMeta: "Ответит в течение 20 минут",
    primaryAction: "Подключить",
    secondaryAction: "Что спросит?",
    input: "Опишите симптомы...",
  },
  {
    question: "Посоветуйте нормального педиатра, а то уже 2 не зашли",
    questionTime: "11:30",
    answer: "Подобрали 3 проверенных врача рядом с вами. Вот разница + отзывы. Можем записать на завтра.",
    answerTime: "11:31",
    cardIcon: "И",
    cardTitle: "Иванова А. С.",
    cardSubtitle: "Педиатр, стаж 12 лет",
    cardMeta: "★ 4.9 (86 отзывов)",
    primaryAction: "Записать",
    secondaryAction: "Сравнить",
    input: "Напишите сообщение...",
  },
];

const solutionTabs = Array.from(document.querySelectorAll("[data-solution-tab]"));
const solutionItems = Array.from(document.querySelectorAll(".solution-feature"));
const phoneScreen = document.querySelector(".solution-phone-screen");
const phoneQuestion = document.querySelector("[data-phone-question]");
const phoneQuestionTime = document.querySelector("[data-phone-question-time]");
const phoneAnswer = document.querySelector("[data-phone-answer]");
const phoneAnswerTime = document.querySelector("[data-phone-answer-time]");
const phoneCardIcon = document.querySelector("[data-phone-card-icon]");
const phoneCardTitle = document.querySelector("[data-phone-card-title]");
const phoneCardSubtitle = document.querySelector("[data-phone-card-subtitle]");
const phoneCardMeta = document.querySelector("[data-phone-card-meta]");
const phonePrimaryAction = document.querySelector("[data-phone-primary-action]");
const phoneSecondaryAction = document.querySelector("[data-phone-secondary-action]");
const phoneInput = document.querySelector("[data-phone-input]");

let activeSolutionSlide = 0;
let solutionTimer;

function renderSolutionSlide(index) {
  const slide = solutionSlides[index];

  activeSolutionSlide = index;
  phoneScreen?.classList.add("is-switching");

  window.setTimeout(() => {
    if (phoneQuestion) phoneQuestion.textContent = slide.question;
    if (phoneQuestionTime) phoneQuestionTime.textContent = slide.questionTime;
    if (phoneAnswer) phoneAnswer.textContent = slide.answer;
    if (phoneAnswerTime) phoneAnswerTime.textContent = slide.answerTime;
    if (phoneCardIcon) phoneCardIcon.textContent = slide.cardIcon;
    if (phoneCardTitle) phoneCardTitle.textContent = slide.cardTitle;
    if (phoneCardSubtitle) phoneCardSubtitle.textContent = slide.cardSubtitle;
    if (phoneCardMeta) phoneCardMeta.textContent = slide.cardMeta;
    if (phonePrimaryAction) phonePrimaryAction.textContent = slide.primaryAction;
    if (phoneSecondaryAction) phoneSecondaryAction.textContent = slide.secondaryAction;
    if (phoneInput) phoneInput.textContent = slide.input;

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

const footerForm = document.querySelector(".site-footer-form");
footerForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});
