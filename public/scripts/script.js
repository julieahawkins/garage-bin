const storedGarages = [];

const fetchData = async () => {
  let garages = await fetch('/api/v1/garages');
  garages = await garages.json();

  let items = await fetch('/api/v1/items');
  items = await items.json();

  populateGarages(garages.garages, items.items);
};

const populateGarages = (garages, items) => {
  garages.forEach(garage => {
    storedGarages.push({ ...garage, items: [] });
    appendGarage(garage);
  });

  items.forEach((item) => {
    storedGarages.forEach(garage => {
      if (item.garage_id === garage.id) {
        garage.items.push(item)
      }
    })
    appendItems(item);
  });
  console.log(storedGarages);
};

const appendGarage = (garage) => {
  $('.garages').append(
    `<div class="garage" id="garage-${garage.id}">
      <h3 class="garage-name">${garage.name}</h3>
      <div class="garage-door"> 
      </div>
      <div class="shelves shelf-1"></div>
      <div class="shelves shelf-2"></div>
      <div class="shelves shelf-3"></div>
      <div class="shelves shelf-4"></div>
      <div class="shelves shelf-5"></div>
      <div class="shelves shelf-6"></div>
      <div class="shelves shelf-7"></div>
      <div class="shelves shelf-8"></div>
      <div class="shelves shelf-9"></div>
    </div>`
  )
};

const appendItems = (item, index) => {
  const shelfNum = storedGarages[item.garage_id - 1].items.length;
  
  $(`#garage-${item.garage_id} .shelf-${shelfNum}`).append(
    `<p>${item.name}</p>`
  );
};

function openDoor() {
  setTimeout(() => ($(this).toggleClass('open')), 600);
};

$(document).ready(fetchData());
$('.garages').on('click', '.garage-door', openDoor);
