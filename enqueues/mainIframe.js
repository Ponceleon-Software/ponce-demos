/**
 * Crea un iframe con los atributos pasados en config
 *
 * @param {any} config Una lista de atributos para el iframe
 */
const createIFrame = (config = {}) => {
  const frame = CustomElement.create("iframe", config);

  return frame;
};

/**
 * Objeto que guarda y da funcionalidad al iframe principal
 */
const mainIFrame = (() => {
	const iframe = createIFrame({
		className: "ponce-admin__full",
		id: "iframe",
		src: pathsInfo.html,
	});

	return {
		appendTo: (parent) => {
			parent.appendChild(iframe);
		},
		get: () => iframe,
		window: () => iframe.contentWindow 
	};
})();

/// Empieza la escucha de errores en el iframe por parte del modal
window.addEventListener("load", (e) => {
	const modal = ErrorModal(mainIFrame.window());
	document.body.appendChild(modal.element());
	window.ponceErrorModal = modal;
});