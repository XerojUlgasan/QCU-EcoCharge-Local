const { db } = require("../firebase/connectToFirebase");

const getEnergyHistory = async () => {
    const snapshot = await db.collection("energyHistory").get()

    snapshot.forEach(snap => {
        const data = snap.data()
    })
}

module.exports = {getEnergyHistory}