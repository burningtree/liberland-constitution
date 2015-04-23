var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var nodePath = require('path');

var source = 'http://liberland.org/en/constitution/';
var target = nodePath.resolve(__dirname, '../constitution.md');
var rIndex = /^§([\d]+\.?)\s/;
var rSubIndex = /^§(\d+\(\d+\))\s/;
var rSubSubIndex = /^§(\d+\(\d+\)\([a-z]+\))\s/;

request(source, function(err, res, body) {
  var $ = cheerio.load(body);
  var text = $('.aPreviewText').text().replace(/\r/g, '').split('\n');
  var output = [
    '# Free Republic of Liberland Constitution draft\n'
  ];

  text.forEach(function(l) {
    l = l.trim();
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
        return '- **' + m.trim() + '** ';
      });
    }
    if(l.match(rSubIndex)) {
      l = l.replace(rSubIndex, function(m) {
        return '  - **' + m.trim() + '** ';
      });
    }
    if(l.match(rSubSubIndex)) {
      l = l.replace(rSubSubIndex, function(m) {
        return '    - **' + m.trim() + '** ';
      });
    }
    output.push(l);
  });

  fs.writeFileSync(target, output.join('\n').replace(/\n\n\n/g, '\n\n'));
  console.log('File save: '+target);
});

