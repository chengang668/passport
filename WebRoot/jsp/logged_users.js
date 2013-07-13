
var who_jsr = new Ext.data.JsonReader({
		root : 'list',
		totalProperty : 'totalCount',
		// id : 'userid',
		successProperty : '@success'
	}, 
	[{ name : 'userid'}, 
	 { name : 'tty'}, 
	 { name : 'from'}, 
	 { name : 'host'}]
);

var who_ds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({
		url : 'getLoggedUser.action',
		method 	: 'POST',
		listeners :  
		{ 'exception' :  conn_exception }
	}),
	reader : who_jsr
	}
);

var loadLoggedUser = function(passport_ip) {
	var _url = 'getLoggedUser.action?passport.ip=' + passport_ip;
	who_ds.proxy.setUrl( _url );
	
	ShowLoggedUserForm();

	who_ds.load(); 
}

var logged_user_win;
var logged_user_form;

var ShowLoggedUserForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!logged_user_win) {
		logged_user_win = new Ext.Window({ 
			layout : 'fit',
			width : 480,
			height : 220,
			closeAction : 'hide',
			plain : true,
			title : '登录Passport的用户',
			iconCls: 'feed-icon',
			items : logged_user_form
		});
	}
	logged_user_win.show('tool-bar-ppt-admin-who');
}
		
logged_user_form = new Ext.FormPanel({ 
	layout : 'fit',
	items : [
		{
			id : 'logged-user-grid',
			xtype : 'grid', 	
			margins: '0 0 0 0',
			border: false,
			loadMask : true, // 载入遮罩动画
			store : who_ds,
			view : new Ext.grid.GridView( cg_grid_view_cfg ),
			columns : [
				new Ext.grid.RowNumberer(), 
				{
					header : '登录名称',
					width : 85,
					sortable : true,
					dataIndex : 'userid'
				}, { 
					header : 'TTY',
					width : 60,
					sortable : true,
					dataIndex : 'tty'
				}, { 
					header : '登录时间',
					width : 100,
					sortable : true,
					dataIndex : 'from'
				}, { 
					id: 'logged-user-host',
					header : '登录的IP地址',
					width : 110,
					sortable : true,
					dataIndex : 'host'
				}
			],
			stripeRows: true, 
			autoExpandColumn: 'logged-user-host'
		} 
	] 
});
 
