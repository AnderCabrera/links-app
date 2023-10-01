const express = require("express");
const router = express.Router();

const pool = require("../database.js");
const { isLoggedIn } = require("../lib/auth.js");

router.get("/add", isLoggedIn, (req, res) => {
  res.render("links/add.hbs");
});

router.post("/add", isLoggedIn, async (req, res) => {
  const { title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id
  };

  await pool.query("INSERT INTO Links set ?", [newLink]);

  req.flash('success', 'Link saved succesfully')
  res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {

  await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id], (error, results) => {
    if (error) return error.code;

    res.render('links/list.hbs', { links: results });
  });
})

router.get('/delete/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;

  await pool.query('DELETE FROM links WHERE id = ?', [id])

  req.flash('success', 'Link removed succesfully')
  res.redirect('/links')
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  
  await pool.query('SELECT * FROM links WHERE id = ?', [id], (error, result) => {
    if (error) return error.code;
    
    res.render('links/edit.hbs', {link: result[0]})
  });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const newLink = {
    title,
    description,
    url
  };

  await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, id], (error, result) => {
    if (error) return error.code;

    req.flash('success', 'Link updated succesfully');
    
    res.redirect('/links');
  });

});

module.exports = router;
