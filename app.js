require('dotenv').config()

const express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    session = require("express-session"),
    flash = require("connect-flash")

const expressSanitizer = require("express-sanitizer")

const app = express();
// DB connection 
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
mongoose.connection.on("error", console.error.bind(console, "connection error"))
mongoose.connection.once("open", () => { console.log("DB connected") })
app.set("view engine", "ejs")
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride("_method"))
app.use(expressSanitizer())

//Seed file
// const { deleteCamps } = require("./seed")
// deleteCamps()



//AUTH - session config
app.use(session({
    secret: "greenmouse cool cat",
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
//AUTH - passport and session
app.use(passport.initialize());
app.use(passport.session());
// passport with User
passport.use(new LocalStrategy(User.authenticate()))
// passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
//locals for user
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})
//routes
const campgrounds = require("./routes/campgrounds")
const comments = require("./routes/comments")
const indexRoute = require("./routes/index")
const usersRoutes = require("./routes/users")
app.use("/", indexRoute)
app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/comments", comments)
app.use("/user", usersRoutes)

app.listen(3000, () => {
    console.log("Server is on")
})