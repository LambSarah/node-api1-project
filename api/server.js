const express = require('express')
const User = require('./users/model')

const server = express()

server.use(express.json())

// Add new user
server.post('/api/users', (req, res) => {
	//validate req.body for req'd fields
	if (!req.body.name || !req.body.bio) {
		// send error if invalid
		res.status(400).json({ message: 'Please provide name and bio for the user' })
	} else {
		const { name, bio } = req.body
		// valid request = save new user  and return user obj
		User.insert({ name, bio })
			.then(user => {
				res.status(201).json(user)
			})
			//catch server error		
			.catch(err => {
				res.status(500).json({
					message: err.message
				})
			})
	}
})

// Get list of users
server.get('/api/users', (req, res) => {
	User.find()
		.then(users => {
			res.status(200).json(users)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				message: "The users information could not be retrieved",
			})
		})
})

module.exports = server // EXPORT YOUR SERVER instead of {}
