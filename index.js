const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.set("view engine", "ejs");
var access_token = "";

const clientID = process.env.GIT_CLIENT_ID;
const clientSecret = process.env.GIT_SECRET;

app.get("/", (req, res) => res.render("pages/index", { client_id: clientID }));

app.get("/github/callback", (req, res) => {
  const requestToken = req.query.code;

  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: {
      accpept: "application/json",
    },
  })
    .then((response) => {
      access_token = response.data.split("&")[0].split("=")[1];
      res.redirect("/success");
    })
    .catch((err) => console.log(err));
});

app.get("/success", function (req, res) {
  axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      Authorization: "token " + access_token,
    },
  })
    .then((response) => {
      console.log(`response: ${response.data}`);
      res.render("pages/success", { userData: response.data });
    })
    .catch((err) => console.log(`oops ${err}`));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));

const secret = " aec7dea094f3f178bd39f094af4d12e0ccfe4136";
