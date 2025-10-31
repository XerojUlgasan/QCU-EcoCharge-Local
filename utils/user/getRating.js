const { db } = require("../firebase/connectToFirebase");

const getRating = async () => {
    const snapshot = await db.collection("ratings").get()

    snapshot.forEach(snap => {
        const data = snap.data()
    })
}

module.exports = {getRating}