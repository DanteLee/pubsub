var pubsub = require('../src/pubsub.js');

function test () {

}

test.prototype = new pubsub;

var a = new test;
var rest = 0;
a.all('evt1', 'evt2', 'evt3', function () {
    console.log('all events triggered');

    rest++;
});

a.emit('evt1');
a.emit('evt2');
a.emit('evt3');

console.log(a.regList);


