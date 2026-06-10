require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readBody, connectDb, registerAuthModels, handleOptions } = require('./_shared');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return handleOptions(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDb();
    registerAuthModels();

    const Admin = mongoose.model('Admin');
    const AdminPassword = mongoose.model('AdminPassword');

    const { email, password, remember } = await readBody(req);

    if (!email || !password) {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'Invalid/Missing credentials.',
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'JWT_SECRET is not configured on the server.',
      });
    }

    const user = await Admin.findOne({ email, removed: false });

    if (!user) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No account with this email has been registered.',
      });
    }

    if (!user.enabled) {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'Your account is disabled, contact your account adminstrator',
      });
    }

    const databasePassword = await AdminPassword.findOne({ user: user._id, removed: false });

    if (!databasePassword) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Invalid credentials.',
      });
    }

    const isMatch = await bcrypt.compare(databasePassword.salt + password, databasePassword.password);

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Invalid credentials.',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: remember ? '8760h' : '24h',
    });

    await AdminPassword.findOneAndUpdate(
      { user: user._id },
      { $push: { loggedSessions: token } },
      { new: true }
    ).exec();

    return res.status(200).json({
      success: true,
      result: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        email: user.email,
        photo: user.photo,
        token,
        maxAge: remember ? 365 : null,
      },
      message: 'Successfully login user',
    });
  } catch (error) {
    console.error('login error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
