/**
 * Define un componente reactivo
 * @param {Node} element El elemento padre del componente
 * @param {any} state El estado del componente reactivo
 * @param {(props:any)=>Node[]} template Función que devuelve una lista
 * de los hijos que serán renderizados dependiendo del estado en
 * cada renderización
 */
function ComponenteReactivo(element, state = {}, template = (props = {}) => []) {

  this.state = state;
  this.element = element;
  this.template = template;

}

ComponenteReactivo.prototype = {

  constructor: ComponenteReactivo,

  /**
   * Función para cambiar el estado de un componente reactivo.
   * Recibe un objeto el cual alguna de sus llaves debe coincidir con
   * uno de los estados, de ser así, actualiza el estado y vuelve a
   * renderizar el dom en base a el
   *
   * @param {any} newState Un objeto con los estados a cambiar .
   */
  setState: function (newState) {
    let change = false;

    for (let key in newState) {
      if (this.state.hasOwnProperty(key)) {
        this.state[key] = newState[key];
        change = true;
      }
    }

    change && this.render();
  },

  /**
   * Función que renderiza el dom según la devolución de template
   */
  render: function () {
    const newTemp = this.template();
    const child = this.element.children;

    newTemp.forEach((el, index) => {
      if (!child[index]) {
        this.element.appendChild(el);
      } else if (el !== child[index]) {
        this.element.replaceChild(el, child[index]);
      }
    });

    if (child.length > newTemp.length) {
      while( child[newTemp.length] ){
        this.element.removeChild( child[newTemp.length] );
      }
    }
  },
};

/**
 * Objeto que ayuda a la creación de elementos del DOM
 */
const CustomElement = {

  /**
   * Crea un elemento y le añade atributos
   *
   * @param {string} tagName El nombre de la etiqueta del elemento
   * @param {any} options Un objeto con los atributos que se le
   * desea añadir a la etiqueta html
   * @param {HTMLElement[]} children Un arreglo de elementos que
   * se añadirán como hijos del elemento creado
   */
  create: (tagName, options = {}, children = []) => {
    const elemento = document.createElement(tagName);

    for (let key in options) {
      if (elemento[key] !== undefined) {
        elemento[key] = options[key];
      }
    }

    children.forEach((value) => {
      elemento.appendChild(value);
    });

    return elemento;
  },

  /**
   * Convierte un string en formato html en un elemento del DOM
   *
   * @param {string} htmlText El string en formato html
   *
   * @return {HTMLElement} El elemento definido por la primera etiqueta
   * que se abra y se cierre en el string recibido
   */
  fromHTML: (htmlText) => {
    const div = document.createElement("div");
    div.innerHTML = htmlText;
    return div.children[0];
  },

};
