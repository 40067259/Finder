let express = require("express");
let app = express();
let reloadMagic = requrie("./reload-magic.js");
let MongoClicent = require("mongodb").MongoClient;
let objectID = requrie("mongodb").objectID;
let sha1 = require("sha1");
let multer = require("multer");
let upload = multer({ dest:_dirname + "/upload/"})
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
dbo =db.db("media-board");
});
let sessions = {};
app.use(cookieParser());
app.use("/upload",express.static(_dirname +"/upload"));
app.use("/",express.static("build"));
app.user("/",express.static("public"));