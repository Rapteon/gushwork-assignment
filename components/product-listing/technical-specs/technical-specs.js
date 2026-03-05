class TechnicalSpecs extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.json = {};
    const div = document.createElement("div");
    div.classList.add("technical-specs");

    // Fetch template content
    fetch("/components/product-listing/technical-specs/template.html").then(
      (response) => {
        if (response.ok) {
          response.text().then((text) => {
            div.innerHTML = text;
            this.shadow.appendChild(document.importNode(div, true));
            this.#populateTable(this.shadow);
          });
        } else {
          div.textContent = "Please check path to template in component";
          this.shadow.appendChild(div);
        }
      },
    );

    // Fetch styles
    const styleLink = document.createElement("link");
    styleLink.href = "/components/product-listing/technical-specs/style.css";
    styleLink.rel = "stylesheet";
    this.shadow.appendChild(styleLink);
  }

  set data(json) {
    this.json = json;
    this.#populateTable(this.shadow, this.json);
  }

  #populateTable = function (shadowRoot, jsonSpecs) {
    const tbody = shadowRoot.querySelector("tbody");
    if (!tbody) return;
    if (!jsonSpecs) {
      return;
    }

    // Clear existing rows
    tbody.innerHTML = "";
    try {
      Object.entries(jsonSpecs).forEach(([parameter, specification]) => {
        console.log(specification);
        const tr = document.createElement("tr");

        const tdParameter = document.createElement("td");
        tdParameter.textContent = parameter;

        const tdSpecification = document.createElement("td");
        if (parameter == "Country of Origin") {
          this.#getCountry(tdSpecification, specification);
        } else {
          tdSpecification.textContent = specification;
        }

        tr.appendChild(tdParameter);
        tr.appendChild(tdSpecification);
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error parsing technicalSpecs:", error);
    }
  };

  #getCountry(tdSpecification, countryName) {
    if (countryName === "IN") {
      tdSpecification.textContent = "India";
      tdSpecification.classList.add("country-in");
    }
  }
}

customElements.define("technical-specs", TechnicalSpecs);
