import "./scripts/init.js";
import "./components.js";

//
//
//
//
// Общие скрипты

// Кнопка Все услуги в шапке
export const headerButton = document.querySelector(".header__button");
export const headerServices = document.querySelector(".header__services");

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
  let headerMainSlider = new Swiper(".header-main-container", {
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
  let feedbackSlider = new Swiper(".feedback-container", {
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
  let newsSlider = new Swiper(".news-container", {
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
