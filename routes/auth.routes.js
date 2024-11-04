const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();
const config = require('config');


// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Password should contains minimum 6 symbols').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Не правильний формат данних',
        });
      }
      const { email, password, name } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: 'Користувач вже зареєстрований' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword, name: name, isAdmin: false, phone: '', deliveryCity: '', deliveryAddress: '' });
      await user.save();

      res.status(201).json({ message: 'Користувача створено!' });
    } catch (e) {
      res.status(500).json({ message: 'Помилка серверу' });
    }
  },
);
// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Не правильний формат пошти').normalizeEmail().isEmail(),
    check('password', 'Password doesnt exist').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Данні не валідні',
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Користувач не існує' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Пароль не правильний!' });
      }
      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), { expiresIn: '1h' });

      res.json({ token, userId: user.id, isAdmin: user.isAdmin === 'true', message: 'Авторизація успішна' });
    } catch (e) {
      res.status(500).json({ message: 'Помилка серверу' });
    }
  },
);


module.exports = router;
