const cardsEndpoints = {
  ponceTopBar: "topbar",
};

/**
 * Toma el arreglo de configuraciones de la base de datos y devuelve
 * las tarjetas correspondientes
 * @param {any[]} settings
 * @returns {TarjetaConfiguracion[]}
 */
const createAllCards = (settings) => {
  return settings.map((value) => {
    const { name, sectores, tipografia, colores, url } = value;
    if (!value.thumbnail) console.log(name);
    const imgurl = value.thumbnail
      ? value.thumbnail
      : "https://i.pinimg.com/564x/66/08/1d/66081dff2bd229c7a9b1e30625ddf2a1.jpg"; //CORREGIR IMAGEN DE NOTARIA PUBLICA
    const tarjeta = new TarjetaConfiguracion(
      name,
      tipografia,
      sectores,
      colores,
      imgurl,
      url
    );
    tarjeta.addKeyWords(sectores);
    tarjeta.addKeyWords(name);
    tarjeta.addKeyWords(tipografia[0]);
    //console.log(tarjeta.keyword);
    return tarjeta;
  });
};

/**
 * Controla la salida de las tarjetas y la manera en que se van a mostrar
 */
const cardsControl = async () => {
  const response = await wpRestApi("demos");
  const settingsAsc = await response.json();
  const settings = [];
  for (let i in settingsAsc) {
    settings.push(settingsAsc[i]);
  }

  let sectores = [];
  let colores = [];
  settings.forEach((el) => {
    el.sectores.forEach((sector) => {
      if (!sectores.includes(sector) && sector) sectores.push(sector);
    });
    el.colores.forEach((color) => {
      if (!colores.includes(color) && color) colores.push(color);
    });
  });

  const controlTarjetas = new Modificador();
  controlTarjetas.state = {
    buscador: "",
  };
  controlTarjetas.tarjetas = createAllCards(settings);
  controlTarjetas.addElements({
    contenedor: "pa-container-config",
    buscador: "pa-buscador-config",
    peso: "pa-weight-config",
    serif: "pa-serif-config",
    sectores: "pa-sectors-config",
    colores: "pa-colors-config",
  });
  controlTarjetas.template = () => {
    const devuelto = [];
    return devuelto.concat(
      controlTarjetas.tarjetas
        .filter((value) =>
          value.keyword.some((word) =>
            word
              .toLowerCase()
              .includes(controlTarjetas.state.buscador.toLowerCase())
          )
        )
        .map((value) => value.tarjeta)
    );
  };
  controlTarjetas.render = () => {
    const template = controlTarjetas.template();
    const actual = controlTarjetas.contenedor.children;

    template.forEach((value, index) => {
      if (actual[index] && value !== actual[index]) {
        controlTarjetas.contenedor.replaceChild(value, actual[index]);
      } else if (!actual[index]) {
        controlTarjetas.contenedor.appendChild(value);
      }
    });

    if (actual.length > template.length) {
      for (let i = template.length; i < actual.length; i++) {
        controlTarjetas.contenedor.removeChild(actual[i]);
      }
    }
    controlTarjetas.buscador.focus();
  };

  controlTarjetas.buscador.addEventListener("keyup", () => {
    controlTarjetas.setState({ buscador: controlTarjetas.buscador.value });
  });
  controlTarjetas.peso.addEventListener("click", (event) => {
    let prevState = controlTarjetas.state.buscador;
    let newState = "";
    event.target.classList.toggle("btn-active");
    let value;
    const botones = getSiblings(event.target, true);
    botones.forEach((el) => {
      value = el.getAttribute("data-filter-weight");
      if (el.classList.contains("btn-active") && !prevState.includes(value))
        newState += value + " ";
      else prevState = prevState.replace(value, "");
    });

    newState = (prevState + newState).trim();
    controlTarjetas.setState({ buscador: newState });
    console.log(newState);
  });
  controlTarjetas.serif.addEventListener("click", (event) => {
    let prevState = controlTarjetas.state.buscador;
    let newState = "";
    event.target.classList.toggle("btn-active");
    let value;
    const botones = getSiblings(event.target, true);
    botones.forEach((el) => {
      value = el.getAttribute("data-filter-serif");
      if (el.classList.contains("btn-active") && !prevState.includes(value))
        newState += value + " ";
      else prevState = prevState.replace(value, "");
    });
    prevState;
    newState = prevState + " " + newState;
    controlTarjetas.setState({ buscador: newState });
    console.log("Nuevo:" + controlTarjetas.state.buscador);
  });
  controlTarjetas.colores.addEventListener("change", (event) => {
    let prevState = controlTarjetas.state.buscador;
    let newState = event.target.value;
    const options = [].slice.apply(event.target.options);
    options.forEach((el) => {
      if (prevState.includes(el.value)) {
        prevState = prevState.replace(el.value, "");
      }
    });
    newState = prevState.trim() + " " + newState;
    controlTarjetas.setState({ buscador: newState });
    console.log(newState);
  });

  controlTarjetas.render();

  sectores.forEach((sector) => {
    let el;
    el = utils.createElement("option", { innerHTML: sector, value: sector });
    controlTarjetas.sectores.appendChild(el);
  });
  colores.forEach((color) => {
    let el;
    el = utils.createElement("option", { innerHTML: color, value: color });
    controlTarjetas.colores.appendChild(el);
  });
};

let getSiblings = function (e, needFirst = false) {
  let siblings = [];
  if (!e.parentNode) {
    return siblings;
  }
  let sibling = e.parentNode.firstChild;

  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== e) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  siblings.unshift(e);
  return siblings;
};
