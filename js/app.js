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
results.addEventListener('click', displayChart);
results.addEventListener('click', displayChartPolar);
reset.addEventListener('click', refresh);

function refresh() {
  window.location.reload();
}
function tally(e) {
  prod[event.target.className].prod_clicks++;
  counter_rounds++;

  if (counter_rounds === 15) {
    for (var i = 0; i< data_name.length; i++) {
      var check_NaN = (prod[i].prod_clicks / prod[i].prod_appear * 100).toFixed(2);
      prod[i].prod_percent = ((!isNaN(check_NaN)) ? check_NaN : check_NaN = 0);
    }
    detachHandler();
    hideImages();
    showResultsButton();
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
    var content = [prod[i].prod_name, prod[i].prod_clicks, prod[i].prod_appear, prod[i].prod_percent];
    createRow(tbl, i, content);
  }
  document.getElementById('results_tbl').parentNode.className = 'show';
  results.removeEventListener('click', displayTable);
  // display the polar section of doom too! \o/
  document.getElementById('chart_polar').parentNode.className = 'show';
}
function createRow(tbl, i, content) {
  var tr = document.createElement('tr');
  tbl.appendChild(tr);
  for (var j = 0; j < prod.length; j++) {
    createCell(tr, content[j]);
  }
}
function createCell(tr, content) {
  var td = document.createElement('td');
  td.textContent = content;
  tr.appendChild(td);
}
function displayChart() {
  var array_bar = [[], []];
  for (var i = 0; i < prod.length; i++) {
    array_bar[0].push(prod[i].prod_name);
    array_bar[1].push(prod[i].prod_clicks);
  }
  // do some stuff and make like 9001 charts appear.  9000 of which are polar area.  because polar area.
  var data_bar = {
    labels: array_bar[0],
    datasets : [
      {
        fillColor : "#48A497",
        strokeColor : "#48A4D1",
        data: array_bar[1]
      }
    ]
  }
  var chart_bar = document.getElementById("chart_bar").getContext("2d");
  new Chart(chart_bar).Bar(data_bar);
}
function displayChartPolar() {
  var data_polar = [];
  for (var i = 0; i < prod.length; i++) {
    data_polar.push(
      {
        value: prod[i].prod_clicks,
        color: '#' + getRandomColor(),
        highlight: "#000000",
        label: prod[i].prod_name
      }
    );
  }
  var chart_polar = document.getElementById("chart_polar").getContext("2d");
  new Chart(chart_polar).PolarArea(data_polar);
}

function getRandomColor() {
  return Math.floor(Math.random()*16777215).toString(16);
}
