app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider    
    .state('home', {
      cache: false,
      url: '/home',
      templateUrl: 'templates/list.html',
      controller: 'ToDoListController'
    })    
    .state('new', {
      cache: false,
      url: '/new',
      templateUrl: 'templates/edit.html',
      controller: 'ToDoEditController'
    })
    .state('edit', {
      cache: false,
      url: '/edit/:id',
      templateUrl: 'templates/edit.html',
      controller: 'ToDoEditController'
    });
    
    $urlRouterProvider.otherwise('/home')
});