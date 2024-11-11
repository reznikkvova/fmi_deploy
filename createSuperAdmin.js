const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const config = require('config');

// Підключення до бази даних
async function connectToDatabase() {
    const dbUri = config.get('mongoUri');
    await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Підключено до бази даних');
}

// Функція для створення супер-адміністратора
async function createSuperAdmin() {
    const email = process.env.npm_config_email;
    const password = process.env.npm_config_password;

    if (!email || !password) {
        console.error('Будь ласка, вкажіть email та password');
        process.exit(1);
    }

    // Перевірка, чи існує користувач
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.log('Користувач з такою поштою вже існує');
        return;
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 12);

    // Створення нового користувача
    const user = new User({
        email,
        password: hashedPassword,
        isAdmin: 'true',
        name: 'Super Admin',
        phone: '',
        deliveryCity: '',
        deliveryAddress: '',
    });

    await user.save();
    console.log('Супер-адміністратор створений');
}

// Основний блок запуску
connectToDatabase()
    .then(createSuperAdmin)
    .then(() => mongoose.disconnect())
    .catch((error) => {
        console.error('Помилка:', error);
        mongoose.disconnect();
    });
