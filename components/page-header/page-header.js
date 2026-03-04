class PageHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const header = document.createElement("header");

    // Fetch template
    fetch("/components/page-header/template.html").then((response) => {
      if (response.ok) {
        response.text().then((value) => {
          header.innerHTML = value;
          shadow.appendChild(document.importNode(header, true));
          this.#setupProductDropdown(shadow);
        });
      } else {
        header.innerHTML = `Please check path to template in page-header component`;
      }
    });

    // Set common styles. Didn't use a <link> tag because of limitations with setting path.
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
    const styleLink = document.createElement("link");
    styleLink.href = "/components/page-header/style.css";
    styleLink.rel = "stylesheet";
    shadow.appendChild(styleLink);
  }

  // For product drop-down navigation in header.
  #setupProductDropdown = function (shadowRoot) {
    const productNavData = [
      new NavData("products/two-for-one-twister.html", "Two For One Twister"),
      new NavData("products/tprs-twister-machine.html", "TPRS Twister Machine"),
      new NavData(
        "products/ring-twisting-machines.html",
        "Ring Twisting Machines",
      ),
      new NavData("products/covering-machines.html", "Covering Machines"),
      new NavData(
        "products/heat-setting-equipment.html",
        "Heat Setting Equipment",
      ),
      new NavData(
        "products/servo-controlled-winders",
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
