class ProductImages extends HTMLElement {
  //   srcset expects a space separated list of image URLs
  static get observedAttributes() {
    return ["srcset"];
  }
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    // Add common styles.
    shadow.appendChild(getStyleNode("/styles.css"));
    // Add component-specific styles
    shadow.appendChild(
      getStyleNode("/components/product-listing/product-images/style.css"),
    );

    const templateContent = await fetchTemplateContent(
      "/components/product-listing/product-images/template.html",
    );

    let parser = new DOMParser();
    let templateDoc = parser.parseFromString(templateContent, "text/html");

    const div = templateDoc.querySelector("div");

    // For selecting images in carousel
    this.selectedImageIdx = 0;
    this.imgUrls = [];

    shadow.appendChild(document.importNode(div, true));
    this.#updateImages(shadow);
    this.#setupClickListeners(shadow);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Can add custom handling code. attributeChangedCallback()
    // will be called because we now have a static getter function called
    // observedAttributes()
    // Do something special if required here.
    if (name === "srcset" && this.shadowRoot) {
      this.#updateImages(this.shadowRoot);
    }
  }

  #setupClickListeners(shadowRoot) {
    // Add click listener for next/prev image functionality
    const leftBtn = shadowRoot.querySelector(".left-btn");
    const rightBtn = shadowRoot.querySelector(".right-btn");

    if (leftBtn) {
      leftBtn.addEventListener("click", () => {
        this.previousImage(shadowRoot);
      });
    }

    if (rightBtn) {
      rightBtn.addEventListener("click", () => {
        this.nextImage(shadowRoot);
      });
    }
  }
  setupZoomBox = function (focusedImage) {
    const zoomBox = document.createElement("div");
    zoomBox.className = "zoom-box";
    focusedImage.parentElement.appendChild(zoomBox);

    focusedImage.addEventListener("mousemove", (e) => {
      const rect = focusedImage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      zoomBox.style.backgroundImage = `url(${focusedImage.src})`;
      zoomBox.style.backgroundPosition = `${-x * 2}px ${-y * 2}px`;
      zoomBox.style.display = "block";
      focusedImage.style.cursor = "zoom-in";
    });

    focusedImage.addEventListener("mouseleave", () => {
      zoomBox.style.display = "none";
    });
  };

  #updateImages = function (shadowRoot) {
    const allImagesCarousel = shadowRoot.querySelector(
      'ul[class="product-images-list"]',
    );
    const srcset = this.getAttribute("srcset") ?? "";
    this.imgUrls = srcset.split(" ") ?? [""]; // fills a single blank URL if no srcset provided.

    // Delete existing li elements, if any
    for (let i = 0; i < allImagesCarousel?.children?.length; i++) {
      allImagesCarousel.removeChild(allImagesCarousel.children[i]);
    }

    this.imgUrls.forEach((imgUrl, idx) => {
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
    // Add zoom box functionality
    this.setupZoomBox(focusedImage);
  };

  nextImage = function (shadowRoot) {
    if (
      this.imgUrls.length === 0 ||
      this.selectedImageIdx === this.imgUrls.length - 1
    ) {
      return;
    }
    this.selectedImageIdx += 1;
    const focusedImage = shadowRoot.querySelector(
      'img[class="product-image-focused"]',
    );
    focusedImage.src = this.imgUrls[this.selectedImageIdx];
  };

  previousImage = function (shadowRoot) {
    if (this.imgUrls.length === 0 || this.selectedImageIdx == 0) {
      return;
    }
    this.selectedImageIdx -= 1;
    const focusedImage = shadowRoot.querySelector(
      'img[class="product-image-focused"]',
    );
    focusedImage.src = this.imgUrls[this.selectedImageIdx];
  };
}

customElements.define("product-images", ProductImages);
