const express = require("express");
const { CONFIG } = require("./config");
const { getAdmin } = require("./utils/admin/getAdmin");
const { getDevice } = require("./utils/device/getDevice");
const app = express();

app.listen(CONFIG.PORT, () => {
    console.log("Listening to PORT " + CONFIG.PORT)
    console.log("http://localhost:" + CONFIG.PORT)

    getAdmin();
    getDevice()
})