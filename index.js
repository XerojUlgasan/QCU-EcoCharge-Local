const express = require("express");
const { CONFIG } = require("./config");
const { getAdmin } = require("./utils/admin/getAdmin");
const { getDevice } = require("./utils/device/getDevice");
const { getUser } = require("./utils/user/getUser");
const { getAlert } = require("./utils/device/getAlert");
const { getAlertHistory } = require("./utils/device/getAlertHistory");
const { getDeviceConfig } = require("./utils/device/getDeviceConfig");
const { getEnergyHistory } = require("./utils/device/getEnergyHistory");
const { getSession } = require("./utils/device/getSession");
const { getContact } = require("./utils/user/getContact");
const { getRating } = require("./utils/user/getRating");
const { getReport } = require("./utils/user/getReport");
const app = express();

app.listen(CONFIG.PORT, () => {
    console.log("Listening to PORT " + CONFIG.PORT)
    console.log("http://localhost:" + CONFIG.PORT)

    getAdmin();
    getDevice();
    getUser();

    getAlert();
    getAlertHistory()
    getDeviceConfig()
    getEnergyHistory()
    getSession()
    
    getContact()
    getRating()
    getReport() 
})