document.addEventListener("DOMContentLoaded", () => {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cartItems");
  const totalItemsElement = document.getElementById("totalItems");
  const totalPriceElement = document.getElementById("totalPrice");
  const payNowButton = document.querySelector(".pay_now");
  const orderForm = document.getElementById("orderForm");
  const messageContainer = document.getElementById("messageContainer");

  orderForm.style.display = "none";

  let inputsHidden = false;

  function showMessage(message) {
    messageContainer.innerHTML = message;
    messageContainer.style.display = "block";

    setTimeout(() => {
      messageContainer.style.display = "none";
    }, 3000);
  }

  function renderCart() {
    cartContainer.innerHTML = "";
    if (cartItems.length === 0) {
      cartContainer.innerHTML = `
              <div class="empty-cart">
                  <h1>Корзина Пуста <span>😭</span></h1>
                  <p>Давай закажи самую вкусную пиццу в React Pizza. за 30 Минут доставим, если пицца не приехала больше 30-и минут, то пицца абсолютно бесплатно. 😉</p>
                  <img src="assets/img/nnn.png" alt="" class="empty-cart-img">
              </div>
          `;
      updateSummary();
      return;
    }

    cartItems.forEach((pizza, index) => {
      const pizzaElement = document.createElement("div");
      pizzaElement.classList.add("pizza");
      pizzaElement.dataset.index = index;
      pizzaElement.innerHTML = `
              <img src=".${pizza.img}" alt="">
              <h3>${pizza.name}</h3>
              <div class='div'>
                  <button class="decrease" data-index="${index}">-</button>
                  <span class="quantity">${pizza.number}</span>
                  <button class="increase" data-index="${index}">+</button>
              </div>
              <p>${(pizza.price * pizza.number).toFixed(2)} ₺</p> 
              <button class="remove" data-index="${index}">x</button>
          `;
      cartContainer.appendChild(pizzaElement);
    });

    document.querySelectorAll(".increase").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        cartItems[index].number++;
        updateCart();
      });
    });

    document.querySelectorAll(".decrease").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        if (cartItems[index].number > 1) {
          cartItems[index].number--;
        } else {
          cartItems.splice(index, 1);
        }
        updateCart();
      });
    });

    document.querySelectorAll(".remove").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        cartItems.splice(index, 1);
        updateCart();
      });
    });

    updateSummary();
  }

  function updateSummary() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.number, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.number,
      0
    );

    totalItemsElement.textContent = `${totalItems} adet`;
    totalPriceElement.textContent = `${totalPrice.toFixed(2)} ₺`;
  }

  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    renderCart();
  }

  renderCart();

  const mersButton = document.querySelector(".mers");

  if (mersButton) {
    mersButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "/index.html";
    });
  }

  payNowButton.addEventListener("click", () => {
    if (cartItems.length === 0) {
      showMessage("Корзина Пуста, Закажи Что-то!");
      return;
    }

    orderForm.style.display = "block";

    if (inputsHidden) {
      document.getElementById("name").style.display = "block";
      document.getElementById("phone").style.display = "block";
      document.getElementById("location").style.display = "block";
      inputsHidden = false;
    }
  });

  document.getElementById("sendOrder").addEventListener("click", function () {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const location = document.getElementById("location").value;

    if (!name || !phone || !location) {
      showMessage("Пожалуйста заполните всё.");
      return;
    }

    const token = "7332653746:AAECkXtND73woqr4QxCPsSzrd_7WQMi4oaE";
    const chatId = "7538330099";

    let pizzaOrderDetails = "Sipariş edilen pizzalar:\n";
    let totalPrice = 0;
    cartItems.forEach((pizza) => {
      pizzaOrderDetails += `- ${pizza.name}: ${
        pizza.number
      } adet, fiyatı: ${pizza.price.toFixed(2)} ₺\n`;
      totalPrice += pizza.price * pizza.number;
    });

    const message = `İsim: ${name}
      \nTelefon: ${phone}
      \nLokasyon: ${location}
      \n\n${pizzaOrderDetails}
      \nToplam fiyat: ${totalPrice.toFixed(2)} ₺`;

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })
      .then((response) => {
        if (response.ok) {
          showMessage("Заказ успешно отправлен! <br><br> Приятного Аппетита!");

          document.getElementById("name").style.display = "none";
          document.getElementById("phone").style.display = "none";
          document.getElementById("location").style.display = "none";

          document.getElementById("sendOrder").style.display = "none";
          document.getElementById("cancelOrder").style.display = "none";

          cartItems.length = 0;
          localStorage.setItem("cart", JSON.stringify(cartItems));
          renderCart();
        } else {
          return response.json().then((data) => {
            console.error("Упс, Какая то ошибка.:", data);
            showMessage(`Hata: ${data.description}`);
          });
        }
      })
      .catch((error) => {
        console.error("Hata:", error);
        showMessage("Здесь явно проблемки.");
      });
  });

  document.getElementById("cancelOrder").addEventListener("click", function () {
    if (!inputsHidden) {
      document.getElementById("name").style.display = "none";
      document.getElementById("phone").style.display = "none";
      document.getElementById("location").style.display = "none";
      inputsHidden = true;
    }
  });
});
