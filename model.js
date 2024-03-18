require('dotenv').config();

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@cluster0.7bo4ldm.mongodb.net/?retryWrites=true&w=majority`);

const journalSchema = new mongoose.Schema({
    title:{
        type: String
    },
    body:{
        type: String,
        required: [true, "Please provide a body"]
    },
    entry_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Entry"
    }

},
{timestamps: true});

const entrySchema = new mongoose.Schema({
    date:{
        type: String,
        required: [true, "please pick a date"]
    },
    mood:{
        type: Number,
        required: [true, "please pick a mood"]
    },
    activities:[{
        type: String
    }],
    journal:[journalSchema]
},
{timestamps: true});



const savedEntrySchema = new mongoose.Schema({
    date:{
        type: String,
        required: [true, "Please pick a date"]
    },
    mood:{
        type: Number,
        required: [true, "Please pick a mood"]
    },
    activities:{
        type:[String]
    },
    journal:[journalSchema]
},
{timestamps: true});

const savedJournalSchema = new mongoose.Schema({
    title:{
        type: String
    },
    body:{
        type: String,
        required: [true, "Please provide a body"]
    },
    entry_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Entry"
    }

},
{timestamps: true}
);

const Entry = mongoose.model('Entry',entrySchema);
const SavedEntry = mongoose.model("SavedEntry", savedEntrySchema);
const SavedJournal = mongoose.model("SavedJournal", savedJournalSchema);

module.exports = {
    Entry, SavedEntry
}
