let express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require('path'),
    expressHandlebars = require('express-handlebars'),
    flash = require('connect-flash'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Joi = require('joi'),
    user_hash = require(__dirname + '/models/user.js');

const User = require(path.join(__dirname, '/models/user.js')),
    Tour = require(path.join(__dirname, '/models/tour.js')),
    Hotel = require(path.join(__dirname, '/models/hotel.js'));
const fileUpload = require('express-fileupload');
const userSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
    confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
});

const port = process.env.PORT || 3000;
let app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    cookie: {maxAge: 60000},
    secret: 'codeworkrsekret',
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.succes_messages = req.flash('success');
    res.locals.error_messages = req.flash('error');
    next();
});

app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024},
}));

app.get('/', function (request, response) {
    console.log("Connected client: " + request.ip);
    response.sendFile(path.join(__dirname + "/pages/creative.html"));
});

app.get('/pages/:page', async function (request, response) {
    if (request.params.page !== 'Бронь.html') {
        console.log('Запрос: ' + request.params.page);
        console.log(path.join(__dirname, 'pages', request.params.page));
        response.sendFile(path.join(__dirname, 'pages', request.params.page));
    }
    else {
        if (request.headers.cookie !== undefined) {

            console.log('Cookie from bron: ' + request.headers.cookie);
            let cookie = request.headers.cookie;
            let array = cookie.split(' ');
            let email;

            for (let i = 0; i < array.length; i++) {
                console.log('el:   ' + array[i]);
                if (array[i].indexOf("User=") !== -1) {
                    console.log('ind:   ' + array[i].indexOf("User="));
                    email = request.headers.cookie.toString().substring(array[i].indexOf("User=") + 5, array[i].indexOf(';'));
                }

            }

            console.log('email:' + email);
            let user = await User.findOne({'email': email});

            if (user !== null) {
                console.log('Сессия пользователя: ' + user);
                response.sendFile(path.join(__dirname, "pages/Бронь.html"));
            } else {
                response.sendFile(path.join(__dirname, "pages/регистр.html"));
            }
        }

    }
});

app.get('/css/:path', function (request, response) {
    response.sendFile(path.join(__dirname + "/css/" + request.params.path));
});
app.get('/sources/bootstrap/:file', function (req, res) {
    if (req.params.file.includes('bootstrap.css.map')) {
        res.sendFile(path.join(__dirname, '/sources/bootstrap/', 'bootstrap.css'));
    } else {
        res.sendFile(path.join(__dirname, '/sources/bootstrap/', req.params.file));
    }

});
app.get('/sources/images/:file', function (req, res) {
    res.sendFile(path.join(__dirname, '/sources/images/', req.params.file));
});
app.get('/images/:file', function (req, res) {
    res.sendFile(path.join(__dirname, '/images/', req.params.file));
});

app.get('/sources/js/:file', function (req, res) {
    console.log(req.params.file);
    res.sendFile(path.join(__dirname, '/sources/js/', req.params.file));
});

app.get('/registration', async (req, res, next) => {
    res.sendFile(__dirname + '/pages/регистр.html');
});
app.post('/registration', async (req, res, next) => {
    try {
        console.log('registration body: ' + JSON.stringify(req.body));
        const result = Joi.validate(req.body, userSchema);
        if (result.error) {
            req.flash('error', 'Data entered is not valid. Please try again.');
            console.log("Data entered is not valid. Please try again.");
            res.sendFile(__dirname + '/pages/регистр.html');
            return
        }

        const user = await User.findOne({'email': result.value.email});
        if (user) {
            req.flash('error', 'Email is already in use.');
            console.log("Email is already in use.");
            res.sendFile(__dirname + '/pages/регистр.html');
            return
        }

        const hash = await User.hashPassword(result.value.password);

        delete result.value.confirmationPassword;
        result.value.password = hash;

        const newUser = await new User(result.value);
        await newUser.save();

        req.flash('success', 'Registration successfully, go ahead and login.');
        console.log('Registration successfully, go ahead and login.');
        res.sendFile(__dirname + '/pages/Бронь.html');

    } catch (error) {
        res.send("Could not find");
        next(error)
    }
});

app.post('/sign-in', async function (req, res, next) {

    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
    });

    let obj = Joi.validate(req.body, schema);
    console.log('Object: ' + obj.value.email);
    let user = await User.findOne({'email': obj.value.email}),
        hashPassword = user_hash.comparePassword(obj.value.password, user.password);

    console.log('Schema password: ' + hashPassword);

    if (hashPassword) {
        req.session.user = {id: user._id, name: user.username, email: user.email};
        res.setHeader("Set-Cookie", "User=" + user.email, {maxAge: 10800});
        res.sendFile(__dirname + '/pages/Бронь.html');
        console.log('success ' + res.getHeader('Set-Cookie'));
    }
    else {
        console.log('password:' + obj.value.password);
        res.sendFile(__dirname + '/pages/регистр.html');
    }
});

