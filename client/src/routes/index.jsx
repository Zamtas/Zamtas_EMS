import { createBrowserRouter } from 'react-router-dom';
import SignIn from '../pages/SIgnIn';
import Home from '../pages/Home';
import UserHome from '../pages/UserHome';
import PageNotFound from '../pages/PageNotFound';
import ForgotPassword from '../pages/PasswordRecover/ForgotPassword';
import CheckEmail from '../pages/PasswordRecover/checkEmail';
import ChoosePass from '../pages/PasswordRecover/choosePass';
import ProtectedRoute from '../common/ProtectedRoute';
import ProductionSheet from '../components/Projects/ProductionSheet';

const router = createBrowserRouter([
    {
        path: '/',
        element: <SignIn />,
    },
    {
        path: '/home',
        element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
        path: '/sheet',
        element: <ProductionSheet />,
    },
    {
        path: '/user-home',
        element: <ProtectedRoute><UserHome /></ProtectedRoute>,
    },
    {
        path: 'forgot-password',
        element: <ForgotPassword />,
    },
    {
        path: 'check-email',
        element: <CheckEmail />,
    },
    {
        path: 'choose-password',
        element: <ChoosePass />,
    },
    {
        path: '*',
        element: <PageNotFound />,
    },
]);

export default router;
