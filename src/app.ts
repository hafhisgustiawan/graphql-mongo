import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import morgan from 'morgan';
import { graphqlHTTP } from 'express-graphql';

//fn or class import
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import resolver from './graphql/resolver.js';
import schema from './graphql/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(
  '/',
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
  })
);

// app.use('/api/v1/subdistricts', kecamatanRouter);
// app.use('/api/v1/productions', productionRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
