import Auth from './modules/Auth';
import Base from './components/Base.jsx';
import HomePage from './containers/HomePage.jsx';
import DashboardPage from './containers/DashboardPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import LoginEmployeePage from './containers/LoginEmployeePage.jsx';
import EmployeeDashboardPage from './containers/EmployeeDashboardPage.jsx';

const routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [

    {
      path: '/',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, DashboardPage);
        } else {
          callback(null, HomePage);
        }
      }
    },
      {
        path: '/employee',
        component: EmployeeDashboardPage
      },

    {
      path: '/login',
      component: LoginPage
    },

    {
      path: '/loginEmployee',
      component: LoginEmployeePage
    },

      {
          path: '/employeeHome',
          component: EmployeeDashboardPage
      },

    {
      path: '/signup',
      component: SignUpPage
    },

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();
        replace('/');
      }
    }
  ]
};

export default routes;
