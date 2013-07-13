
// example of custom renderer function

function fullname_blue(val) {
	return '<span style="color:blue;">' + val + '</span>';
}

var onlineUserRecordDef = Ext.data.Record.create([{
					name : 'userid',
					mapping : 'userid'
				}, {
					name : 'fullname',
					mapping : 'fullname'
				}, {
					name : 'createtime',
					mapping : 'createtime'
				}, {
					name : 'lastlogin',
					mapping : 'lastlogin'
				}, {
					name : 'clientip',
					mapping : 'clientip'
				}]);

var online_user_jsonReader = new Ext.data.JsonReader({
			root : 'list',
			totalProperty : 'totalCount',
			// id : 'userid',
			successProperty : 'success'
		}, onlineUserRecordDef);

var online_user_ds = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : 'getOnlineUsers.action',
						method : 'POST',
						listeners : {
							'exception' : ds_exception
							// function (proxy, type, action, options, response,
							// arg ){
						}
					}),
			//
			reader : online_user_jsonReader
		});

var OnlineUsersList = {
	id : 'online-user-list-panel',
	layout : 'border',
	items : [{
				id : 'online-user-grid',
				region : 'center',
				// title: 'Nested Grid',
				xtype : 'grid',
				layout : 'fit',
				loadMask : true, // 载入遮罩动画
				store : online_user_ds,
				view : new Ext.grid.GridView(cg_grid_view_cfg),
				columns : [new Ext.grid.RowNumberer(), {
							id : 'online-grid-userid',
							header : '登录名',
							width : 50,
							sortable : true,
							dataIndex : 'userid'
						}, {
							header : '姓名',
							width : 100,
							sortable : true,
							renderer : fullname_blue,
							dataIndex : 'fullname'
						}, {
							id : 'online-grid-createtime',
							header : '用户创建时间',
							width : 150,
							sortable : true,
							// renderer : Ext.util.Format.dateRenderer('m/d/Y
							// h:ia'),
							renderer : renderDateF('Y-m-d H:i:s'),
							dataIndex : 'createtime'
						}, {
							id : 'online-grid-lastlogin',
							header : '最近登录时间',
							width : 150,
							sortable : true,
							// renderer : Ext.util.Format.dateRenderer('m/d/Y
							// h:ia'),
							renderer : renderDateF('Y-m-d H:i:s'),
							dataIndex : 'lastlogin'
						}, {
							id : 'online-grid-clientip',
							header : '客户端IP地址',
							width : 150,
							sortable : true,
							dataIndex : 'clientip'
						}],
				stripeRows : true,
				// autoExpandColumn: 'lastlogin',

				// Add a listener to load the data only after the grid is
				// rendered:
				listeners : {
					render : function() {
						// this.store.loadData(myUserData);
						this.store.load({
									params : {
										start : 0,
										limit : 10
									},
									callback : ds_callback
								});
					},
					rowdblclick : function(grid, index) {
						// showSingleUser(grid, index);
					},
					rowcontextmenu : function(grid, rowIndex, e) {
						// popupOnlineUserContextMenu(this, rowIndex, e);
					},
					contextmenu : function(e) {
						var rowIndex = this.view.findRowIndex(e.getTarget());
						popupOnlineUserContextMenu(this, rowIndex, e);
					}
				},
				tbar : [{
							// xtype:'button',
							id : 'online-user-refresh',
							text : '刷新列表',
							iconCls : 'refresh-icon',
							scale : 'large',
							handler : function() {
								refreshOnlineUsersList();
							}
						}]
			}]
};
 
var ou_gridContextMenu = new Ext.menu.Menu({
	items : [{
		text : '刷新列表',
		iconCls : 'refresh-icon',
		handler : function(e) {
			refreshOnlineUsersList();
		}
	}]
});

function popupOnlineUserContextMenu(grid, rowIndex, e) {
	e.preventDefault();
	// grid.getSelectionModel().selectRow(rowIndex);
	ou_gridContextMenu.showAt(e.getXY());
};

function refreshOnlineUsersList() {
	online_user_ds.load();
}
