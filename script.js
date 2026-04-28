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
    answer: "Передала вопрос менеджеру. Он уточнит возраст, симптомы и подскажет безопасные шаги до очного осмотра.",
    answerTime: "12:09",
    cardIcon: "К",
    cardTitle: "Анна М., менеджер",
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

function renderSolutionPhoneClock() {
  const el = document.querySelector(".solution-phone-clock");
  if (!el) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  el.textContent = `${hh}:${mm}`;
  try {
    el.setAttribute("datetime", now.toISOString());
  } catch {
    el.removeAttribute("datetime");
  }
}

renderSolutionPhoneClock();
window.setInterval(renderSolutionPhoneClock, 30000);

(function initHeroTaskHints() {
  const hintEl = document.querySelector("#hero-hint");
  const copyEl = document.querySelector("#hero-hint-copy");
  const bubbles = Array.from(document.querySelectorAll(".task-bubble[data-hero-hint]"));
  if (!hintEl || !copyEl || bubbles.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /** Совпадает с `.hero-hint` выходом opacity/transform 0.3s + запас кадра */
  const HINT_EXIT_MS = 330;
  /** Пауза между сменой баблов: показ + выход/вход анимаций + чтение */
  const AUTOPLAY_MS = 5600;
  let hideFallbackTimer = 0;
  let pendingRevealTimer = 0;
  let autoplayTimer = 0;
  let nextAutoplayIndex = 0;
  let hoveringBubble = false;

  function cancelPendingReveal() {
    window.clearTimeout(pendingRevealTimer);
    pendingRevealTimer = 0;
  }

  function onBubbleHideTransitionEnd(event) {
    if (event.target !== hintEl || event.propertyName !== "opacity") return;
    finishHintHide();
  }

  function clearChars() {
    copyEl.textContent = "";
  }

  function clearAutoplayActive() {
    bubbles.forEach((b) => b.classList.remove("is-autoplay-active"));
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = 0;
  }

  function runAutoplayTick() {
    if (hoveringBubble) return;
    const el = bubbles[nextAutoplayIndex];
    if (!el) return;
    clearAutoplayActive();
    el.classList.add("is-autoplay-active");
    const text = el.dataset.heroHint;
    if (text) showHint(text);
    nextAutoplayIndex = (nextAutoplayIndex + 1) % bubbles.length;
  }

  function startAutoplay() {
    stopAutoplay();
    if (hoveringBubble) return;
    runAutoplayTick();
    autoplayTimer = window.setInterval(runAutoplayTick, AUTOPLAY_MS);
  }

  let hintHideFinished = false;

  function finishHintHide() {
    if (hintHideFinished) return;
    hintHideFinished = true;
    window.clearTimeout(hideFallbackTimer);
    hintEl.removeEventListener("transitionend", onBubbleHideTransitionEnd);
    clearChars();
    if (!hoveringBubble) startAutoplay();
  }

  function renderHintMarkup(line) {
    const delayStep = 0.004;
    const words = line.split(/\s+/).filter(Boolean);
    let charIndex = 0;

    words.forEach((word, wi) => {
      const wordWrap = document.createElement("span");
      wordWrap.className = "hero-hint-word";
      [...word].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "hero-hint-char";
        span.textContent = ch;
        span.style.animationDelay = `${charIndex * delayStep}s`;
        charIndex += 1;
        wordWrap.appendChild(span);
      });
      copyEl.appendChild(wordWrap);
      if (wi < words.length - 1) {
        copyEl.appendChild(document.createTextNode(" "));
      }
    });
  }

  function showHint(text) {
    const line = String(text || "").trim();
    if (!line) return;

    cancelPendingReveal();

    function revealMounted() {
      clearChars();

      if (reducedMotion) {
        copyEl.textContent = line;
        void hintEl.offsetWidth;
        hintEl.classList.add("is-visible");
        return;
      }

      renderHintMarkup(line);
      void hintEl.offsetWidth;
      hintEl.classList.add("is-visible");
    }

    if (reducedMotion) {
      hintEl.classList.remove("is-visible");
      revealMounted();
      return;
    }

    const wasVisible = hintEl.classList.contains("is-visible");
    hintEl.classList.remove("is-visible");

    if (wasVisible) {
      pendingRevealTimer = window.setTimeout(() => {
        pendingRevealTimer = 0;
        revealMounted();
      }, HINT_EXIT_MS);
    } else {
      revealMounted();
    }
  }

  function scheduleHide() {
    hintHideFinished = false;
    cancelPendingReveal();
    window.clearTimeout(hideFallbackTimer);
    hintEl.removeEventListener("transitionend", onBubbleHideTransitionEnd);
    hintEl.classList.remove("is-visible");

    hintEl.addEventListener("transitionend", onBubbleHideTransitionEnd);
    hideFallbackTimer = window.setTimeout(finishHintHide, 320);
  }

  bubbles.forEach((bubble) => {
    bubble.addEventListener("mouseenter", () => {
      window.clearTimeout(hideFallbackTimer);
      cancelPendingReveal();
      hintEl.removeEventListener("transitionend", onBubbleHideTransitionEnd);
      hoveringBubble = true;
      stopAutoplay();
      clearAutoplayActive();
      const text = bubble.dataset.heroHint;
      if (text) showHint(text);
    });
    bubble.addEventListener("mouseleave", () => {
      window.requestAnimationFrame(() => {
        if (bubbles.some((b) => b.matches(":hover"))) return;
        hoveringBubble = false;
        scheduleHide();
      });
    });
  });

  startAutoplay();
})();
