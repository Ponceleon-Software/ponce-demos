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
    const name = value.name
      .split(/([A-Z][a-z]*)/)
      .filter((value) => Boolean(value))
      .join(" ");
    const descripcion = value.description;
    const isActive = value.is_active === "1";
    const dbaction = cardsEndpoints[value.name]
      ? async () => await wpRestApi(cardsEndpoints[value.name])
      : () => {};

    const tarjeta = new TarjetaConfiguracion(name, descripcion, dbaction);
    tarjeta.setSwitch(isActive);
    tarjeta.addKeyWords(value.keywords);
    return tarjeta;
  });
};

/**
 * Controla la salida de las tarjetas y la manera en que se van a mostrar
 */
const cardsControl = async () => {
  const response = await wpRestApi("settings");
  const settings = await response.json();

  const controlTarjetas = new Modificador();
  controlTarjetas.state = {
    buscador: "",
  };
  controlTarjetas.tarjetas = createAllCards(settings);
  controlTarjetas.addElements({
    contenedor: "pa-container-config",
    buscador: "pa-buscador-config",
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

  controlTarjetas.render();
};
