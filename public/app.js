const url = "http://localhost:8080"

Vuetify.createVuetify()

Vue.createApp({

    data: function() {
        return {
            page: "home", //home, listed entries, new entry, new activities*, stats pages. Wanted to possibly a calendar (and profile page?)
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


        };
    },

    // need to add in validation
    methods: {
        loadEntries: function() {
            fetch(`${url}/entries`).then((res) => {
                if (res.status == 200) {
                    res.json().then((entries) => {
                        this.entries = entries;
                        console.log(this.entries);
                    });
                }
            });
        },
        addEntry: function() {
            let new_entry = {
                date: this.new_date,
                mood: this.new_mood,
                activities: this.new_activities,
                journals:[]
            };

            console.log(this.new_mood);
            //let data = "date="+encodeURIComponent(this.new_date)+"&mood="+encodeURIComponent(this.new_mood)+"&activities="+encodeURIComponent(this.new_activities)+"&journals=''";
            //console.log(data);
            fetch(`${url}/entries`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(new_entry),
                
            }).then((res) => {
                console.log(new_entry);
                if(res.status==422){
                    response.json().then(function(data){
                        console.log(data)
                    })
                }
                else if (res.status == 201 ) {
                    this.new_date = "";
                    this.new_mood = "";
                    this.new_activities = [];
                    this.page = "home";
                    this.loadEntries();
                }
            });
        },
        // Add in rest of methods here
    },
    created: function() {
        console.log("Mod Health!");
        this.loadEntries();
    }

}).use(Vuetify).mount("#app");