const Sum = x =>
({
  x,
  concat: ({x: y}) => Sum(x + y),
  inspect: () => `Sum(${x})`
});
let res = Sum(1).concat(Sum(2)).concat(Sum(3));

const All = x =>
({
  x,
  concat: ({x: y}) => All(x && y),
  inspect: () => `All(${x})`
});
res = All(true).concat(All(true)).concat(All(false));

const Some = x =>
({
  x,
  concat: ({x: y}) => Some(x || y),
  inspect: () => `Some(${x})`
});
res = Some(false).concat(Some(true)).concat(Some(false));

const First = x =>
({
  x,
  concat: _ => First(x),
  inspect: () => `First(${x})`
});
res = First('One').concat(First('Two')).concat(First('Three'));

// Example: merge accounts.
const acc1 = {name: First('Ilya'), isPaid: All(true), points: Sum(10), friends: ['Peter']};
const acc2 = {name: First('ily'), isPaid: All(false), points: Sum(5), friends: ['Alex']};
const Map = x =>
({
  x,
  concat: ({x: y}) =>
    Map(Object.keys(x)
      .reduce((x, i) => { x[i] = x[i].concat(y[i]); return x;}, x))
});
res = Map(acc1).concat(Map(acc2));

console.log(res);