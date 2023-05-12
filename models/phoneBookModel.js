const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const URL = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log('MongoDB connected!');
  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
};

connectDB();

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);

// if (process.argv.length === 3) {
//   Person.find({}).then((result) => {
//     result.forEach((person) => {
//       console.log(person.name + ' ' + person.number);
//     });
//     mongoose.connection.close();
//   });
// }

// if (process.argv.length === 5) {
//   const name = process.argv[3];
//   const number = process.argv[4];
//   const person = new Person({
//     name: name,
//     number: number,
//   });
//   person.save().then((result) => {
//     console.log(`added ${person.name} number ${person.number} to phonebook`);
//     mongoose.connection.close();
//   });
// }
