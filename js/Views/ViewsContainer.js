import { utils } from "../Utilities/utilities.js";
import { spinnerShow } from "../Components/Components.js";
import {
  cardsControl,
  successPage,
  crearPagina,
  unloggedPage,
  loginPage,
  signupPage,
} from "./Views.js";

const viewsContainer = {
  container: document.getElementById("ponce-demos-main"),
  demos: utils.createElement(
    "div", 
    {
      className: "h-full w-full flex items-center justify-center",
      style: "border-top-color: gray",
    }, 
    [spinnerShow(null, {size: 16}).get()]
  ),
  createPage: crearPagina.elementoPadre,
  success: successPage.elementoPadre,
  unlogged: unloggedPage,
  login: loginPage,
  signup: signupPage,
  init: async () => {
    viewsContainer.container.innerHTML = "";

    viewsContainer.container.appendChild(viewsContainer.demos);

    viewsContainer.demos = await cardsControl();

    viewsContainer.container.innerHTML = "";

    viewsContainer.container.appendChild(viewsContainer.demos);

    const vistasSinDemos = [
      "createPage",
      "success",
      "unlogged",
      "login",
      "signup",
    ];
    vistasSinDemos
      .map((val) => viewsContainer[val])
      .forEach((val) => {
        const botonVolver = val.querySelector(".pd-go-back");
        botonVolver.addEventListener("click", () =>
          viewsContainer.changeView("demos")
        );
      });
  },
  changeView: (pageName) => {
    if (
      viewsContainer[pageName] &&
      viewsContainer[pageName] instanceof HTMLElement
    ) {
      viewsContainer.container.innerHTML = "";

      viewsContainer.container.appendChild(viewsContainer[pageName]);
    }
  },
  createPageFrom: (idPage) => {
    crearPagina.post = idPage;

    if (window.demo.user === "1") {
      viewsContainer.changeView("createPage");
    } else {
      viewsContainer.changeView("unlogged");
    }
  },
  showSuccessPage: (urlRedirect) => {
    successPage.urlRedirect = urlRedirect;

    viewsContainer.changeView("success");
  },
};

export { viewsContainer };
