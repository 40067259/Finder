let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
let MongoClient = require("mongodb").MongoClient;
let objectID = require("mongodb").objectID;
let sha1 = require("sha1");
let multer = require("multer");
let upload = multer({ dest: __dirname + "/upload/"})
let cookieParser = require("cookie-parser");
reloadMagic(app);
let dbo = undefined;
let url ="mongodb+srv://fred:123@media-board-9o9nz.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(
url,
{
useNewUrlParser: true,
useUnifiedTopology: true
},
(err,db) => {
  if(err) console.log("failed to connect mongodb");
dbo =db.db("media-board");
});
let sessions = {};
app.use(cookieParser());
app.use("/upload",express.static(__dirname +"/upload"));
app.use("/",express.static("build"));
app.use("/",express.static("public"));


app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
