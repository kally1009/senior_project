


app.post("/journals",async (req,res)=>{
    res.setHeader("Content-Type", "application/json")
    let newJournal = new Journal({
        title: req.body.title || "",
        body: req.body.body || "",
        entry_id: req.body.entry_id || "",

    });

    newJournal.save().then((result)=>{
        res.status(201).json({"id": result._id});
        console.log("created journal");

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


/*app.post("/journals",(req,res)=>{
    res.setHeader("Content-Type","application/json");
    console.log("Creating a journal entry");

    let newJournal = {
        
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
});*/

app.put("/journals/:id",(req,res)=>{
    res.setHeader("Content-Type", "application/json");
    console.log("updating journal");
    let updatedEntry = {
        title: req.body.title,
        body: req.body.body
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
            console.error("Error Occured while updating a journal", error);
        res.status(500).send("Server error");
        };
    });
});

app.delete("/journals/:id",(req,res)=>{ 
    res.setHeader("Content-Type", "application/json");
    Entry.findByIdAndDelete(req.params.id).then(()=>{
        console.log("Deleting...")
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
            console.log("Error occured while deleting journal");
            res.status(500).send("Server Error");

        };
    });
});