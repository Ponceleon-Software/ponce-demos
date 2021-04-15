const errorModalInit = (component) => {
	const elements = component.elements;
	const buttons = elements.buttons;

	const close = component.modal.close;

	const showDetails = () => {
		component.setState({showDetails: !component.state.showDetails});
	};

	elements.close.addEventListener("click", close);

	buttons.refresh.addEventListener("click", () => location.reload());

	buttons.details.addEventListener("click", showDetails);
}

/**
 * Inicializa un modal para mostrar los errores de una o varias
 * paginas
 *
 * @param {_ErrorModal} component
 *
 * @return {{subscribe, unsubscribe}}
 */
const listenErrors = (component) => {

	const onError = (err) => {
		const error = {
			name: "Unexpected Error",
			type: err.error.stack.substring(0, err.error.stack.indexOf(":")),
			message: err.message,
			file: err.filename,
			line: err.lineno,
			column: err.colno,
			stack: err.error.stack,
		};
		component.setState({error: error});
		component.modal.open();
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

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe,
	}
};

const ErrorModal = (win) => {
	const elements = errorModalElements();

	const component = new _ErrorModal(elements);
	errorModalInit(component);
	const listener = listenErrors(component);
	listener.subscribe(win);

	component.render();

	return {
		element: () => elements.element,
		get: (element) => elements[element],
		setError: (error) => {
			component.setState({error: error});
		},
		close: () => {
			component.setState({error: null});
		},
		getModal: () => component.modal,
		subscribe: listener.subscribe,
		unsubscribe: listener.unsubscribe,
	}
}