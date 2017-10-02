/*************************************/
/* Helman, heldes.com      */
/* helman at heldes dot com    */
/* sqlitedb.js           */
/* SQLite Database Class For HTML5 */
/** ********************************** */

function cDB(confs) {
	var ret = {
		_db : null,
		_response : null,
		_error : null,
		check : function(tbl) {
			if (!this._db)
				return false;
			var _sql = '', _sqlField = '', _field = [];

			for (var i = 0; i < tbl.length; i++) {
				_sql = "CREATE TABLE IF NOT EXISTS " + tbl[i].table + " (";
				_field = tbl[i].properties;
				_sqlField = '';

				for (var j = 0; j < _field.length; j++) {
					_sqlField += ',`' + _field[j].name + '` ' + _field[j].type;
				}

				_sql += _sqlField.substr(1) + ");";

				this.query(_sql, null, null, null);
			}

			return true;
		},
		getResult : function() {
			return this._response;
		},
		getError : function() {
			return this._error;
		},
		callback_error : function(tx, _er) {
			var err = '';
			if (typeof (tx) == 'object') {
				for ( var q in tx) {
					err += q + ' = "' + tx[q] + '"; ';
				}
			} else {
				err += tx + '; ';
			}
			if (typeof (_er) == 'object') {
				for ( var q in _er) {
					err += q + ' = "' + _er[q] + '"; ';
				}
			} else if (typeof (_er) == 'undefined') {
				err += _er + '; ';
			}
			console.log(err);
			// if(callback) callback();
			return false;
		},
		query : function(sql, callback, params, er) {
			if (!this._db)
				return false;
			var self = this;
			function _er(tx, __er) {
				__er = jQuery.extend(__er, {
					sql : sql
				});
				if (er)
					er(tx, __er);
				else
					self.callback_error(tx, __er);
			}
			;
			this._db.transaction(function(tx) {
				tx.executeSql(sql, (params ? params : []), callback, _er);
			}, _er);
		},
		queryBatch : function(sqls, callback, paramss, er) {
			if (!this._db)
				return false;
			var self = this;
			this._db.transaction(function(tx) {
				for (var i = 0; i < sqls.length; i++) {
					tx.executeSql(sqls[i], (paramss ? paramss[i] : []), function() {
						return false;
					}, (er ? er : self.callback_error));
				}
			}, self.callback_error, function() {
				if (callback)
					callback();
				return true;
			});
			return true;
		},
		update : function(tbl, sets, clauses, callback) {
			var __sql = 'UPDATE ' + tbl, _field = null, __set = '', __clause = '', __values = [];

			for (var i = 0; i < sets.length; i++) {
				0
				_field = sets[i];
				for (var j = 0; j < _field.length; j++) {
					__set += ',`' + _field[j].name + '`=?';
					__values.push(_field[j].value);
				}
			}

			for (var i = 0; i < clauses.length; i++) {
				__clause += ',`' + clauses[i].name + '`=?';
				__values.push(clauses[i].value);
			}
			__sql += ((__set != '') ? ' SET ' + __set.substr(1) : '')
					+ ((__clause != '') ? ' WHERE ' + __clause.substr(1) : '')
					+ ';';
			this.query(__sql, callback, __values);
			return true;
		},
		remove : function(tbl, clauses) {
			var __sql = 'DELETE FROM ' + tbl, __clause = '';

			for (var i = 0; i < clauses.length; i++)
				__clause += ',`' + clauses[i].name + '`="'
						+ escape(clauses[i].value) + '"';

			__sql += ' WHERE '
					+ ((__clause != '') ? __clause.substr(1) : 'FALSE') + ';';

			this.query(__sql);
			return true;
		},
		multiInsert : function(tbl, rows, callback, er) {
			if (!this._db)
				return false;
			var self = this;
			var __sql = '', _field = null, __field = '', __qs = [], __values = [];

			this._db.transaction(function(tx) {
				for (var i = 0; i < rows.length; i++) {
					__qs = [];
					__values = [];
					__field = '';
					_field = rows[i];

					for (var j = 0; j < _field.length; j++) {
						__field += ',`' + _field[j].name + '`';
						__qs.push('?');
						__values.push(_field[j].value);
					}
					tx.executeSql('INSERT INTO ' + tbl + ' ('
							+ __field.substr(1) + ') VALUES(' + __qs.join(',')
							+ ');', __values, function() {
						return false;
					}, (er ? er : self.callback_error));
				}
			}, self.callback_error, function() {
				if (callback)
					callback();
				return true;
			});
			return true;
		},
		insert : function(tbl, rows, callback) {
			var __sql = '', _field = null, __field = '', __qs = [], __values = [], __debug = '';

			for (var i = 0; i < rows.length; i++) {
				__qs = [];
				__field = '';
				_field = rows[i];

				__debug += _field[0].name + ' = ' + _field[0].value + ';';
				for (var j = 0; j < _field.length; j++) {
					__field += ',`' + _field[j].name + '`';
					__qs.push('?');
					__values.push(_field[j].value);
				}
				__sql += 'INSERT INTO ' + tbl + ' (' + __field.substr(1)
						+ ') VALUES(' + __qs.join(',') + ');';
			}
			this.query(__sql, callback, __values);
			return true;
		},
		insertReplace : function(tbl, rows, debug) {
			var __sql = '', _field = null, __field = '', __qs = [], __values = [], __debug = '';

			for (var i = 0; i < rows.length; i++) {
				__qs = [];
				__field = '';
				_field = rows[i];

				__debug += _field[0].name + ' = ' + _field[0].value + ';';
				for (var j = 0; j < _field.length; j++) {
					__field += ',`' + _field[j].name + '`';
					__qs.push('?');
					__values.push(_field[j].value);
				}
				__sql += 'INSERT OR REPLACE INTO ' + tbl + ' ('
						+ __field.substr(1) + ') VALUES(' + __qs.join(',')
						+ ');';
			}
			this.query(__sql, null, __values);
			return true;
		},
		dropTable : function(tbl, callback) {
			var __sql = '';
			if (tbl == null)
				return false;
			__sql = 'DROP TABLE IF EXISTS ' + tbl;
			this.query(__sql, callback);
			return true;
		}
	}
	return jQuery.extend(ret, confs);
}

