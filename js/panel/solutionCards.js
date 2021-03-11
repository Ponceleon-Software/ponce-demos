/* Este archivo se volvió innecesario por el momento
const tarjetaLogo = () => {
  const tarjetaLogo = new TarjetaConfiguracion(
    "Ponce Logo",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit Cras vulputate consequat vestibulum. Sed suscipit sollicitudin sem"
  );
  tarjetaLogo.addKeyWords(["logo", "imagen", "image"]);
  return tarjetaLogo;
};

const tarjetaTopBar = () => {
  const changeTopBar = async () => await wpRestApi("topbar");

  const tarjetaTopBar = new TarjetaConfiguracion(
    "Ponce Topbar",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit Cras vulputate consequat vestibulum. Sed suscipit sollicitudin sem",
    changeTopBar
  );
  tarjetaTopBar.addKeyWords(["top bar", "barra superior", "admin bar"]);

  return tarjetaTopBar;
};

//Comentarios en tarjetaLogo
/*{
      isLogo: false,
      src: "",
      inLogin: false,
      inAdmin: false,
    }*/
/*tarjetaLogo.inputs = {
    src: utils.createElement("input", {
      type: "file",
      accept: "image/jpeg,image/png",
      id: "pa-logo-input",
    }),
    inLogin: createToogle(tarjetaLogo.state.inLogin),
    inAdmin: createToogle(tarjetaLogo.state.inAdmin),
  };
  tarjetaLogo.inputs.inLogin.name = "inLogin";
  tarjetaLogo.inputs.inAdmin.name = "inAdmin";
  const src = labeledInputFile(tarjetaLogo.inputs.src, {
      title: "Subir un logo",
    }),
    inLogin = labelToogle("Login", tarjetaLogo.inputs.inLogin),
    inAdmin = labelToogle("Admin", tarjetaLogo.inputs.inAdmin);
  tarjetaLogo.template = () => {
    const content = [src];
    if (tarjetaLogo.state.isLogo) {
      content.push(inLogin, inAdmin);
    }
    return content;
  };
  tarjetaLogo.handleToogle = (e) => {
    tarjetaLogo.setState({ [e.target.name]: e.target.checked });
  };
  tarjetaLogo.inputs.inLogin.addEventListener(
    "change",
    tarjetaLogo.handleToogle
  );
  tarjetaLogo.inputs.inAdmin.addEventListener(
    "change",
    tarjetaLogo.handleToogle
  );*/

//Comentarios en tarjetaTopBar
/*tarjetaTopBar.inputs = {
    isActive: createToogle(tarjetaTopBar.state.isActive),
  };
  const isActive = labelToogle("Mostrar", tarjetaTopBar.inputs.isActive);
  tarjetaTopBar.template = () => {
    return [isActive];
  };
  tarjetaTopBar.inputs.isActive.addEventListener("change", (e) => {
    tarjetaTopBar.setState({ isActive: e.target.checked });
  });*/
//{ isActive: true }
