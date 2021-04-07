import { utils } from "../Utilities/utilities.js";
import { viewsContainer } from "../Views/ViewsContainer.js";
/**
 * Crea una tarjeta estandar del panel
 *
 * @param {any} options Objeto con los datos del demo
 */
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

  this.previewImage = utils.createElement(
    "div",
    {
      className: " bg-cover z-10 border-black px-24 py-24  ",
      style: `background-image: url(${this.fullsize})`,
      alt: `${this.titulo}`,
    },
    []
  );

  this.previewImage.addEventListener("click", () => {
    const style = this.previewImage.style;
    let url = style.backgroundImage.slice(4, -1).replace(/"/g, "");
    window.open(url, "_blank").focus();
    //Modal para Abrir imagen en la misma pestaña (Experimental)
    /*const modalel = document.getElementById("myModal");
      const modalImg = document.getElementById("img01");
      const captionText = document.getElementById("caption");
      modalel.style.display = "block";
      modalel.style.visibility = "visible";
      console.log(this.previewImage.style);
      const style = this.previewImage.style;
      let url = style.backgroundImage.slice(4, -1).replace(/"/g, "");
      console.log(url);
      modalImg.src = url;
      captionText.innerHTML ='captiontest' ;*/
    //Modal para Abrir imagen en la misma pestaña (Experimental)
  });

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
              this.previewImage,
              utils.createElement(
                "div",
                { className: "z-10 w-28 border-black pl-3 mt-5 ml-6" },
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
