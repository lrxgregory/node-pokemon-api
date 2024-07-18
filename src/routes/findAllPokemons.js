/**
 * @swagger
 * /api/pokemons:
 *   get:
 *     summary: Get list of all pokemons
 *     description: Retrieve a list of all pokemons or search for pokemons by name.
 *     tags:
 *       - Pokemons
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Optional. Search for pokemons by name (case-insensitive). Minimum 2 characters.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Optional. Limit the number of pokemons returned (default is 5).
 *     responses:
 *       '200':
 *         description: A list of pokemons that match the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 data:
 *                   type: array
 *       '400':
 *         description: Bad request. Invalid search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.get('/api/pokemons', auth, (req, res) => {
        if (req.query.name) {
            const name = req.query.name;
            if(name.length < 2 ) {
                const message = `Le terme de recherche doit contenir au moins 2 caractères.`
                return res.status(400).json({ message });
            }
            const limit = parseInt(req.query.limit) || 5;
            return Pokemon.findAndCountAll({
                where: { 
                    name: {
                        [Op.like]: `%${name}%`,
                    },
                },
                order: ['name'],
                limit: limit
            })
            .then(({count, rows}) => {
                const message = `Il y a ${count} pokémon qui correspondent à la recherche ${name}.`
                res.json({ message, data: rows })
            })
        } else {
            Pokemon.findAll()
            .then(pokemons => {
                const message = 'La liste des pokémons a bien été récupérée.'
                res.json({ message, data: pokemons })
            })
            .catch(error => {
                const message = 'La liste des pokémons n\'a pu être récupérée. Réessayez dans quelques instants.';
                res.status(500).json({ message, data: error });
            })
        }
    })
}