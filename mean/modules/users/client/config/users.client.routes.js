'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        },
        ncyBreadcrumb:{
            label: 'Settings',
            parent: 'browse'
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html',
        ncyBreadcrumb:{
            label:'Profile'
        }
      })
      .state('settings.address', {
        url: '/address',
        templateUrl: 'modules/users/client/views/settings/add-address.client.view.html',
        ncyBreadcrumb:{
            label:'Address'
        }
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html',
        ncyBreadcrumb:{
            label:'Password'
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html',
        ncyBreadcrumb:{
            label:'Accounts'
        }
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html',
        ncyBreadcrumb:{
            label:'Picture'
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html',
        ncyBreadcrumb:{
            label:'Authentication',
            parent:'browse'
        }
      })
      .state('authentication.signupuser', {
        url: '/signupuser',
        templateUrl: 'modules/users/client/views/authentication/signupuser.client.view.html',
        ncyBreadcrumb:{
            lebl:'Sign up user'    
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html',
        ncyBreadcrumb:{
            label:'Sign in '    
        }
      })
      .state('authentication.signupvendor', {
        url: '/signupvendor',
        templateUrl: 'modules/users/client/views/authentication/signupvendor.client.view.html',
        ncyBreadcrumb:{
            label:'Sign up vendor'    
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);
