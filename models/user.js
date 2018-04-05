// 1
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// 2
const userSchema = new Schema({
    email: String,
    username: String,
    password: String
}, {

    // 3
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

// 4
const User = mongoose.model('user', userSchema);
module.exports = User;

module.exports.hashPassword = async (password) => {
    try {
        const salt = 'my salt'; //await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(password, salt);
        console.log("hash:" +hash);
        return await bcrypt.hash(password, salt);

    } catch(error) {
        throw new Error('Hashing failed', error)
    }
};

module.exports.comparePassword = (password,hash)=>{
    if(bcrypt.compareSync(password, hash)) {
        console.log('Password equal');
        return true;
    } else {
        console.log('Password is not equal');
        return false;
    }
};