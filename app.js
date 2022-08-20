const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Mongoose

mongoose.connect("mongodb://localhost:27017/todoDB");

const itemsSchema = {
    item: String
};

const Item = mongoose.model("Item", itemsSchema);

const defaultItem = new Item({item: "Drink Enough Water!"});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", userSchema);

// Mongoose


// AUTHENTICATION & SECURITY

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/login", function(req, res){
    res.render("login");
});

// app.get("/:customListName", function(req, res){   // Custom Lists using Express Route Parameters
//     const customListName = _.capitalize(req.params.customListName);

//     List.findOne({name: customListName}, function(err, foundList){
//         if(!err) {
//             if(!foundList) {
//                 // Create a new List
//                 const list = new List({
//                     name: customListName,
//                     items: [defaultItem]
//                 });
//                 list.save(function(err, result){
//                     if(!err) {
//                         res.redirect("/"+customListName);
//                     }           
//                 }); 

//             } else {
//                 // Show existing List
//                 res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
//             }
//         }
//     })
// });

// app.get("/", function(req,res){
    
//     Item.find(function(err, items){
        
//         if (items.length === 0){
//             Item.insertMany([defaultItem], function(err){
//                 if(err) {
//                     console.log(err)
//                 } else {
//                     console.log("Successfully added default items to database.")
//                 }
//                 res.redirect("/");
//             });
//         } else {
//             res.render("list", {listTitle: "Today", newListItems: items});
//         }
//     });
// });

// app.post("/", function(req, res){
    
//     const itemName  = req.body.newItem;
//     const listName = req.body.list;

//     const item = new Item({name: itemName});
    
//     if(listName === "Today") {
//         item.save();
//         res.redirect("/"); 
//     } else {
//         List.findOne({name: listName}, function(err, foundList){
//             if(!err){
//                 foundList.items.push(item);
//                 foundList.save();
//                 res.redirect("/"+listName);
//             }
//         });
//     }
// });

// app.post("/delete", function(req, res){
    
//     const checkedItemId = req.body.checkbox;
//     const listName = req.body.listName;
    
//     if (listName === "Today") {
//         Item.findByIdAndRemove(checkedItemId, function(err){
//             if(!err) {
//                 console.log("Successfully deleted checked item.")
//                 res.redirect("/");
//             }
//         });
//     } else {
//         List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
//             if(!err){
//                 res.redirect("/"+listName);
//             }
//         });
//     }
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(3000, function(){
    console.log("Server is up and running successfully.");
});