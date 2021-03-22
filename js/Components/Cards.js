
import {utils} from '../Utilities/utilities.js'
import {LockeableSwitch} from '../Components/Components.js'
/**
 * Crea una tarjeta estandar del panel
 * @param {string} titulo
 * @param {string} descripcion
 * @param {() => void} dbaction
 * @param {any} ajustes
 */
console.log(utils);
function TarjetaConfiguracion(
  titulo,
  tipografia,
  sectores,
  colores,
  imgurl,
  url
  ) {
  this.titulo = titulo;
  this.tipografia = tipografia;
  this.sectores = sectores;
  this.colores = colores;
  this.imgurl = imgurl;
  this.url = url;

  this.keyword = [];

  this.contenido = utils.createElement("div", {
    className: "form-control my-4",
  });

  this.botonAjustes = utils.createElement("button", {
    className: "btn btn-sm text-white bg-gray-600 hover:bg-gray-500",
    innerText: "Ir Ajustes",
  });
  this.botonAjustes.addEventListener("click", (e) => console.log(this.ajustes));

  /**
   * Muestra una alerta para indicar al usuario si el request fue
   * exitoso o no
   * @param {boolean} success Indica si el request fue exitoso
   */
  const showAlert = (success) => {
    const body = this.tarjeta.firstChild;

    const show = (alerta) => {
      body.appendChild(alerta);
      setTimeout(() => {
        body.removeChild(alerta);
      }, 2000);
    };

    if (success) {
      show(this.alerta);
    } else {
      show(this.alertaEror);
    }
  };

  this.switch = new LockeableSwitch(this.dbaction, showAlert);

  this.alerta = utils.alertaCambios("success", "Se han guardado los cambios");
  this.alertaEror = utils.alertaCambios("error", "Ha ocurrido un error");

  this.tarjeta = utils.createElement(
    "div",
    { className: "card shadow-lg rounded-xl" },
    [
      utils.createElement(
        "div",
        {
          className: "bg-cover parent",
          style: `background-image: url(${this.imgurl})`,
        },
        [
          utils.createElement("div", { className: "   " }, [
            utils.createElement("div", { className: " child card-body p-20" }, [
              utils.createElement("h2", {
                className:
                  "card-title text-base capitalize text-white z-10 text-center ",
                innerHTML: this.titulo,
              }),

              utils.createElement("div", { className: "flex justify-evenly" }, [
                utils.createElement(
                  "button",
                  {
                    className:
                      "btn btn-primary p-0 min-h-0 h-7 w-7 fill-current text-white z-10",
                    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg>`,
                  },
                  [],
                  () => window.open(this.url, "_blank")
                ),
                utils.createElement(
                  "button",
                  {
                    className:
                      "btn btn-accent p-0 min-h-0 h-7 w-7 fill-current text-white z-10",
                    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/></svg>`,
                  },
                  [],
                  () => window.open(this.url, "_blank")
                ),
              ]),
            ]),
          ]),
        ]
      ),
    ]
  );
}
/**
 * Añade a la tarjeta palabras clave para ayudar al buscador
 * @param {string[]} keywords Arreglo de palabras clave a añadir
 */
TarjetaConfiguracion.prototype.addKeyWords = function (keywords) {
  this.keyword = this.keyword.concat(keywords);
};
/**
 * Cambia el estado del switch sin alterar la db
 * @param {boolean} checked Si el switch va estar activo o no
 */
TarjetaConfiguracion.prototype.setSwitch = function (checked) {
  this.switch.setChecked(checked);
};

/**
 * Toma el arreglo de configuraciones de la base de datos y devuelve
 * las tarjetas correspondientes
 * @param {any[]} settings
 * @returns {TarjetaConfiguracion[]}
 */
const createAllCards = (settings) => {
  return settings.map((value) => {
    const { name, sectores, tipografia, colores, url } = value;
    if (!value.thumbnail) console.log(name);
    const imgurl = value.thumbnail
      ? value.thumbnail
      : "https://i.pinimg.com/564x/66/08/1d/66081dff2bd229c7a9b1e30625ddf2a1.jpg"; //CORREGIR IMAGEN DE NOTARIA PUBLICA
    const tarjeta = new TarjetaConfiguracion(
      name,
      tipografia,
      sectores,
      colores,
      imgurl,
      url
    );
    tarjeta.addKeyWords(sectores);
    tarjeta.addKeyWords(name);
    tarjeta.addKeyWords(tipografia[0]);
    return tarjeta;
  });
};
export {createAllCards,TarjetaConfiguracion};