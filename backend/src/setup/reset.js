require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');

async function deleteData() {
  await mongoose.connect(process.env.DATABASE, {
    serverSelectionTimeoutMS: 60_000,
    connectTimeoutMS: 60_000,
  });

  const Admin = require('../models/coreModels/Admin');
  const AdminPassword = require('../models/coreModels/AdminPassword');
  const Setting = require('../models/coreModels/Setting');
  const PaymentMode = require('../models/appModels/PaymentMode');
  const Taxes = require('../models/appModels/Taxes');
  const ServiceItem = require('../models/appModels/ServiceItem');

  await Admin.deleteMany();
  await AdminPassword.deleteMany();
  await PaymentMode.deleteMany();
  await Taxes.deleteMany();
  await ServiceItem.deleteMany();
  console.log('👍 Admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  await Setting.deleteMany();
  console.log('👍 Setting Deleted. To setup Setting data, run\n\n\t npm run setup\n\n');

  process.exit();
}

deleteData();
