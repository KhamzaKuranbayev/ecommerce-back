const MySqli = require('mysqli');

let conn = new MySqli({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'St@rt123',
    db: 'mega_shop'
});

let db = conn.emit(false, '');

module.exports = {
    database: db
}