const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const employeeSchema = mongoose.Schema({
  name: {type:String},
  address1: {type:String},
  address2: {type:String},
  city:{type:String},
  state:{type:String},
  zip:{type:String},
  country:{type:String},
  phone: {type:String },
  email: { type: String},
  emergencyContact: {type:String},
  dob: {type:Date},
  posTitle: {type:String},
  reportTo: {type:String},
  empType: {type:String},
  dept: {type:String},
  joinDate:{type:Date},
  endDate:{type:Date},
  lastOrg1: {type:String},
  duration1:{type:String},
  designation1: {type:String},
  lastOrg2: {type:String},
  duration2:{type:String},
  designation2: {type:String},
  bankName: {type:String},
  bankAccNo: {type:String},
  AccHolderName: {type:String},
  taxFileNo: {type:String},
  accType: {type:String},
  ifsc: {type:String},
  doc1:{type: String },
  doc2:{type: String },
  deleted:{type:Boolean},
  leaveRemaining: {type: Number}
});

employeeSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Employee",employeeSchema );