require('dotenv').config();
const { client, createTables, seed } = require('./db');
const morgan = require('morgan');
const express = require('express');
const apiRouter = require('./api');

const app = express();
app.use(express.json());
app.use(morgan('combined'));

const init = async () => {
    await client.connect();
    console.log('db connnected');
    await createTables();
    console.log('tables created');
    await seed();
    app.use('/api', apiRouter)
    app.listen(process.env.PORT, () => {console.log(`app listening on port ${process.env.PORT}`);});
};


init();