/**
 * @swagger
 * /api/pokemons/{id}:
 *   get:
 *     summary: Get a pokemon by ID
 *     description: Retrieve a pokemon by its ID.
 *     tags:
 *       - Pokemons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the pokemon to retrieve.
 *     responses:
 *       '200':
 *         description: A pokemon was successfully retrieved.
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
  app.get('/api/pokemons/:id', auth, (req, res) => {
    Pokemon.findByPk(req.params.id)
      .then(pokemon => {
        if(pokemon === null) {
          const message = 'Le pokémon demandé n\'existe pas. Réassayez avec un autre identifiants';
          return res.status(404).json(message);
        }
        const message = 'Un pokémon a bien été trouvé.'
        res.json({ message, data: pokemon })
      })
      .catch( )
  })
}