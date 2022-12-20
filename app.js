const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date_module.js");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://ravi_mahato:ravi-MAHATO@cluster0.un2khcm.mongodb.net/toDoListDB", {useNewUrlParser:true});
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');


const taskSchema = new mongoose.Schema({
  name: String
});
const Task = mongoose.model("Task", taskSchema);

const task1 = new Task({
  name: "Work Harder"
});
const task2 = new Task({
  name: "Dedicate Yourself"
});
const task3 = new Task({
  name: "Just Ignore Everything"
});
const defaultTasks = [task1, task2, task3];

const listSchema = new mongoose.Schema({
  listName: String,
  listItems: [taskSchema]
});
const List = mongoose.model("List", listSchema);


app.get("/", function(req, res){
  Task.find(function(err, foundTasks){
    if(foundTasks.length===0){
      Task.insertMany(defaultTasks, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully added!");
          res.redirect("/")
        }
      });
    }else{
      res.render("list", {listName:"Today", listItems: foundTasks})
    }
    });
});
app.get("/about", function(req, res){
  res.render("about");
});
app.get("/:paramName", function(req, res){
  const listName = _.capitalize(req.params.paramName)
  List.findOne({listName: listName}, function(err, foundList){
    if(!err){
      if(!foundList){
        const newList = new List(
          {listName: listName,
           listItems: defaultTasks}
        )
        newList.save()
        res.redirect("/"+listName)
      }else{
        res.render("list", {listName: foundList.listName, listItems: foundList.listItems})
      }
    }
  })
  });


app.post("/", function(req, res){
  let item = req.body.newItem
  const listName = req.body.button
  const newTask = new Task({
    name: item
      });
  if(listName==="Today"){
    newTask.save()
    res.redirect("/")
  }else{
    List.findOne({listName: listName}, function(err, foundList){
      foundList.listItems.push(newTask)
      foundList.save()
      res.redirect("/"+listName)
    })
  }
});
app.post("/delete", function(req, res){
  const toBeDeletedID = req.body.checkbox;
  const listName = req.body.listName
  if(listName==="Today"){
    Task.findByIdAndRemove(toBeDeletedID, function(err){
      if(!err){
        res.redirect("/")
      }
    })
  }else{
    List.findOneAndUpdate({listName: listName},{$pull: {listItems:{_id:toBeDeletedID}}}, function(err){
      if(!err){
        res.redirect("/"+listName)
      }
    })
  }
});


app.listen(3000, function(){
  console.log("Server is running on port 3000")
});
