require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));

// srt router
app.use('/user', require('./router/user'));

app.listen(port, () => console.log(`start ${port} port localhost`));
