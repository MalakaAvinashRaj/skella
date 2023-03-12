const mongoose = require('mongoose');
require('dotenv').configure;


const connectDB = async () => {
    try {
        mongoose.connect("mongodb+srv://Silly2:test123@cluster0.e5m3fvh.mongodb.net/?retryWrites=true&w=majority", { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;
