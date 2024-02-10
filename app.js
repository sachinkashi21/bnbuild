require('dotenv').config()

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({ extended: true }));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));



const engine = require("ejs-mate");
app.engine("ejs", engine);

const User = require("./models/user.js");
const Event = require("./models/event.js");

const dbUrl = process.env.ATLASDB_URL;
const mongoose = require("mongoose");
main().then((res) => {
    console.log("connection established");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
}

const passport = require("passport");
const LocalStrategy = require("passport-local");

const session = require("express-session");
const MongoStore = require('connect-mongo');
// const flash=require("connect-flash");

let store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 60*60*3,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const {asyncWrap}=require("./middlewares.js");
const {isLoggedIn, isOwner,}=require("./middlewares.js");




let sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
    }
}
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    // res.locals.success=req.flash("success");
    // res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/",asyncWrap(async(req,res)=>{
    let arrList=await Event.find({});
    res.render("index.ejs",{arrList});
}))

app.get("/index",asyncWrap(async(req,res)=>{
    let arrList=await Event.find({});
    res.render("index.ejs",{arrList});
}))


app.get("/event/new",isLoggedIn,(req,res)=>{
    res.render("addEvent.ejs");
});

app.post("/event/new",isLoggedIn,asyncWrap(async(req,res)=>{
    console.log(req.body.event);
    let event = req.body.event;
    let newEvent = new Event(event);
    // newEvent.organizer=req.user._id;
    let savedListing=await newEvent.save();
    res.redirect("/index");
}))

app.get("/event/:id",isLoggedIn,asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let event=await Event.findById(id);
    res.render("display",{event}); 
}))

app.post("/event/register/:id",isLoggedIn,async(req,res)=>{
    let {id}=req.params;
    let user=res.locals.currUser;
    let arr=user.pastEvent;
    let newArr=[...arr,id];
    let response=await user.updateOne({_id:user.id},{pastEvent: newArr});
    console.log(response);
    
    res.redirect("/index");
})

app.get("/dashboard",isLoggedIn,asyncWrap(async(req,res)=>{
    // let user=res.locals.currUser;
    let dashUser=await User.findById(res.locals.currUser._id).populate("pastEvent") ;
    res.render("dashboard",{dashUser});
}))

app.get("/calender",isLoggedIn,(req,res)=>{
    res.render("calendar.ejs");
})

app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
})

app.post("/signup",asyncWrap(async(req,res)=>{
    try{
        let {username, email, password,detail}=req.body;
        let newUser= new User({
            username,email,detail
        });
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/index");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}))

app.get("/login", (req, res) => {
    res.render('login.ejs');
})

app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    // failureFlash: true,
}), (req, res) => {
    if (res.locals.redirectUrl) {
        return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/index");
})

app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.redirect("/index");
    });
})

app.get("/user/update/:id",isLoggedIn,asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let user = await User.findById(id);
    res.render("editUser",{user});
}))

app.put("/user/update/:id",isLoggedIn,asyncWrap(async(req,res)=>{
    let {user}=req.body;
    let {id}=req.params;
    let newUser = await User.updateOne({_id:id},{...user});
    
    res.redirect("/dashboard");
}))

app.listen(3000, () => {
    console.log("app running on 3000");
})