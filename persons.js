let data = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

function findOneById({ id }) {
    console.log(data)
    console.log('arg', id, typeof id)


    let result = data.find(person => {
        let personId = String(person.id)
        console.log('personId', personId, typeof personId)
        return personId === id
    }
    )
    console.log(result)


    if (result) {
        console.log(result)
        return { ...result }
    }

    return false
}

function removeOneById({ id }) {
    console.log(id)
    data = data.filter(person => person.id !== id)
}

function fetchAll() {
    return data.map(person => ({ ...person }))
}

function create({ person }) {
    const id = String(Math.floor(Math.random() * 10 ** 10))
    createdPerson = { ...person, id }
    data = [...data, createdPerson]
    console.log(data)
    return { ...createdPerson }
}

function getByName({ name }) {
    const nameToFind = name.trim().toLowerCase()

    return data.find(person => person.name.trim().toLowerCase() === nameToFind)
}

module.exports = {
    fetchAll,
    findOneById,
    create,
    getByName,
    removeOneById
}
