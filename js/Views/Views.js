import { wpRestApi } from "../Utilities/utilities.js";
import { Componente } from "../Components/Components.js";
import { createAllCards } from "../Components/Cards.js";
import { utils, wpRestApiPost } from "../Utilities/utilities.js";
import { viewsContainer } from "./ViewsContainer.js";

/**
 * Controla la salida de las tarjetas y la manera en que se van a mostrar
 * VISTA DE GRID TARJETAS
 * */
const cardsControl = async () => {
  //#region get settings
  const response = await wpRestApi("demos");
  const settingsAsc = await response.json();
  const settings = [];
  for (let i in settingsAsc) {
    settings.push(settingsAsc[i]);
  }
  //#endregion

  //#region Obtener colores y sectores
  let sectores = [];
  let colores = [];
  settings.forEach((el) => {
    el.sectores.forEach((sector) => {
      if (!sectores.includes(sector) && sector) sectores.push(sector);
    });
    el.colores.forEach((color) => {
      if (!colores.includes(color) && color) colores.push(color);
    });
  });
  //#endregion

  //#region definir html
  const inputBuscador = `<input
    type="search"
    placeholder="Buscar"
    class="bg-transparent flex-grow px-4 outline-none"
    id="pa-buscador-config"
  />`,
    botonBuscador = `<button class="btn btn-square btn-ghost">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    class="inline-block w-6 h-6 stroke-current"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    ></path>
  </svg>
</button>`,
    peso = `<div class="btn-group my-3" id="pa-weight-config">
    <button class="btn btn-xs font-light" data-filter="delgada">
      L
    </button>
    <button
      class="btn btn-xs font-normal italic"
      data-filter="inclinada"
    >
      I
    </button>
    <button
      class="btn btn-xs font-semibold"
      data-filter="intermedia"
    >
      B
    </button>
    <button
      class="btn btn-xs font-extrabold"
      data-filter="gruesa"
    >
      B+
    </button>
  </div>`,
    serif = `<div class="btn-group my-3 mx-3" id="pa-serif-config">
    <button class="btn btn-xs font-serif" data-filter="Serifadas">
      Serif
    </button>
    <button
      class="btn btn-xs font-normal "
      data-filter="Sin serifa"
    >
      Sans Serif
    </button>
  </div>`,
    selectSectores = `<select
      class="select select-bordered w-72 my-3 ml-12 select-xs"
      id="pa-sectors-config"
      data-filter="sectores"
    >
      <option disabled="disabled" selected="selected">Sectores</option>
      <option value="">Todos</option>
    </select>`,
    selectColores = `<select
  class="select select-bordered w-32 my-3 mx-4 select-xs"
  id="pa-colors-config"
  data-filter="colores"
  >
  <option disabled="disabled" selected="selected">colores</option>
  <option value="">Todos</option>
  </select>`,
    gridOrList = ` <div class="btn-group ml-auto my-auto " id="pa-serif-config">
    <label class="cursor-pointer label">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px">
      <path d="M0 0h24v24H0z" fill="none"/><path d="M20 13H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm0-10H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1z"/>
      </svg>
          <div>
            <input type="checkbox" checked="checked" class="toggle"> 
            <span class="toggle-mark"></span>
          </div>
       
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/>
      </svg>
    </label>
 </div>

   
    `;
  //#endregion

  const controlTarjetas = new Componente();
  controlTarjetas.state = {
    buscador: "",
    filters: [],
    sectores: "",
    colores: "",
  };

  controlTarjetas.elementoPadre = utils.createElementFromHTML(
    `<div
      class="grid grid-cols-2 xl:grid-cols-3 gap-4"
      id="pa-container-config"
    ></div>`
  );

  controlTarjetas.tarjetas = createAllCards(settings);

  controlTarjetas.buscador = utils.createElementFromHTML(inputBuscador);
  controlTarjetas.peso = utils.createElementFromHTML(peso);
  controlTarjetas.serif = utils.createElementFromHTML(serif);
  controlTarjetas.sectores = utils.createElementFromHTML(selectSectores);
  controlTarjetas.colores = utils.createElementFromHTML(selectColores);
  controlTarjetas.gridOrList = utils.createElementFromHTML(gridOrList);

  /*controlTarjetas.addElements({
    elementoPadre: "pa-container-config",
    buscador: "pa-buscador-config",
    peso: "pa-weight-config",
    serif: "pa-serif-config",
    sectores: "pa-sectors-config",
    colores: "pa-colors-config",
  });*/

  controlTarjetas.template = () => {
    const state = JSON.parse(JSON.stringify(controlTarjetas.state));
    const { buscador, filters, sectores, colores } = state;

    /**
     * Función que comprueba cada tarjeta para ver si debe mostrarse con
     * los filtros actuales
     *
     * @param {TarjetaConfiguracion} tarjeta Una tarjeta de demo
     *
     * @returns true si la tarjeta debe mostrarse, false si no
     */
    const matchFilters = (tarjeta) => {
      return (
        tarjeta.titulo.toLowerCase().includes(buscador.toLowerCase()) &&
        filters.every((filter) => tarjeta.keyword.includes(filter)) &&
        (!sectores || tarjeta.sectores.includes(sectores)) &&
        (!colores || tarjeta.colores.includes(colores))
      );
    };

    return controlTarjetas.tarjetas
      .filter(matchFilters)
      .map((value) => value.tarjeta);
  };

  controlTarjetas.buscador.addEventListener("keyup", () => {
    controlTarjetas.setState({ buscador: controlTarjetas.buscador.value });
  });

  const clickButtonFilter = (e) => {
    const state = JSON.parse(JSON.stringify(controlTarjetas.state));
    const { filters } = state;
    const filtersCopy = JSON.parse(JSON.stringify(filters));
    let filter;

    filter = e.target.dataset.filter;
    e.target.classList.toggle("btn-active");

    if (filtersCopy.includes(filter)) {
      filtersCopy.splice(filtersCopy.indexOf(filter), 1);
    } else {
      filtersCopy.push(filter);
    }

    console.log(filtersCopy);
    controlTarjetas.setState({ filters: filtersCopy });
  };

  const clickButtonView = (e) => {
    const toggleCSSclasses = (el, ...cls) =>
      cls.map((cl) => el.classList.toggle(cl)); //Función para hacer toggle a varias clases, VIVA ES6 CARALHO
    const container = document.getElementById("pa-container-config"); //Grid de tarjetas
    const parents = document.querySelectorAll(".parent"); //Contenedor de BG de tarjeta
    toggleCSSclasses(
      container,
      "grid-cols-2",
      "xl:grid-cols-3", //remove
      "grid-cols-1",
      "xl:grid-cols-1"
    ); //add
    parents.forEach((parent, i, p) => {
      const child = parent.childNodes[0]; //Elemento que se muestra al hacer hover
      const childImg = child.childNodes[0]; //Imagen fullsize del hover
      const childDiv = child.childNodes[1]; //Contenedor de elementos
      const childDivText = childDiv.childNodes[0]; // Nombre del demo
      parent.classList.toggle("h-32");
      child.classList.toggle("child-list"); //add
      childImg.classList.toggle("ml-18");
      child.classList.toggle("child"); //remove
      toggleCSSclasses(
        childDiv,
        "flex",
        "my-auto",
        "w-9/12",
        "justify-between"
      );
      toggleCSSclasses(childDivText, "flex", "my-auto", "mr-0", "text-3xl");
    });
    return;
  };

  const filterInputChange = (e) => {
    const filter = e.target.dataset.filter;

    controlTarjetas.setState({ [filter]: e.target.value });
  };

  controlTarjetas.peso.addEventListener("click", clickButtonFilter);
  controlTarjetas.serif.addEventListener("click", clickButtonFilter);
  controlTarjetas.colores.addEventListener("change", filterInputChange);
  controlTarjetas.sectores.addEventListener("change", filterInputChange);
  controlTarjetas.gridOrList.addEventListener("change", clickButtonView); //Cambiar la vista de grid a lista

  controlTarjetas.render();

  sectores.forEach((sector) => {
    let el;
    el = utils.createElement("option", { innerHTML: sector, value: sector });
    controlTarjetas.sectores.appendChild(el);
  });
  colores.forEach((color) => {
    let el;
    el = utils.createElement("option", { innerHTML: color, value: color });
    controlTarjetas.colores.appendChild(el);
  });

  return utils.createElement("div", { className: "mx-3" }, [
    utils.createElement(
      "div",
      { className: "flex bg-gray-100 rounded-xl my-3" },
      [controlTarjetas.buscador, utils.createElementFromHTML(botonBuscador)]
    ),
    utils.createElement("div", { className: "flex" }, [
      controlTarjetas.peso,
      controlTarjetas.serif,
      controlTarjetas.sectores,
      controlTarjetas.colores,
      controlTarjetas.gridOrList,
    ]),
    controlTarjetas.elementoPadre,
  ]);
};

