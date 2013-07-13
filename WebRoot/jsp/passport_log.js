
var ppt_log_jsr = new Ext.data.JsonReader({
		root : 'list',
		totalProperty : 'totalCount',
		id : 'id',
		successProperty : '@success'
	}, 
	[{ name : 'id'}, 
	 { name : 'digi_ip'}, 
	 { name : 'userid'}, 
	 { name : 'dtime'},
	 { name : 'content'}]
);

var ppt_log_ds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({
		url : 'getDigiLog.action',
		method 	: 'POST',
		listeners :  
		{ 'exception' :  conn_exception }
	}),
	reader : ppt_log_jsr
	}
);

var loadPassportLog = function(passport_ip) {
	var _url = 'getDigiLog.action?passport.ip=' + passport_ip;
	ppt_log_ds.proxy.setUrl( _url );
	
	ShowPptLogForm();

	ppt_log_ds.load(); 
}

var ppt_log_win;
var ppt_log_form;

var ShowPptLogForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!ppt_log_win) {
		ppt_log_win = new Ext.Window({ 
			layout : 'fit',
			width : 680,
			height : 360,
			closeAction : 'hide',
			plain : true,
			title : 'Digi 日志',
			iconCls: 'feed-icon',
			items : ppt_log_form
		});
	}
	ppt_log_win.show('tool-bar-ppt-admin-log');
}
		
ppt_log_form = new Ext.FormPanel({ 
	layout : 'fit',
	items : [
		{
			id : 'digi-log-grid',
			xtype : 'grid', 	
			margins: '0 0 0 0',
			border: false,
			loadMask : true, // 载入遮罩动画
			store : ppt_log_ds,
			view : new Ext.grid.GridView( cg_grid_view_cfg ),
			columns : [
				new Ext.grid.RowNumberer(), 
				{ 
					header : '用户',
					width : 60,
					sortable : true,
					dataIndex : 'userid'
				}, { 
					header : '时间',
					width : 100,
					sortable : true,
					dataIndex : 'dtime'
				}, {
					id: 'digi-log-content-id',
					header : '日志内容',
					width : 85,
					sortable : true,
					dataIndex : 'content'
				} 
			],
			stripeRows: true, 
			autoExpandColumn: 'digi-log-content-id'
		} 
	] 
});
 
