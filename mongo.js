const mongoose = require('mongoose');


const PASSWORD = process.argv[2]
const CONNECTION_STRING = `mongodb+srv://gregorian:${PASSWORD}@cluster0.2f490il.mongodb.net/?retryWrites=true&w=majority`

const name = process.argv[3]
const number = process.argv[4]



const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person',personSchema)

async function createPerson(name,number){
  let person = new Person({name,number})
  let result = await person.save(person)
  //console.log(result)
}

async function listPersons(){
    let persons = await Person.find({})
    console.log('phonebook:')
    persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
    });
}

async function main(){
    await mongoose.connect(CONNECTION_STRING)
    //console.log('connected')
    if(name && number){
        await createPerson(name,number)
    }
    else if (!name & !number){
        await listPersons()
    }
    mongoose.connection.close()
}

main()
