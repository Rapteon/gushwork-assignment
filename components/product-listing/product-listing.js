class ProductListing extends HTMLElement {
  static get observedAttributes() {
    return [
      "dataPath", // URL to file having the required product details.
    ];
  }
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    div.classList.add("product-listing-container");

    // Add script tags for components used by this class.
    let uses = [
      "/components/product-listing/product-images/product-images.js",
      "/components/product-listing/product-tags/product-tags.js",
      "/components/product-listing/technical-specs/technical-specs.js",
    ];
    for (let use of uses) {
      const script = document.createElement("script");
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
        const productImages = shadowRoot.querySelector("product-images");
        productImages.setAttribute("srcset", json["imgSet"].join(" "));

        const productTags = shadowRoot.querySelector("product-tags");
        productTags.setAttribute("tags", json["tags"].join(","));

        const title = shadowRoot.querySelector("h2");
        title.innerText = json["title"];

        const featuresList = shadowRoot.querySelector(".product-features");
        json["features"].forEach((feature) => {
          const li = document.createElement("li");
          li.innerText = feature;
          featuresList.appendChild(li);
        });

        const priceRange = shadowRoot.querySelector(".price-range-value");
        priceRange.innerText = json["priceRange"];

        const stickyHeader = shadowRoot.querySelector("sticky-header");
        stickyHeader.setAttribute("title", json["title"]);
        stickyHeader.setAttribute("imgSrc", json["imgSet"][0] ?? "");
        stickyHeader.setAttribute("priceRange", json["priceRange"]);

        const technicalSpecs = shadowRoot.querySelector("technical-specs");
        technicalSpecs.data = json["technicalSpecs"];
      });
  };
}

customElements.define("product-listing", ProductListing);
