//http://ngcordova.com/docs/install/
//http://ngcordova.com/docs/plugins/sqlite/
//http://ngcordova.com/docs/plugins/toast/
//http://ngcordova.com/docs/plugins/localNotification/
//http://ngcordova.com/docs/plugins/badge/


app.controller('ToDoListController', function ($scope, $ionicPlatform, $ionicListDelegate, $cordovaToast, $cordovaBadge, ToDoFactory) {
     //utilizando a função $ionicPlatform.ready para verificar se o dispositivo (celular, tablet, ...)
     //foi carregado completamente.
     //Esse teste é importante sempre ao executar qualquer metodo de qualquer plugin do cordova
     $ionicPlatform.ready(function () {
          //buscando as tarefas cadastradas no banco
          ToDoFactory.all().then(function (result) {
               $scope.items = result;                
          });
          
          //setando o badge para o total de tarefas não concluídas
          ToDoFactory.countNotDone().then(function (count) { $cordovaBadge.set(count); });
     });

     //função para deletar uma tarefa do banco
     $scope.delete = function ($index, id) {
          $ionicPlatform.ready(function () {
               //deletando o registro do banco
               ToDoFactory.delete(id).then(function (result) {
                    //se deletou com sucesso
                    if (result.success) {
                         //remove o item da lista para não ter que recarregar toda a lista de novo
                         $scope.items.splice($index, 1);
                         $cordovaToast.showShortBottom('Tarefa excluída com suceso.');
                         
                         //setando o badge para o total de tarefas não concluídas
                         ToDoFactory.countNotDone().then(function (count) { $cordovaBadge.set(count); });
                    } else { //se ocorreu algum erro para deletar
                         $cordovaToast.showShortBottom('Ocorreu um erro ao salvar a tarefa. Erro: ' + result.message);
                    }
               });
          });
     };

     //função para marcar uma tarefa como concluída
     $scope.done = function ($index, id) {
          $ionicPlatform.ready(function () {
               //marcando o registro como concluído no banco
               ToDoFactory.done(id).then(function (result) {
                    //se marcou com sucesso
                    if (result.success) {
                         //marco o item da lista como concluído para não ter que recarregar toda a lista de novo
                         $scope.items[$index].done = 1;
                         //fecha as opções abertas com o swipe na tela
                         $ionicListDelegate.closeOptionButtons();
                         $cordovaToast.showShortBottom('Tarefa concluída com suceso.');
                         
                         //setando o badge para o total de tarefas não concluídas
                         ToDoFactory.countNotDone().then(function (count) { $cordovaBadge.set(count); });
                    } else { //se ocorreu algum erro para marcar como concluída                    
                         $cordovaToast.showShortBottom('Ocorreu um erro ao salvar a tarefa. Erro: ' + result.message);
                    }
               });
          });
     }
});

app.controller('ToDoEditController', function ($scope, $state, $stateParams, $ionicPlatform, $cordovaToast,
     $cordovaLocalNotification, $cordovaBadge, ToDoFactory) {

     //inicializando o objeto que vai ser o modelo da tela de cadastro
     $scope.model = {};

     //caso seja informado um id, é porque está editando um registro
     if ($stateParams.id) {
          $ionicPlatform.ready(function () {
               //busca o registro no banco
               ToDoFactory.get($stateParams.id).then(function (item) {
                    //popula o objeto de modelo com os dados do banco
                    $scope.model = item;
               });
          });
     }

     //função para salvar uma tarefa no banco
     $scope.onSubmit = function () {
          $ionicPlatform.ready(function () {
               if ($scope.model) {
                    //salvando o registro no banco
                    ToDoFactory.save($scope.model)
                         .then(function (result) {
                              //se foi salvo com sucesso                    
                              if (result.success) {
                                   $cordovaToast.showShortBottom('Tarefa salva com suceso.');
                                   $state.go('home'); //voltando para a tela inicial

                                   //gerando uma notificação local
                                   $cordovaLocalNotification.schedule({
                                        id: result.id,
                                        title: 'Tarefa salva com sucesso.',
                                        text: 'Você tem uma tarefa para ser executada. Mãos a obra! =]'
                                   })
                                   
                                   //setando o badge para o total de tarefas não concluídas
                                   ToDoFactory.countNotDone().then(function (count) { $cordovaBadge.set(count); });
                              } else { //se ocorrer algum erro
                                   $cordovaToast.showShortBottom('Ocorreu um erro ao salvar a tarefa. Erro: ' + result.message);
                              }
                         });
               }
          });
     }
});