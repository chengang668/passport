var user_passport_jsonReader = new Ext.data.JsonReader(
	{
		root : 'list',
		totalProperty : 'totalCount',
		id : 'passportid',
		successProperty : '@success'
	}, 
	[   { name : 'passportid', mapping : 'passportid' /* type :'int' */ }, 
		{ name : 'ip', mapping : 'ip' },  
		{ name : 'givenname', mapping : 'givenname' },
		{ name : 'owner',  mapping : 'owner' }, 
		//{ name : 'deptname', mapping : 'dept.deptname' }, 
		{ name : 'deptname', mapping : 'dept', convert:getDeptname  }, 
		//{ name : 'sitename', mapping : 'site.sitename' }
		{ name : 'sitename', mapping : 'site', convert:getSitename  }
	]
);

var user_passport_ds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({ 
		url : 'passportData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		} }), 
	reader : user_passport_jsonReader
}); 

var rownum = new Ext.grid.RowNumberer();
var sm = new Ext.grid.CheckboxSelectionModel({
	checkOnly : true,
	sortable : true 
}); 

var addUserPassportTab = {
	id : 'user-passport-admin-panel',
	layout : 'border',
	items : [
	{
		id : 'user-passport-setting-grid',
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // 载入遮罩动画
		store : user_passport_ds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [
			rownum,
			sm,
			/*{
				id : 'passportid',
				header : 'Passport编号',
				width : 50,
				sortable : true,
				dataIndex : 'passportid'
			},*/ 
			{
				header : 'IP 地址',
				width : 100,
				sortable : true,
				dataIndex : 'ip'
			}, {
				id : 'givenname',
				header : 'Passport别名',
				width : 100,
				sortable : true,  
				dataIndex : 'givenname'
			}, {
				id : 'owner',
				header : '负责人',
				width : 50,
				sortable : true,  
				dataIndex : 'owner'
			}, {
				id : 'deptname',
				header : '所属部门',
				width : 60,
				sortable : true,  
				dataIndex : 'deptname'
			}, {
				id : 'sitename',
				header : '机房',
				width : 50,
				sortable : true,  
				dataIndex : 'sitename'
			} ],
		stripeRows : true,
		autoExpandColumn: 'sitename',
		sm : sm,
 
		listeners : {
			render : function() { 
				this.store.load();
			}
		} 
	}]
};


// ================================== Edit user passport relationship ========================

var upeds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({ 
		url : 'passportData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		} 
	}), 	
	reader : user_passport_jsonReader
}); 

var rownume = new Ext.grid.RowNumberer();
var sme = new Ext.grid.CheckboxSelectionModel({
	checkOnly : true,
	sortable : true 
}); 

var editUserPassportPanel = {
	id : 'user-passport-edit-panel',
	layout : 'border',
	items : [
	{
		id : 'user-passport-edit-grid',
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // 载入遮罩动画
		store : upeds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [
			rownume,
			sme,
			{
				header : 'IP 地址',
				width : 100,
				sortable : true,
				dataIndex : 'ip'
			}, {
				id : 'givenname',
				header : '别名',
				width : 100,
				sortable : true,  
				dataIndex : 'givenname'
			}, {
				id : 'owner',
				header : '负责人',
				width : 50,
				sortable : true,  
				dataIndex : 'owner'
			}, {
				id : 'deptname',
				header : '所属部门',
				width : 60,
				sortable : true,  
				dataIndex : 'deptname'
			}, {
				id : 'sitename',
				header : '机房',
				width : 50,
				sortable : true,  
				dataIndex : 'sitename'
			} ],
		stripeRows : true,
		autoExpandColumn: 'sitename',
		sm : sme,
 
		listeners : {
			render : function() { 
				this.store.on('load', function (store, records) {
					loadUserPassport();
				});
				this.store.load(); 
			}
		} 
	}]
};

// ============= load the user passport relationship ===============

var eup_reader = new Ext.data.JsonReader(
	{
		root : 'list',
		totalProperty : 'totalCount',
		id : 'passportid',
		successProperty : '@success'
	}, 
	[   { name : 'passportid', mapping : 'passportid' /* type :'int' */ }, 
		{ name : 'ip', mapping : 'ip' }, 
		{ name : 'givenname', mapping : 'givenname' },
		{ name : 'owner',  mapping : 'owner' }, 
		//{ name : 'deptname', mapping : 'dept.deptname' }, 
		{ name : 'deptname', mapping : 'dept', convert:getDeptname }, 
		//{ name : 'sitename', mapping : 'site.sitename' }
		{ name : 'sitename', mapping : 'site', convert:getSitename }
	]
);

var select_up_ds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({ 
		url : 'GetPassportsOfUser.action?user.userid=root',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		} 
	}), 
	reader : eup_reader
}); 

function loadUserPassport( )
{
	var usergrid = Ext.getCmp('user-grid');
	var _record = usergrid.getSelectionModel().getSelected();
	if (!_record) 
		return;
	var uid = _record.get('userid');
	 
	var url = 'GetPassportsOfUser.action?user.userid=' + uid;
	select_up_ds.proxy.setUrl(url);
	
	select_up_ds.on('load', function(store, records){
		sme.clearSelections(false);
		var size = store.getTotalCount();
		for (var i=0; i<size; i++)
		{
			var passportid = records[i].id;
			sme.selectRow(upeds.indexOfId(passportid), true);
		}
	})
	select_up_ds.load(); 
}





