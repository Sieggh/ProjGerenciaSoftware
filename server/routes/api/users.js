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

const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Senha incorreta' });

    res.status(200).json({ message: 'Login realizado com sucesso', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

module.exports = router;
