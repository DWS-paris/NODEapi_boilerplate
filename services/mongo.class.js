/* 
Import
*/
    // NPM moodules
    const mongoose = require('mongoose'); //=> https://www.npmjs.com/package/mongoose
//

/* 
Define class
*/
    class MONGOClass {
        constructor(){
            // Set MongoDB url
            this.mongoUrl = process.env.MONGO_URL;
        };

        connectDb(){
            return new Promise( (resolve, reject) => {
                mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
                .then( db => resolve( { db: db, url: this.mongoUrl } ))
                .catch( dbErr => reject(`MongoDB not connected`, dbErr) )
            });
        };
    };
//

/* 
Export class
*/
    module.exports = MONGOClass;
//