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
        const query = 'SELECT * FROM Livro WHERE titulo ILIKE $1'
        const values = [title]
        const result = await client.query(query, values);
        const books = result.rows;
        return books;
    }
    const result = await client.query('SELECT * FROM Livro');
    const books = result.rows;
    client.release();
    return books;
}

async function register(userData, credentials, address) {
    const client = await pool.connect();

    let query = "SELECT cpf FROM DonboUser WHERE cpf = $1";
    let values = [userData.cpf];

    const exists = await client.query(query, values).then(response => response.rowCount);

    if (exists) return false;
    else {
        try {
            query = "INSERT INTO DonboUser(cpf, firstName, lastName, birthDate) VALUES ($1, $2, $3, $4)";
            values = [userData.cpf, userData.firstName, userData.lastName, userData.birthDate];
            let success = (await client.query(query, values)).rowCount;

            query = "INSERT INTO DonboUserCredentials(cpf, email, username, userpassword) VALUES ($1, $2, $3, $4)";
            values = [userData.cpf, credentials.email, credentials.username, credentials.password];
            success = (await client.query(query, values)).rowCount;

            query = "INSERT INTO DonboUserAddress(cpf, country, countrystate, city, neighborhood, street, streetnumber, complement, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);";
            values = [userData.cpf, address.country, address.countryState, address.city, address.neighborhood, address.street, address.streetNumber, address.complement, address.zipCode];
            success = (await client.query(query, values)).rowCount;

            return success;
        } catch (error) {
            return false;
        } finally {
            client.release();
        }
    }
}

async function login(username, password) {
    const client = await pool.connect();

    let query = "SELECT * FROM DonboUserCredentials WHERE username = $1 AND userPassword = $2";
    let values = [username, password];

    const exists = await client.query(query, values).then(response => response.rowCount);
    client.release();
    if (exists) return true;
    return false;
}

async function filter(genero) {
    const client = await pool.connect();

    const result = await client.query(`SELECT titulo FROM Livro WHERE genero ILIKE '${genero}'`);
    const books = result.rows;

    client.release();
    return books;
}

module.exports = {
    search,
    register,
    login,
    filter
}