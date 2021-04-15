/**
 * Devuelve un objeto que permite realizar ciertas acciones necesarias
 * en el preview o editor de elementor
 *
 * @return {any} Objeto con las acciones que se puede realizar con
 * el helper
 */
const ponceElementorHelper = () => {
	const sectionsQueue = [];
	const eventsQueue = [];
	let elementor;

	const addSectionButtons = () => {
		const iframe = elementor.$preview[0];

		const script = document.getElementById("tmpl-elementor-add-section");

		let scriptHTML = script.innerHTML;
		scriptHTML = scriptHTML.replace('<div class="elementor-add-section-drag-title', sectionsQueue.join("") + '<div class="elementor-add-section-drag-title');
				
		script.innerHTML = scriptHTML;
	}

	const addBodyEvents = () => {
		const handler = elementor.$previewContents[0].body;
		eventsQueue.forEach((listener) => {
			const {type, action} = listener;
			handler.addEventListener(type, action);
		});
	}

	window.addEventListener("DOMContentLoaded", ev => {
		if( !window.elementor ){ return; }
		
		elementor = window.elementor;

		addSectionButtons();

		elementor.on("preview:loaded", addBodyEvents);

	});

	return {
		addNewSectionButton: (html) => {
			if (elementor) return;
			sectionsQueue.push(html);
		},
		addEventListener: (type, action) => {
			eventsQueue.push({type, action});
		}
	}
}