// basic setup
import { createApp } from 'vue'

const app = createApp({

    data: function() {
        return {
            name: "Name",
            content: [],
            newContentTitle: "",
            newContentPrice: "",
            newContentDescription: ""
        };
    },

    methods: {
        loadContent: function() {
            fetch("http://localhost:8080/entries").then((res) => {
                if (res.status == 200) {
                    res.json().then((content) => {
                        this.content = content;
                        console.log(this.content);
                    });
                }
            });
        },
        addContent: function() {
            console.log(this.newContentTitle);
            let data = "title="+encodeURIComponent(this.newContentTitle)+"&price="+encodeURIComponent(this.newContentPrice)+"&description="+encodeURIComponent(this.newContentDescription);
            console.log(data);
            fetch("http://localhost:8080/entries", {
                method: "POST",
                body: data,
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then((res) => {
                if (res.status == 201 ) {
                    this.newContentTitle = "";
                    this.newContentPrice = "";
                    this.newContentDescription = "";
                    this.loadContent();
                } else {
                    alert("Woah that didn't work!");
                }
            });
        }
    },
    created: function() {
        console.log("Hello World!");
        this.loadContent();
    }

})

app.mount("#app");