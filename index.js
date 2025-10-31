const express = require("express");
const { CONFIG } = require("./config");
const { initializeGetter, initializeListener } = require("./utils/cleaner/initialization");
const app = express();

app.listen(CONFIG.PORT, () => {
    console.log("Listening to PORT " + CONFIG.PORT)
    console.log("http://localhost:" + CONFIG.PORT)

    initializeGetter();
    initializeListener();
})