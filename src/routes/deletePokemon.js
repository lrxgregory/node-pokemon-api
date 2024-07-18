/**
 * @swagger
 * /api/pokemons/{id}:
 *   delete:
 *     summary: Delete a pokemon
 *     description: Delete a pokemon by its ID.
 *     tags:
 *       - Pokemons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the pokemon to delete.
 *     responses:
 *       '200':
 *         description: The pokemon was successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
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
const auth = require('../auth/auth')

module.exports = (app) => {
    app.delete('/api/pokemons/:id', auth, (req, res) => {
        Pokemon.findByPk(req.params.id).then(pokemon => {
            if(pokemon === null) {
                const message = 'Le pokémon demandé n\'existe pas. Réassayez avec un autre identifiants';
                return res.status(404).json(message);
            }
            const pokemonDeleted = pokemon;
            Pokemon.destroy({
                where: { id: pokemon.id }
            })
            .then(_ => {
                const message = `Le pokémon avec l'identifiant n°${pokemonDeleted.id} a bien été supprimé.`
                res.json({ message, data: pokemonDeleted })
            })
            .catch(error => {
                const message = 'Le pokémon n\'a pas pu être supprimé. Réassayez dans quelques instants';
                res.status(500).json({message, data: error});
            })
        })
    })
}