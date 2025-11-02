const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const { db } = require("../firebase/connectToFirebase");
const timestampToDatetime = require("../timestampToDatetime");
const conn = require("../mysql/connectToMysql")

const getUser = async () => {
    const cname = "users"
    const snapshot = await db.collection(cname).get()

    snapshot.forEach(doc => {
        const data = doc.data()
        const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

        const query = `INSERT INTO ${sqlTable} VALUES ("${doc.id}", 
                                                    "${data.email}",
                                                    "${data.full_name}",
                                                    ${data.last_login ? `${timestampToDatetime(data.last_login)}` : 'NULL'},
                                                    ${data.last_logout ? `${timestampToDatetime(data.last_logout)}` : 'NULL'})`
        conn.query(query, (err, res, fields) => {
            if(err){
                console.log(cname)
                console.log(sqlTable)
                console.log(err.message)
                console.log()
                return
            }
            console.log(cname + " : good")
        })
    })

    return
}

module.exports = {getUser}