const { getAdmin } = require("../admin/getAdmin");
const { getDevice } = require("../device/getDevice");
const { getAlert } = require("../device/getAlert");
const { getAlertHistory } = require("../device/getAlertHistory");
const { getDeviceConfig } = require("../device/getDeviceConfig");
const { getSession } = require("../device/getSession");
const { getRating } = require("../user/getRating");
const { getReport } = require("../user/getReport");
const { getEnergyHistory } = require("../device/getEnergyHistory");
const { getContact } = require("../user/getContact");
const createListener = require("./createListener");
const { TABLES } = require("../../config");
const implementSql = require("./implementLocalSql/implementSql");

const initializeGetter = async () => {
    getAdmin();

    getAlert();
    getAlertHistory();
    getDevice();
    getDeviceConfig();
    getEnergyHistory();
    getSession();

    getContact();
    getRating();
    getReport();
}

const initializeListener = async () => {

    TABLES.forEach(table => {
        createListener(table, implementSql)
    })
}

module.exports = {initializeGetter, initializeListener}