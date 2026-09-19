function getItems() {
  const item = document.querySelector("#item");
  const price = document.querySelector("#price");
  const numericPrice = price.value * 100;

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price.value);

  const items = getStorage("items") || [];

  items.push({
    name: item.value,
    price: formattedPrice,
    numericPrice,
    id: crypto.randomUUID(),
  });

  setStorage("items", items);
}

function createCard() {
  const cardContainer = document.querySelector("#card-container");
  const items = getStorage("items") || [];

  cardContainer.appendChild(createElement(items.at(-1)));
}

function getCards() {
  const cardContainer = document.querySelector("#card-container");

  if (cardContainer.children.length === 0) {
    getPlaceholder();
  }

  const savedItems = getStorage("items") || [];

  savedItems.forEach((item) => {
    cardContainer.appendChild(createElement(item));
  });
}

function createElement(item) {
  const card = document.createElement("div");
  const cardInfo = document.createElement("div");

  const itemName = document.createElement("p");
  const itemPrice = document.createElement("p");
  const deleteItem = document.createElement("button");

  itemName.textContent = item.name;
  itemPrice.textContent = item.price;

  itemName.className = "itemName";
  itemPrice.className = "itemPrice";

  deleteItem.textContent = "Excluir";
  deleteItem.onclick = function () {
    removeItem(item.id);
    getTotal();
  };

  cardInfo.appendChild(itemName);
  cardInfo.appendChild(itemPrice);

  card.appendChild(cardInfo);
  card.appendChild(deleteItem);

  card.item = item;
  card.className = "card";
  card.id = item.id;
  card.draggable = true;

  document.querySelector("#placeholder")?.remove();

  return card;
}

function removeItem(id) {
  const savedItems = getStorage("items") || [];
  const newStorage = savedItems.filter((item) => item.id !== id);

  setStorage("items", newStorage);
  document.querySelector(`[id="${id}"]`).remove();

  if (newStorage.length === 0) {
    getPlaceholder();
  }
}

function getTotal() {
  const savedItems = getStorage("items") || [];
  const totalElement = document.querySelector("#total");
  let totalAmount = 0;

  for (let i = 0; i < savedItems.length; i++) {
    totalAmount += savedItems[i].numericPrice;
  }

  totalElement.innerHTML =
    "Total: " +
    (totalAmount / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
}

function getPlaceholder() {
  const cardContainer = document.querySelector("#card-container");
  const placeholder = document.createElement("p");

  placeholder.innerHTML = "Nenhum item cadastrado";
  placeholder.id = "placeholder";

  cardContainer.appendChild(placeholder);
}

function setStorage(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

function getStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function saveItemOrder() {
  const cards = document.querySelectorAll(".card");
  const sortedItems = [];

  cards.forEach((card) => {
    sortedItems.push(card.item);
  });

  setStorage("items", sortedItems);
}

function handleDrag() {
  const cardContainer = document.querySelector("#card-container");

  let dragged = null;

  cardContainer.addEventListener("dragstart", (event) => {
    const card = event.target.closest(".card");

    if (!card) return;

    dragged = card;
  });

  cardContainer.addEventListener("dragover", (event) => {
    const card = event.target.closest(".card");

    if (!card) return;

    const targetRect = card.getBoundingClientRect();
    const draggedRect = dragged.getBoundingClientRect();

    if (draggedRect.top > targetRect.top) {
      cardContainer.insertBefore(dragged, card);
    } else {
      cardContainer.insertBefore(card, dragged);
    }
  });

  cardContainer.addEventListener("dragend", saveItemOrder);
}

function handleClick() {
  getItems();
  createCard();
  getTotal();
}

document.addEventListener("DOMContentLoaded", () => {
  getCards();
  getTotal();
  handleDrag();

  document.querySelector("#add").addEventListener("click", handleClick);
});
