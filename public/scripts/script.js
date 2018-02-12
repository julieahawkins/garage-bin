const openDoor = () => {
  console.log('open sesame')
  setTimeout(() => ($('.garage-door').toggleClass('open')), 600);
};

$('.garage-door').on('click', openDoor);