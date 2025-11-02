const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")
const timestampToDatetime = require("../timestampToDatetime")

const getContact = async () => {
    const cname = "contactUs"
    const snapshot = await db.collection(cname).get()

    snapshot.forEach(doc => {
        const data = doc.data()
        const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

        const query = `INSERT INTO ${sqlTable} VALUES ("${doc.id}",
                                                    "${data.user_id}",
                                                    "${data.subject}",
                                                    "${data.message}",
                                                    "${data.from}",
                                                    ${data.hasRead ? 1 : 0},
                                                    ${data.responded ? 1 : 0},
                                                    "${data.photo_url}",
                                                    ${timestampToDatetime(data.timestamp)})`

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

module.exports = {getContact}