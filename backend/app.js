const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const attendeeRoutes = require('./routes/attendeeRoutes');
const venueRoutes = require('./routes/venueRoutes');
const organizerRoutes = require('./routes/organizerRoutes');

const app = express();

app.use(helmet());
app.use(compression());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// tighter limit on auth routes specifically to slow down brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

app.use('/api', globalLimiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date() });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendees', attendeeRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/organizers', organizerRoutes);

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

module.exports = app;
