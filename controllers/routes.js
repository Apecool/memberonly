const express = require('express');
const router  = express.Router();
const passport = require('passport');
const { addUser, getPosts, getPostById, addPost } = require('../db/queries');

// Register route
router.get('/register', (req, res) => {
    res.render('register', { message: req.flash('error') });
});

router.post('/register', async (req, res) => {
    try {
        //await pool.query('INSERT INTO pusers (username, password, is_member) VALUES ($1, $2, $3)', [username, hashedPassword, !!is_member]);
        await addUser(req.body);
        res.redirect('/login');
    } catch (err) {
        req.flash('error', 'Registration failed.');
        res.redirect('/register');
    }
});

// Index route
router.get('/', (req, res) => {
    res.render('index', { message: req.flash('error') });
});

router.get('/login',(req, res) => {
    res.render('login', { message: req.flash('error') });
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/',
    failureFlash: true
}));

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
          console.error('Logout error:', err);
          return res.redirect('/error'); // Redirect to an error page or handle as needed
        }
        res.redirect('/'); // Redirect to the login page or another page after logout
    });
});

// Posts route (shows post summaries)
router.get('/posts', async (req, res) => {
    //const posts = await pool.query('SELECT id, title, summary FROM posts ORDER BY created_at DESC');
    const posts = await getPosts();
    //console.log(req.user);
    res.render('posts', { user: req.user, posts });
});

// Post details route
router.get('/post/:id', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');
    const postId = req.params.id;
    //const post = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    const post = await getPostById(postId);
    //const user = await pool.query('SELECT is_member FROM pusers WHERE id = $1', [req.user.id]);
    if (!post) {
        return res.status(404).send('Post not found');
    }

    //console.log(req.user.is_member);
    if (!req.user.is_member) {
        return res.status(403).send('Membership required to view details');
    }

    res.render('post-details', { post });
});

// Create a new post
router.get('/posts/new', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('new-post');
});

router.post('/posts/new', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    const { title, summary, content } = req.body;
    const authorId = req.user.id;
    //console.log(authorId);

    //await pool.query('INSERT INTO posts (user_id, title, summary, content) VALUES ($1, $2, $3, $4)', [userId, title, summary, content]);
    await addPost(title, summary, content, authorId);
    res.redirect('/posts');
});

module.exports = router;
