const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")

const getDeviceConfig = async () => {
    const cname = "deviceConfig"
    const snapshot = await db.collection(cname).get()

    snapshot.forEach(doc => {
        const data = doc.data()
        const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

        const query = `INSERT INTO ${sqlTable} VALUES ("${doc.id}", 
                                                    "${data.device_id}",
                                                    ${data.device_enabled ? 1 : 0},
                                                    ${data.device_alert_enabled ? 1 : 0},
                                                    ${data.threat ?? 'NULL'},
                                                    ${data.max_batt ?? 'NULL'},
                                                    ${data.min_batt ?? 'NULL'},
                                                    ${data.max_temp ?? 'NULL'},
                                                    ${data.min_temp ?? 'NULL'},
                                                    ${data.minute_per_peso ?? 'NULL'},
                                                    ${data.samples_per_hour ?? 'NULL'},
                                                    ${data.update_gap_seconds ?? 'NULL'})`

        conn.query(query, (err, res, fields) => {
            if(err){
                console.log(cname)
                console.log(sqlTable)
                console.log(err.message)
                console.log()
                return
            }
            console.log(cname + " : good")
        })
    })

    return
}

module.exports = {getDeviceConfig}