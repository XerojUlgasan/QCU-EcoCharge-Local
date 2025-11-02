const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")
const timestampToDatetime = require("../timestampToDatetime")

const cname = "alertHistory"

const getAlertHistory = async () => {
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

const listenToAlertHistory = () => {
    db.collection(cname).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const data = change.doc.data()
            const id = change.doc.id
            const type = change.type
            const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

            if(type === "added"){
                const query = `INSERT INTO ${sqlTable} VALUES ("${id}", 
                                                    "${data.device_id}",
                                                    ${data.max_batt ? `${timestampToDatetime(data.max_batt)}` : 'NULL'},
                                                    ${data.min_batt ? `${timestampToDatetime(data.min_batt)}` : 'NULL'},
                                                    ${data.max_temp ? `${timestampToDatetime(data.max_temp)}` : 'NULL'},
                                                    ${data.min_temp ? `${timestampToDatetime(data.min_temp)}` : 'NULL'})`

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
                                max_batt = ${data.max_batt ? `${timestampToDatetime(data.max_batt)}` : 'NULL'},
                                min_batt = ${data.min_batt ? `${timestampToDatetime(data.min_batt)}` : 'NULL'},
                                max_temp = ${data.max_temp ? `${timestampToDatetime(data.max_temp)}` : 'NULL'},
                                min_temp = ${data.min_temp ? `${timestampToDatetime(data.min_temp)}` : 'NULL'}
                                WHERE alertHistory_id = "${id}"`

                conn.query(query, (err, res) => {
                    if(err){
                        console.log(err.message)
                        return
                    }
                    console.log(cname + " : modified")
                })
            }

            if(type === "removed"){
                const query = `DELETE FROM ${sqlTable} WHERE alertHistory_id = "${id}"`
                
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

module.exports = {getAlertHistory, listenToAlertHistory}