var assistantDb;
function initDb() {
	var dbName = 'assistantDb';
	assistantDb = new cDB({
		_db : window.openDatabase(dbName, "", dbName, 5 * 1000 * 1000)
	});
	var dbTable = [ {
		table : 'analysis_quota',
		properties : [ {
			name : 'id',
			type : 'INTEGER PRIMARY KEY AUTOINCREMENT'
		}, {
			name : 'name_cn',
			type : 'char'
		}, {
			name : 'name_en',
			type : 'char'
		}, {
			name : 'category',
			type : 'char'
		}, {
			name : 'unit',
			type : 'char'
		}, {
			name : 'expression',
			type : 'char'
		}, {
			name : 'period',
			type : 'char'
		}, {
			name : 'coordinate',
			type : 'char'
		}, {
			name : 'reference_value',
			type : 'char'
		}, {
			name : 'remark',
			type : 'char'
		}, {
			name : 'document_url',
			type : 'char'
		} ]
	}, {
		table : 'analysis_factor',
		properties : [ {
			name : 'id',
			type : 'INTEGER PRIMARY KEY AUTOINCREMENT'
		}, {
			name : 'name_cn',
			type : 'char'
		}, {
			name : 'name_en',
			type : 'char'
		}, {
			name : 'category',
			type : 'char'
		}, {
			name : 'unit',
			type : 'char'
		}, {
			name : 'expression',
			type : 'char'
		}, {
			name : 'period',
			type : 'char'
		}, {
			name : 'coordinate',
			type : 'char'
		}, {
			name : 'reference_value',
			type : 'char'
		}, {
			name : 'remark',
			type : 'char'
		}, {
			name : 'document_url',
			type : 'char'
		} ]
	}, {
		table : 'analysis_goal',
		properties : [ {
			name : 'id',
			type : 'INTEGER PRIMARY KEY AUTOINCREMENT'
		}, {
			name : 'name',
			type : 'char'
		}, {
			name : 'detail',
			type : 'char'
		}, {
			name : 'remark',
			type : 'char'
		}, {
			name : 'document_url',
			type : 'char'
		} ]
	}, {
		table : 'analysis_step',
		properties : [ {
			name : 'id',
			type : 'INTEGER PRIMARY KEY AUTOINCREMENT'
		}, {
			name : 'name',
			type : 'char'
		}, {
			name : 'content',
			type : 'char'
		}, {
			name : 'attentions',
			type : 'char'
		} ]
	}, {
		table : 'analysis_quota_history',
		properties : [ {
			name : 'id',
			type : 'INTEGER PRIMARY KEY AUTOINCREMENT'
		},{
			name : 'quota_id',
			type : 'INTEGER'
		}, {
			name : 'coordinate',
			type : 'char'
		}, {
			name : 'value',
			type : 'char'
		} ]
	}, {
		table : 'analysis_factor_history',
		properties : [ {
			name : 'id',
			type : 'INTEGER PRIMARY KEY AUTOINCREMENT'
		},{
			name : 'factor_id',
			type : 'INTEGER'
		}, {
			name : 'coordinate',
			type : 'char'
		}, {
			name : 'value',
			type : 'char'
		} ]
	}, {
		table : 'analysis_relations',
		properties : [ {
			name : 'id',
			type : 'INTEGER PRIMARY KEY AUTOINCREMENT'
		}, {
			name : 'object_id',
			type : 'INTEGER'
		}, {
			name : 'object_type',
			type : 'INTEGER'
		}, {
			name : 'relation_object_id',
			type : 'INTEGER'
		}, {
			name : 'relation_object_type',
			type : 'INTEGER'
		} , {
			name : 'relation_remark',
			type : 'char'
		} ]
	} ];
	if (!assistantDb.check(dbTable)) {
		assistantDb = false;
		console.log('Failed to cennect to database.');
	}
}
initDb();
