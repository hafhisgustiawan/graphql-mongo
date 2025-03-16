import mongoose from 'mongoose';
import app from './app.js';
import config from './utils/env.js';
mongoose.connect(config.DATABASE).then(() => {
    console.log('DB connection successfull! 🫰');
});
const port = config.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port} 👌`);
});
process.on('unhandledRejection', (err) => {
    console.log('💥UNHANDLED REJECTION, shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
process.on('uncaughtException', (err) => {
    console.log('💥UNCAUGHT EXCEPTION, shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
process.on('SIGTERM', () => {
    console.log('🙅‍♀️ SIGTERM RECEIVED. Shutting down...');
    server.close(() => {
        console.log('💥Process terminated!');
    });
});
