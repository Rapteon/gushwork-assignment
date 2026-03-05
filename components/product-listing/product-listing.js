class ProductListing extends HTMLElement {
  static getobservedAttributes = [
    "dataPath", // URL to file having the required product details.
  ];
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");

    // Add script tags for components used by this class.
    let uses = ["/components/product-listing/product-images/product-images.js"]
    for (let use of uses) {
      const script = document.createElement('script');
      script.src = use;
      shadow.appendChild(script);
    }
    
    // Fetch template
    // Can be refactored later into a function which appends
    // a noed by fetching innerHTML from a template at a specific path
    // and then appending the node to the provided shadowroot. TODO
    fetch("/components/product-listing/template.html").then((response) => {
      if (response.ok) {
        response.text().then((value) => {
          div.innerHTML = value;
          shadow.appendChild(document.importNode(div, true));
          this.#loadData(shadow);
        });
      } else {
        header.innerHTML = `Please check path to template in component`;
      }
    });
  }

  #loadData = function (shadowRoot) {
    fetch("/data/two-for-one-twister.json")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((json) => {
        console.log(json);
        const productImages = shadowRoot.querySelector("product-images");
        productImages.setAttribute("srcset", json["imgSet"].join(" "));
        console.log(productImages);
      });
  };
}

customElements.define("product-listing", ProductListing);
