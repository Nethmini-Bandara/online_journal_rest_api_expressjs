const mongoose = require('mongoose');

const localDB = "mongodb://127.0.0.1:27017/journalDB";
mongoose.set('strictQuery', false);

mongoose.connect(localDB);