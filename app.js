const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const sequelize = require('./src/db/sequelize');
const { success, getUniqueId } = require('./helper.js');
let pokemons = require('./src/db/mock-pokemon.js');
const PokemonModel = require('./src/models/pokemon');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger'); // Importer la configuration Swagger

const app = express();
const port = 3000;

// Configurer Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json()
    );

sequelize.initDb();

require('./src/routes/findAllPokemons')(app);
require('./src/routes/findPokemonByPk')(app);
require('./src/routes/createPokemon')(app);
require('./src/routes/updatePokemon')(app);
require('./src/routes/deletePokemon')(app);
require('./src/routes/login')(app);

app.use(({ res }) => {
    const message = "Impossible de trouver la ressource demandée";
    res.status(400).json({ message });
});

app.listen(port, () => console.log(`Notre app est démarrée sur le port ${port}`));
