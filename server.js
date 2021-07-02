const express = require("express");
const app = express();
const mongoose = require("mongoose")

const users = require("./users")

mongoose.connect("mongodb://localhost/pagination",{ useNewUrlParser: true ,useUnifiedTopology:true})
const db=mongoose.connection
db.once("open",async()=>{
    if(await users.countDocuments().exec()>0) return

    Promise.all([
      users.create({name:"User 1"}),
      users.create({name:"User 2"}),
      users.create({name:"User 3"}),
      users.create({name:"User 4"}),
      users.create({name:"User 5"}),
      users.create({name:"User 6"}),
      users.create({name:"User 7"}),
      users.create({name:"User 8"}),
      users.create({name:"User 9"}),
      users.create({name:"User 10"}),
      users.create({name:"User 11"}),
      users.create({name:"User 12"})
    ]).then(()=>console.log("Added Users"))
})
app.get("/users", paginated(users), (req, res) => {
  return res.json(res.paginated);
});

const PORT = 3000;

function paginated(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < model) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try{
    results.results = model.find().limit(limit).skip(startIndex).exec()
    res.paginated = results;
    next();
  }catch(e){
    res.status(500).json({message:e.message})
  }
}
}
app.listen(PORT, () => {
  console.log("App is listining ");
});
