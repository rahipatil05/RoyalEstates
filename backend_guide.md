# Backend Implementation Guide

While this project is delivered as a fully functional React SPA with a Mock Service Layer (to allow immediate testing without server setup), the codebase is designed to connect to a real Node.js/Express backend easily.

## Switching to Real Backend

1. Go to `services/api.ts`.
2. Replace the `localStorage` logic with `fetch` or `axios` calls to your endpoints.

## Express + Mongoose Structure Reference

Here is how the backend files mentioned in the prompt should be implemented in a real server environment:

### `models/User.js`
```javascript
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'owner', 'user'], default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
});
module.exports = mongoose.model('User', UserSchema);
```

### `models/Property.js`
```javascript
const mongoose = require('mongoose');
const PropertySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  rent: Number,
  location: String,
  type: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  // ... other fields
});
module.exports = mongoose.model('Property', PropertySchema);
```

### `routes/auth.js`
```javascript
const router = require('express').Router();
// Implement POST /login and POST /register using bcrypt and jsonwebtoken
module.exports = router;
```

### `server.js`
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use('/auth', require('./routes/auth'));
app.use('/property', require('./routes/property'));
// ... other routes

app.listen(5000, () => console.log('Server running on 5000'));
```
