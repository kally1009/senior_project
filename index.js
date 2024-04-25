const express = require('express');
const { Entry, SavedEntry, Journal } = require('./model');
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
        activities: req.body.activities,
        journal: req.body.journal,

    });
    createdEntry.save().then((result)=>{
        res.status(201).json({"id": result._id});
        console.log("created entry");

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

app.put("/entries/:id",(req,res)=>{
    res.setHeader("Content-Type", "application/json");
    let updatedEntry = {
        date: req.body.date,
        mood: req.body.mood,
        activities: req.body.activities
    };
    Entry.updateOne({_id: req.params.id},{$set: updatedEntry}).then(()=>{
        console.log("Updated successfully");
        res.status(200).json(updatedEntry);
    }).catch((error)=>{
        if (error.errors){
            let errorMessages = {};
            for(let e in error.errors){
              errorMessages[e] = error.errors[e].message
            }
            res.status(404).json(errorMessages)
          }else{
            console.error("Error Occured while creating an mood entry:", error);
        res.status(500).send("Server error");
        };
    });
});

app.delete("/entries/:id",(req,res)=>{ 
    res.setHeader("Content-Type", "application/json");
    Entry.findByIdAndDelete(req.params.id).then(()=>{
        res.status(200).send("Deleted Successfully");
        console.log("Deleted")
    }).catch((error)=>{
        if(error.errors){
            let errorMessages = {};
            for(let e in error.errors){
              errorMessages[e] = error.errors[e].message
            }
            res.status(404).json(errorMessages);
        } else{
            console.log("Error occured while deleting entry");
            res.status(500).send("Server Error");

        };
    });
});


app.get("/stats",async (req,res)=>{
    res.setHeader("Content-Type", "application/json");


    let mood5query = {mood: 5};
    let mood4query = {mood: 4};
    let mood3query = {mood: 3};
    let mood2query = {mood: 2};
    let mood1query = {mood: 1};
    try{

        //mood counting/stats
        let mood5 = await Entry.find(mood5query);
        let mood5Count = mood5.length;
        let mood4 = await Entry.find(mood4query);
        let mood4Count = mood4.length;
        let mood3 = await Entry.find(mood3query);
        let mood3Count = mood3.length;
        let mood2 = await Entry.find(mood2query);
        let mood2Count = mood2.length;
        let mood1 = await Entry.find(mood1query);
        let mood1Count = mood1.length;
        let totalCount = mood5Count+mood4Count+mood3Count+mood2Count+mood1Count;
        let mean = (((mood5Count*5)+(mood4Count*4)+(mood3Count*3)+(mood2Count*2)+(mood1Count*1))/totalCount).toFixed(1);

        let lst=[];

        for(let i=0; i<mood1Count;i++){
            lst.push(1);
        }
        for(let i=0; i<mood2Count;i++){
            lst.push(2);
        }
        for(let i=0; i<mood3Count;i++){
            lst.push(3);
        }

        for(let i=0; i<mood4Count;i++){
            lst.push(4);
        }

        for(let i=0; i<mood5Count;i++){
            lst.push(5);
        }

        let median=0;

        if(lst.length%2==0){
            let index=lst.length/2;
            let other=index+1;
            median = Math.round(lst[index]+lst[other])/2;
        }else{
            let index = Math.round(lst.length/2);
            median = lst[index];
        }

        let result ={
            "moodEntries":[mood5,mood4,mood3,mood2,mood1],
            "moodCount":[mood5Count,mood4Count,mood3Count,mood2Count,mood1Count],
            "totalCount": totalCount,
            "moodFrequencies" : [(mood5Count/totalCount).toFixed(2),(mood4Count/totalCount).toFixed(2),(mood3Count/totalCount).toFixed(2),(mood2Count/totalCount).toFixed(2),(mood1Count/totalCount).toFixed(2)],
            "moodMean": mean,
            "moodMedian": median,
            

        };
        console.log(result);
        res.status(200).json(result);

    } catch (error){
        res.status(500).json(error);
    }
    
    
    
    
    //python attempt
    /*const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python',["./stats/main.py", arg1, arg2]);
    
    pythonProcess.stdout.on('data', (data) => {
        //do stuff here on the returned data
    });*/
})


app.listen(port,() =>{
    console.log(`App is listening on port ${port}`);
});

module.exports = app;