require('dotenv').config();

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@cluster0.7bo4ldm.mongodb.net/?retryWrites=true&w=majority`);

const journalSchema = new mongoose.Schema({
    title:{
        type: String
    },
    description:{
        type: String,
        required: [true, "Please provide a description"]
    },
    entry_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Entry"
    }

});

const entrySchema = new mongoose.Schema({
    date:{
        type: String,
        required: [true, "please pick a date"]
    },
    mood:{
        type: Number,
        required: [true, "please pick a mood"]
    },
    activities:{
        type:[String]
    },
    journal:[journalSchema]
});



const savedEntrySchema = new mongoose.Schema({
    //fill this in
});

const savedJournalSchema = new mongoose.Schema({
    //fill this in
});

const Entry = mongoose.model('Entry',entrySchema);
const SavedEntry = mongoose.model("SavedEntry", savedEntrySchema);
const SavedJournal = mongoose.model("SavedJournal", savedJournalSchema);

module.exports = {
    Entry, SavedEntry
}
