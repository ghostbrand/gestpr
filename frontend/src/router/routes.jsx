import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

import RequireRole from '@/components/RequireRole';

const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));


const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Customer = lazy(() => import('@/pages/Customer'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const InvoiceCreate = lazy(() => import('@/pages/Invoice/InvoiceCreate'));

const InvoiceRead = lazy(() => import('@/pages/Invoice/InvoiceRead'));
const InvoiceUpdate = lazy(() => import('@/pages/Invoice/InvoiceUpdate'));
const InvoiceRecordPayment = lazy(() => import('@/pages/Invoice/InvoiceRecordPayment'));

const Payment = lazy(() => import('@/pages/Payment/index'));
const PaymentRead = lazy(() => import('@/pages/Payment/PaymentRead'));
const PaymentUpdate = lazy(() => import('@/pages/Payment/PaymentUpdate'));

const Quote = lazy(() => import('@/pages/Quote'));
const QuoteCreate = lazy(() => import('@/pages/Quote/QuoteCreate'));
const QuoteRead = lazy(() => import('@/pages/Quote/QuoteRead'));
const QuoteUpdate = lazy(() => import('@/pages/Quote/QuoteUpdate'));

const PaymentMode = lazy(() => import('@/pages/PaymentMode'));
const PaymentModeCreate = lazy(() => import('@/pages/PaymentMode/PaymentModeCreate'));
const PaymentModeRead = lazy(() => import('@/pages/PaymentMode/PaymentModeRead'));
const PaymentModeUpdate = lazy(() => import('@/pages/PaymentMode/PaymentModeUpdate'));

const Taxes = lazy(() => import('@/pages/Taxes'));
const TaxesCreate = lazy(() => import('@/pages/Taxes/TaxesCreate'));
const TaxesRead = lazy(() => import('@/pages/Taxes/TaxesRead'));
const TaxesUpdate = lazy(() => import('@/pages/Taxes/TaxesUpdate'));

const ServiceItem = lazy(() => import('@/pages/ServiceItem'));
const ServiceItemCreate = lazy(() => import('@/pages/ServiceItem/ServiceItemCreate'));
const ServiceItemRead = lazy(() => import('@/pages/ServiceItem/ServiceItemRead'));
const ServiceItemUpdate = lazy(() => import('@/pages/ServiceItem/ServiceItemUpdate'));

const Settings = lazy(() => import('@/pages/Settings/Settings'));


const Profile = lazy(() => import('@/pages/Profile'));

const About = lazy(() => import('@/pages/About'));

const MovementsReport = lazy(() => import('@/pages/MovementsReport'));

const AdminUsers = lazy(() => import('@/pages/AdminUsers'));

let routes = {
  expense: [],
  default: [
    {
      path: '/login',
      element: <Navigate to="/" />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/about',
      element: <About />,
    },
    {
      path: '/reports/movements',
      element: <MovementsReport />,
    },
    {
      path: '/admin-users',
      element: (
        <RequireRole roles={['owner', 'manager']}>
          <AdminUsers />
        </RequireRole>
      ),
    },
    {
      path: '/',
      element: <Dashboard />,
    },
    {
      path: '/customer',
      element: <Customer />,
    },
    {
      path: '/invoice',
      element: <Invoice />,
    },
    {
      path: '/invoice/create',
      element: <InvoiceCreate />,
    },
    {
      path: '/invoice/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/invoice/update/:id',
      element: <InvoiceUpdate />,
    },
    {
      path: '/invoice/pay/:id',
      element: <InvoiceRecordPayment />,
    },
    {
      path: '/quote',
      element: <Quote />,
    },
    {
      path: '/quote/create',
      element: <QuoteCreate />,
    },
    {
      path: '/quote/read/:id',
      element: <QuoteRead />,
    },
    {
      path: '/quote/update/:id',
      element: <QuoteUpdate />,
    },
    {
      path: '/payment',
      element: <Payment />,
    },
    {
      path: '/payment/read/:id',
      element: <PaymentRead />,
    },
    {
      path: '/payment/update/:id',
      element: <PaymentUpdate />,
    },

    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/settings/edit/:settingsKey',
      element: <Settings />,
    },
    {
      path: '/paymentmode',
      element: <PaymentMode />,
    },
    {
      path: '/paymentmode/create',
      element: <PaymentModeCreate />,
    },
    {
      path: '/paymentmode/read/:id',
      element: <PaymentModeRead />,
    },
    {
      path: '/paymentmode/update/:id',
      element: <PaymentModeUpdate />,
    },
    {
      path: '/taxes',
      element: <Taxes />,
    },
    {
      path: '/taxes/create',
      element: <TaxesCreate />,
    },
    {
      path: '/taxes/read/:id',
      element: <TaxesRead />,
    },
    {
      path: '/taxes/update/:id',
      element: <TaxesUpdate />,
    },
    {
      path: '/serviceitem',
      element: <ServiceItem />,
    },
    {
      path: '/serviceitem/create',
      element: <ServiceItemCreate />,
    },
    {
      path: '/serviceitem/read/:id',
      element: <ServiceItemRead />,
    },
    {
      path: '/serviceitem/update/:id',
      element: <ServiceItemUpdate />,
    },

    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default routes;
