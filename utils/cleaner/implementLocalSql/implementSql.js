const mysql = require("mysql2");
const { MYSQL_TABLES, MYSQL_TABLES_COLUMNS } = require("../../../config");
require('dotenv').config();

const conn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DABA
})

conn.connect((err) => {
    if(err){
        console.log(err.message)
    }
    console.log(MYSQL_TABLES_COLUMNS[MYSQL_TABLES.indexOf("tbl_admin")].toString())
    console.log("connected!")
})

const implementSql = async (data) => {
    conn.query("SELECT * FROM tbl_admin", (err, res, fields) => {
        if(err) {
            console.log(err.message)
        }
    })
}

module.exports = implementSql