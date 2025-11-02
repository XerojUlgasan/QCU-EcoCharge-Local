const timestampToDatetime = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
        return 'NULL';
    }
    
    const date = timestamp.toDate();
    const datetime = date.toISOString().slice(0, 19).replace('T', ' ');
    return `"${datetime}"`;
}

module.exports = timestampToDatetime;