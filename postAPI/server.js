const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const BlogPost = require('./BlogPosts/BlogPostModel.js');

const server = express();

server.use(bodyParser.json());

server.post('/posts', function(req, res) {
	const post = new BlogPost(req.body);

	post
	  .save()
	  .then(function(post) {
	  	res.status(200)
	  	  .json(post);
	  })
	  .catch(function(error) {
	  	res.status(500)
	  	  .json({ message: 'Server Error!', error });
	  });
});

server.get('/posts', function(req, res) {
    BlogPost
      .find()
      .then(function(posts) {
      	res.status(200).json(posts);
      })
      .catch(function(error) {
      	res.status(500)
      	  .json({ message: 'Server Error!', error });
      });
});

server.get('/posts/:id', function(req, res) {
    const id = req.params.id;

    BlogPost
      .findById(id)
      .then(function(post) {
      	if (post === null) {
      		res.status(404)
      		  .json({ message: 'post not found'});
      	} else {
      		res.status(200)
      		  .json(post);
      	}
      })
      .catch(function(error) {
      	if (error.name === 'CastError') {
      		res.status(500)
      		  .json({ message: 'The ID ${error.value} provided is invalid', error });
      	} else {
      		res.status(500).json({ message: 'Server Error', error });
      	}
      });
});

server.delete('/posts/:id', function(req, res) {
    const id = req.params.id;
    BlogPost
      .findByIdAndRemove(id)
      .then(function(post) {
      	res.status(200).json({ message: 'Post removed successfully!'});
      })
      .catch(function(error) {
      	res.status(500).json({ message: 'server error', error });
      });
});

server.put('/posts/:id', function(req, res) {
    const id = req.params.id;
    const postInformation = req.body;

    BlogPost
      .findByIdAndUpdate(id, postInformation)
      .then(function(post) {
      	res.status(200).json({ message: 'Post updated successfully!'});
      })
      .catch(function(error) {
      	res.status(500).json({ message: 'server error', error });
      });
});

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost/BlogPosts', { useMongoClient: true })
  .then(function() {
  	server.listen(5000, function() {
	  console.log('Server running!');
    }); 
  })
  .catch(function(error) {
  	console.log('Error connecting to the Datebase!');
  });

