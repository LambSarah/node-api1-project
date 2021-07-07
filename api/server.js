const express = require('express')
const User = require('./users/model')

const app = express()

app.use(express.json())

app.post('/api/users', (req, res) => {
	//validate req.body 
	if (!req.body.name || !req.body.bio) {
		res.status(422).json({ message: 'name and bio are required' })
	} else {
		const { name, bio } = req.body
		User.create({ name, bio })
			.then(user => {
				res.status(201).json(user)
			})
			.catch(err => {
				res.status(500).json({
					message: err.message
				})
			})
	}
})

module.exports = app // EXPORT YOUR SERVER instead of {}
