//How to store API keys and other data outside of your main code
//https://github.com/motdotla/dotenv
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

//https://stackoverflow.com/questions/38757235/express-how-to-send-html-together-with-css-using-sendfile
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  console.log("firstName = " + firstName + " lastName = " + lastName + " email = " + email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;

  const options = {
    method: "POST",
    auth: "RequiredUsername:" + process.env.API_KEY
  }
  console.log("options = " + options.auth);
  console.log("url = " + url);

  const request = https.request(url, options, function(response) {
    console.log("Status Code = " + response.statusCode);
    if ( response.statusCode === 200 ) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

})


app.post("/failure", function(req, res) {
  res.redirect("/");
})



app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port 3000.");
})
