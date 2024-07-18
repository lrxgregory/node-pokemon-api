/**
 * @swagger
 * /api/pokemons:
 *   post:
 *     summary: Create a new pokemon
 *     description: Create a new pokemon and add it to the database.
 *     tags:
 *       - Pokemons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *     responses:
 *       '200':
 *         description: The pokemon was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       '400':
 *         description: Bad request. Invalid input or unique constraint error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                 data:
 *                   type: object
 *                   description: Error details.
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
 *                 data:
 *                   type: object
 *                   description: Error details.
 */
const { Pokemon } = require('../db/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.post('/api/pokemons', auth, (req, res) => {
        Pokemon.create(req.body)
            .then(pokemon => {
                const message = `Le pokémon ${req.body.name} a bien été crée.`
                res.json({ message, data: pokemon })
            })
            .catch(error => {
                if (error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                if (error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: 'error.message', data: error });
                }
                const message = `Le pokémon n'a pas pu être ajouté. Réessayez dans quelques instants.`
                res.status(500).json({ message, data: error })
            })
    })
}