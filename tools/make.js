var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var nodePath = require('path');
var crypto = require('crypto');

var readmeFile = nodePath.resolve(__dirname, '../README.md');
var source = 'http://liberland.org/en/constitution/';
var target = nodePath.resolve(__dirname, '../Constitution.md');
var rIndex = /^§([\d]+\.?)\s/;
var rSubIndex = /^§(\d+\(\d+\))\s/;
var rSubSubIndex = /^§(\d+\(\d+\)\([a-z]+\))\s/;

function lastRevision(fn) {
  var text = fs.readFileSync(fn).toString();
  return { 
    hash: text.match(/lastRevisionHash: ([\da-f]+)/)[1],
    time: new Date(text.match(/Last changed: ([^\n]+)/)[1].trim())
  }
}
function updateLastRevision(hash) {
  var text = fs.readFileSync(readmeFile).toString();
  text = text.replace(/lastRevisionHash: ([\da-f]+)/, 'lastRevisionHash: '+hash);
  text = text.replace(/Last changed: ([^\n]+)/, 'Last changed: '+ new Date());
  fs.writeFileSync(readmeFile, text);
  return lastRevision(readmeFile);
}

request(source, function(err, res, body) {
  var $ = cheerio.load(body);
  var text = $('.aPreviewText').text().replace(/\r/g, '').split('\n');
  var output = [
    '# Free Republic of Liberland Constitution draft\n',
    'Last changed: #LASTCHANGED\n'
  ];

  text.forEach(function(l) {
    l = l.trim();
    if(l.match(/^We, the Citizens/)) {
      l = '*' + l + '*';
    }
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

  var res = output.join('\n').replace(/\n\n\n/g, '\n\n');
  var hash = crypto.createHash('sha1').update(res).digest('hex');

  var lastRevisionData = lastRevision(readmeFile);
  if(hash !== lastRevisionData.hash) {
    console.log('New revision: '+hash);
    lastRevisionData = updateLastRevision();
  }

  res = res.replace('#LASTCHANGED', lastRevisionData.time);

  fs.writeFileSync(target, res);
  console.log('File save: '+target);
});

