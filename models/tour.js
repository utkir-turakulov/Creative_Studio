const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let toursSchema = new Schema({

    img: { data: Buffer, contentType: String, filename:String },
    name: String,
    country: String,
    city: String,
    price: Number
});

let Tour = mongoose.model('tour',toursSchema);
module.exports = Tour;


