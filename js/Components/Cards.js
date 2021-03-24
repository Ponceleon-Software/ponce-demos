import { utils } from "../Utilities/utilities.js";
import { LockeableSwitch } from "../Components/Components.js";
import { viewsContainer } from "../Views/ViewsContainer.js";
/**
 * Crea una tarjeta estandar del panel
 * @param {string} titulo
 * @param {string} descripcion
 * @param {() => void} dbaction
 * @param {any} ajustes
 */
console.log(utils);
function TarjetaConfiguracion(options) {
  this.titulo = options.name;
  this.tipografia = options.tipografia;
  this.sectores = options.sectores;
  this.colores = options.colores;
  this.thumbnail =
    options.thumbnail ||
    "https://i.pinimg.com/564x/66/08/1d/66081dff2bd229c7a9b1e30625ddf2a1.jpg";
  this.fullsize =
    options.fullsize ||
    "https://i.pinimg.com/564x/66/08/1d/66081dff2bd229c7a9b1e30625ddf2a1.jpg";
  this.url = options.url;
  this.idPost = options["ID"];

  this.keyword = [];

  this.contenido = utils.createElement("div", {
    className: "form-control my-4",
  });

  this.installButton = utils.createElement("button", {
    className:
      " bg-black px-3 py-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded fill-current text-white z-10",
    innerHTML: `<p>Install</p>`,
  });
  this.installButton.addEventListener("click", () => {
    viewsContainer.createPageFrom(this.idPost);
  });

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
          style: `background-image: url(${this.thumbnail})`,
        },
        [
          utils.createElement(
            "div",
            {
              className: "child z-10 flex flex-row border-black",
            },
            [
              utils.createElement(
                "div",
                {
                  className: " bg-cover z-10 border-black px-24 py-32  ",
                  style: `background-image: url(${this.fullsize})`,
                },
                []
              ),
              utils.createElement(
                "div",
                { className: "z-10 w-28 border-black pl-3 mt-10 ml-6" },
                [
                  utils.createElement("h2", {
                    className:
                      "card-title text-base capitalize text-black z-10 content text-center ",
                    innerHTML: this.titulo,
                  }),

                  utils.createElement("div", { className: "" }, [
                    utils.createElement("h2", {
                      className:
                        "card-title text-base capitalize text-black z-10  content text-center ",
                      innerHTML: `<p>★★★★★</p>`,
                    }),

                    utils.createElement(
                      "div",
                      { className: "flex justify-evenly z-10" },
                      [
                        utils.createElement(
                          "a",
                          {
                            className:
                              "bg-white px-3 py-1 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 rounded border-black fill-current text-black z-10",
                            innerHTML: `<p>view</p>`,
                            href: this.url,
                            target: "_blank",
                          },
                          []
                        ),
                        this.installButton,
                      ]
                    ),
                  ]),
                ]
              ),
            ]
          ),
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
    const tarjeta = new TarjetaConfiguracion(value);
    tarjeta.addKeyWords(value.sectores);
    tarjeta.addKeyWords(value.name);
    tarjeta.addKeyWords(value.tipografia[0].split(","));
    return tarjeta;
  });
};
export { createAllCards, TarjetaConfiguracion };
