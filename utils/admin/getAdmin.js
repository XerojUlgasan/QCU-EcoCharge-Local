
const {db} = require("../firebase/connectToFirebase")

const getAdmin = async () => {
    const snapshot = await db.collection("superAdmin").get()

    snapshot.forEach(doc => {
        const data = doc.data()
        
    })

    return
}

module.exports = {getAdmin}