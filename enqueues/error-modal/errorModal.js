const errorModalElements = () => { 
	const modal = Modal({card: {className: "ponce-demos__error-modal"}});

	const elements = {
		modal: modal,
		body: CustomElement.create("div", {className: "ponce-demos__modal--body"}),
		close: CustomElement.create("button", {className: "ponce-demos__modal---close-button", innerHTML: "x"}),
		sectionTitle: CustomElement.create("div", {className: "ponce-demos__modal--section"}),
		sectionDescription: CustomElement.create("div", {className: "ponce-demos__modal--section ponce-demos__modal--center"}),
		sectionNav: CustomElement.create("div", {className: "ponce-demos__modal--section"}),
		title: CustomElement.create("h2", {className: "ponce-demos__modal--title"}),
		descriptionContainer: CustomElement.create("div", {className: "ponce-demos__modal--description ponce-demos__size-full"}),
		message: CustomElement.create("p"),
		description: CustomElement.create("p"),
		debugDetails: CustomElement.create("ul", {className: "ponce-demos__modal--details"}),
		navContainer: CustomElement.create("div", {className: "ponce-demos__modal--nav ponce-demos__size-full"}),
		buttonsContainer: CustomElement.create("div", {className: "ponce-demos__modal--actions"}),
		buttons: {
			refresh: CustomElement.create("button", {innerHTML: "Refrescar"}),
			details: CustomElement.create("button", {innerHTML: "Detalles de Debug"}),
			reset: CustomElement.create("button", {innerHTML: "Reiniciar Plugin"}),
		},
		contact: CustomElement.create("p", {className: "ponce-demos__modal--contact",innerHTML: `Contactanos al correo <a href="#">correo@correo.com</a>`}),
	};

	modal.appendChild(elements.body);

	elements.body.appendChild(elements.close);
	elements.body.appendChild(elements.sectionTitle);
	elements.body.appendChild(elements.sectionDescription);
	elements.body.appendChild(elements.sectionNav);

	elements.sectionTitle.appendChild(elements.title);

	elements.sectionDescription.appendChild(elements.descriptionContainer);

	elements.descriptionContainer.appendChild(elements.message);
	elements.descriptionContainer.appendChild(elements.description);

	elements.sectionNav.appendChild(elements.navContainer);

	elements.navContainer.appendChild(elements.buttonsContainer);
	elements.navContainer.appendChild(elements.contact);

	for(let button in elements.buttons){
		elements.buttonsContainer.appendChild(elements.buttons[button]);
	}

	return elements;
	
};

function _ErrorModal(elements){
	this.state = {error: null, showDetails: false};

	this.elements = elements;
	this.element = elements.body;

	this.modal = elements.modal;

	this.sectionTitle = elements.sectionTitle;
	this.sectionDescription = elements.sectionDescription;
	this.sectionNav = elements.sectionNav;

	this.descriptionContainer = elements.descriptionContainer;
	this.debugDetails = elements.debugDetails;

	this.title = elements.title;
	this.message = elements.message;
	this.description = elements.description;

	this.close = elements.close;

	this.template = () => {
		const state = JSON.parse(JSON.stringify(this.state));
		const {error, showDetails} = state;
		
		if(error){
			this.modal.open();

			this.title.innerHTML = error.name;

			this.sectionDescription.innerHTML = "";

			if(showDetails){
				this.sectionDescription.appendChild(this.debugDetails);

				const capitalize = (word) => word.charAt(0).toUpperCase().concat(word.substring(1));

				let inner = "";
				for(let info in error){
					if (info === "name") continue;
					inner += `<li><b>${capitalize(info)}:</b> ${error[info]}</li>`;
				}

				this.debugDetails.innerHTML = inner;
			}else{
				this.sectionDescription.appendChild(this.descriptionContainer);

				this.message.innerHTML = error.message;
				this.description.innerHTML = error.stack;				
			}
		}else{
			this.modal.close();
		}

		const childs = [this.close ,this.sectionTitle, this.sectionDescription, this.sectionNav];

		return childs;
	}
}
_ErrorModal.prototype = Object.create(ComponenteReactivo.prototype);
_ErrorModal.constructor = _ErrorModal;