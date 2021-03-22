import { wpRestApi } from "../Utilities/utilities.js";
import { Modificador } from "../Utilities/Renderer.js";
import { createAllCards } from "../Components/Cards.js";
import { utils } from "../Utilities/utilities.js";

/**
 * Controla la salida de las tarjetas y la manera en que se van a mostrar
 * VISTA DE GRID TARJETAS
 * */
const cardsControl = async () => {
  const response = await wpRestApi("demos");
  const settingsAsc = await response.json();
  const settings = [];
  for (let i in settingsAsc) {
    settings.push(settingsAsc[i]);
  }

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

  const controlTarjetas = new Modificador();
  controlTarjetas.state = {
    buscador: "",
  };
  controlTarjetas.tarjetas = createAllCards(settings);
  controlTarjetas.addElements({
    contenedor: "pa-container-config",
    buscador: "pa-buscador-config",
    peso: "pa-weight-config",
    serif: "pa-serif-config",
    sectores: "pa-sectors-config",
    colores: "pa-colors-config",
  });
  controlTarjetas.template = () => {
    const devuelto = [];
    return devuelto.concat(
      controlTarjetas.tarjetas
        .filter((value) =>
          value.keyword.some((word) =>
            word
              .toLowerCase()
              .includes(controlTarjetas.state.buscador.toLowerCase())
          )
        )
        .map((value) => value.tarjeta)
    );
  };
  controlTarjetas.render = () => {
    const template = controlTarjetas.template();
    const actual = controlTarjetas.contenedor.children;

    template.forEach((value, index) => {
      if (actual[index] && value !== actual[index]) {
        controlTarjetas.contenedor.replaceChild(value, actual[index]);
      } else if (!actual[index]) {
        controlTarjetas.contenedor.appendChild(value);
      }
    });

    if (actual.length > template.length) {
      for (let i = template.length; i < actual.length; i++) {
        controlTarjetas.contenedor.removeChild(actual[i]);
      }
    }
    controlTarjetas.buscador.focus();
  };

  controlTarjetas.buscador.addEventListener("keyup", () => {
    controlTarjetas.setState({ buscador: controlTarjetas.buscador.value });
  });
  controlTarjetas.peso.addEventListener("click", (event) => {
    let prevState = controlTarjetas.state.buscador;
    let newState = "";
    event.target.classList.toggle("btn-active");
    let value;
    const botones = getSiblings(event.target, true);
    botones.forEach((el) => {
      value = el.getAttribute("data-filter-weight");
      if (el.classList.contains("btn-active") && !prevState.includes(value))
        newState += value + " ";
      else prevState = prevState.replace(value, "");
    });

    newState = (prevState + newState).trim();
    controlTarjetas.setState({ buscador: newState });
  });
  controlTarjetas.serif.addEventListener("click", (event) => {
    let prevState = controlTarjetas.state.buscador;
    let newState = "";
    event.target.classList.toggle("btn-active");
    let value;
    const botones = getSiblings(event.target, true);
    botones.forEach((el) => {
      value = el.getAttribute("data-filter-serif");
      if (el.classList.contains("btn-active") && !prevState.includes(value))
        newState += value + " ";
      else prevState = prevState.replace(value, "");
    });
    prevState;
    newState = prevState + " " + newState;
    controlTarjetas.setState({ buscador: newState });
  });
  controlTarjetas.colores.addEventListener("change", (event) => {
    let prevState = controlTarjetas.state.buscador;
    let newState = event.target.value;
    const options = [].slice.apply(event.target.options);
    options.forEach((el) => {
      if (prevState.includes(el.value)) {
        prevState = prevState.replace(el.value, "");
      }
    });
    newState = prevState.trim() + " " + newState;
    controlTarjetas.setState({ buscador: newState });
  });

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

export { cardsControl, crearPagina };
