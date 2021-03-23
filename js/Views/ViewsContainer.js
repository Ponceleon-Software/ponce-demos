import { utils } from "../Utilities/utilities.js";
import { cardsControl, crearPagina, loginForm } from "./Views.js";

const viewsContainer = {
  container: document.getElementById("pa-lateral-deslizable"),
  demos: utils.createElementFromHTML("<h2>ToDo pantalla de carga aquí</h2>"),
  init: async () => {
    viewsContainer.container.innerHTML = "";

    viewsContainer.container.appendChild(viewsContainer.demos);

    viewsContainer.demos = await cardsControl();

    viewsContainer.container.innerHTML = "";

    viewsContainer.container.appendChild(viewsContainer.demos);
  },
};

export { viewsContainer };
