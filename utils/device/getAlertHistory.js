const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")
const timestampToDatetime = require("../timestampToDatetime")

const getAlertHistory = async () => {
    const cname = "alertHistory"
    const snapshot = await db.collection(cname).get()

    snapshot.forEach(doc => {
        const data = doc.data()
        const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

        const query = `INSERT INTO ${sqlTable} VALUES ("${doc.id}", 
                                                    "${data.device_id}",
                                                    ${data.max_batt ? `${timestampToDatetime(data.max_batt)}` : 'NULL'},
                                                    ${data.min_batt ? `${timestampToDatetime(data.min_batt)}` : 'NULL'},
                                                    ${data.max_temp ? `${timestampToDatetime(data.max_temp)}` : 'NULL'},
                                                    ${data.min_temp ? `${timestampToDatetime(data.min_temp)}` : 'NULL'})`
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

module.exports = {getAlertHistory}