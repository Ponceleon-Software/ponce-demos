import { controlPanel } from "../Components/Panel.js";
import { viewsContainer } from "../Views/ViewsContainer.js";

window.addEventListener("DOMContentLoaded", (e) => {
  controlPanel();
  viewsContainer.init();
});

/**
 * Objeto que se encarga de modificar un componente de acuerdo al
 * state que tenga. Actúa como componente reactivo sin tener que
 * escribir el html directamente en el javascript
 * @param {Object} state El estado inicial del componente
 */
function Modificador(state = {}) {
  this.state = state;

  this.render = (props = {}) => {};
}
Modificador.prototype.setState = function (newState) {
  let cambio = false;
  for (let key in newState) {
    if (this.state.hasOwnProperty(key) && this.state[key] !== newState[key]) {
      this.state[key] = newState[key];
      cambio = true;
    }
  }
  if (cambio) {
    this.render();
  }
};
Modificador.prototype.addElements = function (ids) {
  for (let key in ids) {
    this[key] = document.getElementById(ids[key]);
  }
};
export { Modificador };
