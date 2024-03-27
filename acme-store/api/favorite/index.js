const router = require('express').Router();
const { fetchFavorites } = require('../../db')

router.get('/', async (req, res, next) => {
    try {
        const users = await fetchFavorites();
        res.status(200).send(users);
    } catch (error) {
        next(error)
    };
});

router.get
module.exports = router;