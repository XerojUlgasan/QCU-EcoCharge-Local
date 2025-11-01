const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")

const getAdmin = async () => {
    const cname = "supsuperAdminer"
    const snapshot = await db.collection("superAdmin").get()

    snapshot.forEach(doc => {
        const data = doc.data()
        
        conn.query()
    })

    return
}

module.exports = {getAdmin}