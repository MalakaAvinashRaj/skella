const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    wallet: {
        type: String,
        required: true
    },
    mailId: {
        type: String,
        required: true
    },
    Mobile: {
        type: Number,
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    
});

const myDB = mongoose.connection.useDb('merch');

module.exports = myDB.model('customer', customerSchema);