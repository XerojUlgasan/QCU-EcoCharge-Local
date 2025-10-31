const { db } = require("../firebase/connectToFirebase");

const getDeviceConfig = async () => {
    const snapshot = await db.collection("deviceConfig").get()

    snapshot.forEach(snap => {
        const data = snap.data()
    })
}

module.exports = {getDeviceConfig}