import NewData from "./mook.js";

let wrapper = document.querySelector(".wrapper");
let meatBtn = document.getElementById("meatBtn");

const ReadFunction = (data) => {
  wrapper.innerHTML = "";
  data.map((v) => {
    let div = document.createElement("div");
    div.innerHTML = `<img src="${v.img}" alt=""> <p>${v.name}</p>`;
    wrapper.appendChild(div);
  });
};

ReadFunction(NewData.All);

const FilterByMeatCattegory = () => {
  wrapper.innerHTML = "";
  ReadFunction(NewData.Meat);
};

meatBtn.addEventListener("click", FilterByMeatCattegory);

let cardBascket = [];
const renderPizzas = (data) => {
  wrapper.innerHTML = "";
  data.forEach((pizza) => {
    const div = document.createElement("div");
    div.classList.add("pizza-item");
    div.innerHTML = `
        <img src="${pizza.img}" alt="${pizza.name}">
        <p>${pizza.name}</p>`;

    let add_btn = document.createElement("button");
    add_btn.innerText = "В корзину";
    div.appendChild(add_btn);
    wrapper.appendChild(div);

    add_btn.addEventListener("click", () => {
      cardBascket.push(pizza);
      console.log(pizza);

      localStorage.setItem;
    });
  });
};
