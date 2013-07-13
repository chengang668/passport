function getDevicePK(v, record){
    return record.id.passport.passportid + ':' + record.id.portid;
}


var user_device_jsonReader = new Ext.data.JsonReader(
	{
		root : 'list',
		totalProperty : 'totalCount',
		idProperty : 'id_id', // just provide an non-existing field but 'id'
		successProperty : '@success'
	}, 
	[   { name : 'id_id', convert:getDevicePK }, 
		{ name : 'passportid', mapping : 'id.passport.passportid' },
		{ name : 'portid', mapping : 'id.portid' },
		{ name : 'ppt_givenname', mapping : 'id.passport.givenname'},
		{ name : 'grp'},  
		{ name : 'title'},
		{ name : 'mode'}, 
		{ name : 'port'}, 
		{ name : 'protocol'}, 
		{ name : 'serial_setting'},
		{ name : 'passportip'}
	]
);

var user_device_ds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({ 
		url : 'deviceData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		} }), 
	reader : user_device_jsonReader
}); 

var uds_rownum = new Ext.grid.RowNumberer();
var uds_sm = new Ext.grid.CheckboxSelectionModel({
	checkOnly : true,
	sortable : true 
}); 

var addUserDeviceTab = {
	id : 'user-device-admin-panel',
	layout : 'border',
	items : [
	{
		id : 'user-device-setting-grid',
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // 载入遮罩动画
		store : user_device_ds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [
			uds_rownum,
			uds_sm,
			{
				header : '应急通道  IP 地址',
				width : 100,
				sortable : true,
				dataIndex : 'passportip'
			},{
				header : '别名',
				width : 100,
				sortable : true,
				dataIndex : 'ppt_givenname'
			}, {
				id : 'title',
				header : '设备名',
				width : 50,
				sortable : true,  
				dataIndex : 'title'
			} ],
		stripeRows : true,
		autoExpandColumn: 'title',
		sm : uds_sm,
 
		listeners : {
			render : function() { 
				this.store.load();
			}
		} 
	}]
};


// ================================== Edit user device relationship ========================

var udacle_ds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({ 
		url : 'deviceData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		} 
	}), 
	reader : user_device_jsonReader
}); 

var udacle_rownum = new Ext.grid.RowNumberer();
var udacle_sm = new Ext.grid.CheckboxSelectionModel({
	checkOnly : true,
	sortable : true 
}); 

var editUserDevicePanel = {
	id : 'user-device-edit-panel',
	layout : 'border',
	items : [
	{
		id : 'user-device-edit-grid',
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // 载入遮罩动画
		store : udacle_ds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [
			udacle_rownum,
			udacle_sm,
			{
				header : '应急通道  IP 地址',
				width : 100,
				sortable : true,
				dataIndex : 'passportip'
			},{
				header : '别名',
				width : 100,
				sortable : true,
				dataIndex : 'ppt_givenname'
			}, {
				id : 'title',
				header : '设备名',
				width : 50,
				sortable : true,  
				dataIndex : 'title'
			} ],
		stripeRows : true,
		autoExpandColumn: 'title',
		sm : udacle_sm,
 
		listeners : {
			render : function() { 
				this.store.on('load', function (store, records) {
					loadUserDevice();
				});
				this.store.load(); 
			}
		} 
	}]
};

// ============= load the user device relationship ===============

var eudacl_reader = new Ext.data.JsonReader(
	{
		root : 'list',
		totalProperty : 'totalCount',
		id : 'id_id',
		successProperty : '@success'
	}, 
	[   { name : 'id_id', convert:getDevicePK }, 
		{ name : 'passportid', mapping : 'id.passport.passportid' },
		{ name : 'portid', mapping : 'id.portid' },
		{ name : 'ppt_givenname', mapping : 'id.passport.givenname'},
		{ name : 'grp'},  
		{ name : 'title'},
		{ name : 'mode'}, 
		{ name : 'port'}, 
		{ name : 'protocol'}, 
		{ name : 'serial_setting'},
		{ name : 'passportip'}
	]
);

var select_udacl_ds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({ 
		url : 'GetDevicesOfUser.action?user.userid=root',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		} 
	}), 
	reader : eudacl_reader
}); 

function loadUserDevice( )
{
	var usergrid = Ext.getCmp('user-grid');
	var _record = usergrid.getSelectionModel().getSelected();
	if (!_record) 
		return;
	var uid = _record.get('userid');
	 
	var url = 'GetDevicesOfUser.action?user.userid=' + uid;
	select_udacl_ds.proxy.setUrl(url);
	
	select_udacl_ds.on('load', function(store, records){
		udacle_sm.clearSelections(false);
		var size = store.getTotalCount();
		for (var i=0; i<size; i++)
		{
			var idid = records[i].get('id_id') // .data.id_id;
			var index = udacle_ds.findExact('id_id', idid, 0);
			udacle_sm.selectRow(index, true);
		}
	})
	select_udacl_ds.load(); 
}
 




