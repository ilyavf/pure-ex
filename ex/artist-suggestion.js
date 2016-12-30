// Ex:
// - get two artists
// - get related artists for both
// - give suggestions (crossing of both related items)

// search: artists.items[].id
// related: artists

const Task = require('data.task');
const request = require('request');

const getArgs = new Task((rej, res) => res(process.argv));
const names = getArgs.map(args => args.slice(2));

const httpGet = url =>
  new Task((rej, res) => {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res(JSON.parse(body));
      }
    })
  });

const findArtist = name =>
  httpGet('https://api.spotify.com/v1/search?type=artist&q=' + name)
    .map(r => r.artists.items[0]);

const relatedArtists = id =>
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