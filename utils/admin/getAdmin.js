const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")

const getAdmin = async () => {
    const cname = "superAdmin"
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

        console.log(query)
        conn.query(query, (err, res, fields) => {
            if(err){
                console.log(err.message)
                return
            }
            console.log("good")
        })
    })

    return
}

module.exports = {getAdmin}