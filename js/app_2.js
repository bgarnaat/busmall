'use strict';

var data_name = ['bag', 'banana', 'boots', 'chair', 'cthulhu', 'dragon', 'pen', 'scissors', 'shark', 'sweep', 'unicorn', 'usb', 'water-can', 'wine-glass'];
var prod = [];
var img_index = [0, 0, 0];
var counter_rounds = 0;
var array_bar = [[], []];

function Product(prod_name, prod_path) {
  this.prod_name = prod_name;
  this.prod_path = prod_path;
  this.prod_clicks = 0;
}

for (var i = 0; i < data_name.length; i++) {
  prod.push(new Product(data_name[i], 'img/' + data_name[i] + '.jpg'));
}

window.addEventListener('load', addThreeImage);
document.getElementById('image_container').addEventListener('click', clickHandler);
document.getElementById('results_button').addEventListener('click', displayChart);

function clickHandler(e) {
  if (event.target.id === 'image_1' || event.target.id === 'image_2' || event.target.id === 'image_3') {
    prod[(event.target.id === 'image_1' ? img_index[0] : (event.target.id === 'image_2' ? img_index[1] : (event.target.id === 'image_3' ? img_index[2] : -1)))].prod_clicks++;
    counter_rounds++;
    if (counter_rounds === 15) {
      document.getElementById('results_button').parentNode.className = 'show';
      for (var i = 0; i < prod.length; i++) {
        array_bar[0].push(prod[i].prod_name);
        array_bar[1].push(prod[i].prod_clicks);
      }
    } else {
      addThreeImage();
    }
  }
}
function addThreeImage() {
  img_index.forEach(function (item, index, array) {
    array[index] = getRandom();
  });
  while (img_index[1] === img_index[0]) {
    img_index[1] = getRandom();
  };
  while (img_index[2] === img_index[0] || img_index[2] === img_index[1]) {
    img_index[2] = getRandom();
  };
  img_index.forEach(function (item, index, array) {
    document.getElementById('image_' + (index + 1)).src = prod[array[index]].prod_path;
  });
};
function getRandom() {
  return Math.floor(Math.random() * prod.length);
};
function displayChart() {
  var data_bar = {
    labels: array_bar[0],
    datasets : [
      {
        fillColor : "#48A497",
        strokeColor : "#48A4D1",
        data: array_bar[1]
      },
    ]
  }
  new Chart(document.getElementById("chart_bar").getContext("2d")).Bar(data_bar);
}
