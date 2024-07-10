const express = require('express');
const pokemons = require('./mock-pokemon');

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello express JS'));

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find(pokemon => pokemon.id === id);
    if (pokemon) {
        res.send(`Vous avez demandé le Pokémon ${pokemon.name}.`);
    } else {
        res.status(404).send('Pokémon non trouvé.');
    }
});

app.get('/api/pokemons/', (req, res) => {
    const pokemonNumbers = pokemons.length;
    if (pokemonNumbers) {
        res.send(`Vous avez actuellement ${pokemonNumbers} dans le Pokédex.`);
    } else {
        res.status(404).send('Pokémon non trouvé.');
    }
});

app.listen(port, () => console.log(`Notre app est démarrée sur le port ${port}`));
