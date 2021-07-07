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
			res.status(500).json({
				message: err.message,
				custom: "The users information could not be retrieved",
			})
		})
})

// Get a user by id
server.get('/api/users/:id', (req, res) => {
	const id = req.params.id;
	User.findById(id)
		.then(user => {
			if (!user) {
				res.status(404).json({
					message: "The user with the specified ID does not exist"
				})
			} else {
				res.status(200).json(user)
			}
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				message: err.message,
				custom: 'The user information could not be retrieved'
			})
		})
})

server.delete('/api/users/:id', async (req, res) => {
	try {
		const result = await User.remove(req.params.id)
		if (!result) {
			res.status(404).json({ message: "The user with the specified ID does not exist" })
		} else {
			res.json(result)
		}
	} catch (err) {
		res.status(500).json({
			message: err.message,
			custom: "The user could not be removed"
		})
	}
})

server.put('/api/users/:id', (req, res) => {
	const { id } = req.params
	const { name, bio } = req.body
	if (!name || !bio) {
		res.status(422).json({ message: "Please provide name and bio for the user" })
	} else {
		User.update(id, { name, bio })
			.then(updated => {
				if (!updated) {
					res.status(400).json({ message: "The user with the specified ID does not exist" })
				} else {
					res.status(200).json(updated)
				}
			})
			.catch(err => {
				res.status(500).json({
					message: err.message,
					custom: "The user information could not be modified"
				})
			})
	}
})

module.exports = server // EXPORT YOUR SERVER instead of {}
