var url = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';

var body = d3.select('body');

var tooltip = body.
append('div').
attr('class', 'tooltip').
attr('id', 'tooltip').
style('opacity', 0);

var svg = d3.select('#tree-map'),
width = +svg.attr('width'),
height = +svg.attr('height');

var fader = function (color) {
  var fadedColor = d3.color(color);
  fadedColor.opacity = 0.2;
  return d3.interpolate(fadedColor, d3.color('#fff'));
};


function getCategoryColor(category) {
  var colorMap = {
    'Wii': '#7a056c',
    'GB': '#d11141',
    'DS': '#23bd29',
    'PS2': '#ff4438',
    'SNES': '#993920',
    'GBA': '#3061e3',
    '2600': '#ff0000',
    'DS': '#f1b000',
    'PS3': '#d793a9',
    '3DS': '#c9c9ff',
    'PS': '#01d27a',
    'XB': '#270067',
    'PSP': '#f7b572',
    'X360': '#8fce00',
    'NES': '#7b9c75',
    'PS4': '#930609',
    'N64': '#62073c',
    'PC': '#fc4700',
    'XOne': '#ffd50b' };

  return colorMap[category] || '#ccc';
}



var treemap = d3.treemap().size([width, height]).paddingInner(1);

d3.json(url).
then(data => {
  var root = d3.
  hierarchy(data).
  eachBefore(function (d) {
    d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
  }).
  sum(sumBySize).
  sort(function (a, b) {
    return b.height - a.height || b.value - a.value;
  });

  treemap(root);

  var cell = svg.
  selectAll('g').
  data(root.leaves()).
  enter().
  append('g').
  attr('class', 'group').
  attr('transform', function (d) {
    return 'translate(' + d.x0 + ',' + d.y0 + ')';
  });

  cell.
  append('rect').
  attr('id', function (d) {
    return d.data.id;
  }).
  attr('class', 'tile').
  attr('width', function (d) {
    return d.x1 - d.x0;
  }).
  attr('height', function (d) {
    return d.y1 - d.y0;
  }).
  attr('data-name', function (d) {
    return d.data.name;
  }).
  attr('data-category', function (d) {
    return d.data.category;
  }).
  attr('data-value', function (d) {
    return d.data.value;
  }).
  attr('fill', function (d) {return getCategoryColor(d.data.category);
  }).
  on('mousemove', function (event, d) {
    tooltip.style('opacity', 0.9);
    tooltip.
    html(
    'Name: ' +
    d.data.name +
    '<br>Category: ' +
    d.data.category +
    '<br>Value: ' +
    d.data.value).

    attr('data-value', d.data.value).
    style('left', event.pageX + 10 + 'px').
    style('top', event.pageY - 28 + 'px');
  }).
  on('mouseout', function () {
    tooltip.style('opacity', 0);
  });

  cell.
  append('text').
  attr('class', 'tile-text').
  selectAll('tspan').
  data(function (d) {
    return d.data.name.split(/(?=[A-Z][^A-Z])/g);
  }).
  enter().
  append('tspan').
  attr('x', 4).
  attr('y', function (d, i) {
    return 13 + i * 10;
  }).
  text(function (d) {
    return d;
  });
  var categories = root.leaves().map(function (nodes) {
    return nodes.data.category;
  });
  categories = categories.filter(function (category, index, self) {
    return self.indexOf(category) === index;
  });
  var legend = d3.select('#legend');
  var legendWidth = +legend.attr('width');
  const LEGEND_OFFSET = 10;
  const LEGEND_RECT_SIZE = 15;
  const LEGEND_H_SPACING = 150;
  const LEGEND_V_SPACING = 10;
  const LEGEND_TEXT_X_OFFSET = 3;
  const LEGEND_TEXT_Y_OFFSET = -2;
  var legendElemsPerRow = Math.floor(legendWidth / LEGEND_H_SPACING);

  var legendElem = legend.
  append('g').
  attr('transform', 'translate(60,' + LEGEND_OFFSET + ')').
  selectAll('g').
  data(categories).
  enter().
  append('g').
  attr('transform', function (d, i) {
    return (
      'translate(' +
      i % legendElemsPerRow * LEGEND_H_SPACING +
      ',' + (
      Math.floor(i / legendElemsPerRow) * LEGEND_RECT_SIZE +
      LEGEND_V_SPACING * Math.floor(i / legendElemsPerRow)) +
      ')');

  });

  legendElem.
  append('rect').
  attr('width', LEGEND_RECT_SIZE).
  attr('height', LEGEND_RECT_SIZE).
  attr('class', 'legend-item').
  attr('fill', function (d) {
    return getCategoryColor(d);
  });


  legendElem.
  append('text').
  attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET).
  attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET).
  text(function (d) {
    return d;
  });
});

function sumBySize(d) {
  return d.value;
};