const { db } = require("../firebase/connectToFirebase");

const getAlert = async () => {
    const snapshot = await db.collection("alerts").get()

    snapshot.forEach(snap => {
        const data = snap.data()
    })
}

module.exports = {getAlert}