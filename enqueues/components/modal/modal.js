/**
 * Crea los elementos básicos de un modal
 *
 * return {any} Un objeto con los elementos basicos de un modal. El padre (element), el
 * panel oscurecido en el fondo (back) y la tarjeta del contenido (card)
 */
const createModalElements = (config = {}) => {
	const elementAtt = config.element || {};
	const backAtt = config.back || {};
	const cardAtt = config.card || {};

	const elements = {
		element: CustomElement.create("div", elementAtt),
		back: CustomElement.create("div", backAtt),
		card: CustomElement.create("div", cardAtt),
	};

	elements.element.appendChild(elements.back);
	elements.element.appendChild(elements.card);

	return elements;
}

function _Modal(elements){
	this.state = {open: false};

	this.elements = elements;
	this.element = elements.element;
	this.back = elements.back;
	this.card = elements.card;

	this.template = () => {
		const state = JSON.parse(JSON.stringify(this.state));
		const {open} = state;

		this.element.classList[open ? "remove" : "add"]("ponce-demos__hidden");

		return [this.back, this.card];
	}

}
_Modal.prototype = Object.create(ComponenteReactivo.prototype);
_Modal.prototype.constructor = _Modal;