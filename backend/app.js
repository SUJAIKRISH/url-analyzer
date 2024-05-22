const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('VirusTotal API Key:', process.env.VIRUSTOTAL_API_KEY);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/urls', urlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something broke!' });
});
