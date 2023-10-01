const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/links", async (req, res) => {
  await pool.query("SELECT * FROM links", (error, result) => {
    if (error) return error.code;

    return res.json(result);
  });
});

router.get("/link/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query(
    "SELECT * FROM links WHERE id = ?",
    [id],
    (error, result) => {
      if (error) return error.code;
      if (result.length == 0) return res.json({message: 'Not Found'});

      return res.json(result);
    }
  );
});

module.exports = router;
