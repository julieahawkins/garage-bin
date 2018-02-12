const fetchData = async () => {
  console.log('getting garages')
  let garages = await fetch('/api/v1/garages');
  garages = await garages.json();

  await console.log(garages);

  console.log('getting items')
  let items = await fetch('/api/v1/items');
  items = await items.json();

  await console.log(items);
};

const openDoor = () => {
  setTimeout(() => ($('.garage-door').toggleClass('open')), 600);
};

$(document).ready(fetchData());
$('.garage-door').on('click', openDoor);