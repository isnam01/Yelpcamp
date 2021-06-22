const mongoose = require('mongoose')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb+srv://mansi:mansi@confusion.tueyj.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.on("open", () => {
    console.log("Database Connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            author: "608abe546730976da89e3341",
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem ipsum",
            price,
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})