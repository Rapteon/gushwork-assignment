class PageHeader extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.appendChild(document.importNode(getStyleNode("/styles.css"), true));
    shadowRoot.appendChild(
      document.importNode(getStyleNode("/components/page-header/style.css"), true),
    );

    // Fetch template content
    const templateContent = await fetchTemplateContent(
      "/components/page-header/template.html",
    );

    let parser = new DOMParser();
    let templateDoc = parser.parseFromString(templateContent, "text/html");

    const header = templateDoc.querySelector("header");
    shadowRoot.appendChild(document.importNode(header, true));

    this.#setupProductDropdown(shadowRoot);
  }

  // For product drop-down navigation in header.
  #setupProductDropdown = function (shadowRoot) {
    const productNavData = [
      new NavData("/products/two-for-one-twister.html", "Two For One Twister"),
      new NavData(
        "/products/tprs-twister-machine.html",
        "TPRS Twister Machine",
      ),
      new NavData(
        "/products/ring-twisting-machines.html",
        "Ring Twisting Machines",
      ),
      new NavData("/products/covering-machines.html", "Covering Machines"),
      new NavData(
        "/products/heat-setting-equipment.html",
        "Heat Setting Equipment",
      ),
      new NavData(
        "/products/servo-controlled-winders",
        "Servo Controlled Winders",
      ),
    ];
    const productDropdown = shadowRoot.querySelector(
      'div[class="product-dropdown"]',
    );
    const productDropdownText = productDropdown.querySelector("p");
    const productList = productDropdown.querySelector("ul");
    for (let navData of productNavData) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = navData.url;
      a.textContent = navData.text;
      li.appendChild(a);
      productList.appendChild(li);
    }
    productList.classList.add("hidden");
    productDropdown.addEventListener("click", () => {
      productList.classList.toggle("hidden");
      productDropdownText.classList.toggle("dropdown-caret-unopened");
      productDropdownText.classList.toggle("dropdown-caret-opened");
    });
    productDropdownText.classList.toggle("dropdown-caret-unopened");
  };
}

customElements.define("page-header", PageHeader);
