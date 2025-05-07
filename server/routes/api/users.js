const express = require('express');
const router = express.Router();
const User = require('../../models/user')

router.post('/register', async (req, res) => {
  const { name, email, password, phone, city, age } = req.body;

  try {
    // Verifica se o e-mail já existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'E-mail já cadastrado' });

    const newUser = new User({
      name,
      email,
      password,
      phone,
      city,
      age
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

module.exports = router;
