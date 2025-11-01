const createListener = require("./createListener");
const implementSql = require("./implementLocalSql/implementSql");
const { FIREBASE_TABLES } = require("../../config");

const initializeListener = async () => {

    FIREBASE_TABLES.forEach(table => {
        createListener(table, implementSql)
    })
}

module.exports = {initializeListener}