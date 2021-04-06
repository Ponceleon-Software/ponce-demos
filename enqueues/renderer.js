/* @var pathsInfo Es pasada desde el php por wp_localize_script */

//Aquí se contiene todo lo que va a hacer la aplicación
window.addEventListener("DOMContentLoaded", (e) => {
	const wpContent = document.getElementById("wpbody-content");

	const panelObject = poncePanel({logo: pathsInfo.logo});
	const iframe = createIFrame({src: pathsInfo.html});

	const panel = panelObject.get("panelContent");
	panel.appendChild(iframe);

	const containerPanel = panelObject.container();
	wpContent.appendChild(containerPanel);
});