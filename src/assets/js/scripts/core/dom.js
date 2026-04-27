import { html } from "../variables";
import { haveScroll } from "./checks";

// Добавление класса loaded после полной загрузки страницы
export function loaded() {
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
