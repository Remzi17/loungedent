(function (exports) {
  'use strict';

  //
  //
  //
  //
  // Переменные
  const body = document.querySelector("body");
  const html = document.querySelector("html");
  const modals = document.querySelectorAll(".modal");
  let modalStack = [];

  const headerTop = document.querySelector(".header") ? document.querySelector(".header") : document.querySelector("head");
  document.querySelectorAll("[data-fixed]");

  const allForms = document.querySelectorAll("form");

  const menuClass = ".header__mobile";
  const menu = document.querySelector(menuClass) ? document.querySelector(menuClass) : document.querySelector("head");
  const menuLink = document.querySelector(".header__burger") ? document.querySelector(".header__burger") : document.querySelector("head");
  const menuActive = "active";

  const burgerMedia = 1199;
  const bodyOpenModalClass = "modal-show";

  let windowWidth = window.innerWidth;
  document.querySelector(".container")?.offsetWidth || 0;

  const checkWindowWidth = () => {
    windowWidth = window.innerWidth;
    document.querySelector(".container").offsetWidth || 0;
  };

  // Задержка при вызове функции. Выполняется в конце
  function debounce(fn, delay) {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, arguments), delay);
    };
  }

  window.addEventListener("resize", debounce(checkWindowWidth, 100));

  // Закрытие элемента при клике вне него
  function closeOutClick(closedElement, clickedButton, clickedButtonActiveClass, callback) {
    document.addEventListener("click", (e) => {
      const button = document.querySelector(clickedButton);
      const element = document.querySelector(closedElement);
      const withinBoundaries = e.composedPath().includes(element);

      if (!withinBoundaries && button?.classList.contains(clickedButtonActiveClass) && e.target !== button && !e.target.closest(".modal")) {
        button.click();
      }
    });
  }

  //
  //
  //
  //
  // Позиционирование

  // Отступ элемента от краев страницы
  function offset(el) {
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      right: windowWidth - rect.width - (rect.left + scrollLeft),
    };
  }

  // Проверка на десктоп разрешение
  function isDesktop() {
    return windowWidth > burgerMedia;
  }

  // Проверка поддержки webp
  function checkWebp() {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
      if (webP.height !== 2) {
        document.querySelectorAll("[style]").forEach((item) => {
          const styleAttr = item.getAttribute("style");
          if (styleAttr.indexOf("background-image") === 0) {
            item.setAttribute("style", styleAttr.replace(".webp", ".jpg"));
          }
        });
      }
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  // Проверка на браузер safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Проверка есть ли скролл
  function haveScroll() {
    return document.documentElement.scrollHeight !== document.documentElement.clientHeight;
  }

  // Видимость элемента
  function isHidden(el) {
    return window.getComputedStyle(el).display === "none";
  }

  // Закрытие бургера на десктопе
  function checkBurgerAndMenu() {
    if (isDesktop()) {
      menuLink.classList.remove("active");
      if (menu) {
        menu.classList.remove(menuActive);
        if (!body.classList.contains(bodyOpenModalClass)) {
          body.classList.remove("no-scroll");
        }
      }
    }

    // if (html.classList.contains("lg-on")) {
    //   if (isMobile()) {
    //     body.style.paddingRight = "0";
    //   } else {
    //     body.style.paddingRight = getScrollBarWidth() + "px";
    //   }
    // }
  }

  // Получение объектов с медиа-запросами
  function dataMediaQueries(array, dataSetValue) {
    let media = Array.from(array).filter(function (item) {
      if (item.dataset[dataSetValue]) {
        return item.dataset[dataSetValue].split(",")[0];
      }
    });

    if (media.length) {
      let breakpointsArray = [];
      media.forEach((item) => {
        let params = item.dataset[dataSetValue];
        let breakpoint = {};
        let paramsArray = params.split(",");
        breakpoint.value = paramsArray[0];
        breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
        breakpoint.item = item;
        breakpointsArray.push(breakpoint);
      });

      let mdQueries = breakpointsArray.map(function (item) {
        return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
      });

      mdQueries = uniqArray(mdQueries);
      let mdQueriesArray = [];

      if (mdQueries.length) {
        mdQueries.forEach((breakpoint) => {
          let paramsArray = breakpoint.split(",");
          let mediaBreakpoint = paramsArray[1];
          let mediaType = paramsArray[2];
          let matchMedia = window.matchMedia(paramsArray[0]);

          let itemsArray = breakpointsArray.filter(function (item) {
            return item.value === mediaBreakpoint && item.type === mediaType;
          });

          mdQueriesArray.push({ itemsArray, matchMedia });
        });

        return mdQueriesArray;
      }
    }
  }

  // Добавление класса loaded после полной загрузки страницы
  function loaded() {
    document.addEventListener("DOMContentLoaded", function () {
      html.classList.add("loaded");
      if (document.querySelector("header")) {
        document.querySelector("header").classList.add("loaded");
      }
      if (haveScroll()) {
        setTimeout(() => {
          html.classList.remove("scrollbar-auto");
        }, 500);
      }
    });
  }

  // Проверка на браузер safari
  if (isSafari) document.documentElement.classList.add("safari");

  // Проверка поддержки webp
  checkWebp();

  // Закрытие бургера на десктопе
  window.addEventListener("resize", debounce(checkBurgerAndMenu, 100));
  checkBurgerAndMenu();

  // Добавление класса loaded при загрузке страницы
  loaded();

  // Расчет высоты шапки
  function setHeaderFixedHeight() {
    if (!headerTop) return;

    requestAnimationFrame(() => {
      const height = headerTop.offsetHeight;

      document.documentElement.style.setProperty("--headerFixedHeight", height + "px");
    });
  }

  document.addEventListener("DOMContentLoaded", setHeaderFixedHeight);

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => {
      setHeaderFixedHeight();
    });
    ro.observe(headerTop);
  }

  //
  //
  //
  //
  // Функции для работы со скроллом и скроллбаром

  // Скрытие скроллбара
  function hideScrollbar() {
    modals.forEach((element) => {
      element.style.display = "none";
    });

    if (haveScroll()) {
      body.classList.add("no-scroll");
    }

    // changeScrollbarPadding();
  }

  // Показ скроллбара
  function showScrollbar() {
    if (!menu.classList.contains(menuActive)) {
      body.classList.remove("no-scroll");
    }

    // changeScrollbarPadding(false);
  }

  function burger() {
    if (menuLink) {
      let isAnimating = false;

      menuLink.addEventListener("click", function () {
        if (isAnimating) return;
        isAnimating = true;

        headerButton.classList.remove("active");
        headerButton.setAttribute("aria-expanded", "false");

        headerServices.classList.remove("active");

        const onEnd = (e) => {
          if (e.target !== headerServices) return;
          headerServices.setAttribute("hidden", "");
          headerServices.removeEventListener("transitionend", onEnd);
        };

        if (!headerServices.hasAttribute("hidden")) {
          headerServices.addEventListener("transitionend", onEnd);
        }

        menuLink.classList.toggle("active");
        menu.classList.toggle(menuActive);

        if (menu.classList.contains(menuActive)) {
          hideScrollbar();

          const scrollY = window.scrollY;
          const headerHeight = headerTop.offsetHeight;

          if (scrollY === 0) {
            menu.style.removeProperty("top");
          } else if (scrollY < headerHeight) {
            menu.style.top = scrollY + "px";
          } else {
            const headerRect = headerTop.getBoundingClientRect();
            menu.style.top = headerRect.bottom + "px";
          }
        } else {
          setTimeout(() => {
            showScrollbar();
          }, 400);
        }

        setTimeout(() => {
          isAnimating = false;
        }, 500);
      });

      function checkHeaderOffset() {
        if (headerButton.classList.contains("active") && !headerServices.hasAttribute("hidden")) {
          menuLink.classList.add("active");
          menu.classList.add(menuActive);
        }

        if (isDesktop()) {
          menuLink.classList.remove("active");
          menu.classList.remove(menuActive);
          menu.removeAttribute("style");

          if (!body.classList.contains(bodyOpenModalClass)) {
            body.classList.remove("no-scroll");
          }
        }
      }

      window.addEventListener("resize", debounce(checkHeaderOffset, 50));
      window.addEventListener("resize", debounce(checkHeaderOffset, 150));

      if (document.querySelector(".header__mobile")) {
        closeOutClick(".header__mobile", ".menu-link", "active");
      }
    }
  }

  //
  //
  //
  //
  // Анимации

  const fadeTokens = new WeakMap();

  // Плавное появление
  const fadeIn = (el, display = "block", timeout = 400) => {
    document.body.classList.add("_fade");

    const elements = el instanceof Element ? [el] : document.querySelectorAll(el);

    if (!elements.length) return;

    elements.forEach((element) => {
      const token = Symbol();
      fadeTokens.set(element, token);

      element.style.transition = "none";
      element.style.opacity = 0;
      element.style.display = display;
      element.style.transition = `opacity ${timeout}ms`;

      setTimeout(() => {
        if (fadeTokens.get(element) !== token) return;
        element.style.opacity = 1;

        setTimeout(() => {
          if (fadeTokens.get(element) !== token) return;
          document.body.classList.remove("_fade");
        }, timeout);
      }, 10);
    });
  };

  // Плавное исчезновение
  const fadeOut = (el, timeout = 400) => {
    document.body.classList.add("_fade");

    const elements = el instanceof Element ? [el] : document.querySelectorAll(el);

    if (!elements.length) return;

    elements.forEach((element) => {
      const token = Symbol();
      fadeTokens.set(element, token);

      element.style.transition = "none";
      element.style.opacity = 1;
      element.style.transition = `opacity ${timeout}ms`;

      setTimeout(() => {
        if (fadeTokens.get(element) !== token) return;
        element.style.opacity = 0;

        setTimeout(() => {
          if (fadeTokens.get(element) !== token) return;
          element.style.display = "none";
          document.body.classList.remove("_fade");
        }, timeout);

        setTimeout(() => {
          if (fadeTokens.get(element) !== token) return;
          element.removeAttribute("style");
        }, timeout + 400);
      }, 10);
    });
  };

  // Плавно скрыть с анимацией слайда
  const slideUp = (target, duration = 400, showmore = 0) => {
    if (target && !target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = `${target.offsetHeight}px`;
      target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingBlock = 0;
      target.style.marginBlock = 0;
      window.setTimeout(() => {
        target.style.display = !showmore ? "none" : "block";
        !showmore ? target.style.removeProperty("height") : null;
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        !showmore ? target.style.removeProperty("overflow") : null;
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
        document.dispatchEvent(
          new CustomEvent("slideUpDone", {
            detail: {
              target: target,
            },
          })
        );
      }, duration);
    }
  };

  // Плавно показать с анимацией слайда
  const slideDown = (target, duration = 400) => {
    if (target && !target.classList.contains("_slide")) {
      target.style.removeProperty("display");
      let display = window.getComputedStyle(target).display;
      if (display === "none") display = "block";
      target.style.display = display;
      let height = target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = 0;
      target.style.paddingBLock = 0;
      target.style.marginBlock = 0;
      target.offsetHeight;
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = height + "px";
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      window.setTimeout(() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
      }, duration);
    }
  };

  // Плавно изменить состояние между slideUp и slideDown
  const slideToggle = (target, duration = 400) => {
    if (target && isHidden(target)) {
      return slideDown(target, duration);
    } else {
      return slideUp(target, duration);
    }
  };

  //
  //
  //
  //
  // Работа с url

  // Получение хэша
  function getHash() {
  	return location.hash ? location.hash.replace('#', '') : '';
  }

  // Удаление хэша
  function removeHash() {
  	setTimeout(() => {
  		history.pushState("", document.title, window.location.pathname + window.location.search);
  	}, 100);
  }

  //
  //
  //
  //
  // Валидация элементов формы

  function validation() {
    let inputs = document.querySelectorAll("input, textarea");

    inputs.forEach((input) => {
      if (!input) return;

      const parentElement = input.parentElement;

      const updateActiveState = () => {
        if (input.type === "text" || input.type === "date") {
          parentElement.classList.toggle("active", input.value.length > 0);
        }
      };

      // Валидация ФИО
      const validateFIOField = () => {
        const nameAttr = input.name.toLowerCase() || "";
        const placeholder = input.placeholder.toLowerCase() || "";
        const fioKeywords = ["имя", "фамилия", "отчество"];
        const isFIO = nameAttr.includes("name") || fioKeywords.some((word) => placeholder.includes(word));

        if (isFIO) {
          input.value = input.value.replace(/[^а-яА-ЯёЁ\s]/g, "");
          input.value = input.value.replace(/\s{2,}/g, " ");
        }
      };

      input.addEventListener("keyup", updateActiveState);

      input.addEventListener("change", () => {
        input.classList.remove("wpcf7-not-valid");
        updateActiveState();

        if (input.type === "email") {
          const value = input.value.trim();

          if (!value) {
            input.setCustomValidity("");
            return;
          }

          const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

          if (!emailPattern.test(value)) {
            input.setCustomValidity("Введите корректный email");
          } else {
            input.setCustomValidity("");
          }
        }
      });

      input.addEventListener("input", () => {
        if (input.getAttribute("data-number")) {
          input.value = input.value.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
        }

        if (input.type === "email") {
          input.value = input.value.replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/g, "");
        }

        validateFIOField();
      });

      input.addEventListener("paste", (e) => {
        setTimeout(() => {
          if (input.type === "email") {
            input.value = input.value.replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/g, "");
          }
          validateFIOField();
          updateActiveState();
        }, 0);
      });

      if (input.type == "date") {
        input.addEventListener("keyup", checkInputDateValue);
        input.addEventListener("change", checkInputDateValue);

        input.classList.toggle("empty", input.value.length === 0);
      }
    });
  }

  validation();

  function clearInputs() {
    let inputs = document.querySelectorAll("input, textarea");

    inputs.forEach((input) => {
      input.classList.remove("wpcf7-not-valid", "error");

      if (input.type == "date") {
        input.classList.add("empty");
      }
    });
  }

  function checkInputDateValue(e) {
    e.target.classList.toggle("empty", e.target.value.length === 0);
  }

  // Проверка формы перед отправкой
  function initFormValidation(form) {
    const getHasChoiceValue = () => {
      const requiredChoice = form.querySelectorAll("[data-required-choice]");

      return Array.from(requiredChoice).some((input) => {
        if (input.type === "tel") {
          return input.value.replace(/\D/g, "").length >= 11;
        }

        return input.value.trim() !== "";
      });
    };

    const updateRequiredChoice = () => {
      const hasChoiceValue = getHasChoiceValue();
      const requiredChoice = form.querySelectorAll("[data-required-choice]");

      requiredChoice.forEach((input) => {
        if (hasChoiceValue) {
          input.removeAttribute("required");
          input.setCustomValidity("");
        } else {
          input.setAttribute("required", "true");
        }
      });
    };

    updateRequiredChoice();

    form.addEventListener(
      "submit",
      (e) => {
        let isValid = true;

        updateRequiredChoice();

        const hasChoiceValue = getHasChoiceValue();
        const inputTel = form.querySelector('input[type="tel"]');

        if (inputTel) {
          const digits = inputTel.value.replace(/\D/g, "");

          if (!hasChoiceValue && digits.length > 0 && digits.length !== 11) {
            e.preventDefault();
            isValid = false;
          } else {
            inputTel.setCustomValidity("");
          }
        }

        if (!isValid || !form.checkValidity()) {
          e.preventDefault();
        }
      },
      {
        capture: true,
      }
    );

    const requiredChoice = form.querySelectorAll("[data-required-choice]");

    requiredChoice.forEach((input) => {
      input.addEventListener("input", updateRequiredChoice);
    });
  }

  if (allForms) {
    allForms.forEach((form) => {
      initFormValidation(form);
    });
  }

  // После отправки формы
  function successSubmitForm(form) {
    const modalInterval = 3000;

    fadeOut(".modal");

    setTimeout(() => {
      fadeIn(".modal-thank");
    }, modalInterval - 500);

    setTimeout(() => {
      fadeOut(".modal");
    }, modalInterval * 2);

    setTimeout(() => {
      body.classList.remove("no-scroll");
    }, modalInterval * 3);

    // form.reset();

    // const originalPlaceholders = form.querySelectorAll("[data-original-placeholder]");

    // if (originalPlaceholders) {
    //   originalPlaceholders.forEach((input) => {
    //     input.placeholder = input.getAttribute("data-original-placeholder");
    //   });
    // }
  }

  if (typeof window !== "undefined") {
    window.successSubmitForm = successSubmitForm;
  }

  // Валидация поля Телефон или Почта
  const inputs = document.querySelectorAll("[data-tel-or-email]");

  inputs.forEach((input) => {
    let mode = "";
    const originalPlaceholder = input.placeholder;

    input.addEventListener("input", (e) => {
      input.setCustomValidity("");

      let val = input.value;

      if (val.includes("+")) {
        const firstPlus = val.indexOf("+");
        val = (firstPlus === 0 ? "+" : "") + val.replace(/\+/g, "").trim();
        input.value = val;
      }

      const trimmed = val.trim();
      const hasAt = trimmed.includes("@");
      const hasLetter = /[a-zA-Zа-яА-Я]/.test(trimmed);
      const digitsOnly = trimmed.replace(/\D/g, "");
      const startsLikePhone = /^[\+78]/.test(trimmed);
      const isPhone = digitsOnly.length >= 4 && !hasLetter && !hasAt && val !== "+";

      if ((startsLikePhone || isPhone) && !hasLetter && !hasAt) {
        if (mode !== "phone") {
          mode = "phone";
          input.type = "tel";
          input.placeholder = "";
        }
        maskPhone();
      } else {
        if (mode !== "email") {
          mode = "email";
          input.type = "email";
          input.placeholder = originalPlaceholder;
        }
        validation();
      }
    });
  });

  /* 
    ================================================
  	  
    Модалки
  	
    ================================================
  */

  // Открытие модалки
  function openModal(modal, addHashFlag = true, dataTab = null, stack = false) {
    if (!modal) return;

    if (!stack) {
      // Если не стековая, то закрыть все остальные модалки
      document.querySelectorAll(".modal_open").forEach((m) => closeModal(m, false));
      modalStack.length = 0;
      body.classList.add(bodyOpenModalClass);
    }

    // Добавление в стек
    modalStack.push(modal);

    hideScrollbar();

    if (addHashFlag && !window.location.hash.includes(modal.id)) {
      window.location.hash = modal.id;
    }

    fadeIn(modal);

    modal.classList.remove("modal_close");
    modal.classList.add("modal_open");

    if (dataTab) {
      document.querySelector(`[data-href="#${dataTab}"]`)?.click();
    }
  }

  function closeModal(modal, removeHashFlag = true) {
    if (!modal) return;

    modal.classList.remove("modal_open");
    modal.classList.add("modal_close");

    // Убрать из стека
    const index = modalStack.indexOf(modal);
    if (index !== -1) {
      modalStack.splice(index, 1);
    }

    setTimeout(() => {
      fadeOut(modal);

      if (removeHashFlag && getHash() ? getHash() == modal.id : true) {
        if (modalStack.length) {
          window.location.hash = modalStack[modalStack.length - 1].id;
        } else {
          history.pushState("", document.title, window.location.pathname + window.location.search);
          body.classList.remove(bodyOpenModalClass);
          showScrollbar();
        }
      }

      clearInputs();

      setTimeout(() => {
        const modalInfo = document.querySelector(".modal-info");
        if (modalInfo) modalInfo.value = "";
      }, 400);
    }, 200);
  }

  function modal() {
    const modalDialogs = document.querySelectorAll(".modal__dialog");

    document.querySelectorAll("[data-modal]").forEach((button) => {
      button.addEventListener("click", function () {
        let [dataModal, dataTab] = button.getAttribute("data-modal").split("#");
        const stack = button.hasAttribute("data-modal-stack");

        let modal = document.getElementById(dataModal);
        if (!modal) return;

        openModal(modal, !button.hasAttribute("data-modal-not-hash"), dataTab, stack);
      });
    });

    // Открытие модалки по хешу
    window.addEventListener("load", () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const modal = document.querySelector(`.modal[id="${hash}"]`);
        if (modal) {
          setTimeout(() => {
            hideScrollbar();
            modal.classList.add("modal_open");
            fadeIn(modal);
          }, 500);
        }
      }
    });

    // Закрытие модалки при клике на крестик
    document.querySelectorAll("[data-modal-close]").forEach((element) => {
      element.addEventListener("click", () => closeModal(element.closest(".modal")));
    });

    // Закрытие модалки при клике вне области контента
    window.addEventListener("click", (e) => {
      modalDialogs.forEach((modal) => {
        if (e.target === modal) {
          closeModal(modal.closest(".modal"));
        }
      });
    });

    // Закрытие модалки при клике ESC
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.querySelectorAll(".lg-show").length === 0) {
        if (modalStack.length) {
          closeModal(modalStack[modalStack.length - 1]);
        }
      }
    });

    // Навигация назад/вперёд
    let isAnimating = false;

    window.addEventListener("popstate", async () => {
      if (isAnimating) {
        await new Promise((resolve) => {
          const checkAnimation = () => {
            if (!document.body.classList.contains("_fade")) {
              resolve();
            } else {
              setTimeout(checkAnimation, 50);
            }
          };
          checkAnimation();
        });
      }

      const hash = window.location.hash.replace("#", "");
      const modal = hash ? document.querySelector(`.modal[id="${hash}"]`) : null;
      const openedModal = document.querySelector(".modal_open");

      if (hash && modal) {
        hideScrollbar();
        isAnimating = true;
        await fadeIn(modal);

        modal.classList.remove("modal_close");
        modal.classList.add("modal_open");

        isAnimating = false;
      } else if (!hash && openedModal) {
        isAnimating = true;
        await closeModal(openedModal, false);
        isAnimating = false;
      }
    });
  }

  // Плавный скролл
  function scrollToSmoothly(pos, time = 400) {
    const currentPos = window.pageYOffset;
    let start = null;
    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      const progress = currentTime - start;
      if (currentPos < pos) {
        window.scrollTo(0, ((pos - currentPos) * progress) / time + currentPos);
      } else {
        window.scrollTo(0, currentPos - ((currentPos - pos) * progress) / time);
      }
      if (progress < time) {
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, pos);
      }
    });
  }

  // Изменение масштаба
  class ZoomDetector {
    constructor() {
      this.lastZoom = this.getCurrentZoom();
      this.isChecking = false;
      this.startDetection();
    }

    getCurrentZoom() {
      return window.outerWidth / window.innerWidth;
    }

    startDetection() {
      const checkZoom = () => {
        const currentZoom = this.getCurrentZoom();

        if (Math.abs(currentZoom - this.lastZoom) > 0.01) {
          this.lastZoom = currentZoom;
          this.onZoomChange(currentZoom);
        }

        if (this.isChecking) {
          requestAnimationFrame(checkZoom);
        }
      };

      this.isChecking = true;
      checkZoom();
    }

    stopDetection() {
      this.isChecking = false;
    }

    onZoomChange(zoomLevel) {
      const percentage = Math.round(zoomLevel * 100);
      // Отправка события
      window.dispatchEvent(
        new CustomEvent("zoomchange", {
          detail: { zoomLevel: percentage },
        })
      );
    }
  }

  new ZoomDetector();

  window.addEventListener("zoomchange", (e) => {
    if (haveScroll() && body.classList.contains(bodyOpenModalClass)) ;
  });

  /* 
  	================================================
  	  
  	Плавная прокрутка
  	
  	================================================
  */

  function scroll() {
    let headerScroll = 0;
    const scrollLinks = document.querySelectorAll("[data-scroll], .menu a");

    if (scrollLinks.length) {
      scrollLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          const target = link.hash;

          if (target && target !== "#") {
            const scrollBlock = document.querySelector(target);
            e.preventDefault();

            if (scrollBlock) {
              headerScroll = window.getComputedStyle(scrollBlock).paddingTop === "0px" ? -40 : 0;

              scrollToSmoothly(offset(scrollBlock).top - parseInt(headerTop.clientHeight - headerScroll), 400);

              removeHash();
              menu.classList.remove(menuActive);
              menuLink.classList.remove("active");
              body.classList.remove("no-scroll");
            } else {
              let [baseUrl, hash] = link.href.split("#");
              if (window.location.href !== baseUrl && hash) {
                link.setAttribute("href", `${baseUrl}?link=${hash}`);
                window.location = link.getAttribute("href");
              }
            }
          }
        });
      });
    }

    document.addEventListener("DOMContentLoaded", () => {
      const urlParams = new URLSearchParams(window.location.search);
      const link = urlParams.get("link");

      if (link) {
        if (link.startsWith("tab-") && /^\d+-\d+$/.test(link.replace("tab-", ""))) {
          const [_, blockIndex, tabIndex] = link.split("-");
          const tabsBlock = document.querySelector(`[data-tabs-index="${blockIndex}"]`);
          const tabs = tabsBlock.querySelectorAll("[data-tabs-title]");

          if (tabs && tabs[tabIndex]) {
            tabs[tabIndex].click();

            scrollToSmoothly(offset(tabsBlock).top - parseInt(headerTop.clientHeight), 400);
          }
        } else if (link.startsWith("tab-")) {
          const tabId = link;
          const tabButton = document.getElementById(tabId);

          if (tabButton) {
            tabButton.click();

            scrollToSmoothly(offset(tabButton.closest("[data-tabs]") || tabButton).top - parseInt(headerTop.clientHeight), 400);
          }
        } else {
          const scrollBlock = document.getElementById(link);
          if (scrollBlock) {
            const headerScroll = window.getComputedStyle(scrollBlock).paddingTop === "0px" ? -40 : 0;
            scrollToSmoothly(offset(scrollBlock).top - parseInt(headerTop.clientHeight - headerScroll), 400);
          }
        }

        urlParams.delete("link");
        const newUrl = urlParams.toString() ? `${window.location.pathname}?${urlParams}` : window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    });
  }

  /* 
  	================================================
  	  
  	Спойлеры
  	
  	================================================
  */

  function spoller() {
    const spollersArray = document.querySelectorAll("[data-spollers]");
    if (!spollersArray.length) return;

    document.addEventListener("click", setSpollerAction);

    const spollersRegular = [...spollersArray].filter((item) => !item.dataset.spollers.split(",")[0]);
    if (spollersRegular.length) initSpollers(spollersRegular);

    const mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
    mdQueriesArray?.forEach((mdItem) => {
      mdItem.matchMedia.addEventListener("change", () => initSpollers(mdItem.itemsArray, mdItem.matchMedia));
      initSpollers(mdItem.itemsArray, mdItem.matchMedia);
    });

    function initSpollers(array, matchMedia = false) {
      array.forEach((spollersBlock) => {
        const block = matchMedia ? spollersBlock.item : spollersBlock;
        const isInit = matchMedia ? matchMedia.matches : true;

        block.classList.toggle("_spoller-init", isInit);
        initSpollerBody(block, isInit);
      });
    }

    function initSpollerBody(block, hideBody = true) {
      block.querySelectorAll("[data-spoller]").forEach((item) => {
        const title = item.querySelector("[data-spoller-title]");
        const content = item.querySelector("[data-spoller-content]");
        if (!content) return;

        if (hideBody) {
          if (!item.hasAttribute("data-open")) {
            content.style.display = "none";
            title.classList.remove("active");
          } else {
            title.classList.add("active");
          }
        } else {
          content.style.display = "";
          title.classList.remove("active");
        }
      });
    }

    function setSpollerAction(e) {
      const titleEl = e.target.closest("[data-spoller-title]");
      const blockEl = e.target.closest("[data-spollers]");

      if (titleEl && blockEl) {
        if (blockEl.classList.contains("_disabled-click")) return;

        const itemEl = titleEl.closest("[data-spoller]");
        const contentEl = itemEl.querySelector("[data-spoller-content]");
        const speed = parseInt(blockEl.dataset.spollersSpeed) || 400;

        blockEl.classList.add("_disabled-click");
        setTimeout(() => blockEl.classList.remove("_disabled-click"), speed);

        if (blockEl.classList.contains("_spoller-init") && contentEl && !blockEl.querySelectorAll("._slide").length) {
          if (blockEl.hasAttribute("data-one-spoller") && !titleEl.classList.contains("active")) {
            hideSpollersBody(blockEl);
          }

          titleEl.classList.toggle("active");

          if (titleEl.classList.contains("active")) {
            itemEl.setAttribute("data-open", "");
          } else {
            itemEl.removeAttribute("data-open");
          }

          slideToggle(contentEl, speed);

          if (itemEl.hasAttribute("data-spoller-scroll") && titleEl.classList.contains("active")) {
            const scrollOffset = parseInt(itemEl.dataset.spollerScroll) || 0;
            const headerOffset = itemEl.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header")?.offsetHeight || 0 : 0;
            window.scrollTo({
              top: itemEl.offsetTop - (scrollOffset + headerOffset),
              behavior: "smooth",
            });
          }
        }
      }

      if (!blockEl) {
        document.querySelectorAll("[data-spoller-close]").forEach((title) => {
          const item = title.closest("[data-spoller]");
          const block = title.closest("[data-spollers]");
          const content = item.querySelector("[data-spoller-content]");
          const speed = parseInt(block.dataset.spollersSpeed) || 400;

          if (block.classList.contains("_spoller-init")) {
            const itemEl = title.closest("[data-spoller]");

            title.classList.remove("active");
            itemEl?.removeAttribute("data-open");

            slideUp(content, speed);
          }
        });
      }
    }

    function hideSpollersBody(block) {
      const activeTitle = block.querySelector("[data-spoller] .active");
      if (!activeTitle || block.querySelectorAll("._slide").length) return;

      const content = activeTitle.closest("[data-spoller]")?.querySelector("[data-spoller-content]");
      const speed = parseInt(block.dataset.spollersSpeed) || 400;
      const activeItem = activeTitle.closest("[data-spoller]");

      activeTitle.classList.remove("active");
      activeItem?.removeAttribute("data-open");

      slideUp(content, speed);
    }
  }

  /* 
    ================================================
  	  
    Анимация чисел
  	
    ================================================
  */

  function numbers() {
    function digitsCountersInit(digitsCounter) {
      if (!digitsCounter.classList.contains("active")) {
        digitsCounter.dataset.originalValue = digitsCounter.innerHTML.replace(" ", "").replace(",", ".");

        digitsCounter.style.width = digitsCounter.offsetWidth + "px";
        digitsCounter.innerHTML = "0";
      }

      if (parseFloat(digitsCounter.dataset.originalValue.replace(",", ".")) % 1 != 0) {
        digitsCounter.setAttribute("data-float", true);
      }

      digitsCountersAnimate(digitsCounter);
    }

    function digitsCountersAnimate(digitsCounter) {
      let startTimestamp = null;
      const duration = parseInt(digitsCounter.dataset.digitsCounter) || 1000;
      const startValue = parseFloat(digitsCounter.dataset.originalValue.replace(/[^0-9]/g, "")) || 0;
      const startPosition = 0;

      digitsCounter.classList.add("active");

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        if (digitsCounter.getAttribute("data-float")) {
          digitsCounter.innerHTML = (progress * (startPosition + startValue)).toFixed(1).replace(".", ",");
        } else {
          digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue));
          digitsCounter.innerHTML = digitsCounter.innerHTML.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
        }

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);

      setTimeout(() => {
        digitsCounter.removeAttribute("style");
      }, duration + 500);
    }

    // digitsCountersInit() // Запуск при скролле

    let options = {
      threshold: 0,
      rootMargin: "0px 0px 0px 0px",
    };

    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const digitsCounter = entry.target;

        if (entry.isIntersecting) {
          digitsCountersInit(digitsCounter);
          observer.unobserve(digitsCounter);
        }
      });
    }, options);

    let digitsCounters = document.querySelectorAll("[data-digits-counter]");

    if (digitsCounters.length) {
      digitsCounters.forEach((digitsCounter) => {
        observer.observe(digitsCounter);
      });
    }
  }

  burger();
  modal();
  scroll();
  spoller();
  numbers();

  //
  //
  //
  //
  // Общие скрипты

  // Кнопка Все услуги в шапке
  const headerButton = document.querySelector(".header__button");
  const headerServices = document.querySelector(".header__services");

  if (headerButton && headerServices) {
    headerButton.addEventListener("click", function () {
      const isOpen = this.classList.toggle("active");

      this.setAttribute("aria-expanded", isOpen);

      if (isOpen) {
        headerServices.removeAttribute("hidden");
        requestAnimationFrame(() => {
          headerServices.classList.add("active");
        });

        const firstLink = headerServices.querySelector("a, button");

        if (firstLink) firstLink.focus();
      } else {
        headerServices.classList.remove("active");

        const onEnd = (e) => {
          if (e.target !== headerServices) return;
          headerServices.setAttribute("hidden", "");
          headerServices.removeEventListener("transitionend", onEnd);
        };

        headerServices.addEventListener("transitionend", onEnd);

        this.focus();
      }
    });
  }

  //
  //
  // Слайдеры

  // Шапка
  if (document.querySelector(".header-main-container")) {
    new Swiper(".header-main-container", {
      resistanceRatio: 0,
      pagination: {
        el: ".header-main__pagination",
        type: "bullets",
        clickable: true,
      },
      navigation: {
        nextEl: ".header-main__next",
        prevEl: ".header-main__prev",
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      speed: 500,
    });
  }

  // Отзывы
  if (document.querySelector(".feedback-container")) {
    new Swiper(".feedback-container", {
      autoplay: {
        delay: 4000,
        pauseOnMouseEnter: true,
      },
      resistanceRatio: 0,
      pagination: {
        el: ".feedback__pagination",
        type: "bullets",
        clickable: true,
      },
      navigation: {
        nextEl: ".feedback__next",
        prevEl: ".feedback__prev",
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      speed: 500,
      breakpoints: {
        1: {
          slidesPerView: "auto",
          spaceBetween: 12,
        },
        576: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1300: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1501: {
          slidesPerView: 4,
          spaceBetween: 32,
        },
      },
    });
  }

  // Новости
  if (document.querySelector(".news-container")) {
    new Swiper(".news-container", {
      autoplay: {
        delay: 4000,
        pauseOnMouseEnter: true,
      },
      resistanceRatio: 0,
      pagination: {
        el: ".news__pagination",
        type: "bullets",
        clickable: true,
      },
      navigation: {
        nextEl: ".news__next",
        prevEl: ".news__prev",
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      speed: 500,
      breakpoints: {
        1: {
          slidesPerView: "auto",
          spaceBetween: 12,
        },
        576: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1501: {
          slidesPerView: 4,
          spaceBetween: 32,
        },
      },
    });
  }

  exports.headerButton = headerButton;
  exports.headerServices = headerServices;

  return exports;

})({});
//# sourceMappingURL=script.js.map
