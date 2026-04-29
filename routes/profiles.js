const express = require('express')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()

const API_URL = process.env.API_URL

function getHeaders(req) {
    return {
        'Authorization': `Bearer ${req.session.access_token}`,
        'X-API-Version': '1'
    }
}

// list all profiles
router.get('/', async (req, res) => {
    try {
        console.log('Headers being sent:', getHeaders(req))
        const { gender, country_id, age_group, min_age, max_age, sort_by, order, page, limit } = req.query

        const response = await axios.get(`${API_URL}/api/profiles`, {
            headers: getHeaders(req),
            params: { gender, country_id, age_group, min_age, max_age, sort_by, order, page: page || 1, limit: limit || 10 }
        })

        res.render('profiles', {
            profiles: response.data.data,
            pagination: {
                page: response.data.page,
                total_pages: response.data.total_pages,
                total: response.data.total,
                links: response.data.links
            },
            filters: req.query,
            user: req.session.user
        })
    } catch(err) {
        console.log(err.message)
        res.render('profiles', { profiles: [], pagination: {}, filters: {}, user: req.session.user, error: 'Failed to load profiles' })
    }
})

// search profiles
router.get('/search', async (req, res) => {
    const { q, page, limit } = req.query
    let results = []
    let pagination = {}
    let error = null

    if (q) {
        try {
            const response = await axios.get(`${API_URL}/api/profiles/search`, {
                headers: getHeaders(req),
                params: { q, page: page || 1, limit: limit || 10 }
            })
            results = response.data.data
            pagination = {
                page: response.data.page,
                total_pages: response.data.total_pages,
                total: response.data.total
            }
        } catch(err) {
            error = err.response?.data?.message || 'Search failed'
        }
    }

    res.render('search', { results, pagination, q, user: req.session.user, error })
})

// get single profile
router.get('/:id', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/api/profiles/${req.params.id}`, {
            headers: getHeaders(req)
        })
        res.render('profile', { profile: response.data.data, user: req.session.user })
    } catch(err) {
        res.redirect('/profiles')
    }
})

module.exports = router