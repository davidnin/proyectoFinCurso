'use strict'

var express = require('express');
var CommentController = require('../controllers/comment');

var md_auth = require('../middlewares/autenticated');
var api = express.Router();



api.get('/comment/:id', CommentController.getComment);
api.get('/',CommentController.pruebaComment);
api.post('/create',CommentController.createComment);
api.get('/comments', CommentController.getComments);
api.put('/update/:id',CommentController.updateComment);
api.delete('/delete/:id',CommentController.deleteComment);


module.exports = api;
