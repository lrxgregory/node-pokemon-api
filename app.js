const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const sequelize = require('./src/db/sequelize'); 
const { success, getUniqueId } = require('./helper.js');
let pokemons = require('./src/db/mock-pokemon.js');
const PokemonModel = require('./src/models/pokemon');

const app = express();
const port = 3000; 

// Middleware
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json()
);

sequelize.initDb();

require('./src/routes/findAllPokemons')(app);
require('./src/routes/findPokemonByPk.js')(app);
require('./src/routes/createPokemon.js')(app);
require('./src/routes/updatePokemon.js')(app);
require('./src/routes/deletePokemon.js')(app);

app.listen(port, () => console.log(`Notre app est démarrée sur le port ${port}`));
