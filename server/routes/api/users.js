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
    return res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      user: {
        name: newUser.name,
        email: newUser.email
      }
    });

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

router.put('/update-basic', async (req, res) => {
  const { email, name, phone, city, age } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, phone, city, age },
      { new: true }
    );

    res.json({ message: 'Atualizado com sucesso', user });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
});

router.put('/update-email', async (req, res) => {
  const { currentEmail, newEmail } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email: currentEmail },
      { email: newEmail },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json({ message: 'E-mail atualizado com sucesso', email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar o e-mail' });
  }
});

router.put('/update-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar a senha' });
  }
});


router.get('/me', async (req, res) => {
  const email = req.query.email;

  const user = await User.findOne({ email }).select('-password');
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  res.json(user);
});

router.delete('/delete', async (req, res) => {
  const { email } = req.body;

  try {
    const deleted = await User.findOneAndDelete({ email });
    if (!deleted) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});

module.exports = router;
