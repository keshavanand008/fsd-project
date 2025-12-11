import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function maybeAuth(req, res, next) {
  try {
    const hdr = req.headers.authorization || '';
    if (hdr.startsWith('Bearer ')) {
      const token = hdr.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch(e) { /* ignore, stay unauthenticated */ }
  next();
}
