const ponceDemosCalls = {

  endpointurl: (function () {
    var href = window.location.href;
    var index = href.indexOf("/wp-admin");
    var homeUrl = href.substring(0, index);
    return homeUrl;
  })(),

  wpRestApi: async function (path) {
    let response;
    try {
      response = await fetch(`${ponceDemosCalls.endpointurl}/wp-json/ponce-demos/v2/${path}`, {
        method: "GET",
        "Access-Control-Allow-Origin": "*",
        mode: "cors",
        credentials: "include",
      });
      return response;
    } catch (e) {
      alert(e);
    }
  },

  wpRestApiPost: async function (path, params = {}) {
    let response;
    try {
      response = await fetch(`${ponceDemosCalls.endpointurl}/wp-json/ponce-demos/v2/${path}`, {
        method: "POST",
        "Access-Control-Allow-Origin": "*",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      return response;
    } catch (e) {
      alert(e);
    }
  },
};