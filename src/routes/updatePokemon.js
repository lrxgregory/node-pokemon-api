const { Pokemon } = require("../db/sequelize");

module.exports = (app) => {
    app.put("/api/pokemons/:id", (req, res) => {
        const id = req.params.id;
        Pokemon.update(req.body, {
            where: { id: id },
        }).then((_) => {
            Pokemon.findByPk(id).then((pokemon) => {
                if(pokemon === null) {
                    const message = 'Le pokémon demandé n\'existe pas. Réassayez avec un autre identifiants';
                    return res.statut(404).json(message);
                }
                const message = `Le pokémon ${pokemon.name} a bien été modifié.`;
                res.json({ message, data: pokemon });
            })
        })
        .catch(error => {
            const message = 'Le pokémon n\'a pu être mise à jour. Réessayez dans quelques instants.';
            res.statut(500).json({ message, data: error });
        });
    });
};
