const fetchData = async () => {
  console.log('getting garages')
  let garages = await fetch('/api/v1/garages');
  garages = await garages.json();

  console.log('getting items')
  let items = await fetch('/api/v1/items');
  items = await items.json();

  populateGarages(garages.garages, items.items);
};

const populateGarages = (garages, items) => {
  console.log(garages);
  console.log(items);

  garages.forEach(garage => {
    appendGarage(garage);
  });
};

const appendGarage = (garage) => {
  console.log(garage.id)
  $('.garages').append(
    `<div class="garage">
      <h3 class="garage-name">${garage.name}</h3>
      <div class="garage-door"> 
      </div>
      <div class="shelves shelf-3"></div>
      <div class="shelves shelf-2"></div>
      <div class="shelves shelf-1"></div>
    </div>`
  )
};

function openDoor() {
  console.log(this)
  setTimeout(() => ($(this).toggleClass('open')), 600);
};

$(document).ready(fetchData());
$('.garages').on('click', '.garage-door', openDoor);
