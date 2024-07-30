const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'donbo_db',
    password: '123456',
    port: 5432
});

async function search(title) {
    const client = await pool.connect();
    if (title) {
        title = `%${title}%`;
        const query = 'SELECT * FROM Book WHERE title ILIKE $1 ORDER BY title ASC'
        const values = [title]
        const result = await client.query(query, values);
        const books = result.rows;
        return books;
    }
    const result = await client.query('SELECT * FROM Book ORDER BY title ASC');
    const books = result.rows;
    client.release();
    return books;
}

async function filterByGenre(genre) {
    const client = await pool.connect();

    let books;

    if (genre) {
        const query = 'SELECT * FROM Literature WHERE genre = $1';
        const value = [genre]

        const result = await client.query(query, value);
        books = result.rows;
    } else {
        const query = 'SELECT * FROM Literature';

        const result = await client.query(query);
        books = result.rows;
    }

    client.release();
    return books;
}

async function filterBySubject(subject) {
    const client = await pool.connect();

    let books;
    if (subject) {
        const query = 'SELECT * FROM Academic WHERE subject = $1';
        const value = [subject]

        const result = await client.query(query, value);
        books = result.rows;
    } else {
        const query = 'SELECT * FROM Academic';

        const result = await client.query(query);
        books = result.rows;
    }

    client.release();
    return books;
}

async function genreList() {
    const client = await pool.connect();

    const query = 'SELECT genre FROM Literature GROUP BY genre ORDER BY genre ASC';

    const result = await client.query(query);
    const books = result.rows;

    client.release();
    return books;
}

async function subjectList() {
    const client = await pool.connect();

    const query = 'SELECT subject FROM Academic GROUP BY subject ORDER BY subject ASC';

    const result = await client.query(query);
    const books = result.rows;

    client.release();
    return books;
}

async function login(username, password) {
    const client = await pool.connect();

    let query = "SELECT * FROM Credentials WHERE username = $1 AND userPassword = $2";
    let values = [username, password];

    const exists = await client.query(query, values).then(response => response.rowCount);
    client.release();
    if (exists) return true;
    return false;
}

async function register(userData, credentials, address) {
    const client = await pool.connect();

    let query = "SELECT cpf FROM UserDonbo WHERE cpf = $1";
    let values = [userData.cpf];

    const exists = await client.query(query, values).then(response => response.rowCount);

    if (exists) return false;
    else {
        try {
            query = "INSERT INTO UserDonbo(cpf, firstName, lastName, birthDate) VALUES ($1, $2, $3, $4)";
            values = [userData.cpf, userData.firstName, userData.lastName, userData.birthDate];
            let success = (await client.query(query, values)).rowCount;

            query = "INSERT INTO Credentials(cpf, email, username, userpassword) VALUES ($1, $2, $3, $4)";
            values = [userData.cpf, credentials.email, credentials.username, credentials.password];
            success = (await client.query(query, values)).rowCount;

            query = "INSERT INTO Address(cpf, country, countrystate, city, neighborhood, street, streetnumber, complement, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);";
            values = [userData.cpf, address.country, address.countryState, address.city, address.neighborhood, address.street, address.streetNumber, address.complement, address.zipCode];
            success = (await client.query(query, values)).rowCount;

            return success;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            client.release();
        }
    }
}

module.exports = {
    search,
    register,
    login,
    filterByGenre,
    filterBySubject,
    genreList,
    subjectList
}