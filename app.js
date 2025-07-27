// app.js
const { fetchCryptoPrices } = require('../utils/cryptoPrice');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const apiRoutes = require('./routes/api');
const walletRoutes = require('./routes/walletRoutes');
const gameSocket = require('./sockets/gameSocket');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api', walletRoutes);
app.use(express.static('public'));

gameSocket(io); // WebSocket logic

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
