// utils/jwt.js
// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config();

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME });
};



