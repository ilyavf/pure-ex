const { Right, Left } = require('data.either');

var res = Right(100).fold(console.err, r => {
  console.log(r);
  return r;
});
console.log('Here: ', res);