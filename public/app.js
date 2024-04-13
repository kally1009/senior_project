const url = "http://localhost:8080";

Vue.createApp({

    data: function() {
        return {
            page: "home", //home (listed entries), update , newEntry, stats
            entry_id:"",
            errors: {},
            date:"",
            mood: 0,
            activities:[],
            journalings:[],
            entries:[],
            activities_list:[
                "school",
                "relax",
                "sport",
                "movies/tv",
                "reading",
                "gaming",
                "work"
            ], 
            new_activity:"",
            new_date:"",
            new_mood:0,
            new_activities:[],
            new_journal:"",
            journal_description:"",
            title:"",



        };
    },

    // need to add in validation
    methods: {

        addActivity: function(){
            activities_list.push(new_activity); //maybe add an option to save even on server restart??
        },

        validateEntries: function(){
            this.errors = {};
            if(this.new_mood<=0){
                this.errors.title = "Please pick a mood"
                console.log("No Mood Selected");
                return false;

            }
            if(this.new_date.length==0 || this.new_date>Date() ){ 
                this.errors.author = "Please Specify a date"
                console.log("No date picked");
                return false;
            }
            else {
                return true;
            }
        },

        loadEntries: function() {
            fetch(`${url}/entries`).then((res) => {
                if (res.status == 200) {
                    res.json().then((entries) => {
                        this.entries = entries;
                        this.entries.sort(
                            (d1,d2) => (d1.date < d2.date) ? 1: (d1.date > d2.date) ? -1: 0);
                        console.log(this.entries);
                    });
                }
            });
        },
        addEntry: function() {

            if(!this.validateEntries()){
                console.log("Not Valid Entry");
                return;
            }
            let new_entry = {
                date: this.new_date,
                mood: this.new_mood,
                activities: this.new_activities,
                journals:[]
            };

            console.log(this.new_mood);
            console.log(this.new_activities);
            console.log(this.new_date);
    
            fetch(`${url}/entries`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(new_entry),
                
            }).then((res) => {
                console.log(new_entry);
                console.log(res.status);
                if(res.status==422){
                    response.json().then(function(data){
                        console.log(data)
                    })
                }
                else if (res.status == 201 ) {
                    this.new_date = "";
                    this.new_mood = "";
                    this.new_activities = [];
                    this.loadEntries();
                    this.page = "home";
                }
            });
        },
        deleteEntry: function(id){
            fetch(`${url}/entries/`+id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res)=>{
                this.loadEntries();
            });
        },

        saveEditEntry: function(){
            var updated_body = {
                _id:this.entry_id,
                date: this.date,
                mood: this.mood,
                activities: this.activities,

            };
            fetch(`${url}/entries/`+this.entry_id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"

                },
                body:JSON.stringify(updated_body)

            }).then(function(response){
                console.log(updated_body)
                if(response.status==404){
                    response.json().then(function(data){
                        alert(data.msg) //put something else here eventually
                    })
                }else if(response.status == 200){
                    this.date=""
                    this.new_mood = 0;
                    this.activities = [],
                    this.page="home",
                    this.loadEntries()
                    
                }
            });
        },
        editEntry: function(entry){
            this.date = entry.date
            this.mood = entry.mood
            this.activities = entry.activities
            this.entry_id = entry.entry_id
            this.page="updateEntry"
    },
        getJournals: function(entry_id){
            fetch(`${url}/entries/${entry_id}`).then(function(response){
                response.json().then(function(data){
                    console.log(data);
                    this.journalings = data;
                })
            }).then(function(){
                this.page="entry"
            })
        },

        createJournal: function(entry_id){
            var new_journal = {
                entry_id: entry_id,
                title: this.title,
                body:this.journal_description,
            }
            fetch(`${url}/journals`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(new_journal)
            }).then(function(response){
                console.log(new_journal)
                if(response.status==404){
                    response.json().then(function(data){
                        alert(data.msg) //put something else here eventually
                    })
                }else if(response.status == 201){
                    this.title="";
                    this.journal_description="";
                    this.getJournals(entry_id);
                }
            });
        },


    },
    created: function() {
        console.log("Mod Health!");
        this.loadEntries();
    }

}).mount("#app");