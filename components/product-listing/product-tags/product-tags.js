class ProductTags extends HTMLElement {
  //   srcset expects a space separated list of image URLs
  static get observedAttributes() {
    return ["tags"];
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    div.classList.add("tag-container");

    // Set style tag for this component
    const styleLink = document.createElement("link");
    styleLink.href = "/components/product-listing/product-tags/style.css";
    styleLink.rel = "stylesheet";
    this.shadow.appendChild(styleLink);

    this.#setupTags(div);
    this.shadow.appendChild(div);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Can add custom handling code. attributeChangedCallback()
    // will be called because we now have a static getter function called
    // observedAttributes()
    // Do something special if required here.
    if (name === "tags" && this.shadow) {
        const div = this.shadow.querySelector('div[class="tag-container"]')
        this.#setupTags(div);
    }
  }

  #setupTags = function(parentNode) {
    if (!parentNode) {
        return
    }

    // Remove existing tags if any
    for (let child of parentNode.children) {
        child.remove();
    }

    const tags = this.getAttribute("tags") ?? "";
    const tagsList = tags.split(",").map((tag) => tag.trim());
    for (let tag of tagsList) {
      const tagNode = document.createElement("div");
      tagNode.classList.add("product-tag");
      tagNode.classList.add("body-14-medium");
      if (tag.startsWith("BIS")) {
        this.#addTag("/assets/images/bis-mark.svg", tag, tagNode);
      }
      if (tag.startsWith("ISO")) {
        this.#addTag("/assets/images/isi-mark.svg", tag, tagNode);
      }
      if (tag.startsWith("CE")) {
        this.#addTag("/assets/images/ce-mark.svg", tag, tagNode);
      }

      parentNode.appendChild(tagNode);
    }
  }

  #addTag = function(imgUrl, tagText, tagNode)   {
    const img = document.createElement('img')
    img.src = imgUrl;
    tagNode.appendChild(img);
    const span = document.createElement('span');
    span.innerText = tagText;
    tagNode.appendChild(span);
  }
}

customElements.define("product-tags", ProductTags);
