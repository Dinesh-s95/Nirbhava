const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/AuthRoutes');
const userDetailsRoutes = require('./routes/UserDetailsRoute');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../openapi.json');

require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userDetailsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