/**
 *
 * VISTA DE CREAR PÁGINA
 * */

const crearPagina = {
  elementoPadre: utils.createElementFromHTML(
    `<div  class="relative px-6 pt-4 pb-20 artboard-demo max-w-md m-auto bg-base-200 flex flex-col justify-start align-start">
    <div class="flex flex-start w-full" id="pd-go-back">
      <button class="btn btn-square btn-ghost rounded-2xl display-inline hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current text-success">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
      </button>
    </div>
  <h2 class=" text-4xl text-black font-bold"> Bienvenido </h2>
  <div class="mt-5 px-2 py-2 card">
    <div class="form-control">
      <input
        type="text"
        id="pd-name-new-post"
        placeholder="Nombre para su nuevo sitio"
        class="text-left input input-lg input-bordered w-96"
      />
      <div class="flex flex-row mt-3 justify-around">
        <button
          class="btn bg-black text-white hover:bg-gray-700"
          style="width: 11.9rem"
        >
          Crear con ayuda
        </button>
        <button class="btn bg-gray-100 text-black" style="width: 11.9rem">
          Yo me encargo
        </button>
      </div>
      <div class="mt-5">
        <p class=" text-1xl">
          ¿Te gustaría que un Técnico Profesional se encargue de la
          construcción de tu sitio web?
        </p>
      </div>
      <div class="mt-5">
        <p class=" text-1xl">
          Si eliges un Técnico, recibirás una llamada para asistirte en el
          proceso.
        </p>
      </div>
      <div class="mt-5">
        <button id="pd-create-post" class="btn w-96 bg-black text-white hover:bg-gray-700">Continuar</button>
      </div>
    </div>
  </div>
</div>`
  ),
  post: 0,
  wait: false,
};

