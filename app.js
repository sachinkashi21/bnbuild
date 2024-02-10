const express=require("express");
const app=express();

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({ extended: true }));

const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const engine=require("ejs-mate");
app.engine("ejs",engine);


app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.listen(3000,()=>{
    console.log("app running on 3000");
})