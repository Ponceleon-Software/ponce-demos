const ponceElementorHelper = () => {
	const sectionsQueue = [];
	let elementor;

	window.addEventListener("DOMContentLoaded", ev => {
		if( !window.elementor ){ return; }
		
		elementor = window.elementor;
		

		const iframe = elementor.$preview[0];

		const script = document.getElementById("tmpl-elementor-add-section");

		let scriptHTML = script.innerHTML;
		scriptHTML = scriptHTML.replace('<div class="elementor-add-section-drag-title', sectionsQueue.join("") + '<div class="elementor-add-section-drag-title');
				
		script.innerHTML = scriptHTML;

	});

	return {
		addNewSectionButton: (html) => {
			if (elementor) return;
			sectionsQueue.push(html);
		}
	}
}