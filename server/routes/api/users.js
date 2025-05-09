const express = require('express');
const router = express.Router();
const User = require('../../models/user')
const multer = require('multer');
const path = require('path');

// Configuração do destino e nome do arquivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

router.post('/register', upload.single('profileImage'), async (req, res) => {
  const { name, username, email, password, phone, city, age } = req.body;
  const profileImage = req.file?.filename;

  try {
    // Verifica se o e-mail já existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'E-mail já cadastrado' });

    const usernameExists = await User.findOne({ username });
    if (usernameExists) return res.status(400).json({ error: 'Nome de usuário já cadastrado' });
    
    const newUser = new User({
      name,
      username,
      email,
      password,
      phone,
      city,
      age,
      profileImage
    });

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      user: {
        name: newUser.name,
        email: newUser.email,
        profileImage: newUser.profileImage
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

    res.status(200).json({ message: 'Login realizado com sucesso', user: { name: user.name, email: user.email, profileImage: user.profileImage } });
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

router.put('/update-username', async (req, res) => {
  const { email, newUsername } = req.body;

  const exists = await User.findOne({ username: newUsername });
  if (exists) return res.status(400).json({ error: 'Nome de usuário já está em uso.' });

  const user = await User.findOneAndUpdate({ email }, { username: newUsername }, { new: true });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  res.json({ message: 'Nome de usuário atualizado com sucesso', username: user.username });
});

router.put('/update-descricao', async (req, res) => {
  const { email, descricao } = req.body;

  const user = await User.findOneAndUpdate({ email }, { descricao }, { new: true });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  res.json({ message: 'Descrição atualizada com sucesso', descricao: user.descricao });
});


router.get('/me', async (req, res) => {
  const email = req.query.email;

  const user = await User.findOne({ email }).select('-password');
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  res.json(user);
});

router.put('/update-photo', upload.single('profileImage'), async (req, res) => {
  const { email, useDefault } = req.body;

  let newImage = 'default-avatar.jpg';
  if (!useDefault && req.file?.filename) {
    newImage = req.file.filename;
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { profileImage: newImage },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json({ message: 'Imagem atualizada', profileImage: user.profileImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar imagem' });
  }
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

router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ error: 'Parâmetro de busca ausente' });

  try {
    const users = await User.find({
      username: { $regex: q, $options: 'i' }
    }).select('username profileImage');

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

router.get('/public-profile', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username }).select('username name bio profileImage');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar perfil público' });
  }
});


module.exports = router;
