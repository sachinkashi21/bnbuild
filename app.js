const express=require("express");
const app=express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({ extended: true }));

const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const engine=require("ejs-mate");
app.engine("ejs",engine);

const User=require("./models/user.js");

const dbUrl="mongodb://127.0.0.1:27017/bnb";
const mongoose = require("mongoose");
main().then((res) => {
    console.log("connection established");
}).catch((err) => {
    console.log(err);
}) 
async function main() {
    await mongoose.connect(dbUrl);
}

const passport=require("passport");
const LocalStrategy=require("passport-local");

const session=require("express-session");
// const MongoStore = require('connect-mongo');
// const flash=require("connect-flash");

app.use((req,res,next)=>{
   
    res.locals.currUser= req.user;
    next();
});


let sessionOptions={     
    secret: "mysecret",
    resave: false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now()+ 1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly: true,
    }
}
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.get("/index",async(req,res)=>{
    let arrList=await Event.find();
    res.render("index.ejs",{arrList});
})

app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
})


app.get("/event/new",(req,res)=>{
    res.render("addEvent.ejs");
});

app.post("/event/new",async(req,res)=>{
    console.log(req.body.event);
    let event=req.body.event;
    let newEvent= new Event(event);
    // newEvent.organizer=req.user._id;
    let savedListing=await newListing.save();
    res.send("success");
})

app.post("/signup",async(req,res)=>{
    try{
        let {username, email, password}=req.body;
        let newUser= new User({
            username,email
        });
        let registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            res.redirect("/index");
        })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
})

app.get("/login",(req,res)=>{
    res.render('login.ejs');
})

app.post("/login",passport.authenticate("local",{
    failureRedirect:"/login",
    // failureFlash: true,
    }),(req,res)=>{
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/index");
})

app.listen(3000,()=>{
    console.log("app running on 3000");
})