const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")
const timestampToDatetime = require("../timestampToDatetime")

const getRating = async () => {
    const cname = "ratings"
    const snapshot = await db.collection(cname).get()

    snapshot.forEach(doc => {
        const data = doc.data()
        const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

        const query = `INSERT INTO ${sqlTable} VALUES ("${doc.id}",
                                                    "${data.user_id}",
                                                    ${timestampToDatetime(data.dateTime)},
                                                    "${data.email}",
                                                    "${data.name}",
                                                    "${data.building}",
                                                    "${data.location}",
                                                    "${data.comment}",
                                                    ${data.rate},
                                                    "${data.photo}")`

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

module.exports = {getRating}