const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')
require('dotenv').config()

const authRouter = require('./routes/auth')
const profilesRouter = require('./routes/profiles')
const requireAuth = require('./middleware/requireAuth')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.set('trust proxy', 1)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 5 * 60 * 1000 // 5 minutes
    }
}))

// routes
app.use('/auth', authRouter)
app.use('/profiles', requireAuth, profilesRouter)

// home
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/profiles')
    }
    res.redirect('/auth/login')
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Web portal running on port ${PORT}`)
})