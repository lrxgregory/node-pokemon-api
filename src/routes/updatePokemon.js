/**
 * @swagger
 * /api/pokemons/{id}:
 *   put:
 *     summary: Update a pokemon by ID
 *     description: Update a pokemon by its ID.
 *     tags:
 *       - Pokemons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the pokemon to update.
 *       - in: body
 *         name: body
 *         required: true
 *         description: The pokemon data to update.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             hp:
 *               type: integer
 *             cp:
 *               type: integer
 *             picture:
 *               type: string
 *             types:
 *               type: array
 *               items:
 *                 type: string
 *     responses:
 *       '200':
 *         description: The pokemon was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       '400':
 *         description: Bad request. Invalid input data.
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
 *       '404':
 *         description: Not found. The pokemon with the specified ID was not found.
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
 *                 data:
 *                   type: object
 *                   description: Error details.
 */
const { Pokemon } = require('../db/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.put('/api/pokemons/:id', auth, (req, res) => {
        const id = req.params.id
        Pokemon.update(req.body, {
            where: { id: id }
        })
            .then(_ => {
                return Pokemon.findByPk(id).then(pokemon => {
                    if (pokemon === null) {
                        const message = `Le pokémon demandé n'existe pas. Réessayez avec un autre identifiant.`
                        return res.status(404).json({ message })
                    }

                    const message = `Le pokémon ${pokemon.name} a bien été modifié.`
                    res.json({ message, data: pokemon })
                })
            })
            .catch(error => {
                if (error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                if (error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: 'error.message', data: error });
                }
                const message = `Le pokémon n'a pas pu être modifié. Réessayez dans quelques instants.`
                res.status(500).json({ message, data: error })
            })
    })
}