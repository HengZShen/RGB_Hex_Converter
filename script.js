// 基礎版 :　https://codepen.io/HenryTaro/pen/RwGMqeN?editors=1011 (修改JS，但HTML命名尚未修正)

// read list from localStorage

function readLocal() {
  const list = JSON.parse(localStorage.getItem("favoriteColor")) || [];
  console.log(list);
  for (const key in list) {
    console.log(key);
    console.log(list[key]);
    addtoLocal(list[key]);
  }
}

function addtoLocal(value) {
  const tbody = document.querySelector(".palette table tbody");
  let htmlContent = " ";
  htmlContent += `<tr>
        <td>
          <div class='num'></div>
          <div class="preview"></div><i class="fas fa-trash-alt"></i>
        </td>
      </tr>`;
  tbody.innerHTML += htmlContent;
  const trLength = document.querySelectorAll(".palette table tbody tr").length;
  document.querySelectorAll(".palette tbody tr .num")[
    trLength - 1
  ].innerText = value;
  document.querySelectorAll(".palette tbody tr .preview")[
    trLength - 1
  ].style.background = value;
}

readLocal();

// section 1 -----------show RGB when Input----------------
// add listener
const container = document.querySelector(".container");
container.addEventListener("input", showRGB);

// show RGB when Input
function showRGB() {
  let target = event.target;
  if (target.matches(".rgb-input")) {
    const value = target.value;
    target.nextElementSibling.innerText = value;
    sendToHex();
  }
}

// section 2 ---------------convert RGB to HexInputBar -------------------------

// transport Hex number to inputBar
function sendToHex() {
  let hexCode = "";
  // gather input from three individual inputBar
  const valueR = document.querySelector(".input-red").value;
  const valueG = document.querySelector(".input-green").value;
  const valueB = document.querySelector(".input-blue").value;

  hexCode = rgb2Hex(valueR, valueG, valueB);
  // change input value
  const hexBar = document.querySelector("#hex-input");
  hexBar.value = hexCode;

  // change hex Color
  document.querySelector("body").style.background = hexCode;
}

// function RGB to  HEX
function rgb2Hex(valueR, valueG, valueB) {
  let rgb = [
    parseInt(valueR).toString(16),
    parseInt(valueG).toString(16),
    parseInt(valueB).toString(16)
  ];

  rgb = rgb.map((element) => {
    if (element.length !== 2) {
      element = "0" + element;
    }
    return element;
  });

  // // reduce 1
  // const reducer = (accumulator,currentValue)=>accumulator + currentValue
  // rgb = rgb.reduce(reducer)

  // reduce 2
  rgb = rgb.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    "#"
  );

  return rgb;
}

//section 3 ----------- when input  change color and slider

container.addEventListener("input", showHex);
function showHex() {
  let target = event.target;
  if (target.matches("#hex-input")) {
    const hexInput = document.querySelector("#hex-input");
    const value = hexInput.value;

    if (checkHex(value)) {
      document.querySelector("body").style.background = value;
      sendToRGB(value);
    } else {
      document.querySelector("body").style.background = "black";
    }
  }
}

// send to RGB
function sendToRGB(value) {
  let rgbCode = rgbChange(value.slice(1));
  document.querySelector(".input-red").value = rgbCode[0];
  document.querySelector(".input-green").value = rgbCode[1];
  document.querySelector(".input-blue").value = rgbCode[2];
  document.querySelector(".show-red").innerText = rgbCode[0];
  document.querySelector(".show-green").innerText = rgbCode[1];
  document.querySelector(".show-blue").innerText = rgbCode[2];
}

// change hexCode to rgbCode
function rgbChange(str) {
  let rgbRed, rgbGre, rgbBlu;

  rgbRed = parseInt(
    "0X" + (str.length === 3 ? str[0].repeat(2) : str[0] + str[1])
  );
  rgbGre = parseInt(
    "0X" + (str.length === 3 ? str[1].repeat(2) : str[2] + str[3])
  );
  rgbBlu = parseInt(
    "0X" + (str.length === 3 ? str[2].repeat(2) : str[4] + str[5])
  );

  return [rgbRed.toString(), rgbGre.toString(), rgbBlu.toString()];
}

// check Hex valid
function checkHex(str) {
  let reg = /^#[A-F\da-f]{6}$|^#[A-F\da-f]{3}$/;
  let check = reg.test(str);
  return check;
}

// section 4 --------------- my Favorite list  -----------------

container.addEventListener("click", addToPalette);

// part 1 : push button add to Palette
function addToPalette() {
  let target = event.target;
  if (target.matches("#add-favorite")) {
    const hexInput = document.querySelector("#hex-input");
    const value = hexInput.value;
    if (checkHex(value)) {
      addFavorite(extendText(value));
    }
  }
}

// extend #f12 => #ff1122
function extendText(str) {
  if (str.length === 4) {
    str = str[0] + str[1] + str[1] + str[2] + str[2] + str[3] + str[3];
  }
  return str;
}

// add Favorite
function addFavorite(value) {
  // add to localStorage
  const list = JSON.parse(localStorage.getItem("favoriteColor")) || [];
  const color = value;
  if (list.some((color) => color === value)) {
    return alert("already favorite");
  }
  list.push(value);
  localStorage.setItem("favoriteColor", JSON.stringify(list));
  // show in list
  const tbody = document.querySelector(".palette table tbody");
  let htmlContent = " ";
  htmlContent += `<tr>
        <td>
          <div class='num'></div>
          <div class="preview"></div><i class="fas fa-trash-alt"></i>
        </td>
      </tr>`;
  tbody.innerHTML += htmlContent;
  const trLength = document.querySelectorAll(".palette table tbody tr").length;
  document.querySelectorAll(".palette tbody tr .num")[
    trLength - 1
  ].innerText = value;
  document.querySelectorAll(".palette tbody tr .preview")[
    trLength - 1
  ].style.background = value;
}

// part 2 : delete
const palette = document.querySelector(".palette");
palette.addEventListener("click", deleteFavorite);

function deleteFavorite() {
  let target = event.target;
  if (target.matches(".fa-trash-alt")) {
    const color = target.parentElement.children[0].innerText;

    // remove from localStorage
    const list = JSON.parse(localStorage.getItem("favoriteColor"));
    const site = list.indexOf(color);
    list.splice(site, 1);

    //refresh List
    localStorage.setItem("favoriteColor", JSON.stringify(list));

    // remove from list
    target.parentElement.parentElement.remove();
  }
}

// part 3 : click square to change background, slider and hexinput

palette.addEventListener("click", review);

function review() {
  let target = event.target;
  if (target.matches(".preview")) {
    const value = target.parentElement.children[0].innerText;
    document.querySelector("body").style.background = value;
    document.querySelector("#hex-input").value = value;
    sendToRGB(value);
  }
}
