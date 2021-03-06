'use strict';

(function() {
  var data_name = ['bag', 'banana', 'boots', 'chair', 'cthulhu', 'dragon', 'pen', 'scissors', 'shark', 'sweep', 'tentacle', 'unicorn', 'watering can', 'wine glass'];
  var data_path = ['img/bag.jpg', 'img/banana.jpg', 'img/boots.jpg', 'img/chair.jpg', 'img/cthulhu.jpg', 'img/dragon.jpg', 'img/pen.jpg', 'img/scissors.jpg', 'img/shark.jpg', 'img/sweep.jpg', 'img/usb.jpg', 'img/unicorn.jpg', 'img/water-can.jpg', 'img/wine-glass.jpg'];
  var prod = [];
  var img_index = [0, 0, 0];
  var counter_rounds = 0;
  var image_container = document.getElementById('image_container');
  var results = document.getElementById('button_results');
  var reset = document.getElementById('button_reset');
  var ls_clear = document.getElementById('button_clear');

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
  function addThreeImage() {
    // get random # x3.  if 2 = 1, re-roll.  if 3 = 2 || 1, re-roll;
    img_index.forEach(function (item, index, array) {
      array[index] = getRandom();
    });
    while (img_index[1] === img_index[0]) {
      img_index[1] = getRandom();
    }
    while (img_index[2] === img_index[0] || img_index[2] === img_index[1]) {
      img_index[2] = getRandom();
    }
    img_index.forEach(function(item, index, array) {
      addRandImage(array[index], index);
    });
  }

  function getRandom() {
    return Math.floor(Math.random() * prod.length);
  }
  function addRandImage(img_index, index) {
    var img = document.getElementById('image_' + (index + 1));
    img.src = data_path[img_index];
    prod[img_index].prod_appear++;
  }
  function attachHandler() {
    image_container.addEventListener('click', clickHandler);
  }
  function detachHandler() {
    image_container.removeEventListener('click', clickHandler);
  }
  function showResultsButton() {
    var button = document.getElementById('button_results');
    button.parentNode.className = 'show';
  }
  function hideImages() {
    var image_container = document.getElementById('image_container');
    image_container.parentNode.className = 'hidden';
  }
  function displayTable() {
    var tbl = document.getElementById('results_body');
    for (var i = 0; i< data_name.length; i++) {
      var content = [prod[i].prod_name, prod[i].prod_clicks, prod[i].prod_appear, prod[i].prod_percent];
      createRow(tbl, content);
    }
    document.getElementById('results_tbl').parentNode.className = 'show';
    results.removeEventListener('click', resultHandler);
    document.getElementById('chart_polar').parentNode.className = 'show';
  }
  function createRow(tbl, content) {
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
  function getDataArrayBar() {
    var array_bar = [[], [], []];
    for (var i = 0; i < prod.length; i++) {
      array_bar[0].push(prod[i].prod_name);
      array_bar[1].push(prod[i].prod_clicks);
      array_bar[2].push(prod[i].prod_appear);
    }
    var data_bar = {
      labels: array_bar[0],
      datasets : [
        {
          fillColor: '#48A497',
          strokeColor: '#48A4D1',
          data: array_bar[1]
        },
        {
          fillColor: '#b4b4ff',
          strokeColor: '#b4b4ff',
          data: array_bar[2]
        }
      ]
    };
    return data_bar;
  }
  function displayChart() {
    var data_bar = getDataArrayBar();
    var chart_bar = document.getElementById('chart_bar').getContext('2d');
    var bar_chart = new Chart(chart_bar).Bar(data_bar);
  }
  function displayChartPolar() {
    var data_polar = [];
    for (var i = 0; i < prod.length; i++) {
      data_polar.push(
        {
          value: prod[i].prod_clicks,
          color: '#' + getRandomColor(),
          highlight: '#000000',
          label: prod[i].prod_name
        }
      );
    }
    var chart_polar = document.getElementById('chart_polar').getContext('2d');
    var polar_chart = new Chart(chart_polar).PolarArea(data_polar);
  }
  function getRandomColor() {
    return Math.floor(Math.random()*16777215).toString(16);
  }

  function pageLoad() {
    ls_initialize();
    if (counter_rounds >= 15) {
      for (var i = 0; i< data_name.length; i++) {
        var check_NaN = (prod[i].prod_clicks / prod[i].prod_appear * 100).toFixed(2);
        prod[i].prod_percent = ((!isNaN(check_NaN)) ? check_NaN : check_NaN = 0);
      }
      detachHandler();
      hideImages();
      showResultsButton();
    } else {
      addThreeImage();
      attachHandler();
    }
  }
  function refresh() {
    window.location.reload();
  }
  function resultHandler() {
    displayTable();
    displayChart();
    displayChartPolar();
  }
  function clickHandler(e) {
    var e_id = event.target.id;
    if (e_id === 'image_1' || e_id === 'image_2' || e_id === 'image_3') {
      prod[(e_id === 'image_1' ? img_index[0] : (e_id === 'image_2' ? img_index[1] : (e_id === 'image_3' ? img_index[2] : -1)))].prod_clicks++;
      counter_rounds++;
      ls_record();
      if (counter_rounds >= 15) {
        for (var i = 0; i< data_name.length; i++) {
          var check_NaN = (prod[i].prod_clicks / prod[i].prod_appear * 100).toFixed(2);
          prod[i].prod_percent = ((!isNaN(check_NaN)) ? check_NaN : check_NaN = 0);
        }
        detachHandler();
        hideImages();
        showResultsButton();
      } else {
        addThreeImage();
      }
    }
  }

  function ls_initialize() {
    // Persist data in HTML5 Local Storage
    var ls_data_prod = localStorage.getItem('ls_data_prod');
    var ls_data_count = localStorage.getItem('ls_data_count');
    (ls_data_prod) ? prod = JSON.parse(ls_data_prod) : localStorage.setItem('ls_data_prod', JSON.stringify(prod));
    (ls_data_count) ? counter_rounds = JSON.parse(ls_data_count) : localStorage.setItem('ls_data_count', JSON.stringify(counter_rounds));
  }

  function ls_record() {
    localStorage.setItem('ls_data_prod', JSON.stringify(prod));
    localStorage.setItem('ls_data_count', JSON.stringify(counter_rounds));
  }

  function clear_ls() {
    console.log('clearing local storage...');
    localStorage.clear();
  }

  window.addEventListener('load', pageLoad);
  results.addEventListener('click', resultHandler);
  reset.addEventListener('click', refresh);
  ls_clear.addEventListener('click', clear_ls);
}());
