const { Left, Right } = require('data.either');

const Iso = (to, from) =>
({
  to,
  from
});

// String ~ [char]
const chars = Iso(s => s.split(''), a => a.join(''));
const truncate = s =>
  chars.from(chars.to(s).slice(0, 5).concat('...'));
console.log('chars: ' + chars.from(chars.to('Hello world')));
console.log('truncate: ' + truncate('Hello world'));

// [a] ~ Either null a
const singleton = Iso(
  ([a]) => a > 0 ? Right(a) : Left(null),
  e => e.fold(() => [], a => [a])
);
console.log('Res: ' + singleton.to([5]));
console.log('Res: ', singleton.from(Left(null)));
console.log('Res: ', singleton.from(Right(5)));

// filter Either:
const filterEither = (e, pred) =>
  singleton.to(singleton.from(e).filter(pred));
console.log('filterEither: ' + filterEither(Right(5), a => a > 3));
console.log('filterEither: ' + filterEither(Right(5), a => a > 10));