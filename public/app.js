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
            ], //need to add the possible activities available (can add in more too!). Make them into different categories???
            new_date:"",
            new_mood:0,
            new_activities:[]


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
            console.log(this.new_mood);
            let data = "date="+encodeURIComponent(this.new_date)+"&mood="+encodeURIComponent(this.new_mood)+"&activities="+encodeURIComponent(this.new_activities)+"&journals=''";
            console.log(data);
            fetch(`${url}/entries`, {
                method: "POST",
                body: data,
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then((res) => {
                if (res.status == 201 ) {
                    this.new_date = "";
                    this.new_mood = "";
                    this.new_activities = [];
                    this.page = "home";
                    this.loadEntries();
                } else {
                    alert("Adding an Entry didn't work."); // maybe change the error handling here...
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