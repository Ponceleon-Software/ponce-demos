import { utils } from "../Utilities/utilities.js";
import { LockeableSwitch } from "../Components/Components.js";
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
  thumbnail,
  fullsize,
  url
) {
  this.titulo = titulo;
  this.tipografia = tipografia;
  this.sectores = sectores;
  this.colores = colores;
  this.thumbnail =thumbnail;
  this.fullsize =fullsize;
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
                      "card-title tamanno text-base capitalize text-black z-10 content text-center ",
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
                          "button",
                          {
                            className:
                              "bg-white px-3 py-1 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 rounded border-black fill-current text-black z-10",
                            innerHTML: `<p>view</p>`,
                          },
                          [],
                          () => window.open(this.url, "_blank")
                        ),
                        utils.createElement(
                          "button",
                          {
                            className:
                              " bg-black px-3 py-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 rounded fill-current text-white z-10",
                            innerHTML: `<p>Install</p>`,
                          },
                          [],
                          () => window.open(this.url, "_blank")
                        ),
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
    const { name, sectores, tipografia, colores, url } = value;
    if (!value.thumbnail) console.log(name);
    const thumbnail = value.thumbnail
      ? value.thumbnail
      : "https://i.pinimg.com/564x/66/08/1d/66081dff2bd229c7a9b1e30625ddf2a1.jpg"; //CORREGIR IMAGEN DE NOTARIA PUBLICA
    const fullsize = value.fullsize
      ? value.fullsize
      : "https://i.pinimg.com/564x/66/08/1d/66081dff2bd229c7a9b1e30625ddf2a1.jpg"; //CORREGIR IMAGEN DE NOTARIA PUBLICA
    const tarjeta = new TarjetaConfiguracion(
      name,
      tipografia,
      sectores,
      colores,
      thumbnail,
      fullsize,
      url
    );
    tarjeta.addKeyWords(sectores);
    tarjeta.addKeyWords(name);
    tarjeta.addKeyWords(tipografia[0]);
    return tarjeta;
  });
};
export { createAllCards, TarjetaConfiguracion };
