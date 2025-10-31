const { db } = require("../firebase/connectToFirebase");

const getDevice = async () => {
    const snapshot = await db.collection("devices").get()

    snapshot.forEach(snap => {
        const data = snap.data()
    })
}

module.exports = {getDevice}