const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let hotelsSchema = new Schema({

    img: { data: Buffer, contentType: String, filename:String  },
    name: String,
    country: String,
    city: String,
    price: Number
});

let Hotel = mongoose.model('hotel',hotelsSchema);
module.exports = Hotel;