const { MYSQL_TABLES, FIREBASE_TABLES } = require("../../config")
const {db} = require("../firebase/connectToFirebase")
const conn = require("../mysql/connectToMysql")

const cname = "deviceConfig"

const getDeviceConfig = async () => {
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

const listenToDeviceConfig = () => {
    db.collection(cname).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const data = change.doc.data()
            const id = change.doc.id
            const type = change.type
            const sqlTable = MYSQL_TABLES[FIREBASE_TABLES.indexOf(cname)].toString()

            if(type === "added"){
                const query = `INSERT INTO ${sqlTable} VALUES ("${id}", 
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

                conn.query(query, (err, res) => {
                    if(err){
                        console.log(cname)
                        console.log(sqlTable)
                        console.log(err.message)
                        console.log()
                        return
                    }
                    console.log(cname + " : added")
                })
            }

            if(type === "modified"){
                const query = `UPDATE ${sqlTable} SET 
                                device_id = "${data.device_id}",
                                device_enabled = ${data.device_enabled ? 1 : 0},
                                device_alert_enabled = ${data.device_alert_enabled ? 1 : 0},
                                threat = ${data.threat ?? 'NULL'},
                                max_batt = ${data.max_batt ?? 'NULL'},
                                min_batt = ${data.min_batt ?? 'NULL'},
                                max_temp = ${data.max_temp ?? 'NULL'},
                                min_temp = ${data.min_temp ?? 'NULL'},
                                minute_per_peso = ${data.minute_per_peso ?? 'NULL'},
                                samples_per_hour = ${data.samples_per_hour ?? 'NULL'},
                                update_gap_seconds = ${data.update_gap_seconds ?? 'NULL'}
                                WHERE deviceConfig_id = "${id}"`

                conn.query(query, (err, res) => {
                    if(err){
                        console.log(err.message)
                        return
                    }
                    console.log(cname + " : modified")
                })
            }

            if(type === "removed"){
                const query = `DELETE FROM ${sqlTable} WHERE deviceConfig_id = "${id}"`
                
                conn.query(query, (err, res) => {
                    if(err){
                        console.log(err.message)
                        return
                    }
                    console.log(cname + " : removed")
                })
            }
        })
    })
}

module.exports = {getDeviceConfig, listenToDeviceConfig}