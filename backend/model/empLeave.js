const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const empLeaveSchema = mongoose.Schema({
phone: {type:String ,required:true},
name: {type:String },

leaveFrom: {type:Date},
leaveTo:{type: Date},
leaveType:{type:String},
empStatus:{type:String},
leaveTime:{type:String},
reason:{type:String},
leaveRemaining: {type:String},
deleted:{type:Boolean}
});

empLeaveSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Leave",empLeaveSchema );