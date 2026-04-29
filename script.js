(function initMobileNavigation() {
  const burger = document.querySelector(".hero-nav-burger");
  const dialog = document.querySelector("#mobile-nav-dialog");
  const root = document.documentElement;

  if (!burger || !dialog) return;

  function setMobileNavOpen(nextOpen) {
    if (nextOpen) {
      dialog.removeAttribute("hidden");
      dialog.setAttribute("aria-hidden", "false");
      root.classList.add("mobile-nav-open");
      burger.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Закрыть меню");
      document.body.style.overflow = "hidden";
    } else {
      dialog.setAttribute("hidden", "");
      dialog.setAttribute("aria-hidden", "true");
      root.classList.remove("mobile-nav-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Открыть меню");
      document.body.style.overflow = "";
    }
  }

  function toggleMobileNav() {
    setMobileNavOpen(dialog.hasAttribute("hidden"));
  }

  burger.addEventListener("click", () => toggleMobileNav());

  dialog.querySelectorAll("a.mobile-nav-link, .mobile-nav-footer a").forEach((link) => {
    link.addEventListener("click", () => setMobileNavOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && root.classList.contains("mobile-nav-open")) {
      setMobileNavOpen(false);
    }
  });
})();

const solutionSlides = [
  {
    question: "Как быстро понять, почему ребёнок плохо спит?",
    questionTime: "11:24",
    answer: "Собрала короткий план проверки режима. Начнём с возраста, окон бодрствования и ритуала перед сном.",
    answerTime: "11:25",
    cardLead: "download",
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
    cardLead: "none",
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
    cardLead: "photo",
    cardPhotoSrc: "./img/reviews/review-1.jpg",
    cardPhotoAlt: "Иванова А. С., педиатр",
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
const solutionTabsMobileMq = window.matchMedia("(max-width: 47.5rem)");

function updateSolutionFeatureTabs(activeIndex) {
  if (solutionTabsMobileMq.matches) {
    solutionItems.forEach((item) => item.classList.remove("is-active"));
    solutionTabs.forEach((tab) => {
      tab.tabIndex = -1;
      tab.setAttribute("aria-disabled", "true");
      tab.setAttribute("aria-pressed", "false");
    });
    return;
  }
  solutionItems.forEach((item, itemIndex) => {
    item.classList.toggle("is-active", itemIndex === activeIndex);
  });
  solutionTabs.forEach((tab, tabIndex) => {
    tab.tabIndex = 0;
    tab.removeAttribute("aria-disabled");
    tab.setAttribute("aria-pressed", String(tabIndex === activeIndex));
  });
}

solutionTabsMobileMq.addEventListener("change", () =>
  updateSolutionFeatureTabs(activeSolutionSlide)
);
const phoneScreen = document.querySelector(".solution-phone-screen");
const phoneQuestion = document.querySelector("[data-phone-question]");
const phoneQuestionTime = document.querySelector("[data-phone-question-time]");
const phoneAnswer = document.querySelector("[data-phone-answer]");
const phoneAnswerTime = document.querySelector("[data-phone-answer-time]");
const phoneCardDownload = document.querySelector("[data-phone-download]");
const phoneCardPhotoWrap = document.querySelector("[data-phone-photo-wrap]");
const phoneCardPhoto = document.querySelector("[data-phone-card-photo]");
const phoneCardTitle = document.querySelector("[data-phone-card-title]");
const phoneCardSubtitle = document.querySelector("[data-phone-card-subtitle]");
const phoneCardMeta = document.querySelector("[data-phone-card-meta]");
const phonePrimaryAction = document.querySelector("[data-phone-primary-action]");
const phoneSecondaryAction = document.querySelector("[data-phone-secondary-action]");
const phoneInput = document.querySelector("[data-phone-input]");
const phoneResultLead = document.querySelector(".solution-result-lead");

let activeSolutionSlide = 0;
let solutionTimer;

let aiHelperGlareHideTimer = 0;
let aiHelperGlareStartRafId = 0;

/** Блик по stroke хелпера: при каждой смене слайда в блоке solution */
function playAiHelperGlareSweep() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const wrap = document.querySelector(".hero-ai-helper-wrap");
  if (!wrap) return;
  const stroke = wrap.querySelector(".hero-ai-helper-stroke");
  const mascot = wrap.querySelector(".hero-ai-helper");
  window.clearTimeout(aiHelperGlareHideTimer);
  if (aiHelperGlareStartRafId) {
    window.cancelAnimationFrame(aiHelperGlareStartRafId);
    aiHelperGlareStartRafId = 0;
  }
  wrap.classList.remove("is-glaring");
  if (stroke) {
    stroke.style.animation = "none";
    void stroke.getBoundingClientRect();
    stroke.style.removeProperty("animation");
  }
  if (mascot) {
    mascot.style.animation = "none";
    void mascot.getBoundingClientRect();
    mascot.style.removeProperty("animation");
  }
  void wrap.offsetWidth;
  aiHelperGlareStartRafId = window.requestAnimationFrame(() => {
    aiHelperGlareStartRafId = 0;
    wrap.classList.add("is-glaring");
    aiHelperGlareHideTimer = window.setTimeout(() => {
      wrap.classList.remove("is-glaring");
      aiHelperGlareHideTimer = 0;
    }, 2120);
  });
}

function renderSolutionSlide(index) {
  const slide = solutionSlides[index];

  activeSolutionSlide = index;
  phoneScreen?.classList.add("is-switching");

  window.setTimeout(() => {
    if (phoneScreen) phoneScreen.setAttribute("data-phone-lead", slide.cardLead ?? "none");
    if (phoneQuestion) phoneQuestion.textContent = slide.question;
    if (phoneQuestionTime) phoneQuestionTime.textContent = slide.questionTime;
    if (phoneAnswer) phoneAnswer.textContent = slide.answer;
    if (phoneAnswerTime) phoneAnswerTime.textContent = slide.answerTime;
    if (phoneCardDownload && phoneCardPhotoWrap && phoneCardPhoto) {
      if (slide.cardLead === "download") {
        if (phoneResultLead) phoneResultLead.hidden = false;
        phoneCardDownload.hidden = false;
        phoneCardPhotoWrap.hidden = true;
        phoneCardPhoto.removeAttribute("src");
        phoneCardPhoto.alt = "";
      } else if (slide.cardLead === "photo") {
        if (phoneResultLead) phoneResultLead.hidden = false;
        phoneCardDownload.hidden = true;
        phoneCardPhotoWrap.hidden = false;
        phoneCardPhoto.src = slide.cardPhotoSrc ?? "";
        phoneCardPhoto.alt = slide.cardPhotoAlt ?? slide.cardTitle ?? "";
      } else {
        if (phoneResultLead) phoneResultLead.hidden = true;
        phoneCardDownload.hidden = true;
        phoneCardPhotoWrap.hidden = true;
        phoneCardPhoto.removeAttribute("src");
        phoneCardPhoto.alt = "";
      }
    }
    if (phoneCardTitle) phoneCardTitle.textContent = slide.cardTitle;
    if (phoneCardSubtitle) phoneCardSubtitle.textContent = slide.cardSubtitle;
    if (phoneCardMeta) phoneCardMeta.textContent = slide.cardMeta;
    if (phonePrimaryAction) phonePrimaryAction.textContent = slide.primaryAction;
    if (phoneSecondaryAction) phoneSecondaryAction.textContent = slide.secondaryAction;
    if (phoneInput) phoneInput.textContent = slide.input;

    updateSolutionFeatureTabs(index);

    phoneScreen?.classList.remove("is-switching");
    playAiHelperGlareSweep();
  }, 160);
}

function startSolutionAutoplay() {
  window.clearInterval(solutionTimer);
  solutionTimer = window.setInterval(() => {
    renderSolutionSlide((activeSolutionSlide + 1) % solutionSlides.length);
  }, 4200);
}

solutionTabs.forEach((tab) => {
  tab.addEventListener("click", (event) => {
    if (solutionTabsMobileMq.matches) {
      event.preventDefault();
      return;
    }
    renderSolutionSlide(Number(tab.dataset.solutionTab));
    startSolutionAutoplay();
  });
});

if (solutionTabs.length > 0) {
  renderSolutionSlide(0);
  startSolutionAutoplay();
  window.requestAnimationFrame(() => {
    playAiHelperGlareSweep();
  });
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

(function initHeroAiHelperParallax() {
  const scene = document.querySelector(".hero-scene");
  const wrap = document.querySelector(".hero-ai-helper-wrap");
  const stack = document.querySelector(".hero-ai-helper-stack");
  const hintWrap = document.querySelector(".hero-hint-wrap");
  if (!scene || !wrap || !stack) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const MAX_SHIFT_REM = 0.5;
  const ROT_CORNER_DEG = 2 * (MAX_SHIFT_REM / 1.5);
  const IDLE_ORIENT_TRANSFORM = "translateY(-0.25rem) rotate(-2deg)";
  const PARALLAX_EASE_MS = 550;
  const IDLE_RESUME_AFTER_LAND_MS = 220;

  let leaveFallbackTimer = 0;
  let leaveResumeTimer = 0;

  /** @type { ((ev: TransitionEvent) => void) | null } */
  let leaveTeHandler = null;

  let exitingToIdle = false;

  function rotationDeg(nx, ny) {
    const rTopLeft = -ROT_CORNER_DEG;
    const rTopRight = ROT_CORNER_DEG;
    const rBotLeft = ROT_CORNER_DEG;
    const rBotRight = -ROT_CORNER_DEG;
    const rTop = rTopLeft * (1 - nx) + rTopRight * nx;
    const rBot = rBotLeft * (1 - nx) + rBotRight * nx;
    return rTop * (1 - ny) + rBot * ny;
  }

  function applyParallax(clientX, clientY) {
    const r = scene.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const nx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const ny = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    const tx = (nx - 0.5) * 2 * MAX_SHIFT_REM;
    const ty = (ny - 0.5) * 2 * MAX_SHIFT_REM;
    const rot = rotationDeg(nx, ny);
    const t = `translate(${tx}rem, ${ty}rem) rotate(${rot}deg)`;
    stack.style.transform = t;
    if (hintWrap) hintWrap.style.transform = t;
  }

  function cancelLeaveAnimation() {
    window.clearTimeout(leaveFallbackTimer);
    leaveFallbackTimer = 0;
    window.clearTimeout(leaveResumeTimer);
    leaveResumeTimer = 0;
    exitingToIdle = false;
    if (leaveTeHandler) {
      stack.removeEventListener("transitionend", leaveTeHandler);
      leaveTeHandler = null;
    }
  }

  function finishParallaxLeave() {
    cancelLeaveAnimation();
    wrap.classList.remove("hero-ai-helper-wrap--parallax-hover");
    stack.style.removeProperty("transform");
    if (hintWrap) hintWrap.style.removeProperty("transform");
  }

  function scheduleIdleResume() {
    window.clearTimeout(leaveResumeTimer);
    leaveResumeTimer = window.setTimeout(() => {
      leaveResumeTimer = 0;
      finishParallaxLeave();
    }, IDLE_RESUME_AFTER_LAND_MS);
  }

  function beginIdleResumePhase() {
    if (exitingToIdle) return;
    exitingToIdle = true;
    window.clearTimeout(leaveFallbackTimer);
    leaveFallbackTimer = 0;
    if (leaveTeHandler) {
      stack.removeEventListener("transitionend", leaveTeHandler);
      leaveTeHandler = null;
    }
    scheduleIdleResume();
  }

  function onLeave() {
    if (!wrap.classList.contains("hero-ai-helper-wrap--parallax-hover")) return;
    cancelLeaveAnimation();

    stack.style.transform = IDLE_ORIENT_TRANSFORM;
    if (hintWrap) hintWrap.style.transform = IDLE_ORIENT_TRANSFORM;

    leaveTeHandler = (ev) => {
      if (ev.target !== stack || ev.propertyName !== "transform") return;
      beginIdleResumePhase();
    };
    stack.addEventListener("transitionend", leaveTeHandler);

    leaveFallbackTimer = window.setTimeout(() => {
      beginIdleResumePhase();
    }, PARALLAX_EASE_MS + 80);
  }

  function onEnter(e) {
    cancelLeaveAnimation();
    wrap.classList.add("hero-ai-helper-wrap--parallax-hover");
    window.requestAnimationFrame(() => {
      applyParallax(e.clientX, e.clientY);
    });
  }

  function onMove(e) {
    if (!wrap.classList.contains("hero-ai-helper-wrap--parallax-hover")) return;
    applyParallax(e.clientX, e.clientY);
  }
  scene.addEventListener("pointerenter", onEnter);
  scene.addEventListener("pointermove", onMove);
  scene.addEventListener("pointerleave", onLeave);
  scene.addEventListener("pointercancel", onLeave);
})();

(function initHeroTaskHints() {
  const hintEl = document.querySelector("#hero-hint");
  const copyEl = document.querySelector("#hero-hint-copy");
  const topicRow = hintEl?.querySelector(".hero-hint-topic-row");
  const topicIconImg = hintEl?.querySelector(".hero-hint-topic-icon-img");
  const topicLabel = hintEl?.querySelector("#hero-hint-topic-label");
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

  function clearTopicRow() {
    if (topicLabel) topicLabel.textContent = "";
    if (topicIconImg) topicIconImg.removeAttribute("src");
    if (topicRow) topicRow.classList.add("hero-hint-topic-row--hidden");
  }

  function syncTopicIconFromBubble(sourceBubble) {
    if (!topicRow || !topicIconImg) return;
    const bubbleIcon = sourceBubble?.querySelector(".task-icon img");
    const src = bubbleIcon?.getAttribute("src");
    const labelText = sourceBubble?.querySelector(".task-text")?.textContent?.trim() ?? "";
    if (src) {
      topicIconImg.src = src;
      if (topicLabel) topicLabel.textContent = labelText;
      topicRow.classList.remove("hero-hint-topic-row--hidden");
    } else {
      clearTopicRow();
    }
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
    if (text) showHint(text, el);
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
    clearTopicRow();
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

  function showHint(text, sourceBubble) {
    const line = String(text || "").trim();
    if (!line) return;

    cancelPendingReveal();

    function revealMounted() {
      syncTopicIconFromBubble(sourceBubble);
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
      if (text) showHint(text, bubble);
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

(function initSolutionBackgroundParallax() {
  const section = document.querySelector("#solution");
  const bg = section?.querySelector(".solution-bg");
  if (!section || !bg) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const RATE = 0.25;
  let ticking = false;

  function apply() {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const ty = -rect.top * RATE;
    bg.style.transform = `translate3d(0, ${ty}px, 0)`;
  }

  function onScrollOrResize() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(apply);
    }
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
  apply();
})();

(function initSolutionExpertsParallax() {
  const stage = document.querySelector(".solution-phone-stage");
  const leftList = document.querySelector(".solution-experts-list.solution-experts-list--side.solution-experts-list--left");
  if (!stage || !leftList) return;

  const mqDesktop = window.matchMedia("(min-width: 47.5001rem)");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** Доля видимой высоты блока при старте/финале анимации (видно 20% стейджа): низ входа / верх выхода */
  const VIS_FRAC = 0.2;

  let raf = 0;

  function clamp01(x) {
    return Math.min(1, Math.max(0, x));
  }

  /**
   * t = 0: верх стейджа на линии, где только что видна нижняя 20% высоты блока у нижней кромки вьюпорта
   *   rect.top === vh - VIS_FRAC * H.
   * t = 1: видна верхняя 20%, «хвост» уходит вверх
   *   rect.top === -(1 - VIS_FRAC) * H.
   * Линейно по rect.top между этими точками — при скролле назад значение симметрично отматывается.
   */
  function tick() {
    raf = 0;

    if (!mqDesktop.matches || prefersReduced.matches) {
      stage.style.setProperty("--solution-expert-parallax-t", "0");
      return;
    }

    if (window.getComputedStyle(leftList).display === "none") {
      stage.style.setProperty("--solution-expert-parallax-t", "0");
      return;
    }

    const rect = stage.getBoundingClientRect();
    const H = Math.max(rect.height, 1);
    const vh = window.innerHeight;

    /* Полностью вне экрана — без смещения */
    if (rect.bottom <= 0 || rect.top >= vh) {
      stage.style.setProperty("--solution-expert-parallax-t", "0");
      return;
    }

    const startTop = vh - VIS_FRAC * H;
    const endTop = -(1 - VIS_FRAC) * H;
    const denom = startTop - endTop;

    if (Math.abs(denom) < 1e-9) {
      stage.style.setProperty("--solution-expert-parallax-t", "0");
      return;
    }

    const t = clamp01((startTop - rect.top) / denom);
    stage.style.setProperty("--solution-expert-parallax-t", t.toFixed(5));
  }

  function onScrollOrResize() {
    if (!raf) raf = window.requestAnimationFrame(tick);
  }

  mqDesktop.addEventListener("change", onScrollOrResize);
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
  tick();
})();
