import { utils, wpRestApiPost } from "../Utilities/utilities.js";
import { cardsControl, crearPagina, loginForm } from "./Views.js";

const viewsContainer = {
  container: document.getElementById("pa-lateral-deslizable"),
  demos: utils.createElementFromHTML("<h2>ToDo pantalla de carga aquí</h2>"),
  createPage: crearPagina,
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
    const viewCreate = viewsContainer.createPage;

    const botonCrear = viewCreate.querySelector("#pd-create-post"),
      inputName = viewCreate.querySelector("#pd-name-new-post");

    botonCrear.onclick = async (e) => {
      botonCrear.onclick = null;

      let params = {};
      if (inputName.value) {
        params["post_title"] = inputName.value;
      }

      console.log(params);
      const res = await wpRestApiPost(`new_site/${idPage}`, params);

      if (res.ok) {
        console.log(await res.json());
      } else {
        console.log("Error");
      }

      viewsContainer.changeView("demos");
    };

    viewsContainer.changeView("createPage");
  },
};

export { viewsContainer };
