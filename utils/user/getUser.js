const { db } = require("../firebase/connectToFirebase");

const getUser = async () => {
    const snapshot = await db.collection("users").get()

    snapshot.forEach(snap => {
        const data = snap.data()
    })
}

module.exports = {getUser}