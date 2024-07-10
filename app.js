const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const { success } = require('./helper.js');
const pokemons = require('./mock-pokemon');

const app = express();
const port = 3000; 

// Middleware
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev')
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

app.listen(port, () => console.log(`Notre app est démarrée sur le port ${port}`));
