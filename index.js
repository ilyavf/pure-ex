const { Right, Left } = require('data.either');
const Task = require('data.task');
const log = msg => v => {
  console.log('Logging ' + msg + ': ', v);
  return v;
};

// Task: find a user, and then find his best friend

const fake = id =>
  ({id: id, name: 'user1', best_friend_id: id + 1});

// ---------- Try 1:
const Db1 = {
  find: id =>
    new Task((rej, res) =>
      id > 2 ? res(fake(id)) : rej('not found'))
};
const res1 = Db1.find(1).chain(u => Db1.find(u.best_friend_id));
//res1.fork(err => console.log('Error: ', err), res => console.log('Success: ', res))

// ----------- Try 2:
const Db2 = {
  find: id =>
    new Task((rej, res) =>
      res(id > 2 ? Right(fake(id)) : Left('not found')))
};
const res2 = Db2.find(4)   // Task Either
  .chain(either => Task.of(either.map(user => Db2.find(user.best_friend_id))));

//res2.fork(
//  err => console.log('Error: ', err),
//  either => {
//    console.log('Success: ', either)
//    either.map(task => task.fork(console.error, u => console.log('Success2: ', u)))
//  }
//);


// ----------- V3: with Natural Transformation
const eitherToTask = e =>
  e.fold(Task.rejected, Task.of);

const res3 = Db2.find(3)                    // Task( Right( value ) )
  .chain(eitherToTask)                      // Task( value )
  .chain(u => Db2.find(u.best_friend_id))   // Task( Right( value ) )
  .chain(eitherToTask)                      // Task( value )

res3.fork(
  err => console.log('Error: ', err),
  res => console.log('Success: ', res)
);