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
    db.collection(collection()).onSnapshot
}

module.exports = {getAdmin}