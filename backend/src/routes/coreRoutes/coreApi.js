const express = require('express');

const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const adminController = require('@/controllers/coreControllers/adminController');
const adminDirectoryController = require('@/controllers/coreControllers/adminDirectoryController');
const settingController = require('@/controllers/coreControllers/settingController');
const emailController = require('@/controllers/coreControllers/emailController');

const { singleStorageUpload } = require('@/middlewares/uploadMiddleware');
const requireAdminDirectoryAccess = require('@/middlewares/requireAdminDirectoryAccess');

// //_______________________________ Admin management_______________________________

router.route('/admin/read/:id').get(catchErrors(adminController.read));

router
  .route('/admin/directory/list')
  .get(requireAdminDirectoryAccess, catchErrors(adminDirectoryController.list));
router
  .route('/admin/directory/read/:id')
  .get(requireAdminDirectoryAccess, catchErrors(adminDirectoryController.read));
router
  .route('/admin/directory/create')
  .post(requireAdminDirectoryAccess, catchErrors(adminDirectoryController.create));
router
  .route('/admin/directory/update/:id')
  .patch(requireAdminDirectoryAccess, catchErrors(adminDirectoryController.update));
router
  .route('/admin/directory/delete/:id')
  .delete(requireAdminDirectoryAccess, catchErrors(adminDirectoryController.remove));

router.route('/admin/password-update/:id').patch(catchErrors(adminController.updatePassword));

//_______________________________ Admin Profile _______________________________

router.route('/admin/profile/password').patch(catchErrors(adminController.updateProfilePassword));
router
  .route('/admin/profile/update')
  .patch(
    singleStorageUpload({ entity: 'admin', fieldName: 'photo', fileType: 'image' }),
    catchErrors(adminController.updateProfile)
  );

// //____________________________________________ API for Global Setting _________________

router
  .route('/setting/create')
  .post(requireAdminDirectoryAccess, catchErrors(settingController.create));
router.route('/setting/read/:id').get(catchErrors(settingController.read));
router
  .route('/setting/update/:id')
  .patch(requireAdminDirectoryAccess, catchErrors(settingController.update));
//router.route('/setting/delete/:id).delete(catchErrors(settingController.delete));
router.route('/setting/search').get(catchErrors(settingController.search));
router.route('/setting/list').get(catchErrors(settingController.list));
router.route('/setting/listAll').get(catchErrors(settingController.listAll));
router.route('/setting/filter').get(catchErrors(settingController.filter));
router
  .route('/setting/readBySettingKey/:settingKey')
  .get(catchErrors(settingController.readBySettingKey));
router.route('/setting/listBySettingKey').get(catchErrors(settingController.listBySettingKey));
router
  .route('/setting/updateBySettingKey/:settingKey?')
  .patch(requireAdminDirectoryAccess, catchErrors(settingController.updateBySettingKey));
router
  .route('/setting/upload/:settingKey?')
  .patch(
    requireAdminDirectoryAccess,
    singleStorageUpload({ entity: 'setting', fieldName: 'settingValue', fileType: 'image' }),
    catchErrors(settingController.updateBySettingKey)
  );
router
  .route('/setting/updateManySetting')
  .patch(requireAdminDirectoryAccess, catchErrors(settingController.updateManySetting));

router.route('/email/test').post(requireAdminDirectoryAccess, catchErrors(emailController.test));

module.exports = router;
