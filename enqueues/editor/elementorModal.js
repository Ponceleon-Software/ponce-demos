/**
 * Guarda el modal de ponce-demos en el editor de elementor
 */
const ponceElementorModal = (() => {
	const config = {
		card: {className: "ponce-demos__elementor-modal"},
	};

	const modal = Modal(config);

	const elements = {
		container: CustomElement.create("div", {className: "ponce-demos__size-full ponce-demos__elementor-body"}),
		head: CustomElement.create("div", {className: "ponce-demos__elementor-head"}),
		close: CustomElement.create("button", {innerHTML: "x", className: "ponce-demos__elementor-close"}),
		iframeContainer: CustomElement.create("div", {className: "ponce-demos__elementor-iframe"}),
	}

	modal.appendChild(elements.container);

	elements.head.appendChild(elements.close);

	elements.container.appendChild(elements.head);
	elements.container.appendChild(elements.iframeContainer);

	elements.close.addEventListener("click", modal.close);

	mainIFrame.get().classList.replace("ponce-admin__full", "ponce-demos__size-full");
	mainIFrame.appendTo(elements.iframeContainer);

	return modal;
})()