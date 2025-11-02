const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")
const timestampToDatetime = require("../timestampToDatetime")

const cname = "reports"

const getReport = async () => {
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

const listenToReport = () => {
    db.collection(cname).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const data = change.doc.data()
            const id = change.doc.id
            const type = change.type
            const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

            if(type === "added"){
                const query = `INSERT INTO ${sqlTable} VALUES ("${id}",
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

                conn.query(query, (err, res) => {
                    if(err){
                        console.log(cname)
                        console.log(sqlTable)
                        console.log(err.message)
                        console.log()
                        return
                    }
                    console.log(cname + " : added")
                })
            }

            if(type === "modified"){
                const query = `UPDATE ${sqlTable} SET 
                                device_id = "${data.device_id}",
                                user_id = "${data.user_id}",
                                dateTime = ${timestampToDatetime(data.dateTime)},
                                name = "${data.name}",
                                email = "${data.email}",
                                description = "${data.description}",
                                type = "${data.type}",
                                status = "${data.status}",
                                urgencyLevel = "${data.urgencyLevel}",
                                photo = "${data.photo}"
                                WHERE report_id = "${id}"`

                conn.query(query, (err, res) => {
                    if(err){
                        console.log(err.message)
                        return
                    }
                    console.log(cname + " : modified")
                })
            }

            if(type === "removed"){
                const query = `DELETE FROM ${sqlTable} WHERE report_id = "${id}"`
                
                conn.query(query, (err, res) => {
                    if(err){
                        console.log(err.message)
                        return
                    }
                    console.log(cname + " : removed")
                })
            }
        })
    })
}

module.exports = {getReport, listenToReport}