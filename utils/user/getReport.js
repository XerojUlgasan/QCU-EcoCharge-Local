const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")
const timestampToDatetime = require("../timestampToDatetime")

const getReport = async () => {
    const cname = "reports"
    const snapshot = await db.collection(cname).get()

    snapshot.forEach(doc => {
        const data = doc.data()
        const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

        const query = `INSERT INTO ${sqlTable} VALUES ("${doc.id}",
                                                    "${data.device_id}",
                                                    "${data.user_id}",
                                                    ${timestampToDatetime(data.dateTime)},
                                                    "${data.name}",
                                                    "${data.email}",
                                                    "${data.description}",
                                                    "${data.type}",
                                                    "${data.status}",
                                                    "${data.urgencyLevel}",
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

module.exports = {getReport}