app.get('/add-tours', async function (req, res, next) {
    res.sendFile(__dirname + '/pages/addTourPage.html');
});

app.post('/add-tours', bodyParser.urlencoded({extended: false}), async function (req, res, next) {
    let tour = new Tour();
    tour.img.data = req.files.attachment.data;
    tour.img.filename = req.files.attachment.name.toString().split('.')[0];
    tour.img.contentType = req.files.attachment.mimetype.split('/')[1];
    tour.name = req.body.name;
    tour.country = req.body.country;
    tour.city = req.body.city;
    tour.price = req.body.price;
    tour.save();
    res.sendFile(__dirname + '/pages/addTourPage.html');
});

app.post('/add-hotels', bodyParser.urlencoded({extended: false}), async function (req, res, next) {
    let hotel = new Hotel();
    hotel.img.data = req.files.attachment.data;
    hotel.img.filename = req.files.attachment.name.toString().split('.')[0];
    hotel.img.contentType = req.files.attachment.mimetype.split('/')[1];
    hotel.name = req.body.name;
    hotel.country = req.body.country;
    hotel.city = req.body.city;
    hotel.price = req.body.price;
    hotel.save();
    res.sendFile(__dirname + '/pages/addTourPage.html');
});

app.post('/tour-list', async function (req, res, next) {

    let tour = await Tour.find({'country': req.body.country, 'city': req.body.city});
    res.setHeader("Content-Type", 'application/json');
    let tours = {
        length: 0,
        items: new Array()
    };
    if (tour !== null) {
        tours.length = tour.length;
        for (let i = 0; i < tour.length; i++) {
            console.log(" i " + i);

            let obj = {
                name: tour[i].name,
                country: tour[i].country,
                city: tour[i].city,
                price: tour[i].price, img: {
                    'file_name': tour[i].img.filename,
                    'content-type': tour[i].img.contentType,
                    'data': new Buffer(tour[i].img.data, 'binary').toString('base64')
                }
            };
            tours.items.push(obj);

        }
    } else {
        res.status(404);
    }

    res.send(tours);

});

app.get('/tour-list', async function (req, res, next) {
    let tour = await Tour.find({});
    res.setHeader("Content-Type", 'application/json');
    let tours = {
        length: 0,
        items: new Array()
    };
    if (tour !== null) {
        for (let i = 0; i < tour.length; i++) {
            let obj = {
                name: tour[i].name,
                country: tour[i].country,
                city: tour[i].city,
                price: tour[i].price
            };
            if (!tours.items.some(tour => tour['name'].trim() === obj.name.trim()))
                tours.items.push(obj);
        }
        tours.length = tours.items.length;
    } else {
        res.status(404);
    }

    res.send(tours);
});

app.get('/hotel-list', async function (req, res, next) {
    let hotel = await Hotel.find({});
    res.setHeader("Content-Type", 'application/json');

    let hotels = {
        length: 0,
        country: new Array(),
        city: new Array(),
        items: new Array()
    };

    if (hotel !== null) {
        for (let i = 0; i < hotel.length; i++) {
            let obj = {
                name: hotel[i].name,
                country: hotel[i].country,
                city: hotel[i].city,
                price: hotel[i].price
            };

            if (!hotels.country.includes(obj.country))
                hotels.country.push(obj.country);

            if (!hotels.city.includes( obj.city))
                hotels.city.push(obj.city);

            if (!hotels.items.some(hotel => hotel['name'].trim() === obj.name.trim()))
                hotels.items.push(obj);
        }
        hotels.length = hotels.items.length;
    } else {
        res.status(404);
    }

    res.send(hotels);
});

app.post('/hotel-list', async function (req, res, next) {

    let tour = await Hotel.find({'country': req.body.country, 'city': req.body.city});
    res.setHeader("Content-Type", 'application/json');
    let tours = {
        length: 0,
        items: new Array()
    };
    if (tour !== null) {
        tours.length = tour.length;
        for (let i = 0; i < tour.length; i++) {
            let obj = {
                name: tour[i].name,
                country: tour[i].country,
                city: tour[i].city,
                price: tour[i].price, img: {
                    'file_name': tour[i].img.filename,
                    'content-type': tour[i].img.contentType,
                    'data': new Buffer(tour[i].img.data, 'binary').toString('base64')
                }
            };
            tours.items.push(obj);
        }
    } else {
        res.status(404);
    }

    res.send(tours);
});

app.listen(port, function (err) {

    if (err)
        throw err;
    else {
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://utkir:spidster95@ds237979.mlab.com:37979/heroku_648dkgsq').then(() => {
            console.log("Connected to MongoDB !");
        }).then(() => {
            console.log("App listen on port: " + port);
        });
    }
});
