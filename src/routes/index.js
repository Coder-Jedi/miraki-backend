const express = require('express');
const authRoutes = require('./auth');
const artworkRoutes = require('./artworks');
const artistRoutes = require('./artists');
const favoriteRoutes = require('./favorites');
const cartRoutes = require('./cart');
const adminRoutes = require('./admin');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/artworks', artworkRoutes);
router.use('/artists', artistRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/cart', cartRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
