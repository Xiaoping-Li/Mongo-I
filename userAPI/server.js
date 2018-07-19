const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./Users/UserModel.js');

const server = express();

server.use(bodyParser.json());

server.post('/users', function(req, res) {
	const userInformation = req.body;
	const user = new User(userInformation);

	user
	  .save()
	  .then(function(user) {
	  	res.status(200).json(user);
	  })
	  .catch(function(error) {
	  	res.status(500)
	  	  .json({ message: "Server Error", error });
	  });
});

server.get('/users', function(req, res) {
    User.find({})
      .then(function(users) {
        res.status(200).json(users);
      })
      .catch(function(error) {
      	res.status(500).json({
      		message: "Server Error", error
      	});
      });
});

server.get('/users/:id', function(req, res) {
	const { id } = req.params;

	User.findById(id)
	  .then(function(user) {
	  	if (user === null) {
	  		res.status(404).json({ message: 'User not found' });
	  	} else {
	  		res.status(200).json(user);
	  	}
	  })
	  .catch(function(error) {
	  	if (error.name === 'CastError') {
	  		res.status(500).json({ message: 'The ID ${error.value} provided is invalid', error })
	  	} else {
	  		res.status(500).json({ message: 'Server Error', error })
	  	}
	  });
});

server.delete('/users/:id', function(req, res) {
    const id = req.params.id;

    User.findByIdAndRemove(id)
      .then(function(user) {
	  		res.status(200).json({ message: 'User removed successfully'});
	  })
	  .catch(function(error) {
	  		res.status(500).json({ message: 'Server Error', error });
	  });
});

server.put('/users/:id', function(req, res) {
    const id = req.params.id;
    const userInformation = req.body;

    User.findByIdAndUpdate(id, userInformation)
      .then(function(user) {
	  		res.status(200).json({ message: 'User updated successfully'});
	  })
	  .catch(function(error) {
	  		res.status(500).json({ message: 'Server Error', error });
	  });
});

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/CS5', { useMongoClient: true })
  .then(function(){
  	 server.listen(5000, function() {
      console.log('Server up');
     });
  })
  .catch(function(error) {
  	console.log('Error connecting to the Database');
  });




