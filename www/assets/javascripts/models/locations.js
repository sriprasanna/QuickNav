window.LocationDAO = function(db){
  this.db = db;
};

_.extend(window.LocationDAO.prototype, {

  findAll:function (callback) {
    db.transaction(
      function (tx) {
        var sql = "SELECT * FROM locations ORDER BY name";
        tx.executeSql(sql, [], function (tx, results) {
          var len = results.rows.length;
          var locations = [];
          for (var i = 0; i < len; i++) {
            locations[i] = results.rows.item(i);
          }
          callback(locations);
        });
      },
      function (tx, error) {
        alert("Transaction Error - Find All " + error);
      }
    );
  },

  create:function (model, callback) {
    db.transaction(function(tx){
      var sql = 'INSERT INTO locations (name, address) VALUES (?, ?)';
      tx.executeSql(sql, [model.escape('name'), model.escape('address')]);
    },
    function(tx, error){
      alert('Transaction error - Creating record ' + error);
    },
    function(tx){
      callback();
    });
  },

  update:function (model, callback) {
    db.transaction(function(tx){
      var sql = 'UPDATE locations SET name = ?, address = ? WHERE id = ?';
      tx.executeSql(sql, [model.escape('name'), model.escape('address'), model.escape('id')]);
    },
    function(tx, error){
      alert('Transaction error - Creating record ' + error);
    },
    function(tx){
      callback();
    });
  },

  destroy:function (model, callback) {
    db.transaction(function(tx){
      var sql = 'DELETE FROM locations WHERE id = ?';
      tx.executeSql(sql, [model.escape('id')]);
    },
    function(tx, error){
      alert('Transaction error - Creating record ' + error);
    },
    function(tx){
      callback();
    });
  },

  find:function (model, callback) {

  },

  populate:function (callback) {
    db.transaction(
      function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS locations');
        var sql =
            "CREATE TABLE IF NOT EXISTS locations ( " +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "name VARCHAR(50), " +
                "address TEXT)";
        tx.executeSql(sql);
        tx.executeSql("INSERT INTO locations VALUES (1,'Home','dlf phase 5, gurgaon')");
      },
      function (tx, error) {
        alert('Transaction error - Creating tables ' + error);
      },
      function (tx) {
        callback();
      }
    );
  }
});


Backbone.sync = function (method, model, options) {
  var dao = new model.dao(window.db);
  switch (method) {
    case "read":
      if (model.id)
        dao.find(model, function (data) {
          options.success(data);
        });
      else
        dao.findAll(function (data) {
          options.success(data);
        });
      break;
    case "create":
      dao.create(model, function (data) {
        options.success(data);
      });
      break;
    case "update":
      dao.update(model, function (data) {
        options.success(data);
      });
      break;
    case "delete":
      dao.destroy(model, function (data) {
        options.success(data);
      });
      break;
  }
};

window.Location = Backbone.Model.extend({
  dao: LocationDAO
});

window.LocationCollection = Backbone.Collection.extend({
  model: Location,
  dao: LocationDAO
});