const express = require('express')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()

const API_URL = process.env.API_URL

// show login page
router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/profiles')
    res.render('login')
})

// redirect to github
router.get('/github', (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        redirect_uri: `${API_URL}/auth/github/callback`,
        scope: 'user:email',
        state: 'web'
    })
    res.redirect(`https://github.com/login/oauth/authorize?${params}`)
})

// github callback — backend handles OAuth, redirects here with tokens
router.get('/callback', async (req, res) => {
    const { access_token, refresh_token, username, role } = req.query

    if (!access_token) {
        return res.redirect('/auth/login')
    }

    req.session.user = { username, role }
    req.session.access_token = access_token
    req.session.refresh_token = refresh_token

    res.redirect('/profiles')
})

// logout
router.post('/logout', async (req, res) => {
    try {
        await axios.post(`${API_URL}/auth/logout`, {
            refresh_token: req.session.refresh_token
        })
    } catch(err) {
        // continue even if logout request fails
    }

    req.session.destroy()
    res.redirect('/auth/login')
})

module.exports = router