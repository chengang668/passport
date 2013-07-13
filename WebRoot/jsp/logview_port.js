var port_log_pageSize = 50;

// create the combo for adding user form

Ext.apply(cg_pptipComboBoxCfg, {id: 'port-log-query-host'});
var comboPptIpList_2 = new Ext.form.ComboBox( cg_pptipComboBoxCfg );


var port_log_query_board_columns = 5*2;
var port_log_query_board_perWidth = 950/port_log_query_board_columns;

var port_log_query_board = new Ext.FormPanel({
    id:'port-log-query-board-id',
    frame:true,
    layout:'table', 
    region : 'north', 
    height : 70,    // style:'height:10%',
    layoutConfig: {columns:port_log_query_board_columns},
    defaults:{ border:false,layout:'form', frame:false, labelAlign:'right',
    	labelWidth:75, width:port_log_query_board_perWidth*2,height:30},
    items:[
    	{colspan:2, items:comboPptIpList_2 }, //xtype:'textfield',anchor:'100%',fieldLabel:'应急通道', id:'log-query-host'
    	{colspan:2, items:{xtype:'textfield',anchor:'100%',fieldLabel:'受管设备名', id:'port-log-query-port'}},
    	{colspan:2, items:{xtype:'textfield',anchor:'100%',fieldLabel:'操作员', id:'port-log-query-operator'}},
    	{colspan:2, items:{xtype:'textfield',anchor:'100%',fieldLabel:'执行的命令', id:'port-log-query-inputcmd'}},
    	{colspan:2, hidden:true},
    	{colspan:2, items:{xtype:'datefield',anchor:'100%',fieldLabel:'起始时间', id:'port-log-query-starttime', format:'Y-m-d'}},
    	{colspan:2, items:{xtype:'datefield',anchor:'100%',fieldLabel:'结束时间', id:'port-log-query-endtime', format:'Y-m-d'}},
    	{colspan:2, items:{xtype:'textfield',anchor:'100%',fieldLabel:'其他关键字', id:'port-log-query-other'}},

    	{colspan:1, width:port_log_query_board_perWidth,  items:{text : '查询', xtype: 'button', type : 'button', 
    		iconCls : 'refresh-icon', hideLabel : false, handler : do_port_log_query, anchor:'98%'}},
    	{colspan:1, width:port_log_query_board_perWidth,  items:{text : '存档', xtype: 'button', type : 'button', 
    		iconCls : 'cg-log-save', hideLabel : false, handler : do_port_log_save, anchor:'98%'}},
    	{colspan:1, width:port_log_query_board_perWidth,  items:{text : '删除', xtype: 'button', type : 'button', 
    		iconCls : 'cg-log-delete', hideLabel : false, handler : do_port_log_delete, anchor:'98%'}}
    ]
});

port_log_query_board.on('afterrender', function(){
	var endtime = new Date();
	var starttime = endtime;
	Ext.getCmp('port-log-query-starttime').setValue ( starttime );
	Ext.getCmp('port-log-query-endtime').setValue ( endtime ); 
});


//============================================================================================

var port_log_query_jsr = new Ext.data.JsonReader({
	root : 'list',
	totalProperty : 'totalCount',
	idProperty : 'id', //'id.portid',
	successProperty : 'success' }, 
	[
	{ name : 'host', mapping : 'host'}, 
	{ name : 'program', mapping : 'program'}, 
	{ name : 'facility', mapping : 'facility' },
	{ name : 'level', mapping : 'level' },
	{ name : 'datetime', mapping : 'datetime' },
	{ name : 'msg', mapping : 'msg'}
]);


var port_log_query_proxy = new Ext.data.HttpProxy({
	url : 'QueryLog4port.action', 
	timeout : 60000,
	method 	: 'POST',
	listeners :  
	{   'exception' : ds_exception  
	}
});
 
var port_log_query_ds = new Ext.data.Store({
	proxy : port_log_query_proxy,
	reader : port_log_query_jsr,
	listeners : {
		//load : doFilterOnLoad
		beforeload : function(){	
			var myparm = getPortLogQueryCriterias();	
    		Ext.apply( this.baseParams, myparm );
    	}
	}
});

// var page_display_text = new Ext.Toolbar.TextItem({xtype: 'tbtext', text: '当前显示 {0} 条 / 共 {1} 记录' });
var port_log_paging_tb_cfg = {};
Ext.apply(port_log_paging_tb_cfg, cg_pagingToolbar_config);
Ext.apply(port_log_paging_tb_cfg, 
	{store : port_log_query_ds, 
	items : [{ xtype: 'tbspacer', width: 160}, ' 分页  ']
	});

