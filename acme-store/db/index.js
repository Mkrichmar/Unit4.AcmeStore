const pg = require('pg');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const client = new pg.Client(`postgres://localhost/${process.env.DB_NAME}`);

const createTables = async () => {
    const SQL = /*SQL*/`
    DROP TABLE IF EXISTS favorite;
    DROP TABLE IF EXISTS product;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
    );

    CREATE TABLE product(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );

    CREATE TABLE favorite(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        product_id UUID REFERENCES product(id) NOT NULL
    );
    `
    await client.query(SQL);
};

const createUser = async ({ username, password }) => {
    const SQL = /*SQL*/`
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *;
    `
    const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 10)]);
    return response.rows[0];
};

const createProduct = async ({ name }) => {
    const SQL = /*SQL*/`
    INSERT INTO product(id, name) VALUES($1, $2) RETURNING *`
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0]
};

const fetchUsers = async () => {
    const SQL = /*SQL*/`SELECT * FROM users`
    const response = await client.query(SQL);
    return response.rows;
};

const fetchProducts = async () => {
    const SQL = /*SQL*/`SELECT * FROM product`
    const response = await client.query(SQL);
    return response.rows;
};

const createFavorite = async ({ user_id, product_id }) => {
    const SQL = /*SQL*/`INSERT INTO favorite(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *`
    const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
    return response.rows[0];
};

const fetchFavorites = async ( user_id ) => {
    console.log(user_id);
    const SQL = /*SQL*/`SELECT * FROM favorite WHERE user_id=$1`
    const response = await client.query(SQL, [user_id]);
    return response.rows;
};

const destroyFavorite = async ({ user_id, product_id }) => {
    const SQL = /*SQL*/`DELETE * FROM favorite WHERE user_id='${user_id}' AND product_id='${product_id}'`;
    const response = await client.query(SQL);
};

const seed = async () => {
    await Promise.all([
        createUser({username: 'fiona', password: 'backward'}),
        createUser({username: 'gary', password: 'forward'}),
        createUser({username: 'dbunk', password: 'p@ssword'}),
        createProduct({name: 'stereo'}),
        createProduct({name: 'bluetooth speaker'}),
        createProduct({name: 'victrola'})
    ]);

    const users = await fetchUsers();
    console.log('User are', await fetchUsers());
    const product = await fetchProducts();
    console.log('Products are', await fetchProducts());

    await Promise.all([
        createFavorite({user_id: users[0].id, product_id: product[2].id}),
        createFavorite({user_id: users[1].id, product_id: product[1].id}),
        createFavorite({user_id: users[2].id, product_id: product[0].id})
    ]);
    console.log('Favorite products are', await fetchFavorites(users[0].id));
}




module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    createFavorite,
    destroyFavorite,
    seed
}