const express = require('express');
const User = require('mongoose').model('User');

const router = new express.Router();

router.post('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message."
  });
});

module.exports = router;