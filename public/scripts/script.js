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

  populateItems(items);
};

const populateItems = (items) => {
  items.forEach((item) => {
    storedGarages.forEach(garage => {
      if (item.garage_id === garage.id) {
        garage.items.push(item)
      }
    })
    appendItems(item);
  });
  appendItemCount();
};

const appendItemCount = () => {
  const counts = storedGarages.reduce((counts, garage) => {
    const itemTypeCounts = garage.items.reduce((itemTypeCounts, item) => {
      if(!itemTypeCounts[item.cleanliness]) {
        itemTypeCounts[item.cleanliness] = 0;
      }

      itemTypeCounts[item.cleanliness]++;

      return itemTypeCounts
    }, {});

    if (!counts[garage.name]) {
      counts[garage.name] = {
        id: garage.id,
        count: garage.items.length,
        types: itemTypeCounts
      };
    } 
    return counts;
  }, {});

  storedGarages.forEach(garage => {
    $(`#garage-${counts[garage.name].id} .item-count`).append(`${counts[garage.name].count} Items Stored`);
    $(`#garage-${counts[garage.name].id} .counts-container`).append(
      `<p>${counts[garage.name].types.Sparkling || 0} Sparkling.</p>
      <p>${counts[garage.name].types.Dusty || 0} Dusty.</p>
      <p>${counts[garage.name].types.Rancid || 0} Rancid.</p>`
    )
  });
};

const appendGarage = (garage) => {
  $('.garages').append(
    `<div class="garage" id="garage-${garage.id}">
      <h3 class="garage-name">${garage.name} 
        <span class="item-count"></span>
      </h3>
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
      <div class="counts-container">
      </div>
      <div class="add-item">+ ADD ITEM</div>
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
