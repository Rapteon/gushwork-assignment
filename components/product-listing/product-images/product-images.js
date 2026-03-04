class ProductImages extends HTMLElement {
  //   srcset expects a space separated list of image URLs
  static get observedAttributes() {
    return ["srcset"];
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");

    // Fetch template content
    fetch("/components/product-listing/product-images/template.html").then(
      (response) => {
        if (response.ok) {
          response.text().then((text) => {
            div.innerHTML = text;
            this.shadow.appendChild(document.importNode(div, true));
            this.#setupImages(this.shadow);
          });
        } else {
          div.textContent = "Please check path to template in component";
        }
      },
    );

    // Fetch styles
    const styleLink = document.createElement("link");
    styleLink.href = "/components/product-listing/product-images/style.css";
    styleLink.rel = "stylesheet";
    this.shadow.appendChild(styleLink);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Can add custom handling code. attributeChangedCallback()
    // will be called because we now have a static getter function called
    // observedAttributes()
    // Do something special if required here.
    if (name === "srcset") {
      if (this.shadow) {
        this.#setupImages(this.shadow);
      }
    }
  }

  #setupImages = function (shadowRoot) {
    const allImagesCarousel = shadowRoot.querySelector(
      'ul[class="product-images-list"]',
    );
    const srcset = this.getAttribute("srcset") ?? "";
    const imgUrls = srcset.split(" ") ?? [];

    imgUrls.forEach((imgUrl, idx) => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      img.id = `product-image-${idx}`;
      if (imgUrl != "") {
        img.src = imgUrl;
        img.alt = `product image ${idx}`;
      } else {
        img.classList.add("blank-image");
      }
      img.classList.add("unfocused-image");
      li.appendChild(img);
      allImagesCarousel.appendChild(li);
    });

    const focusedImage = shadowRoot.querySelector(
      'img[class="product-image-focused"]',
    );
    const firstImage = shadowRoot.querySelector(
      'ul[class="product-images-list"] > li:first-of-type > img',
    );
    if (firstImage) {
      focusedImage.src = firstImage.src;
    }
  };
}

customElements.define("product-images", ProductImages);
