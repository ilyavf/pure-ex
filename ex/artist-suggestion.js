// Ex:
// - get two artists
// - get related artists for both
// - give suggestions (crossing of both related items)

// search: artists.items[].id
// related: artists

const Task = require('data.task');

const getArgs = new Task((rej, res) => res(process.argv));
const names = getArgs.map(args => args.slice(2));

const findArtist = name =>
  new Task((rej, res) => res({artists: {items: {id: 1}}}));

const relatedArtists = id =>
  new Task((rej, res) => res([{artists:[{name:'One'},{name:'Two'}]}]));

const related = name =>
  findArtist(name)
  .map(artist => artist.id)
  .chain(relatedArtists);

const main = ([name1, name2]) =>
  Task.of(rel1 => rel2 => [rel1, rel2])
  .ap(related(name1))
  .ap(related(name2));



names.map(main).fork(console.err, console.log);