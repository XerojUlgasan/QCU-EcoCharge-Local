const { db } = require("../firebase/connectToFirebase");

const getReport = async () => {
    const snapshot = await db.collection("reports").get()

    snapshot.forEach(snap => {
        const data = snap.data()
    })
}

module.exports = {getReport}