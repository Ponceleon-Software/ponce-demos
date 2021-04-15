const initModal = (component) => {
	component.back.addEventListener("click", (e) => {
		component.setState({open: false});
	});
}

const Modal = (config = {}) => {
	config.element = config.element || {};
	config.back = config.back || {};
	config.card = config.card || {};

	config.element.className = (config.element.className || "") + " ponce-demos__size-screen ponce-demos__modal--container";
	config.back.className = (config.back.className || "") + " ponce-demos__modal--back ponce-demos__size-full";
	config.card.className = (config.card.className || "") + " ponce-demos__modal";

	const elements = createModalElements(config);

	const component = new _Modal(elements);

	initModal(component);
	component.render();

	document.body.appendChild(elements.element);

	return {
		open: () => component.setState({open: true}),
		close: () => component.setState({open: false}),
		toggle: () => component.setState({open: !component.state.open}),
		isOpen: () => component.state.open,
		appendChild: (element) => elements.card.appendChild(element),
		element: () => elements.element,
		elements: () => elements,
	}
}