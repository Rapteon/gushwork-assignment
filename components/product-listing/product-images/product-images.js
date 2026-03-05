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

    // For selecting images in carousel
    this.selectedImageIdx = 0;
    this.imgUrls = [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Can add custom handling code. attributeChangedCallback()
    // will be called because we now have a static getter function called
    // observedAttributes()
    // Do something special if required here.
  }

  #setupImages = function (shadowRoot) {
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
    this.#setupZoomBox(shadowRoot, focusedImage);
  };

  #setupZoomBox = function (shadowRoot, focusedImage) {
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
}

customElements.define("product-images", ProductImages);
