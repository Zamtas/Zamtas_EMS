const express = require('express');
const router = express.Router()
const userSignInController = require('../controller/UserSignInController');
const userSignUpController = require('../controller/UserSignUpController');
const getEmployeesController = require('../controller/getEmployeesController');
const { deleteEmployeeController, updateRoleController, getUserDetailsController, updateUserDetailsController } = require('../controller/employeeController');
const upload = require('../config/multer');
const { addProjectController, getProjectsController, checkProjectIdController, updateProjectController } = require('../controller/projectController');
const { addClientController, getClientsController, getClientByIdController, updateClientController } = require('../controller/clientController');
const { addProjectManagerController, getProjectManagersController, getProjectManagerByIdController, updateProjectManagerController } = require('../controller/projectManagerController');
const { addTaskController, getTasksController, getProjectDetailsController, getUserTasksController, completeTaskController, startTaskController, updateTaskController } = require('../controller/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const auth = require('../middleware/auth');
const { sendForgotPasswordOTP, resetPassword, verifyOTP } = require('../controller/forgotPasswordController');
const { addProductController, getProductsController, updateProductController, deleteProductController } = require('../controller/productController');
const { saveProductionSheetController, getProductionSheetController } = require('../controller/productionSheetController');
const { markNotificationAsReadController, getNotificationsController } = require('../controller/notificationController');

router.post('/sign-in', userSignInController);
router.post('/sign-up', userSignUpController);

router.get('/employees', getEmployeesController);
router.delete('/employees/:id', deleteEmployeeController);
router.put('/employees/:id/role', updateRoleController);
router.get('/employees/:id', getUserDetailsController);
router.put('/employees/:id', upload.single('profilePicture'), updateUserDetailsController);

router.post('/projects', addProjectController);
router.get('/projects', getProjectsController);
router.get('/check-project-id/:projectId', checkProjectIdController);
router.put('/projects/:projectId', updateProjectController);

router.post('/clients', addClientController);
router.get('/clients', getClientsController);
router.get('/clients/:id', getClientByIdController);
router.put('/clients/:id', updateClientController);

router.post('/project-managers', addProjectManagerController);
router.get('/project-managers', getProjectManagersController);
router.put('/projectManagers/:managerId', updateProjectManagerController);
router.get('/projectManagers/:managerId', getProjectManagerByIdController);


router.post('/tasks', addTaskController);
router.get('/tasks', getTasksController);
router.get('/projects/:projectId', getProjectDetailsController);


router.get('/user-tasks', auth, getUserTasksController);
router.put('/task/:taskId', updateTaskController);
router.post('/task-start', upload.single('startImage'), startTaskController);
router.post('/task-submit', upload.single('completeImage'), completeTaskController);

router.post('/forgot-password', sendForgotPasswordOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);


router.post('/products/add', addProductController);
router.get('/products', getProductsController);
router.put('/products/:id', updateProductController);
router.delete('/products/:id', deleteProductController);

router.post('/production-sheet/save', saveProductionSheetController);
router.get('/production-sheet/:projectId', getProductionSheetController);

router.post('/notifications/mark-as-read', markNotificationAsReadController);
router.get('/notifications', getNotificationsController);

// Protected Routes
router.use(authMiddleware);

module.exports = router;
