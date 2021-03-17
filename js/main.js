let endpointurl = getHomeUrl();
window.addEventListener("load", function () {
  let frame;
  htmlbutton = `${`<iframe name="iframe" id="iframe" src="${endpointurl}/html/ponce-demos.html"></iframe>`}`;

  function createElementFromHTML(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  frame = createElementFromHTML(htmlbutton);
  element = document.querySelector("#wpbody-content")
    ? document.querySelector("#wpbody-content")
    : document.querySelector("#page");
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

function getHomeUrl() {
  var href = paths.pluginsUrl;
  console.log(href);
  return href;
}
