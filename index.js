const express = require('express');
const { Entry, SavedEntry } = require('./model');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(cors());
app.use(express.json({}));

app.get("/entries",(req,res)=>{
    res.setHeader("Content-Type", "application/json");
    Entry.find({}, (err, entries)=>{
        if(err!=null){
            res.status(500).json({
                error: err,
                message: "Could not load entries"
            });
            return;
        }
        res.status(200).json(entries);
        req.local = {error: "Error: did not work."}
    });
});


app.get("/entries/:id",(req,res)=>{
    res.setHeader("Content-Type", "application/json")
    Entry.findById(req.params.id, (err, entry)=>{
        if (err !=null){
            res.status(500).json({
                error: err,
                message: "Could not get the specified entry",
            });
        } else if(entry === null){
            res.status(404).json({
                message: "Entry does not exist"
            });
        }else {
            res.status(200).json(entry);
        }
    });
});

app.post("/entries",(req,res)=>{
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
    //finish up this method
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





app.listen(port,() =>{
    console.log(`App is listening on port ${port}`);
});