const router = require('express').Router();
const jwt = require('jsonwebtoken');

const person = [
  {
    name: 'YiRu',
    age: 18,
  },
  {
    name: 'Owen',
    age: 20,
  },
];

let refreshTokens = [];

function auth(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.replace('Bearer', '').trim();
  if (!token) return res.status(401).send({ message: 'jwt must be provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    // eslint-disable-next-line no-param-reassign
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).send({ message: 'jwt invalid' }); // token 失效
  }
}

router.post('/signin', (req, res) => {
  const { name } = req.body;
  const accessToken = jwt.sign({ name }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '5s',
  });
  const refreshToken = jwt.sign({ name }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '15s',
  });
  refreshTokens.push(refreshToken);
  res.send({ accessToken, refreshToken });
});

router.post('/check', auth, (req, res) => {
  const { name } = req.user;
  const { age } = req.body;
  if (!age) return res.sendStatus(404);
  const data = person.filter((item) => item.name === name)[0];
  return res.status(200).send(data);
});

router.post('/signout', (req, res) => {
  console.log(req.body.token);
  refreshTokens = refreshTokens.filter((item) => item !== req.body.token);
  console.log(refreshTokens);
  res.status('204').send('以登出');
});

router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).send({ message: 'jwt must be provided' });
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(401).send({ message: 'jwt invalid' });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ name: decoded.name }, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: '5s',
    });
    return res.send({ accessToken });
  } catch (error) {
    return res.status(401).send({ message: 'jwt invalid' });
  }
});

module.exports = router;
