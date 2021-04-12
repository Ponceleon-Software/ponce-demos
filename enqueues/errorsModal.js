const modalElements = {
	element: CustomElement.create("div", {className: "ponce-demos__modal--container"}),
	modalBody: CustomElement.create("div", {className: "ponce-demos__modal--body"}),
};

/**
 * Inicializa un modal para mostrar los errores de una o varias
 * paginas
 *
 * @param {Window} win La pagina de la cual mostrar los errores.
 * De no pasarla, puede cambiarse después con el método subscribe
 * del objeto devuelto
 *
 * @see subscribe(handler)
 */
const errorsModal = (win = null) => {

	const onError = (e) => {
		alert(e.message);
		return false;
	};

	/**
	 * Añade una pagina cuyos error serán mostrados en el modal
	 *
	 * @param {Window} handler La pagina de la cual mostrar los errores.
	 */
	const subscribe = (handler) => {
		handler.addEventListener("error", onError);
		console.log("subscrito");
	};

	/**
	 * Hace que el modal deje de leer los errores de una ventana
	 *
	 * @param {Window} handler La ventana a la cual dejar de escuchar sus errores.
	 */
	const unsubscribe = (handler) => {
		handler.removeEventListener("error", onError);
		console.log("Desubscrito");
	}

	if(win){
		subscribe(win);
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe,
	}
};