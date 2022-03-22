const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const authJwt = require('./utils/jwt')
const errorHandler = require('./utils/error-handler')
require('dotenv/config')

app.use(cors())
app.options('*', cors())

// Middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt())
// Routes
const productRouter = require('./routers/productRoutes')
const categoryRouter = require('./routers/categoryRoutes')
const userRouter = require('./routers/userRoutes')
const orderRouter = require('./routers/orderRoutes')
app.use(errorHandler)

const api = process.env.API_URL

// Routers
app.use(`${api}/products`, productRouter)
app.use(`${api}/categories`, categoryRouter)
app.use(`${api}/users`, userRouter)
// app.use(`${api}/orders`, orderRouter)

mongoose
    .connect(process.env.DATABASE)
    .then(() => console.log('DB connection successful!'))
    .catch((err) => {
        console.log(err)
    })

app.listen(3000, () => {
    console.log(api)
    console.log('server is running on localhost')
})
