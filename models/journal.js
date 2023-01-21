const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const journalSchema = mongoose.Schema({
    title: String,
    writer:String,
    jbody:String,
    uid:String
});

const Journal = mongoose.model("Journal", journalSchema);
journalSchema.plugin(passportLocalMongoose);

module.exports = Journal;