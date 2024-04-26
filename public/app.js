const url = "http://localhost:8080";


var app = Vue.createApp({

    data: function() {
        return {
            page: "home",
            entry_id:"",
            errors: {},
            date:"",
            mood: 0,
            activities:[],
            journalings:[],
            entries:[],
            activities_list:[
                "school",
                "relaxing",
                "sport",
                "movies/tv",
                "reading",
                "gaming",
                "work"
            ], 
            new_activity:"",
            addNewActivity:false,
            new_date:"",
            new_mood:0,
            new_activities:[],
            new_journal:"",
            journal_description:"",
            title:"",
            stats:[],
            activitiesCount: {},
            edit_date:"",
            edit_mood: 0,
            edit_activities: [],
            activityList:[],
            addNewJournal: false,
            activitiesAverageMood: {},




        };
    },

    // need to add in user-facing validation
    methods: {
        toggleAddActivity: function(){
            if(this.addNewActivity == false){
                this.addNewActivity = true;
            }else{
                this.addNewActivity = false;
            }
            
        },

        addActivity: function(){
            console.log(this.new_activity)
            this.activities_list.push(this.new_activity);
            this.new_activity = "";
            this.addNewActivity = false;
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
            this.new_activity = "";
            fetch(`${url}/entries`).then((res) => {
                if (res.status == 200) {
                    res.json().then((entries) => {
                        this.entries = entries;
                        this.entries.sort(
                            (d1,d2) => (d1.date < d2.date) ? 1: (d1.date >= d2.date) ? -1: 0 );
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
                
            };

    
            fetch(`${url}/entries`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(new_entry),
                
            }).then((res) => {
                if(res.status==422){
                    res.json()
                }
                else if (res.status == 201 ) {
                    res.json().then((data)=>{
                        console.log(data);
                        this.new_date = "";
                        this.new_mood = "";
                        this.new_activities = [];
                        this.new_activity=""
                        this.addActivity = false;
                        this.loadEntries();
                        this.loadStats();
                        this.page = "home";
                    });
                    
                }
            })
        },
        deleteEntry: function(id){
            fetch(`${url}/entries/`+id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((res)=>{
                this.loadEntries();
                this.loadStats();
            });
        },

        saveEditEntry: function(){
            let updated_body = {
                _id: this. entry_id,
                date: this.edit_date,
                mood: this.edit_mood,
                activities: this.edit_activities,
                

            };
            fetch(`${url}/entries/`+this.entry_id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"

                },
                body: JSON.stringify(updated_body)

            }).then((res)=>{
                if(res.status==404){
                    res.json().then(function(data){
                        
                        alert(data.msg) //put something else here eventually
                    })
                }else if(res.status == 200){
                    console.log("updated")
                    this.edit_date="";
                    this.edit_mood = 0;
                    this.edit_activities = [];
                    this.page="home";
                    this.loadEntries();
                    this.loadStats();
                    
                }
                console.log(res.status)
                
            });
        },
        editEntry: function(entry){
            
            this.entry_id = entry._id
            this.edit_date = entry.date
            this.edit_mood = entry.mood
            this.edit_activities = entry.activities
            this.page="updateEntry"
    },
        


        // function not currently used
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

        // function not currently used
        createJournal: function(entry){
            var new_journal = {
                entry_id: entry._id,
                title: this.title,
                body:this.new_journal,
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
                    this.new_journal="";
                }
                
            });
            this.loadEntries();
        },

        loadStats: function(){
            fetch(`${url}/stats`).then((res) => {
                if (res.status == 200) {
                    res.json().then((stats) => {
                        this.stats = stats;
                        
                    });
                }
            });
        },
        

        calculateStats: function(){
            let usedActivities = [];
            let activitesMood = {}; // activity : []list of moods
            
            for(let i=0;i<this.entries.length; i++){
                for(let j=0; j<this.entries[i].activities.length; j++){
                    let activity = this.entries[i].activities[j];
                    usedActivities.push(activity);
                    if(!activitesMood[activity]){
                        activitesMood[activity] = [this.entries[i].mood];
                       
                    }else{
                        activitesMood[activity].push(this.entries[i].mood);
                       
                    }
                }
            }

            //This code here was from counting duplicate values in javascript arrays (article)
                const counts = {};
                usedActivities.forEach((value) => {
                  if (!counts[value]) {
                    counts[value] = 1;
                    
                  } else {
                    counts[value]++;
                  }
                });

            //Code from How to Sort Object Property By Values in JavaScript (article)
            const sortedCounts = Object.fromEntries(
                Object.entries(counts).sort((a, b) => b[1] - a[1]));
            this.activitiesCount = sortedCounts;
            

            //figuring out the average mood for each activity
            let activitiesAverageMood = {}
            for(const activity in activitesMood){
                let moodlst = activitesMood[activity];
                let sum=0;
                for(let i=0;i<moodlst.length;i++){
                    sum+=moodlst[i]
                }
                let average = (sum/moodlst.length).toFixed(2);
                
                activitiesAverageMood[activity] = average;

            }
            //structure based off of one above
            const sortedActivityFrequencies = Object.fromEntries(
                Object.entries(activitiesAverageMood).sort((a, b) => b[1] - a[1]));
            this.activitiesAverageMood = sortedActivityFrequencies;
            
            
            

        },

        //DJ helped me figure this part out
        renderChart: function(){
            
            if (!this.$refs.moodChart && !this.$refs.lineMoodChart && !this.$refs.activityChart && !this.$refs.activityAverageMoodChart) {
                return;
            }

            this.$refs.lineMoodChart.getContext("2d").reset();

            this.$refs.moodChart.getContext("2d").reset();

            this.$refs.activityChart.getContext("2d").reset();

            this.$refs.activityAverageMoodChart.getContext("2d").reset();

            let dateData = [];
            let dailyMoodData = [];
            for(let i=0;i<this.entries.length;i++){
                dailyMoodData.push(this.entries[i].mood);
                dateData.push(this.entries[i].date);
            }
            dateData.reverse();
            dailyMoodData.reverse();

            // timeline of mood
            new Chart(this.$refs.lineMoodChart, {
                type: 'line',
                options: {
                    animation: false,
                plugins: {
                    legend: {
                    display: false,
                    },
                    tooltip: {
                    enabled: true,
                    },
                },
                },
                data:{
                    labels: dateData,
                datasets: [
                    {
                    label: 'Daily Moods',
                    data: dailyMoodData,
                    fill: false,
                    borderColor: 'rgb(66, 203, 245)',
                    tension: 0
                    },
                ],
                }
            });

            //mood frequencies

            const moodData = [
                { mood: '5 (Awesome)', frequency: this.stats.moodFrequencies[0]},
                { mood: '4 (Good)', frequency: this.stats.moodFrequencies[1]},
                {mood: '3 (Okay)', frequency: this.stats.moodFrequencies[2]},
                {mood: '2 (Not Good)', frequency: this.stats.moodFrequencies[3]},
                {mood: '1 (Horrible)', frequency: this.stats.moodFrequencies[4]},
            ];

            new Chart(this.$refs.moodChart, {
                type: 'bar',
                options: {
                animation: false,
                plugins: {
                    legend: {
                    display: false,
                    },
                    tooltip: {
                    enabled: true,
                    },
                },
                },
                data: {
                labels: moodData.map((row) => row.mood),
                datasets: [
                    {
                    label: '',
                    data: moodData.map((row) => row.frequency),
                    backgroundColor: [
                        '#25995C',
                        '#92eb34',
                        'rgb(255, 255, 0)',
                        '#eb9c34',
                        'rgb(255, 0, 0)',
                        
                    ],
                    },
                ],
                },
            });

            //activity frequencies

            let activityFrequencies=[];
            let activityList = [];
            for(const activity in this.activitiesCount){
               
                let num = this.activitiesCount[activity];
                let freq = (num/this.stats.totalCount).toFixed(2);
                activityFrequencies.push(freq);
                activityList.push(activity);

            }

            new Chart(this.$refs.activityChart, {
                type: 'bar',
                options: {
                animation: false,
                plugins: {
                    legend: {
                    display: false,
                    },
                    tooltip: {
                    enabled: true,
                    },
                },
                },
                data: {
                labels: activityList,
                datasets: [
                    {
                    label: '',
                    data: activityFrequencies,
                    backgroundColor: [
                        '#66a4d4',
                        
                        
                    ],
                    },
                ],
                },
            });

            // Average Mood Rating by Activity -- Score

            let activitiesAverageLabels = [];
            let activitiesAverageMood = [];

            for(const activity in this.activitiesAverageMood){
                activitiesAverageLabels.push(activity);
                activitiesAverageMood.push(this.activitiesAverageMood[activity]);
            }

            new Chart(this.$refs.activityAverageMoodChart, {
                type: 'bar',
                options: {
                animation: false,
                plugins: {
                    legend: {
                    display: false,
                    },
                    tooltip: {
                    enabled: true,
                    },
                },
                },
                data: {
                labels: activitiesAverageLabels,
                datasets: [
                    {
                    label: '',
                    data: activitiesAverageMood,
                    backgroundColor: [
                        '#abdaed',
                    ],
                    },
                ],
                },
            });
            

        },



    },

    updated: function(){
        this.renderChart();
    },

    created: function() {
        console.log("Mod Health!");
        this.loadEntries();
        this.loadStats(); 
    }

}).mount("#app");