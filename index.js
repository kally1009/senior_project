const express = require('express');
const { Entry, SavedEntry } = require('./model');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(cors());
app.use(express.json({}));

app.get("/entries",async (req,res)=>{
    res.setHeader("Content-Type", "application/json");
    try{
        let result = await Entry.find()
        res.status(200).json(result);
    } catch (error){
        res.status(500).json(error);
    }
});


app.get("/entries/:id",async (req,res)=>{
    res.setHeader("Content-Type", "application/json");
    try{
        let result = await Entry.findById(req.params.id);
        res.status(200).json(result);
    } catch (error){
        if(error!=null){
            res.status(500).json({error: error, message: "Could not get the specified entry"});
        }
        else if(result === null){
            res.status(404).json({message: "Entry does not exist"})
        }
    }
});

app.post("/entries",async (req,res)=>{
    res.setHeader("Content-Type", "application/json")
    let createdEntry = new Entry({
        date: req.body.date,
        mood: req.body.mood,
        activites: req.body.activites,
        journal: req.body.journal,

    });
    createdEntry.save().then(()=>{
        res.status(201).send("created");

    }).catch((error)=>{
        if (error.errors){
            let errorMessages = {};
            for(let e in error.errors){
              errorMessages[e] = error.errors[e].message
            }
            res.status(422).json(errorMessages)
          }else{
            console.error("Error Occured while creating an mood entry:", error);
        res.status(500).send("Server error");
        };
    })
});

app.put("/entries:id",(req,res)=>{
    res.setHeader("Content-Type", "application/json");
    console.log("updating entry");
    let updatedEntry = {
        date: req.body.date,
        mood: req.body.mood,
        activites: req.body.activites
    };
    Entry.update({_id: req.params.id},{$set: updatedEntry}, function(err, updateOneResponse){
        if (err){
            res.status(500).json({
                error: err,
                message: "Unable to update the entry"
            });
            return;
        }
        /*else if (updateOneResponse === 0){
            res.status(404).send(JSON.stringify({
                error: "Unable to update entry"
            }));
            return;
        };*/
        res.status(200).json(updateOneResponse);

    });
});

app.delete("/entries:id",(req,res)=>{
    res.setHeader("Content-Type", "application/json");
    Entry.findByIdAndDelete(req.params.id,(err,entry)=>{
        if(err){
            res.status(500).json({
                error: err,
                message: "Cannot Delete Entry"
            });
        } else if (entry==null){
            console.log("unable to find entry");
            res.status(404);

        }else{
            res.status(200).json(entry);
        }
    });
});

app.post("/journals",(req,res)=>{
    res.setHeader("Content-Type","application/json");
    console.log("Creating a journal entry");

    let newJournal = {
        title: req.body.title || "",
        body: req.body.body || "",
        entry_id: req.body.entry_id || "", //put an error here
    };
    Entry.findByIdAndUpdate(
        req.body.entry_id,
        { $push: {journal: newJournal}},
        { new : true},
        (err, entry)=>{
            if(err!=null){
                res.status(500).json({
                    error: err,
                    message: "Unable to add a journal entry to this mood entry"
                });
            } else if(story === null){
                res.status(404);
                console.log("Mood Entry does not exist. Can't make a journal entry.");
            } else {
                res.status(201).json(entry.journal[entry.journal.length -1]);
            }
        }
    );
});




app.listen(port,() =>{
    console.log(`App is listening on port ${port}`);
});

module.exports = app;