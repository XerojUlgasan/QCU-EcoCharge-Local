const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const { db } = require("../firebase/connectToFirebase");
const timestampToDatetime = require("../timestampToDatetime");
const conn = require("../mysql/connectToMysql")

const cname = "users"

const getUser = async () => {
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

const listenToUser = () => {
    db.collection(cname).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const data = change.doc.data()
            const id = change.doc.id
            const type = change.type
            const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

            if(type === "added"){
                const query = `INSERT INTO ${sqlTable} VALUES ("${id}", 
                                                    "${data.email}",
                                                    "${data.full_name}",
                                                    ${data.last_login ? `${timestampToDatetime(data.last_login)}` : 'NULL'},
                                                    ${data.last_logout ? `${timestampToDatetime(data.last_logout)}` : 'NULL'})`

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
                                email = "${data.email}",
                                full_name = "${data.full_name}",
                                last_login = ${data.last_login ? `${timestampToDatetime(data.last_login)}` : 'NULL'},
                                last_logout = ${data.last_logout ? `${timestampToDatetime(data.last_logout)}` : 'NULL'}
                                WHERE user_id = "${id}"`

                conn.query(query, (err, res) => {
                    if(err){
                        console.log(err.message)
                        return
                    }
                    console.log(cname + " : modified")
                })
            }

            if(type === "removed"){
                const query = `DELETE FROM ${sqlTable} WHERE user_id = "${id}"`
                
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

module.exports = {getUser, listenToUser}