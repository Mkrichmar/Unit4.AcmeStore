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
        product_id UUID REFERENCES product(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL
    );
    `
    await client.query(SQL);
};

module.exports = {
    client,
    createTables
}