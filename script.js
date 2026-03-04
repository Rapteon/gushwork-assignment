/**
 * Represents data which can be used for navigation
 * between pages or components.
 *
 * @class
 */
class NavData {
  constructor(url, text) {
    this.url = url;
    this.text = text;
  }
}

// For product drop-down navigation in header.
function setupProductDropdown() {
  const productNavData = [
    new NavData("products/two-for-one-twister", "Two For One Twister"),
    new NavData("products/tprs-twister-machine", "TPRS Twister Machine"),
    new NavData("products/ring-twisting-machines", "Ring Twisting Machines"),
    new NavData("products/covering-machines", "Covering Machines"),
    new NavData("products/heat-setting-equipment", "Heat Setting Equipment"),
    new NavData(
      "products/servo-controlled-winders",
      "Servo Controlled Winders",
    ),
  ];
  const productDropdown = document.querySelector(
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
}

function setupBreadcrumbNavigation() {
  function getTextFromFilename(str) {
    str = str.substring(0, str.indexOf("."));
    str = str.replaceAll("-", " ");
    str = str
      .split(" ")
      .map((val) => {
        if (val != "") {
          return val.charAt(0).toUpperCase() + val.substring(1);
        } else {
          return val;
        }
      })
      .join(" ");
    return str;
  }
  function getNavDataArr() {
    let pageUrl = window.location.href;
    pageUrl = pageUrl.substring(pageUrl.lastIndexOf("//") + 2);
    urlSegments = pageUrl.split("/").slice(1);
    console.log(urlSegments);
    let navSegments = urlSegments.map((value, idx) => {
      if (idx != urlSegments.length - 1) {
        value = value.charAt(0).toUpperCase() + value.substring(1);
        return new NavData("#", value);
      } else {
        let text = getTextFromFilename(value);
        return new NavData(urlSegments.slice(0, idx + 1).join("/"), text);
      }
    });
    return navSegments;
  }
  let navDataArr = getNavDataArr();
  const navList = document.querySelector(
    'nav[class="breadcrumb-navigation"] > ol',
  );
  for (let navData of navDataArr) {
    const li = document.createElement("li");
    li.textContent = navData.text;
    navList.appendChild(li);
  }
}
// Call functions to setup page.

setupProductDropdown();
setupBreadcrumbNavigation();
