const mongoose = require('mongoose');

// if (process.argv.length === 3) {
//     const password = process.argv[2];
// } else if (process.argv.length === 5) {
//     const password = process.argv[2];
//     const name = process.argv[3];
//     const number = process.argv[4];
// }
if (process.argv.length === 3) {
  const password = process.argv[2];
  const url = `mongodb+srv://keplib:${password}@cluster0.mupub.mongodb.net/?retryWrites=true&w=majority`;

  mongoose.set('strictQuery', false);
  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model('Person', personSchema);
  console.log('phonebook: ');
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name + ' ' + person.number);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const password = process.argv[2];
  const name = process.argv[3];
  const number = process.argv[4];

  const url = `mongodb+srv://keplib:${password}@cluster0.mupub.mongodb.net/?retryWrites=true&w=majority`;

  mongoose.set('strictQuery', false);
  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model('Person', personSchema);

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
