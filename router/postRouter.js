const { createPost, getPosts, getPost, deletePost, updatePost } = require('../controllers/postController');
const upload = require('../utils/multer')
const router = require('express').Router();

router.post('/posts/:id', upload.array('images', 10), createPost);
router.get('/posts', getPosts);
router.get('/posts/:id', getPost);
router.put('/posts/:id',upload.array('images', 10), updatePost);
router.delete('/posts/:id', deletePost);

module.exports = router