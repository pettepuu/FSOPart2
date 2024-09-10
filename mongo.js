const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://ukunakki:${password}@cluster0.mj2uxtk.mongodb.net/?retryWrites=true&w=majority&appName=puhelinluettelo`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,  // Change the type to String to accommodate phone numbers better
});

const Person = mongoose.model('Person', personSchema);

if (name === undefined && number === undefined) {
    console.log('To add someone, node mongo.js <password> <name> <number>');
    
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person);
        });
        mongoose.connection.close();
      });

  }
else{
    const person = new Person({
        name: name,
        number: number,
      });
      
      person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
      }).catch(err => {
        console.error('Error saving person:', err);
        mongoose.connection.close();
      });
}

export default Person


