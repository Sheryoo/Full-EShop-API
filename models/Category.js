const mongoose = require("mongoose");

const categoryScheme = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    icon: {
        type:String,
    },
    color: {
        type:String,
    },
});

exports.Category = mongoose.model("Category", categoryScheme);
