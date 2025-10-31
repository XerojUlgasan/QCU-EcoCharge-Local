const { db } = require("../firebase/connectToFirebase");

const getAlertHistory = async () => {
    const snapshot = await db.collection("alertHistory").get()

    snapshot.forEach(snap => {
        const data = snap.data()
    })
}

module.exports = {getAlertHistory}