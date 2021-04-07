/**
 * Crea un iframe con los atributos pasados en config
 *
 * @param {any} config Una lista de atributos para el iframe
 */
const createIFrame = (config = {}) => {
  config.className = config.className || "ponce-admin__full";
  config.id = "iframe";
  const frame = CustomElement.create("iframe", config);

  return frame;
};
