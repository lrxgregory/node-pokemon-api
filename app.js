const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const { success, getUniqueId } = require('./helper.js');
let pokemons = require('./mock-pokemon');

const app = express();
const port = 3000; 

// Middleware
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json()
);

app.get('/', (req, res) => res.send('Hello express JS'));

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find(pokemon => pokemon.id === id);
    if (pokemon) {
        const message = "Un Pokémon a bien été trouvé"
        res.json(success(message, pokemon));
    } else {
        res.status(404).send('Pokémon non trouvé.');
    }
});

app.get('/api/pokemons/', (req, res) => {
    if (pokemons) {
        const message = "La liste des pokémons a bien été récupérée"
        res.json(success(message, pokemons));
    } else {
        res.status(404).send('Pokémon non trouvé.');
    }
});

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons);
    const pokemonCreated = {...req.body, ...{id, created: new Date()}}
    pokemons.push(pokemonCreated);
    const message = `Le pokémon ${pokemonCreated.name} a bien été créé.`
    res.json(success(message, pokemonCreated)); 
})

// app.put('/api/pokemons/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const pokemonUpdated = {...req.body, id: id}
//     pokemons.map(pokemon => {
//         return pokemon.id === id ? pokemonUpdated : pokemon
//     })
//     const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`
//     res.json(success(message, pokemonUpdated)); 
// })

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonUpdated = { ...req.body, id: id };
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon;
    });
    const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`;
    res.json(success(message, pokemonUpdated));
});

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id);
    if (pokemonDeleted) {
        pokemons.filter(pokemon => pokemon.id !== id);
        const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`;
        res.json(success(message, pokemonDeleted));
    } else {
        res.status(404).send('Pokémon non trouvé.');
    }
});

app.listen(port, () => console.log(`Notre app est démarrée sur le port ${port}`));
