/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
//


/*
Definition
*/
    const MySchema = new Schema({
        title: String,
        content: String,
        image: String,
        author: String
    });
//

/*
Export
*/
    const MyModel = mongoose.model('post', MySchema);
    module.exports = MyModel;
//