const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config");
const { db } = require("../firebase/connectToFirebase");
const conn = require("../mysql/connectToMysql");
const timestampToDatetime = require("../timestampToDatetime");

const getDevice = async () => {
    const cname = "devices"
    const snapshot = await db.collection(cname).get()

    snapshot.forEach(doc => {
        const data = doc.data()
        const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

        const query = `INSERT INTO ${sqlTable} VALUES ("${doc.id}", 
                                                    "${data.name}",
                                                    "${data.building}",
                                                    "${data.location}",
                                                    ${timestampToDatetime(data.date_added)})`
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

module.exports = {getDevice}