var port_log_grid = new Ext.grid.GridPanel({
	id : 'port-log-detail-grid',
	region : 'center', 
	xtype : 'grid',
	layout : 'fit',
	loadMask : true, 
	store : port_log_query_ds,
	view : new Ext.grid.GridView(cg_grid_view_cfg),
	columns : [ 
		new Ext.grid.RowNumberer(),
		{ header : '主机名称', width : 100, sortable:true, dataIndex : 'host'}, 
		{ header : '程序', width : 120, sortable:true, dataIndex : 'program' },
		{ header : '日志类别', width : 80, sortable:false, dataIndex : 'facility' }, 
		{ header : '日志级别', width : 80, sortable:false, dataIndex : 'level' }, 
		{ header : '时间', width : 120, sortable:true, dataIndex : 'datetime' }, 
		{ header : '日志内容', width : 150, sortable:false, dataIndex : 'msg', id:'port-log-detail-msg-col' }  
    ],
	stripeRows : true,
	autoExpandColumn: 'port-log-detail-msg-col',
	bbar : new Ext.PagingToolbar(port_log_paging_tb_cfg )  
});

port_log_paging_tb_cfg = null;

var portLogViewPanel = {
	id : 'port-log-view-panel',
	title:'端口操作日志',
	layout : 'border',
	items:[ port_log_query_board, port_log_grid ]
};

function do_port_log_query(){
	var myparm = {}; // getPortLogQueryCriterias();
 
	Ext.apply(myparm, {
		start : 0,
		limit : port_log_pageSize
	});
	port_log_query_ds.load({params: myparm}); // , add:true
	
	//If using remote paging, the first load call must specify the start and limit properties in the options. 
	// params property to establish the initial position within the dataset,
	// and the number of Records to cache on each read from the Proxy.
}

function getPortLogQueryCriterias(){
	var host = $('port-log-query-host').value.trim();
	var porttitle = $('port-log-query-port').value.trim();
	var operator = $('port-log-query-operator').value.trim();
	var starttime = $('port-log-query-starttime').value.trim();
	var endtime = $('port-log-query-endtime').value.trim(); 
	var inputcmd = $('port-log-query-inputcmd').value.trim();
	var other = $('port-log-query-other').value.trim();
	
	var parm = {
		host: host,
		porttitle: porttitle,
		operator : operator,
		starttime: starttime,
		endtime : endtime,
		inputcmd : inputcmd,
		other : other
	};
	
	return parm;
}

function do_port_log_save(){ 
	var myparm = getPortLogQueryCriterias();

	if (!Ext.fly('id_download_portlog')) {
		var frm = document.createElement('form');
		frm.id = 'id_download_portlog';
		frm.name = 'downloading_portlog';
		frm.style.display = 'none';
		document.body.appendChild(frm);
	}
	Ext.Ajax.request({
		url : 'DownloadPortLog.action',
		form : Ext.fly('id_download_portlog'),
		method : 'POST',
		isUpload : true,
		timeout : 60000,
		params : myparm
	}); 
}

function do_port_log_delete() {
	Ext.MessageBox.confirm('确认删除', '你确认要删除这些端口日志吗？删除前请先存档.', function(btn) {
				if (btn == "yes") {
					port_log_delete()
				}
			});
}

function port_log_delete(){
	var myparm = getPortLogQueryCriterias();

	if ( (myparm.operator != null) && (myparm.operator != '') ||
		 (myparm.inputcmd != null) && (myparm.inputcmd != '') ||
		 (myparm.other != null) && (myparm.other != '')){
		 	
		Ext.MessageBox.alert('失败', '只能以"时间", "端口名"和"应急通道IP"为条件做删除操作！')
		return;		
	}
	
	Ext.Ajax.request({
		url : 'DeletePortLog.action',
		timeout : 30000,
		params : myparm,
		
		success : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj && obj.success == true)
			{
				Ext.MessageBox.alert('成功', '您已成功删除端口日志 (' + obj.affected + ' 条)');
				do_port_log_query();
			}
			else
				Ext.MessageBox.alert('删除日志失败', obj.error.reason);
		},
		failure : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.MessageBox.alert('删除日志失败', obj.error.reason);
			}
		}
	}); 
}

