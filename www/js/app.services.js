/**
 * Factory para encapsular o acesso ao banco de dados
 */
app.factory('DbFactory', function ($ionicPlatform, $cordovaSQLite, $rootScope) {
     return {
          /**
           * Inicializa a conexação com o banco de dados
           */
          initialize: function () {
               if (!$rootScope.db) {
                    //abrindo a conexão com o banco de dados
                    //caso ele não exista ele será criado                    
                    var db = $cordovaSQLite.openDB({ name: "ToDo.db", iosDatabaseLocation: 'Default' });

                    //salvando o db em uma variavel global para não ter que carregar toda vez
                    $rootScope.db = db;

                    //sql para criar a tabela
                    var createTable = "CREATE TABLE IF NOT EXISTS ToDo ( " +
                         "id integer primary key autoincrement, " +
                         "title varchar(50) not null, " +
                         "description varchar(250) not null," +
                         "done integer not null)";

                    //criando a tabela onde serão gravados os registros
                    $cordovaSQLite.execute(db, createTable).then(function (res) {
                         console.log("Tabela criada");
                    }, function (error) {
                         console.error("Ocorreu algum erro ao criar a tabela. " + error);
                    });
               }
          },
          /**
           * Recupera dados do banco de dados
           */
          getData: function (query, whereParam) {
               this.initialize();
               return $cordovaSQLite.execute($rootScope.db, query, whereParam)
                    .then(function (result) {
                         return { success: true, rows: result.rows };
                    }, function (error) {
                         return { success: false, message: error };
                    });
          },
          /**
           * Salva dados no banco de dados
           */
          saveData: function (query, args) {
               this.initialize();
               return $cordovaSQLite.execute($rootScope.db, query, args)
                    .then(function (result) {
                         return { success: true, id: result.insertId, rowsAffected: result.rowsAffected };
                    }, function (error) {
                         return { success: false, message: error };
                    });
          }
     }
});

/**
 * Factory para fazer o CRUD de tarefa
 */
app.factory('ToDoFactory', function (DbFactory) {
     return {
          /**
           * Busca todas as tarefas do banco de dados
           */
          all: function () {               
               return DbFactory.getData("select * from ToDo order by title").then(function (result) {
                    var items = [];
                    
                    if (result.success) {
                         for (var i = 0; i < result.rows.length; i++) {
                              var row = result.rows.item(i);
                              items.push(row);
                         }
                    }
                    
                    return items;
               });               
          },
          /**
           * Salva uma tarefa no banco de dados
           */
          save: function (item) {
               var query = '';
               var args = [];

               if (item.id) {
                    query = 'update ToDo set title = ?, description = ? where id = ?';
                    args = [item.title, item.description, item.id]
               } else {
                    query = 'insert into ToDo (title, description, done) values (?,?,?)';
                    args = [item.title, item.description, 0];
               }

               return DbFactory.saveData(query, args).then(function (result) {
                    return result;
               });
          },
          /**
           * Deleta uma tarefa do banco de dados
           */
          delete: function(id) {
               return DbFactory.saveData('delete from ToDo where id = ?', [id]).then(function (result) {
                    return result;
               });
          },
          /**
           * Recupera uma tarefa do banco de dados
           */
          get: function (id) {
               return DbFactory.getData("select * from ToDo where id = ?", [id]).then(function (result) {
                    if (result.success && result.rows.length > 0) {
                         return result.rows.item(0);
                    }
               });
          },
          /**
           * Marca uma tarefa como concluída
           */
          done: function(id) {
               return DbFactory.saveData('update ToDo set done = ? where id = ?', [1, id]).then(function (result) {
                    return result;
               });
          },
          /**
           * Recupera a quantidade de tarefas não concluídas
           */
          countNotDone: function() {
               return DbFactory.getData("select COUNT(*) as Qtd from ToDo where done = ?", [0]).then(function (result) {
                    var count = 0;
                    if (result.success) {
                         count = result.rows.item(0).Qtd;
                    }
                    return count;
               });
          }
     }
});