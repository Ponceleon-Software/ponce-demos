import { Modificador } from "../Utilities/Renderer.js";
import { utils } from "../Utilities/utilities.js";

/**
 * Encapsula funcionalidad compartida entre todoslos componentes
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

/**
 *
 * @param {() => Promise<Response>} action
 * @param {(success:boolean) => void} onFinish
 */
function LockeableSwitch(action, onFinish = null) {
  this.state = { locked: false };

  const [label, input] = utils.createToogle();
  this.label = label;
  this.input = input;
  this.toggleMark = this.label.querySelector("span.toggle-mark");

  this.loadCircle = utils.createElement("span", {
    className:
      "w-4 h-4 ml-2 rounded-full border-2 border-gray-200 animate-spin",
    style: "border-top-color: gray",
  });

  this.elementoPadre = utils.createElement(
    "div",
    { className: "flex items-center" },
    [this.label]
  );

  this.action = action;
  this.onFinish = onFinish;

  this.input.addEventListener("click", async (e) => {
    if (this.state.locked) {
      e.preventDefault();
      return;
    }
    this.setState({ locked: true });
    const response = await this.action();
    this.setState({ locked: false });
    if (this.onFinish) {
      const success = response.ok;
      this.onFinish(success);
      if (!success) {
        this.input.checked = !this.input.checked;
      }
    }
  });
}
LockeableSwitch.prototype = Object.create(Componente.prototype);
LockeableSwitch.prototype.template = function () {
  this.toggleMark.style = this.state.locked ? "cursor: default;" : "";

  const temp = [this.label];
  if (this.state.locked) {
    temp.push(this.loadCircle);
  }
  return temp;
};
/**
 *
 * @param {boolean} checked Si el switch está activo no
 */
LockeableSwitch.prototype.setChecked = function (checked) {
  this.input.checked = checked;
};

const spinner = {
  elementoPadre: utils.createElement(
    "div",
    {
      className: "h-full w-full flex items-center justify-center",
      style: "border-top-color: gray",
    },
    [
      utils.createElement("span", {
        className:
          "w-16 h-16 ml-2 rounded-full border-2 border-gray-200 animate-spin",
        style: "border-top-color: gray",
      }),
    ]
  ),
};

export { LockeableSwitch, Componente, spinner };
