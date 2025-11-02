const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")

const cname = "superAdmin"

const getAdmin = async () => {
    const snapshot = await db.collection(cname).get()

    snapshot.forEach(doc => {
        const data = doc.data()
        const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

        const query = `INSERT INTO ${sqlTable} VALUES ("${doc.id}", 
                                                    "${data.username}",
                                                    "${data.email}",
                                                    "${data.password}",
                                                    ${data.backup_email ? `"${data.backup_email}"` : 'NULL'},
                                                    ${data.full_name ? `"${data.full_name}"` : 'NULL'})`

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

const listenToAdmin = () => {
    db.collection(cname).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const data = change.doc.data()
            const id = change.doc.id
            const type = change.type

            const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

            if(type === "added"){
                const query = `INSERT INTO ${sqlTable} VALUES ("${id}", 
                                                    "${data.username}",
                                                    "${data.email}",
                                                    "${data.password}",
                                                    ${data.backup_email ? `"${data.backup_email}"` : 'NULL'},
                                                    ${data.full_name ? `"${data.full_name}"` : 'NULL'})`

                conn.query(query, (err, res, fields) => {
                    if(err){
                        console.log(cname)
                        console.log(sqlTable)
                        console.log(err.message)
                        console.log()
                        return
                    }
                    console.log(cname + " : " + type)
                })                                                    
            }

            if(type === "modified"){
                console.log("Modified document ID:", id)
                console.log("New data:", data)
                
                const query = `UPDATE ${sqlTable} SET 
                                username = "${data.username}",
                                email = "${data.email}",
                                password = "${data.password}",
                                backup_email = ${data.backup_email ? `"${data.backup_email}"` : 'NULL'},
                                full_name = ${data.full_name ? `"${data.full_name}"` : 'NULL'}
                                WHERE admin_id = "${id}"`

                conn.query(query, (err, res) => {
                    if(err){
                        console.log(err.message)
                        return
                    }
                    console.log(cname + " : " + type)
                })
            }

            if(type === "removed"){
                const query = `DELETE FROM ${sqlTable} WHERE admin_id = "${id}"`
                
                conn.query(query, (err, res) => {
                    if(err){
                        console.log(err.message)
                        return
                    }
                    console.log(cname + " : " + type)
                })
            }
        })
    })
}

module.exports = {getAdmin, listenToAdmin}