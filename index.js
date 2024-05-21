const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser')

const reviewRoute = require('./src/routes/reviewRoute')
const userRoute = require('./src/routes/userRoute')
const productRoute = require('./src/routes/productRoute')
const categoryRoute = require('./src/routes/categoryRoute')
const orderRoute = require('./src/routes/orderRoute')
const attributeRoute = require('./src/routes/attributeRoute')
const attributeValueRoute = require('./src/routes/attributeValueRoute')
const paypalRoute = require('./src/routes/paypalRoute')



const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
    optionsSuccessStatus: 200,
    credentials: true, // Enable credentials (cookies, authorization headers, etc)
    origin: ["http://localhost:3000", "http://localhost:3001"]
}));


const uri = process.env.MONGODB_URL

async function connect() {
    try {
        await mongoose.connect(uri)
        console.log('Connected to MongoDB')
    }
    catch (err) {
        console.error(err)
    }
}
connect()


app.use('/api/auth', userRoute)
app.use('/api/product', productRoute)
app.use('/api/category', categoryRoute)
app.use('/api',orderRoute)
app.use('/api', attributeRoute)
app.use('/api', attributeValueRoute)
app.use('/api', reviewRoute)
app.use('/api', paypalRoute)

app.listen(4000, () => {
    console.log('listening on port 4000');
});