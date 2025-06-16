const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5500;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/contact_form', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(' Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Mongoose Schema & Model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String
});
const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    res.send('<h2 style="text-align:center;">Form submitted successfully!</h2><a href="/">Go back</a>');
  } catch (error) {
    console.error('error saving data:', error);
    res.status(500).send('Something went wrong!');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
