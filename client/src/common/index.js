const backendDomain = import.meta.env.VITE_API_URL;

const Api = {
    signUp: {
        url: `${backendDomain}/api/sign-up`,
        method: "post"
    },
    signIn: {
        url: `${backendDomain}/api/sign-in`,
        method: "post"
    },
    getEmployee: {
        url: `${backendDomain}/api/employees`,
        method: "get"
    },
    deleteEmployee: {
        url: `${backendDomain}/api/employees/:id`,
        method: "delete"
    },
    updateRole: {
        url: `${backendDomain}/api/employees/:id/role`,
        method: "put"
    },
    EmployeeDetails: {
        url: `${backendDomain}/api/employees/:id`,
        method: "get"
    },
    updateEmployee: {
        url: `${backendDomain}/api/employees/:id`,
        method: "put"
    },
    addProject: {
        url: `${backendDomain}/api/projects`,
        method: "post"
    },
    getProject: {
        url: `${backendDomain}/api/projects`,
        method: "get"
    },
    checkProjectId: {
        url: `${backendDomain}/api/check-project-id/:projectId`,
        method: "get"
    },
    addClient: {
        url: `${backendDomain}/api/clients`,
        method: "post"
    },
    getClient: {
        url: `${backendDomain}/api/clients`,
        method: "get"
    },
    getClientById: {
        url: `${backendDomain}/api/clients/:id`,
        method: "get"
    },
    updateClient: {
        url: `${backendDomain}/api/clients/:id`,
        method: "put"
    },
    addProjectManager: {
        url: `${backendDomain}/api/project-managers`,
        method: "post"
    },
    getProjectManager: {
        url: `${backendDomain}/api/project-managers`,
        method: "get"
    },
    updateProjectManager: {
        url: `${backendDomain}/api/projectManagers/:managerId`,
        method: "put"
    },
    getManager: {
        url: `${backendDomain}/api/projectManagers/:managerId`,
        method: "get"
    },
    addTask: {
        url: `${backendDomain}/api/tasks`,
        method: "post"
    },
    getTask: {
        url: `${backendDomain}/api/tasks`,
        method: "get"
    },
    updateTask: {
        url: `${backendDomain}/api/task/:taskId`,
        method: "put"
    },
    getUserTasks: {
        url: `${backendDomain}/api/user-tasks`,
        method: "get"
    },
    submitTask: {
        url: `${backendDomain}/api/task-submit`,
        method: "post"
    },
    startTask: {
        url: `${backendDomain}/api/task-start`,
        method: "post"
    },
    getProjectDetail: {
        url: `${backendDomain}/api/projects/:projectId`,
        method: "get"
    },
    updateProject: {
        url: `${backendDomain}/api/projects/:projectId`,
        method: "put"
    },
    forgotPass: {
        url: `${backendDomain}/api/forgot-password`,
        method: "post"
    },
    verifyOTP: {
        url: `${backendDomain}/api/verify-otp`,
        method: "post"
    },
    resetPass: {
        url: `${backendDomain}/api/reset-password`,
        method: "post"
    },
    addProduct: {
        url: `${backendDomain}/api/products/add`,
        method: "post"
    },
    getProduct: {
        url: `${backendDomain}/api/products`,
        method: "get"
    },
    updateProduct: {
        url: `${backendDomain}/api/products/:id`,
        method: "put"
    },
    deleteProduct: {
        url: `${backendDomain}/api/products/:id`,
        method: "delete"
    },
    saveSheet: {
        url: `${backendDomain}/api/production-sheet/save`,
        method: "post"
    },
    getSheet: {
        url: `${backendDomain}/api/production-sheet/:projectId`,
        method: "get"
    },
    readNotifications: {
        url: `${backendDomain}/api/notifications/mark-as-read`,
        method: "post"
    },
    getNotifications: {
        url: `${backendDomain}/api/notifications`,
        method: "get"
    },
};

export default Api;
