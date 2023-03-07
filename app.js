const express = require("express");
const app = express();

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended: true}));

const request = require("request");
const https = require("https");

// It specifies that any files that are stored in the "public" directory of the application should be made publicly available to clients accessing the application.
// The argument passed to the express.static() method is the name of the directory that contains the static files, in this case "public".
// static files are such as an image or a CSS file
app.use(express.static("public"));

app.get("/", function(req, res){
   res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var mail = req.body.mail;
    console.log("These are your details that you entered\n" + fname + "\n" + lname + "\n" + mail);
    
    var data = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname

                }
            }
        ]
    }
// now we'll convert this data into flat pack jason --> convert the data into a string that is in the form of jason
    var jasonData = JSON.stringify(data);
    
    const url = "https://us21.api.mailchimp.com/3.0/lists/88619c32e2"
    const options = {
        method: "POST",
        auth: "mehar:5b0fe4bcf0249970b7c55b1500b9eab0-us21"

    }
    const request = https.request(url, options, function(response){

        if (response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        // we're gonna check what data they sent us
        // we're looking out for any data that we get sent back from mailchimp
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });

    });
     // send the data to mailchimp
    //  request.write(jasonData);
     request.end();

});

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.post("/success", function(req, res){
    res.redirect("/");
})

// Since we are deplyomg on heroku, it;s servers might not work on port 3000, hence, we'll have to keep this dynamic
// By using process.env.PORT, our project won't run locally on our system
// To solve this problem, we can use process.env.PORT || 3000 (if the project is running on heroku, its gonna use its own port, and if its running locally, then port 3000 will be used)
app.listen(process.env.PORT || 3000, function(){
    console.log("The requests are handled by port 3000");
});

// The Mailchimp API allows developers to perform various tasks programmatically, such as adding or removing subscribers from email lists, creating and sending email campaigns, and retrieving data and analytics related to email campaigns. The API is based on REST (Representational State Transfer) architecture, which uses HTTP requests to perform operations and return data in a standardized format such as JSON (JavaScript Object Notation).
// API key
// 5b0fe4bcf0249970b7c55b1500b9eab0-us21
// audience id or list id
// this is gonna help mailchimp idetnify the list you want to put your subscribers into
// 88619c32e2