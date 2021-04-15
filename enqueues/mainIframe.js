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
 * Guarda el iframe principal de ponce-demos
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

window.addEventListener("load", (e) => {
	const errorModal = ErrorModal(mainIFrame.window());
	window.ponceErrorModal = errorModal.getModal();
});