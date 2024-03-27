const router = require('express').Router();
const { fetchUsers, createUser, createFavorite, destroyFavorite } = require('../../db');

router.get('/', async (req, res, next) => {
    try {
        const users = await fetchUsers();
        res.status(200).send(users);
    } catch (error) {
        next(error)
    };
});

router.post('/', async (req, res, next) => {
    try{
        const { username, password } = req.body;
        const user = await createUser({ username: username, password: password });
        res.status(200).send(user);

    } catch(error) {
        next(error)
    }
})

router.post('/:user_id/product', async (req, res, next) => {
    try {
        const { product_id } = req.body;
        const favorite = await createFavorite({ user_id: req.params.user_id, product_id: product_id});
        res.status(200).send(favorite);
    } catch (error) {
        next(error)
    }
});

router.delete('/:user_id/:favorite/:id', async (req, res, next) => {
    try {
        await destroyFavorite({ user_id: req.params.user_id, id: req.params.id });
        res.status(204);
    } catch (error) {
        next (error)
    }
});

router.post('/:user_id/:favorite')

module.exports = router;