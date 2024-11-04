const { Router } = require('express');
const router = Router();
const User = require("../models/User");
const Tire = require("../models/Tire");

const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
router.put('/update/:id', async (req, res) => {
    try {
        const update = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        });

        res.status(200).json({ message: 'Дані було успішно оновлено' });
    } catch (e) {
        console.log(e);
    }
})

router.put('/update-password/:id', [
    check('current', 'Ви не ввели поточний пароль').notEmpty(),
    check('new', 'Новий пароль повинен містити 6 символів').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некоректно введені дані'
            });
        }

        const { current, new: newPassword } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        // Проверка текущего пароля
        const isMatch = await bcrypt.compare(current, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Поточний пароль невірний' });
        }

        // Хэшируем новый пароль
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        // Сохраняем изменения
        await user.save();

        res.status(200).json({ message: 'Пароль було успішно змінено' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

router.get('/get-user', async (req, res) => {
    try{
        const userId = req.query.userId;

        const user = await User.findOne({_id: userId});

        return res.status(200).json({
            success: true,
            user: user
        });

    } catch(err) {
        res.status(500).json({ error: 'Помилка серверу' });
    }
});


module.exports = router;
