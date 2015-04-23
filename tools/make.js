var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var nodePath = require('path');

var source = 'http://liberland.org/en/constitution/';
var target = nodePath.resolve(__dirname, '../constitution.md');
var rIndex = /^§([\d]+\.)/;
var rSubIndex = /^§([\d\(\)]+)/;

request(source, function(err, res, body) {
  var $ = cheerio.load(body);
  var text = $('.aPreviewText').text().split('\n');
  var output = [
    '# Free Republic of Liberland Constitution draft\n'
  ];

  text.forEach(function(l) {
    if(l.match(/^Notice/)) {
      l = '> '+l;
    }
    if(l.match(/^(Article |Bill of )/)) {
      l = '## ' + l;
    }
    if(l.match(/^PART /)) {
      l = '### ' + l;
    }
    if(l.match(rIndex)) {
      l = l.replace(rIndex, function(m) {
        return '- **' + m + '**';
      });
    }
    if(l.match(rSubIndex)) {
      l = l.replace(rSubIndex, function(m) {
        return '  - **' + m + '**';
      });
    }
    output.push(l);
  });

  fs.writeFileSync(target, output.join('\n'));
  console.log('File save: '+target);
});

