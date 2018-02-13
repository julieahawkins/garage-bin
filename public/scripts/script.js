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
    `<p class="item-name">${item.name}</p>`
  );
};

function openDoor() {
  setTimeout(() => ($(this).toggleClass('open')), 600);
};

const addItem = async (event) => {
  event.preventDefault();

  const item = {
    name: $('.item-name').val(),
    reason: $('.item-name').val(),
    cleanliness: $('select').val(),
    garage_id: $('.hidden-id').text()
  }

  if(!item.name || !item.reason || !item.garage_id) {
    console.log('wrong')
  } else {
    const post = await fetch('/api/v1/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
    const result = await post.json();
    
    console.log(result);
    storedGarages.

    $('input').val('');
    closeForm();
  }
};

function seeItemDetails() {
  const garage = $(this).closest('.garage').attr('id');
  const garageID = garage[garage.length - 1];
  const match = storedGarages.find(garage => garage.id === parseInt(garageID));
  const item = match.items.find(item => item.name === $(this).text());

  $('.item-details').removeClass('none');
  $('.details-name').text(`Name: ${item.name}`);
  $('.details-reason').text(`Reason for Storage: ${item.reason}`);
  $('.details-cleanliness').val(item.cleanliness);
  // setTimeout(() => ($('.item-details').addClass('none')), 2000)
};

function openForm() {
  const garage = $(this).closest('.garage').attr('id');
  const garageID = garage[garage.length - 1];

  $('.item-form').removeClass('none');
  $('.hidden-id').replaceWith(`<p class="hidden-id" hidden>${garageID}</p>`)
};

const closeForm = () => {
  $('.item-form').addClass('none');
};

const closeDetails = () => {
  $('.item-details').addClass('none');
};

const changeItem = () => {
  console.log($('.details-cleanliness').val())
};

$(document).ready(fetchData());
$('.garages').on('click', '.garage-door', openDoor);
$('.garages').on('click', '.add-item', openForm);
$('.garages').on('click', '.item-name', seeItemDetails);
$('.add-item-btn').on('click', addItem);
$('.close').on('click', closeForm);
$('.close-details').on('click', closeDetails);
$('.change-item').on('click', changeItem);
