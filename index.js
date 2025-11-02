const express = require("express");
const { CONFIG } = require("./config");
const { getAdmin, listenToAdmin } = require("./utils/admin/getAdmin");
const { getDevice, listenToDevice } = require("./utils/device/getDevice");
const { getUser, listenToUser } = require("./utils/user/getUser");
const { getAlert, listenToAlert } = require("./utils/device/getAlert");
const { getAlertHistory, listenToAlertHistory } = require("./utils/device/getAlertHistory");
const { getDeviceConfig, listenToDeviceConfig } = require("./utils/device/getDeviceConfig");
const { getEnergyHistory, listenToEnergyHistory } = require("./utils/device/getEnergyHistory");
const { getSession, listenToSession } = require("./utils/device/getSession");
const { getContact, listenToContact } = require("./utils/user/getContact");
const { getRating, listenToRating } = require("./utils/user/getRating");
const { getReport, listenToReport } = require("./utils/user/getReport");
const app = express();

app.listen(CONFIG.PORT, () => {
    console.log("Listening to PORT " + CONFIG.PORT)
    console.log("http://localhost:" + CONFIG.PORT)

    // getAdmin();
    // getDevice();
    // getUser();

    // getAlert();
    // getAlertHistory()
    // getDeviceConfig()
    // getEnergyHistory()
    // getSession()
    
    // getContact()
    // getRating()
    // getReport()

    listenToAdmin()
    listenToDevice()
    listenToUser()

    listenToAlert()
    listenToAlertHistory()
    listenToDeviceConfig()
    listenToEnergyHistory()
    listenToSession()
    listenToContact()
    listenToRating()
    listenToReport()
})