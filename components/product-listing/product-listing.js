class ProductListing extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    // Add script tags for components used by this class.
    let dependencies = [
      "/components/product-listing/product-images/product-images.js",
      "/components/product-listing/product-tags/product-tags.js",
      "/components/product-listing/technical-specs/technical-specs.js",
    ];
    loadComponents(dependencies, shadow);

    // Fetch template
    const templateContent = await fetchTemplateContent(
      "/components/product-listing/template.html",
    );

    const parser = new DOMParser();
    const templateDoc = parser.parseFromString(templateContent, "text/html");

    const div = templateDoc.querySelector(".product-listing-container");

    shadow.appendChild(document.importNode(div, true));

    this.#loadData(shadow);
  }

  #loadData = function (shadowRoot) {
    fetch(this.getAttribute("dataSrc"))
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

        // const stickyHeader = shadowRoot.querySelector("sticky-header");
        // stickyHeader.setAttribute("title", json["title"]);
        // stickyHeader.setAttribute("imgSrc", json["imgSet"][0] ?? "");
        // stickyHeader.setAttribute("priceRange", json["priceRange"]);

        // const technicalSpecs = shadowRoot.querySelector("technical-specs");
        // technicalSpecs.data = json["technicalSpecs"];
      });
  };
}

customElements.define("product-listing", ProductListing);
