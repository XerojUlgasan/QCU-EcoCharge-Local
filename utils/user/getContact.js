const { db } = require("../firebase/connectToFirebase");

const getContact = async () => {
    const snapshot = await db.collection("contactUs").get()

    snapshot.forEach(snap => {
        const data = snap.data()
    })
}

module.exports = {getContact}