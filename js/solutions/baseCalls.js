function getHomeUrl() {
  var href = window.location.href;
  var index = href.indexOf("/wp-content");
  var homeUrl = href.substring(0, index);
  return homeUrl;
}

const endpointurl = getHomeUrl();

async function wpRestApi(path) {
  let response;
  try {
    response = await fetch(`${endpointurl}/wp-json/ponceadmin/v2/${path}`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      mode: "cors",
      credentials: "include",
    });
    return response;
  } catch (e) {
    alert(e);
  }
}
