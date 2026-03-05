class StickyHeader extends HTMLElement {
  static get observedAttributes() {
    return ["title", "imgSrc", "priceRange"];
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("table");
    div.classList.add("sticky-header");

    // Fetch template content
    fetch("/components/product-listing/sticky-header/template.html").then(
      (response) => {
        if (response.ok) {
          response.text().then((text) => {
            div.innerHTML = text;
            this.shadow.appendChild(document.importNode(div, true));
          });
        } else {
          div.textContent = "Please check path to template in component";
          this.shadow.appendChild(div);
        }
      },
    );

    // Fetch styles
    const styleLink = document.createElement("link");
    styleLink.href = "/components/product-listing/sticky-header/style.css";
    styleLink.rel = "stylesheet";
    this.shadow.appendChild(styleLink);

    // Set up intersection observer to make it sticky when scrolled past
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            this.classList.add("sticky");
          } else {
            this.classList.remove("sticky");
          }
        });
      },
      { threshold: 0 },
    );
    observer.observe(this);
  }
}

customElements.define("sticky-header", StickyHeader);
