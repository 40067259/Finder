let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
let sha1 = require("sha1");
let multer = require("multer");
let upload = multer({ dest: __dirname + "/upload/" });
let cookieParser = require("cookie-parser");
reloadMagic(app);
let dbo = undefined;
let url =
"mongodb+srv://fred:123@media-board-9o9nz.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, db) => {
    dbo = db.db("media-board");
  }
);
let sessions = {};
app.use(cookieParser());
app.use("/upload", express.static(__dirname + "/upload"));
app.use("/",express.static("src/images"));
app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

// Your endpoints go after this line
app.post("/signup", upload.none(), (req, res) => {
  let username = req.body.username;
  let fName = req.body.firstName;
  let lName = req.body.lastName;
  let password = req.body.password;
 
  if (username !== "" && password !== "") {
    dbo.collection("users").findOne({ username: username }, (err, user) => {
      console.log(user, "user");
      if (err) {
        console.log(err, "signup err");
        res.send(JSON.stringify({ success: false }));
        return;
      }
      if (user !== null) {
        console.log("same username");
        res.send(JSON.stringify({ success: false }));
        return;
      } else {
        //this is for create the user & the cart in the backend
        dbo.collection("cart").insertOne({ username, items: [] });
        dbo
          .collection("users")
          .insertOne({ username, password: sha1(password), fName, lName });
          //operate the login actions 
          let sid = Math.floor(Math.random() * 10000000);
          sessions[sid] = username;
          res.cookie("sid", sid);
          //send the info to front end
          console.log(username,"000000000000000000000")
          res.send({
            success: true,
            username: username,
            sid: sid,
            fName: fName,
            lName: lName
          });
        return;
      }
    });
  }
});

app.post("/onlineService",upload.none(),(req, res) => {
  let sessionId = req.cookies.sid
  let username = sessions[sessionId]
  // let username = req.body.username;
  let message = req.body.message;
  if (username !=="" && message !=="") {
    dbo.collection("onlineService").insertOne({username,message});
  }
  res.send({data:dbo.onlineServie.find()})
})

app.post("/login", upload.none(), (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let hashedPwd = sha1(password);
  if (username !== "" && password !== "") {
    dbo.collection("users").findOne({ username: username }, (err, user) => {
      if (err) {
        console.log(err, "login error");
        res.send({ success: false });
        return;
      }
      if (user === null) {
        res.send({ success: false });
        return;
      }
      if (user.password === hashedPwd) {
        let sid = Math.floor(Math.random() * 10000000);
        sessions[sid] = username;
        res.cookie("sid", sid);
        res.send({
          success: true,
          username: username,
          sid: sid,
          fName: user.fName,
          lName: user.lName
        });
        return;
      }
    });
  }
});
app.post("/update-cart", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  let user = sessions[sessionId];
  dbo.collection("cart").findOne({ username: user }, (err, user) => {
    if (user) {
      res.send({ cartLength: user.items.length });
    }
  });
});

app.get("/logout", (req, res) => {
  let sessionId = req.cookies.sid;
  delete sessions[sessionId];
});

// app.post("/newItem", upload.array("image", 5), (req, res) => {
//   let name =
//     req.body.fName.charAt(0).toUpperCase() +
//     req.body.fName.slice(1) +
//     " " +
//     req.body.lName.charAt(0).toUpperCase() +
//     req.body.lName.slice(1);
//   let title = req.body.title;
//   let desc = req.body.description;
//   let cat = req.body.categories;
//   let price = req.body.price;
//   let images = req.files;
//   let img = [];
//   for (let i = 0; i < images.length; i++) {
//     img.push("/upload/" + req.files[i].filename);
//   }
//   console.log(img);
//   if (name === "Undefined Undefined") {
//     res.send({ success: false });
//   }
//   dbo
//     .collection("items")
//     .insertOne({
//       title: title,
//       description: desc,
//       price: price,
//       images: img,
//       category: cat,
//       seller: name
//     })
//     .then(result => {
//       res.send({ success: true, item: result.ops[0] });
//     });
// });

app.post("/addToCart", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  let item = req.body.id;
  dbo.collection("items").findOne({ _id: ObjectID(item) }, (err, it) => {
    console.log(it._id, "it");
    console.log(item, "item");
    //this is for find the id of the item for stack it in the cart
    // collection with the username
    if (err) {
      console.log(err, "add to cart error");
      res.send({ success: false });
    }
    if (it._id == item) {
      dbo.collection("cart").findOne({ username: username }, (err, user) => {
        console.log(user, "user");
        //this is for find the good cart for stack the items inside of them.
        if (err) {
          console.log(err, "error find cart user");
          res.send({ success: false });
          return;
        }
        if (user.username === username) {
          //we concat an object each time the user click on add to cart
          // with categories for property and the id of the item.
          let newArr = [];
          for (let i = 0; i < user.items.length; i++) {
            newArr.push(user.items[i]);
          }
          newArr.push(item);
          console.log(newArr, "new Items");
          dbo
            .collection("cart")
            .updateOne({ username }, { $set: { items: newArr } });
          res.send({ arrLength: newArr.length, list: newArr });
          return;
        }
      });
    }
  });
});
app.get("/send-items", (req, res) => {
  dbo
    .collection("items")
    .find({})
    .toArray((err, items) => {
      if (err) {
        console.log("error", err);
        res.send({ success: false });
        return;
      }
      res.send(JSON.stringify(items));
    });
});
app.get("/user-cart", (req, res) => {
  let sessionId = req.cookies.sid;
  res.send({ user: sessions[sessionId] });
});
app.post("/checkout", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  console.log(username, "username");
  dbo.collection("cart").findOne({ username: username }, (err, user) => {
    if (err) {
      console.log(err, "cart error");
      res.send({ success: false });
      return;
    }
    if (username) {
      let items = [];
      user.items.forEach(it => {
        items.push(it);
      });
      res.send(JSON.stringify(items));
      return;
    }
    console.log("username not find");
    res.send({ success: false });
    return;
  });
});
app.post("/deleteItemCart", upload.none(), (req, res) => {
  let id = req.body.id;
  let username = req.body.username;
  console.log(username);
  dbo.collection("cart").findOne({ username: username }, (err, user) => {
    if (err) {
      console.log(err, "cart error");
      res.send({ success: false });
      return;
    }
    if (username) {
      let newCart = user.items.filter(item => {
        return item !== id;
      });
      let cartId = user._id;
      dbo
        .collection("cart")
        .updateOne({ _id: ObjectID(cartId) }, { $set: { items: newCart } });
      res.send({ success: true });
      return;
    }
    console.log("username not find");
    res.send({ success: false });
    return;
  });
});

app.post("/save-stripe-token", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  dbo.collection("cart").findOne({ username: username }, (err, user) => {
    if (err) {
      console.log(err, "cart error");
      res.send({ success: false });
      return;
    }
    if (username) {
      dbo
        .collection("cart")
        .updateOne({ _id: ObjectID(cartId) }, { $set: { items: [] } });
      res.send({ success: true });
    }
  });
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
