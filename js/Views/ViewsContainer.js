import { utils } from "../Utilities/utilities.js";
import { cardsControl, successPage, crearPagina, loginForm } from "./Views.js";

const viewsContainer = {
  container: document.getElementById("pa-lateral-deslizable"),
  demos: utils.createElementFromHTML("<h2>ToDo pantalla de carga aquí</h2>"),
  createPage: crearPagina.elementoPadre,
  success: successPage.elementoPadre,
  login: loginForm,
  init: async () => {
    viewsContainer.container.innerHTML = "";

    viewsContainer.container.appendChild(viewsContainer.demos);

    viewsContainer.demos = await cardsControl();

    viewsContainer.container.innerHTML = "";

    viewsContainer.container.appendChild(viewsContainer.demos);
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
    console.log(idPage);

    crearPagina.post = idPage;

    viewsContainer.changeView("createPage");
  },
  showSuccessPage: (urlRedirect) => {
    successPage.urlRedirect = urlRedirect;

    viewsContainer.changeView("success");
  },
};

export { viewsContainer };
