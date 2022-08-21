const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/todoDB");

const itemsSchema = {
    item: String
};

const Item = mongoose.model("Item", itemsSchema);

const defaultItem = new Item({item: "Drink Enough Water!"});

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

const userSchema = new mongoose.Schema({
    username: String,
    // email: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/:customListName", function(req, res){   // Custom Lists using Express Route Parameters
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err) {
            if(!foundList) {
                // Create a new List
                const list = new List({
                    name: customListName,
                    items: [defaultItem]
                });
                list.save(function(err, result){
                    if(!err) {
                        res.redirect("/"+customListName);
                    }           
                }); 

            } else {
                // Show existing List
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    })

    app.post("/:customListName", function(req, res){
        
    });

    // if(req.isAuthenticated()){ 
        
    // } else {
    //     res.redirect("/login");
    // }
});

app.post("/register", function(req, res){
    const uname = _.capitalize(req.body.username);
    User.register({username: uname}, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/"+uname);
            });
        }
    });
});

app.post("/login", function(req, res){

});



app.post("/delete", function(req, res){
    
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    
    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err) {
                console.log("Successfully deleted checked item.")
                res.redirect("/");
            }
        });
    } else {
        User.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        });
    }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(3000, function(){
    console.log("Server is up and running successfully.");
});