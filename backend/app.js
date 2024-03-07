const express = require('express');
const cors = require('cors');
const logger = require('./util/logger');
const userRouter = require('./routes/userRoutes');
const profileRouter = require('./routes/profileRoutes');
const teamRouter = require('./routes/teamRoutes');
const { authenticateJWT } = require("./middleware/auth");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded());
app.use(authenticateJWT);
app.use((req, res, next) => {
    logger.info(`${req.method} request at ${req.url}`);
    next();
});
app.use('/profiles', profileRouter);
app.use('/users', userRouter);
app.use('/teams', teamRouter)

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});