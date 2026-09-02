require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { testConnection } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const buildLookupRouter = require('./routes/lookupRoutes');

const authRoutes = require('./routes/authRoutes');
const programRoutes = require('./routes/programRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const savedProgramRoutes = require('./routes/savedProgramRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ProgramWise API', time: new Date().toISOString() });
});

// Feature routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/saved-programs', savedProgramRoutes);
app.use('/api/admin', adminRoutes);

// Lookup / reference-data routes (universities, providers, categories, career goals)
app.use('/api/universities', buildLookupRouter('universities', { hasDescription: true, hasWebsite: true }));
app.use('/api/providers', buildLookupRouter('providers', { hasDescription: true, hasWebsite: true }));
app.use('/api/categories', buildLookupRouter('categories', {}));
app.use('/api/career-goals', buildLookupRouter('career_goals', {}));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ProgramWise API running on http://localhost:${PORT}`);
  testConnection();
});
