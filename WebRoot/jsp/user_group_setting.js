//================  User Group Admin   =======================

var select_group_jr =  new Ext.data.JsonReader(
	{
		root : 'list',
		totalProperty : 'totalCount',
		id : 'groupid',
		successProperty : '@success'
	}, 
	[   { name : 'groupid', mapping : 'groupid'  }, 
		{ name : 'groupname', mapping : 'groupname' }, 
		{ name : 'description', mapping : 'description' }
	]
); 

var select_group_ds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({ url : 'groupData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		}
	}),
	reader : select_group_jr
});

var groupsm = new Ext.grid.CheckboxSelectionModel({
	checkOnly : true,
	sortable : true 
}); 

var usersGroupTab = {
	id : 'user-group-setting',
	layout : 'fit',
	items : [
		{
			id : 'user-group-setting-grid',
			xtype : 'grid', 	
			margins: '0 0 0 0',
			border: false,
			loadMask : true, // 载入遮罩动画
			store : select_group_ds,
			view : new Ext.grid.GridView( cg_grid_view_cfg ),
			columns : [
				groupsm, 
				{
					header : '组名',
					width : 85,
					sortable : true,
					dataIndex : 'groupname'
				}, {
					id: 'ug_description',
					header : '描述',
					width : 100,
					sortable : true,
					dataIndex : 'description'
				}
			],
			stripeRows: true, 
			autoExpandColumn: 'ug_description',
			sm : groupsm,
			listeners : { render : function() { this.store.load(); } }
		} 
	]
};
  
//=============================Edit user group relationship======================================

var edit_user_group_ds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({ url : 'groupData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		} }),
	reader : select_group_jr
});

var editgroupsm = new Ext.grid.CheckboxSelectionModel({
	checkOnly : true,
	sortable : true 
}); 

var editUsersGroupTab = {
	id : 'edit-user-group-setting',
	layout : 'fit',
	items : [
		{
			id : 'user-group-edit-grid',
			xtype : 'grid', 	
			margins: '0 0 0 0',
			border: false,
			loadMask : true, // 载入遮罩动画
			store : edit_user_group_ds,
			view : new Ext.grid.GridView( cg_grid_view_cfg ),
			columns : [
				editgroupsm, 
				{
					header : '组名',
					width : 85,
					sortable : true,
					dataIndex : 'groupname'
				}, {
					id: 'eug_description',
					header : '描述',
					width : 100,
					sortable : true,
					dataIndex : 'description'
				}
			],
			stripeRows: true, 
			autoExpandColumn: 'eug_description',
			sm : editgroupsm,
			listeners : { 
				render : function() {
					this.store.on ('load', function (store, records) {
						loadUserGroup();
					});
					this.store.load(); 
				} 
			}			
		} 
	]
};


//======= load a user's groups =============

 

var load_ug_reader = new Ext.data.JsonReader(
	{
		root : 'list',
		totalProperty : 'totalCount',
		id : 'groupid',
		successProperty : '@success'
	}, 
	[   { name : 'groupid', mapping : 'groupid'  }, 
		{ name : 'groupname', mapping : 'groupname' }, 
		{ name : 'description', mapping : 'description' }
	]
);

var load_ug_ds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({ url : 'GetGroupsOfUser.action?user.userid=root',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		} }), 
	reader : load_ug_reader
}); 

function loadUserGroup( )
{
	var usergrid = Ext.getCmp('user-grid');
	var _record = usergrid.getSelectionModel().getSelected();
	if (!_record) 
		return;
	var uid = _record.get('userid');
	 
	var url = 'GetGroupsOfUser.action?user.userid=' + uid;
	load_ug_ds.proxy.setUrl(url);
	
	load_ug_ds.on('load', function(store, records){
		editgroupsm.clearSelections(false);
		var size = store.getTotalCount();
		for (var i=0; i<size; i++)
		{
			var groupid = records[i].id;
			editgroupsm.selectRow(edit_user_group_ds.indexOfId(groupid), true);
		}
	})
	load_ug_ds.load(); 
}
