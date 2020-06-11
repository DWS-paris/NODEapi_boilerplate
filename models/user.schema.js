/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
    const jwt = require('jsonwebtoken'); // https://www.npmjs.com/package/jsonwebtoken
//


/*
Definition
*/
    const MySchema = new Schema({
        name: String,
        email: { unique: true, type: String },
        password: String
    });
//

/* 
Methods
*/
    MySchema.methods.generateJwt = (user) => {
        
        // set expiration
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 59);

        const jwtObj = {
            _id: user._id,
            email: user.email,
            expireIn: '10s',
            exp: parseInt(expiry.getTime() / 100, 10)
        };

        // JWT creation 'HtKNZ24utVB1V21F67UNRxgp9RZIcO'
        return jwt.sign(jwtObj, process.env.JWT_SECRET )
    };
//

/*
Export
*/
    const MyModel = mongoose.model('user', MySchema);
    module.exports = MyModel;
//