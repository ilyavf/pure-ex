// Ex:
// - get two artists
// - get related artists for both
// - give suggestions (intersection of both related items)

// search: artists.items[].id
// related: artists

const Task = require('data.task');
const request = require('request');
const Either = require('data.either');

const getArgs = new Task((rej, res) => res(process.argv));
const names = getArgs.map(args => args.slice(2));

const eitherToTask = e =>
  e.fold(Task.rejected, Task.of);

const tryParse = Either.try(JSON.parse);

const httpGet = url =>
  new Task((rej, res) =>
    request(url, (error, response, body) =>
      error ? rej(error) : res(body)))
  .map(tryParse)
  .chain(eitherToTask);

const first = xs =>
  Either.fromNullable(xs[0]);

const findArtist = name =>
  httpGet(`https://api.spotify.com/v1/search?type=artist&q=${name}`)
    .map(r => r.artists.items)
    .map(first)
    .chain(eitherToTask);

const relatedArtists = id =>
  httpGet(`https://api.spotify.com/v1/artists/${id}/related-artists`)
    .map(r => r.artists.map(a => a.name));

const related = name =>
  findArtist(name)
  .map(artist => artist.id)
  .chain(relatedArtists);

const Intersection = xs =>
({
  xs,
  concat: ({xs: ys}) =>
    Intersection(xs.filter(x => ys.some(y => x === y)))
});
console.log(Intersection([1,2,4,5]).concat(Intersection([10,2,20,5,6])));

const artistIntersection = rel1 => rel2 =>
  Intersection(rel1).concat(Intersection(rel2));

const main = ([name1, name2]) =>
  Task.of(artistIntersection)
  .ap(related(name1))
  .ap(related(name2));

names.chain(main).fork(console.err, console.log);

// To run:
// $ node ex/artist-suggestion.js oasis blur