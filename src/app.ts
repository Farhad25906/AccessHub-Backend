import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import httpStatus from 'http-status';
import routes from './routes';

const app: Application = express();

// Trust proxy is required for secure cookies on Vercel
app.set('trust proxy', 1);

app.use(cors({
  origin: (origin, callback) => {
    // In production, allow the frontend URL. In dev, allow localhost.
    const allowedOrigins = [
      'https://access-hub-frontend.vercel.app',
      'http://localhost:3000'
    ];
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'AccessHub System API is running'
  });
});

app.use('/api', routes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong';
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages: err.errors || [],
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
});

// Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API route not found'
      }
    ]
  });
});

export default app;
