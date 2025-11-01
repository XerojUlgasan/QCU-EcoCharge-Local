const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config");
const { db } = require("../firebase/connectToFirebase");
const conn = require("../mysql/connectToMysql");

const getDevice = async () => {
    const cname = "devices"
    const snapshot = await db.collection(cname).get()

    snapshot.forEach(doc => {
        const data = doc.data()
        const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

        // Convert Firestore Timestamp to MySQL datetime format
        let dateAdded = 'NULL';
        if (data.date_added && typeof data.date_added.toDate === 'function') {
            const date = data.date_added.toDate();
            dateAdded = `"${date.toISOString().slice(0, 19).replace('T', ' ')}"`;
        }

        const query = `INSERT INTO ${sqlTable} VALUES ("${doc.id}", 
                                                    "${data.name}",
                                                    "${data.building}",
                                                    "${data.location}",
                                                    ${dateAdded})`

        console.log(query)
        conn.query(query, (err, res, fields) => {
            if(err){
                console.log(err.message)
            }
            console.log("good")
        })
    })

    return
}

module.exports = {getDevice}