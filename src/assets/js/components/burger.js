import { body, menu, menuActive, menuLink, headerTop, bodyOpenModalClass } from "../scripts/variables";
import { debounce, closeOutClick } from "../scripts/core/helpers";
import { isDesktop } from "../scripts/ui/browser";
import { hideScrollbar, showScrollbar } from "../scripts/ui/scrollbar";
import { headerServices, headerButton } from "../script";

export function burger() {
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
