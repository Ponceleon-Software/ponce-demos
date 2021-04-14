import { Modificador } from "../Utilities/Renderer.js";
import { utils } from "../Utilities/utilities.js";

/**
 * Encapsula funcionalidad compartida entre todos los componentes
 * reactivos
 * @param {Node} elemento
 * @param {() => Node[]} template
 */
function Componente(elemento = null, template = null) {
  this.elementoPadre = elemento;
  this.template = template;
}
Componente.prototype = Object.create(Modificador.prototype);
Componente.prototype.render = function () {
  const template = this.template();
  const children = this.elementoPadre.children;

  template.forEach((value, index) => {
    if (children[index]) {
      if (value !== children[index]) {
        this.elementoPadre.replaceChild(value, children[index]);
      }
    } else {
      this.elementoPadre.appendChild(value);
    }
  });

  if (children.length > template.length) {
    const deleteArr = [];
    for (let i = template.length; i < children.length; i++) {
      deleteArr.push(children[i]);
    }
    deleteArr.forEach((value) => this.elementoPadre.removeChild(value));
  }
};

const spinnerShow = (component = null, spinnerOptions = {}) => {
  const comp = component || utils.createElement("div");
  const inner = comp.innerHTML;

  const size = spinnerOptions.size || 4;

  const state = {mostrado: false};

  const loadCircle = utils.createElement("span", {
    className:
      `w-${size} h-${size} ml-2 rounded-full border-2 border-gray-200 animate-spin`,
    style: "border-top-color: gray",
  });

  const mainSpinner = {
    show: () => {
      if (state.mostrado) return;
      comp.appendChild(loadCircle);
      state.mostrado = true;
    },
    remove: () => {
      if (!state.mostrado) return;
      comp.removeChild(loadCircle);
      state.mostrado = false;
    },
    toggle: () => {
      if(state.mostrado){
        mainSpinner.remove();
      }else{
        mainSpinner.show();
      }
    },
    get: () => loadCircle,
  };

  return mainSpinner;
}

export { Componente, spinnerShow };
