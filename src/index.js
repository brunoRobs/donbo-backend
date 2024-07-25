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

app.get('/search', async (req, res) => {
    const title = req.query.title;
    const books = await database.search(title)
    res.send(books);
});

app.post('/register', async (req, res) => {
    const { userData, credentials, address } = req.body;
    const success = await database.register(userData, credentials, address);
    if (success) res.status(200).send();
    else res.status(400).send();
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const success = await database.login(username, password);
    if (success) res.status(200).send();
    else res.status(400).send();
});

app.get('/filter', async (req, res) => {
    const genero = req.query.genero;
    const success = await database.filter(genero);
    if (success) res.status(200).send(success);
    else res.status(400).send();
});

const server = app.listen(8080, '26.60.40.255', () => {
    console.log('Server inicialized...');
});

// const fs = require('fs');

// async function inserirImagem(caminhoDaImagem ,isbn) {
//     try {
//         const client = await pool.connect();
//         const dadosDaImagem = fs.readFileSync(caminhoDaImagem);

//         const query = 'UPDATE Livro SET imagem = $1 WHERE isbn = $2';
//         const values = [dadosDaImagem, isbn];

//         console.log(dadosDaImagem);

//         await client.query(query, values);
//         client.release();
//         console.log('Imagem inserida com sucesso.');
//     } catch (err) {
//         console.error('Erro ao inserir imagem:', err);
//     }
// }

// const { Pool } = require('pg');

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'donbo_db',
//     password: '123456',
//     port: 5432
// });

// async function inserirImagem() {
//     try {
//         const client = await pool.connect();

//         const livros =  [
//             {
//                 titulo: "Dom Casmurro",
//                 autor: "Machado de Assis",
//                 editora: "Editora 34",
//                 genero: "Romance"
//             },
//             {
//                 titulo: "Grande Sertão: Veredas",
//                 autor: "João Guimarães Rosa",
//                 editora: "Nova Fronteira",
//                 genero: "Romance"
//             },
//             {
//                 titulo: "O Morro dos Ventos Uivantes",
//                 autor: "Emily Brontë",
//                 editora: "Martin Claret",
//                 genero: "Romance"
//             },
//             {
//                 titulo: "1984",
//                 autor: "George Orwell",
//                 editora: "Companhia das Letras",
//                 genero: "Ficção Científica"
//             },
//             {
//                 titulo: "Cem Anos de Solidão",
//                 autor: "Gabriel García Márquez",
//                 editora: "Record",
//                 genero: "Ficção"
//             },
//             {
//                 titulo: "O Senhor dos Anéis",
//                 autor: "J.R.R. Tolkien",
//                 editora: "HarperCollins Brasil",
//                 genero: "Fantasia"
//             },
//             {
//                 titulo: "A Revolução dos Bichos",
//                 autor: "George Orwell",
//                 editora: "Companhia das Letras",
//                 genero: "Ficção"
//             },
//             {
//                 titulo: "Orgulho e Preconceito",
//                 autor: "Jane Austen",
//                 editora: "Martin Claret",
//                 genero: "Romance"
//             },
//             {
//                 titulo: "O Apanhador no Campo de Centeio",
//                 autor: "J.D. Salinger",
//                 editora: "Editora do Autor",
//                 genero: "Romance"
//             },
//             {
//                 titulo: "A Metamorfose",
//                 autor: "Franz Kafka",
//                 editora: "Companhia das Letras",
//                 genero: "Ficção"
//             },
//             {
//                 titulo: "A Menina que Roubava Livros",
//                 autor: "Markus Zusak",
//                 editora: "Intrínseca",
//                 genero: "Drama"
//             },
//             {
//                 titulo: "O Pequeno Príncipe",
//                 autor: "Antoine de Saint-Exupéry",
//                 editora: "Agir",
//                 genero: "Ficção"
//             },
//             {
//                 titulo: "A Guerra dos Tronos",
//                 autor: "George R.R. Martin",
//                 editora: "LeYa",
//                 genero: "Fantasia"
//             },
//             {
//                 titulo: "O Código Da Vinci",
//                 autor: "Dan Brown",
//                 editora: "Arqueiro",
//                 genero: "Suspense"
//             },
//             {
//                 titulo: "O Alquimista",
//                 autor: "Paulo Coelho",
//                 editora: "Rocco",
//                 genero: "Ficção"
//             },
//             {
//                 titulo: "Harry Potter e a Pedra Filosofal",
//                 autor: "J.K. Rowling",
//                 editora: "Rocco",
//                 genero: "Fantasia"
//             },
//             {
//                 titulo: "Moby Dick",
//                 autor: "Herman Melville",
//                 editora: "Cosac Naify",
//                 genero: "Aventura"
//             },
//             {
//                 titulo: "Crime e Castigo",
//                 autor: "Fiódor Dostoiévski",
//                 editora: "Editora 34",
//                 genero: "Ficção"
//             },
//             {
//                 titulo: "O Iluminado",
//                 autor: "Stephen King",
//                 editora: "Suma",
//                 genero: "Terror"
//             },
//             {
//                 titulo: "A Divina Comédia",
//                 autor: "Dante Alighieri",
//                 editora: "Editora 34",
//                 genero: "Poesia"
//             }
//         ];

//         for (let i = 0; i < livros.length; i++) {
//             const query = `INSERT INTO Livro (titulo, autor, editora, genero) VALUES ('${livros[i].titulo}', '${livros[i].autor}', '${livros[i].editora}', '${livros[i].genero}')`;
//             await client.query(query);
//         }

//         client.release();
//     } catch (err) {
//         console.error('Erro ao inserir imagem:', err);
//     }
// }

// inserirImagem()