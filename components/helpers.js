function getStyleNode(styleUrl) {
  const styleLink = document.createElement("link");
  styleLink.href = styleUrl;
  styleLink.rel = "stylesheet";
  return styleLink;
}

async function fetchTemplateContent(templateUrl) {
  const content = await fetch(templateUrl)
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        return "";
      }
    })
    .catch((err) => {
      console.error(err);
      return "";
    });

  return content;
}

function loadComponents(scriptUrls, shadowRoot) {
  for (let url of scriptUrls) {
    const script = document.createElement("script");
    script.src = url;
    script.setAttribute("defer", "");
    shadowRoot.appendChild(script);
  }
}
