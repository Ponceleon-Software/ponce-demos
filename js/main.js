let endpointurl = getHomeUrl();
window.addEventListener("load", function () {
  let frame;
  htmlbutton = `${`<iframe name="iframe" id="iframe" src="${endpointurl}/wp-content/plugins/Ponce-admin/html/ponce-admin.html"></iframe>`}`;

  function createElementFromHTML(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  frame = createElementFromHTML(htmlbutton);
  element = document.querySelector("#wpbody-content");
  element.appendChild(frame);
  let iframe = document.getElementById("iframe");
  iframe.addEventListener("load", function (e) {
    const documentIframe = iframe.contentWindow.document;
    const changeIframe = function () {
      if (iframe.style.width != "100vw") {
        iframe.style.width = "100vw";
        iframe.style.top = "0";
        iframe.style.marginTop = "0";
        iframe.style.height = "100%";
      } else {
        setTimeout(function () {
          iframe.style = null;
        }, 350);
      }
    };
    let p_button = [
      documentIframe.getElementById("pa-button-fixed"),
      documentIframe.getElementById("pa-cubierta"),
    ];
    p_button.forEach((value) => value.addEventListener("click", changeIframe));
  });
});

/*/Ruta dinámica implementada (kindof, falta testear fuera de wp-admin)
async function wpRestApi() {
  let response;
  try {
    //topbar es para mostrar o quitar el topbar
    response = await fetch(`${endpointurl}/wp-json/ponceadmin/v2/settings`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      mode: "cors",
      credentials: "include",
    });
    let data = await response.json();
    return data;
  } catch (e) {
    alert(e);
  }
}

let result = wpRestApi();
result.then((r) => {
  console.log(r);
});*/

function getHomeUrl() {
  var href = window.location.href;
  var index = href.indexOf("/wp-admin");
  var homeUrl = href.substring(0, index);
  return homeUrl;
}
