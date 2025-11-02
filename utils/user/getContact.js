const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")
const timestampToDatetime = require("../timestampToDatetime")

const cname = "contactUs"

const getContact = async () => {
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

const listenToContact = () => {
    db.collection(cname).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const data = change.doc.data()
            const id = change.doc.id
            const type = change.type
            const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

            if(type === "added"){
                const query = `INSERT INTO ${sqlTable} VALUES ("${id}",
                                                    "${data.user_id}",
                                                    "${data.subject}",
                                                    "${data.message}",
                                                    "${data.from}",
                                                    ${data.hasRead ? 1 : 0},
                                                    ${data.responded ? 1 : 0},
                                                    "${data.photo_url}",
                                                    ${timestampToDatetime(data.timestamp)})`

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
                                user_id = "${data.user_id}",
                                subject = "${data.subject}",
                                message = "${data.message}",
                                \`from\` = "${data.from}",
                                hasRead = ${data.hasRead ? 1 : 0},
                                responded = ${data.responded ? 1 : 0},
                                photo_url = "${data.photo_url}",
                                timestamp = ${timestampToDatetime(data.timestamp)}
                                WHERE contact_id = "${id}"`

                conn.query(query, (err, res) => {
                    if(err){
                        console.log(err.message)
                        return
                    }
                    console.log(cname + " : modified")
                })
            }

            if(type === "removed"){
                const query = `DELETE FROM ${sqlTable} WHERE contact_id = "${id}"`
                
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

module.exports = {getContact, listenToContact}