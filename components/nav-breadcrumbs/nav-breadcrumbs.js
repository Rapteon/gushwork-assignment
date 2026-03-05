class NavBreadcrumbs extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Add common styles.
    shadowRoot.appendChild(getStyleNode("/styles.css"));
    // Add component-specific styles
    shadowRoot.appendChild(
      getStyleNode("/components/nav-breadcrumbs/style.css"),
    );

    const templateContent = await fetchTemplateContent(
      "/components/nav-breadcrumbs/template.html",
    );

    let parser = new DOMParser();
    let templateDoc = parser.parseFromString(templateContent, "text/html");

    const nav = templateDoc.querySelector("nav");

    shadowRoot.appendChild(document.importNode(nav, true));

    // Update data
    this.#updateData(shadowRoot);
  }

  #updateData = function (shadowRoot) {
    function getTextFromFilename(str) {
      str = str.substring(0, str.indexOf("."));
      str = str.replaceAll("-", " ");
      str = str
        .split(" ")
        .map((val) => {
          if (val != "") {
            return val.charAt(0).toUpperCase() + val.substring(1);
          } else {
            return val;
          }
        })
        .join(" ");
      return str;
    }
    function toTitleCase(str) {
      if (str === "") {
        return;
      }
      return str.charAt(0).toLocaleUpperCase() + str.substring(1);
    }

    function getURLSegments() {
      let pageUrl = window.location.href;
      pageUrl = pageUrl.substring(pageUrl.lastIndexOf("//") + 2);
      return pageUrl.split("/").slice(1);
    }

    function getNavDataArr() {
      let urlSegments = getURLSegments();
      let navSegments = urlSegments.map((value, idx) => {
        if (idx != urlSegments.length - 1) {
          value = toTitleCase(value);
          return new NavData("#", value);
        } else {
          // Last segment is expected to be a filename.
          let text = getTextFromFilename(value);
          return new NavData(urlSegments.slice(0, idx + 1).join("/"), text);
        }
      });
      return navSegments;
    }
    let navDataArr = getNavDataArr();
    const navList = shadowRoot.querySelector("ol");
    for (let navData of navDataArr) {
      const li = document.createElement("li");
      li.textContent = navData.text;
      navList.appendChild(li);
    }
  };
}

customElements.define("nav-breadcrumbs", NavBreadcrumbs);
