import { wpRestApi } from "../Utilities/utilities.js";
import { Componente } from "../Components/Components.js";
import { createAllCards } from "../Components/Cards.js";
import { utils } from "../Utilities/utilities.js";

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
      class="btn btn-xs font-normal font-sans"
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
  </select>`;
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
        tarjeta.titulo.includes(buscador) &&
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

  const filterInputChange = (e) => {
    const filter = e.target.dataset.filter;

    controlTarjetas.setState({ [filter]: e.target.value });
  };

  controlTarjetas.peso.addEventListener("click", clickButtonFilter);
  controlTarjetas.serif.addEventListener("click", clickButtonFilter);
  controlTarjetas.colores.addEventListener("change", filterInputChange);
  controlTarjetas.sectores.addEventListener("change", filterInputChange);

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
    ]),
    controlTarjetas.elementoPadre,
  ]);
};

/**
 *
 * VISTA DE CREAR PÁGINA
 * */

const crearPagina = utils.createElementFromHTML(
  `<div  class="relative px-6 pt-32 pb-8 artboard-demo max-w-md m-auto bg-base-200 flex flex-col justify-start">
  <h2 class="font-sans text-4xl absolute top-12 text-black font-bold"> Bienvenido </h2>
  <div class="mt-5 px-2 py-2 card">
    <div class="form-control">
      <input
        type="text"
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
        <p class="font-sans text-1xl">
          ¿Te gustaría que un Técnico Profesional se encargue de la
          construcción de tu sitio web?
        </p>
      </div>
      <div class="mt-5">
        <p class="font-sans text-1xl">
          Si eliges un Técnico, recibirás una llamada para asistirte en el
          proceso.
        </p>
      </div>
      <div class="mt-5">
        <button class="btn w-96 bg-black text-white hover:bg-gray-700">Continuar</button>
      </div>
    </div>
  </div>
</div>`
);
const loginForm = utils.createElementFromHTML(
  `<div class="relative px-6 pt-32 pb-8 artboard-demo max-w-md m-auto bg-base-200 flex flex-col justify-start" >
    <h2 class="font-sans text-4xl absolute top-12 text-black font-bold"> ¿Tienes Cuenta? </h2>
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
        <h2 class="font-sans text-2xl text-black font-bold text-center"> O, Regístrate para Continuar </h2>
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

export { cardsControl, crearPagina, loginForm };
