var app = angular.module('todo', ['ionic', 'ngCordova'])
.run(function($ionicPlatform, DbFactory) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {      
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);      
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});