(function initCrearPagina() {
  const viewCreate = crearPagina.elementoPadre;
  const botonVolver = viewCreate.querySelector("#pd-go-back");
  const botonCrear = viewCreate.querySelector("#pd-create-post"),
    inputName = viewCreate.querySelector("#pd-name-new-post");

  botonVolver.onclick = () => {
    viewsContainer.changeView("demos");
  };

  botonCrear.onclick = async (e) => {
    if (crearPagina.post === 0 || crearPagina.wait) return;

    crearPagina.wait = true;

    let params = {};
    if (inputName.value) {
      params["post_title"] = inputName.value;
    }

    console.log(params);
    const res = await wpRestApiPost(`new_site/${crearPagina.post}`, params);

    crearPagina.post = 0;

    if (res.ok) {
      const urlPost = await res.json();
      console.log(urlPost);
      if (urlPost) {
        viewsContainer.showSuccessPage(urlPost);
      } else {
        viewsContainer.changeView("demos");
      }
    } else {
      console.log("Error");
      viewsContainer.changeView("demos");
    }

    crearPagina.wait = false;
  };
})();

const successPage = {
  elementoPadre: utils.createElementFromHTML(
    `<div class=" relative px-6 pt-12 pb-3 artboard-demo max-w-md m-auto bg-base-200 flex flex-col justify-start"  >
      <h2 class=" text-4xl absolute top-12 text-black font-bold">Felicitaciones</h2>

      <div class="mt-5 mb-4 px-2 py-2 card">
        <div class="">
          <img src="../assets/svg/check_circle-black-48dp.svg" class="w-36 h-36 m-auto mt-4" />
        
        </div>
        <div class="mt-4">
          <p class=" text-1xl text-justify">
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea nulla impedit vero ad doloribus possimus, facere accusantium illo sequi dolore ab deserunt, consequatur perferendis ullam placeat eligendi? Maiores, expedita laudantium!
           Dolor nesciunt perspiciatis magni architecto nostrum distinctio error delectus blanditiis, reiciendis 

          </p>
        </div>
        <div class="mt-5">
          <a id="pd-edit-new-page" target="_blank" class="btn w-96 bg-black text-white hover:bg-gray-700">Editar mi Página Web</a>
        </div>
      </div>
    </div>`
  ),
  set urlRedirect(url) {
    const buttonEdit = successPage.elementoPadre.querySelector(
      "#pd-edit-new-page"
    );
    buttonEdit.href = url;
  },
  get urlRedirect() {
    const buttonEdit = successPage.elementoPadre.querySelector(
      "#pd-edit-new-page"
    );
    return buttonEdit.href;
  },
};

const loginForm = utils.createElementFromHTML(
  `<div class="relative px-6 pt-32 pb-8 artboard-demo max-w-md m-auto bg-base-200 flex flex-col justify-start" >
    <h2 class=" text-4xl absolute top-12 text-black font-bold"> ¿Tienes Cuenta? </h2>
    <div class="mt-2 px-10 py-2 card mb-6">
      <div class="flex flex-col justify-between">
        <a id="google-button" class="btn bg-black text-white  hover:bg-gray-700 mb-3 flex justify-start ">
          <img src="../assets/svg/google.svg" class="w-6 h-6 mx-5 colorize-white">Google Social Login
        </a>
        <button class="btn bg-gray-100 text-black mb-3 flex justify-start w-96" >
          <img src="../assets/img/logo-ponceleon.svg" class="w-8 h-8 ml-4 mr-4  " />
           Sí, Iniciar Sesión
        </button>
      </div>
        
      </div>
        <h2 class=" text-2xl text-black font-bold text-center"> O, Regístrate para Continuar </h2>
          <div class="px-2 py-2 card mb-2 mt-2">
            <div class="flex flex-col mt-3 justify-between">
              <a id="google-button" class="btn bg-black text-white  hover:bg-gray-700 mb-3 flex justify-start ">
                <img src="../assets/svg/google.svg" class="w-6 h-6 mx-5 colorize-white">Google Social Login
              </a>   
              <button class="btn bg-gray-100 text-black mb-3 flex justify-start w-96" >
              <img src="../assets/img/logo-ponceleon.svg" class="w-8 h-8 ml-4 mr-4  " /> Continuar
              </button>
            </div>
    </div>
  </div>`
);

export { cardsControl, successPage, crearPagina, loginForm };
