import { CorsOptions } from 'apollo-server'

export default {
  credentials: true,
  // origin: process.env.NODE ? process.env.API_DEV : process.env.API_WEB,
  origin: 'http://localhost:3000',
  allowedHeaders: [
    'Access-Control-Allow-Origin',
    'Origin',
    'Access-Control-Allow-Headers',
    'Content-Type',
    'Authorization'
  ]
} as CorsOptions
