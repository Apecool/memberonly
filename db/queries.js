const pool = require('./index');
const bcrypt = require('bcryptjs');

// Get user by name
const getUserByName = async (username) => {
  const result = await pool.query('SELECT * FROM pusers WHERE username = $1', [username]);
  return result.rows[0];
};

// Get user by id
const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM pusers WHERE id = $1', [id]);
  return result.rows[0];
}
// Add a new user
const addUser = async (user) => {
  const { username, password, is_member } = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query('INSERT INTO pusers (username, password, is_member) VALUES ($1, $2, $3)', [username, hashedPassword, !!is_member]);
  return result.rows[0];
};

// Get posts
const getPosts = async () => {
  const posts = await pool.query('SELECT id, title, summary FROM posts ORDER BY created_at DESC');
  return posts.rows;
}

// Get post by id
const getPostById = async (id) => {
  const post = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  return post.rows[0];
}

// Add post
const addPost = async (title, summary, content, authorId) => {
  const result = await pool.query('INSERT INTO posts (title, summary, content, author_id) VALUES ($1, $2, $3, $4)', [title, summary, content, authorId]);
  return result.rows[0];
}

module.exports = {
  getUserByName,
  getUserById,
  addUser,
  getPosts,
  getPostById,
  addPost,
};
