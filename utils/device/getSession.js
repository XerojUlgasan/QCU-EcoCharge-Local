const { db } = require("../firebase/connectToFirebase");

const getSession = async () => {
    const snapshot = await db.collection("transactions").get()

    snapshot.forEach(snap => {
        const data = snap.data()
    })
}

module.exports = {getSession}