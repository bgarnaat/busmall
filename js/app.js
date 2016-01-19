'use strict';


var data_name = ['bag', 'banana', 'boots', 'chair', 'cthulhu', 'dragon', 'pen', 'scissors', 'shark', 'sweep', 'tentacle', 'unicorn', 'watering can', 'wine glass'];
var data_path = ['img/bag.jpg', 'img/banana.jpg', 'img/boots.jpg', 'img/chair.jpg', 'img/cthulhu.jpg', 'img/dragon.jpg', 'img/pen.jpg', 'img/scissors.jpg', 'img/shark.jpg', 'img/sweep.jpg', 'img/usb.jpg', 'img/unicorn.jpg', 'img/water-can.jpg', 'img/wine-glass.jpg'];
var prod = [];
var img_index = [0, 0, 0];
var counter_rounds = 0;
var image_container = document.getElementById('image_container');
var results = document.getElementById('results_button');
var reset = document.getElementById('reset_button');

function Product(prod_name, prod_path) {
  this.prod_name = prod_name;
  this.prod_path = prod_path;
  this.prod_clicks = 0;
  this.prod_appear = 0;
  this.prod_percent = 0;
}

for (var i = 0; i < data_name.length; i++) {
  prod.push(new Product(data_name[i], data_path[i]));
}

window.addEventListener('load', addThreeImage);
window.addEventListener('load', attachHandler);
results.addEventListener('click', displayTable);
reset.addEventListener('click', refresh);

function refresh() {
  window.location.reload();
}

function tally(e) {
  prod[event.target.className].prod_clicks++;
  counter_rounds++;

  if (counter_rounds === 15) {
    detachHandler();
    showResultsButton();
    hideImages();
  }
}


function addThreeImage() {
  // get random # x3.  if 2 = 1, re-roll.  if 3 = 2 || 1, re-roll;
  img_index.forEach(function (item, index, array) {
    array[index] = getRandom();
  });
  while (img_index[1] === img_index[0]) {
    img_index[1] = getRandom();
  };
  while (img_index[2] === img_index[0] || img_index[2] === img_index[1]) {
    img_index[2] = getRandom();
  };
  var counter_img = 0;
  addRandImage(++counter_img, img_index[0]);
  addRandImage(++counter_img, img_index[1]);
  addRandImage(++counter_img, img_index[2]);
};

function getRandom() {
  return Math.floor(Math.random() * prod.length);
};

function addRandImage(counter_img, img_path) {
  var img = document.getElementById('image_' + counter_img);
  img.className = img_path;
  img.src = data_path[img_path];
  prod[img_path].prod_appear++;
}

function attachHandler() {
  image_container.addEventListener('click', tally);
  image_container.addEventListener('click', addThreeImage);
}

function detachHandler() {
  image_container.removeEventListener('click', tally);
  image_container.removeEventListener('click', addThreeImage);
}


function showResultsButton() {
  var button = document.getElementById('results_button');
  button.parentNode.className = 'show';
}

function hideImages() {
  var button = document.getElementById('image_container');
  button.parentNode.className = 'hidden';
}

function displayTable() {
  var tbl = document.getElementById('results_body');
  for (var i = 0; i< data_name.length; i++) {
    // createRow(i);
    var tr = document.createElement('tr');
    // for (var j = 0; j < prod.length; j++) {
      // createCell(i);
      var td = document.createElement('td');
      td.textContent = prod[i].prod_name;
      tr.appendChild(td);
      var td_2 = document.createElement('td');
      td_2.textContent = prod[i].prod_clicks;
      tr.appendChild(td_2);
      var td_3 = document.createElement('td');
      td_3.textContent = prod[i].prod_appear;
      tr.appendChild(td_3);
      var td_4 = document.createElement('td');
      var check_NaN = (prod[i].prod_clicks / prod[i].prod_appear * 100).toFixed(2);
      (!isNaN(check_NaN)) ? td_4.textContent = check_NaN : td_4.textContent = 0;
      tr.appendChild(td_4);
    // }
    tbl.appendChild(tr);
  }
  document.getElementById('results_tbl').parentNode.className = 'show';
  results.removeEventListener('click', displayTable)
}
