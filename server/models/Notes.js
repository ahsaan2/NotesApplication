const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NoteSchema = new Schema({
user : {
    type: Schema.ObjectId, 
    reference : 'User',
},
title : {
    type : String, 
    required : true
},
body : {
    type : String, 
    required : true,
},
createAt : {
    type : Date,
    default : Date.now()
}

});
module.exports = mongoose.model("Note", NoteSchema);
