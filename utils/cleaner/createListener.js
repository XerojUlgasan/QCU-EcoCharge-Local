const { db } = require("../firebase/connectToFirebase")

const createListener = async (collectionName, callback) => {
    console.log("listening to : " + collectionName) //

    db.collection(collectionName).onSnapshot(async (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
            const data = change.doc.data()

            const load = {
                collectionName: collectionName,
                id: change.doc.id,
                type: change.type,
                data: data
            }
            console.log(load)
            if(callback){
                await callback(load)
            }
        })
    })
}

module.exports = createListener