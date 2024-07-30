const express = require('express');

const cors = require('cors');

const database = require('./database');

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());


app.use(express.static('../public'));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const success = await database.login(username, password);
    if (success) res.status(200).send();
    else res.status(400).send();
});

app.post('/register', async (req, res) => {
    const { userData, credentials, address } = req.body;
    const success = await database.register(userData, credentials, address);
    if (success) res.status(200).send();
    else res.status(400).send();
});

app.get('/search', async (req, res) => {
    const title = req.query.title;
    const books = await database.search(title)
    res.send(books);
});

app.get('/filter', async (req, res) => {
    try {
        if (req.query.type === 'literature') {
            const genre = req.query.genre;
            const success = await database.filterByGenre(genre);
            if (success) res.status(200).send(success);
            else res.status(400).send();
        }
        else if (req.query.type === 'academic') {
            const subject = req.query.subject;
            const success = await database.filterBySubject(subject);
            if (success) res.status(200).send(success);
            else res.status(400).send();
        }
    } catch (error) {
        console.error(error);
    }
});

app.get('/list', async (req, res) => {
    try {
        if (req.query.type === 'genre') {
            const genreList = await database.genreList();
            if (genreList.length) res.status(200).send(genreList);
            else res.status(400).send();
        }
        else if (req.query.type === 'subject') {
            const subjectList = await database.subjectList();
            if (subjectList.length) res.status(200).send(subjectList);
            else res.status(400).send();
        }
    } catch (error) {
        console.error(error);
    }
});

const server = app.listen(8080, 'localhost', () => {
    console.log('Server inicialized...');
});
