class NavBreadcrumbs extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    // Create HTML element
    const nav = document.createElement("nav");
    nav.classList.add("breadcrumb-navigation");
    nav.classList.add("body-14-regular");
    const ol = document.createElement("ol");
    nav.appendChild(ol);
    shadow.appendChild(nav, true);

    // Set common styles. Didn't use a <link> tag because of limitations with setting path.
    // Used in multiple places, maybe refactor later. TODO
    fetch("/styles.css").then((response) => {
      if (response.ok) {
        const style = document.createElement("style");
        response.text().then((data) => {
          style.textContent = data;
        });
        shadow.appendChild(style);
      }
    });

    // Fetch styles
    // Used in multiple places, maybe refactor later. TODO
    const styleLink = document.createElement("link");
    styleLink.href = "/components/nav-breadcrumbs/style.css";
    styleLink.rel = "stylesheet";
    shadow.appendChild(styleLink);

    // Setup data
    this.#updateData(this);
  }

  #updateData = function (element) {
    const shadowRoot = element.shadowRoot;
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
