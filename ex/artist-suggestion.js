// Ex:
// - get two artists
// - get related artists for both
// - give suggestions (crossing of both related items)

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
  .chain(eitherToTask)

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

const relatedArtists1 = id =>
  new Task((rej, res) => res([{id: id, artists:[{name:'One'},{name:'Two'}]}]));

const related = name =>
  findArtist(name)
  .map(artist => artist.id)
  .chain(relatedArtists);

const main = ([name1, name2]) =>
  Task.of(rel1 => rel2 => [rel1, rel2])
  .ap(related(name1))
  .ap(related(name2));



names.chain(main).fork(console.err, console.log);