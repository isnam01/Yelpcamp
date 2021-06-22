if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const ejsmate = require('ejs-mate')
const methodOverride = require('method-override')

const ExpressError = require('./utils/expresserror')

const session = require('express-session');
const flash = require('connect-flash');

const Review = require('./models/review')
const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');

mongoose.connect('mongodb+srv://mansi:mansi@confusion.tueyj.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.on("open", () => {
    console.log("Database Connected")
});


app.engine('ejs', ejsmate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: "fyewdyugewudgewd",
    resave: false,
    saveUninitialized: true,
    cookies: {
        expires: Date.now() + 1000 * 60,
        maxAge: 1000 * 60
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);

app.use('/campgrounds', campgrounds)

app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message)
        err.message = "Something went wrong"
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () =>
    console.log("Serving on port 3000")
)

//sudo netstat -lpn |grep :'3000'