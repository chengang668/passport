Ext.BLANK_IMAGE_URL = '../resource/ext-3.0.0/resources/images/default/s.gif';

var logview_current_pptip='';
var logview_current_port = {};

var log_tree = new Ext.tree.TreePanel({
	id : 'logging-view-tree',
	layout : 'fit',
	border : false,
	rootVisible:false,
	split : true,
	collapsible : true, 
	margins : '2 0 5 5',
	cmargins : '2 5 5 5',
	// autoScroll : true,
    animCollapse:true,
    animate: true,
    collapseMode:'mini',
    
    loader : new Ext.tree.TreeLoader({
            dataUrl:'loadPptTreeForLogview.action?user.userid=root' // passportTreeLoader.action
        }),

	root : new Ext.tree.AsyncTreeNode('Passport operation'), 
	collapseFirst : false
});

// log_tree.root.appendChild([{ id:'log-tree-root', text : '��־', leaf:false, expanded:true}]); 
	
var log_nav_panel	= {
	id : 'log-nav-panel-id',
	title : '��ѯ��־',
	border : false,
	autoScroll : true,
	iconCls : 'cg-log-icon',
	items : [log_tree]
};

var log_tree_folder_menu = new Ext.menu.Menu({
    items: [
    	{
	    	text:'ˢ��',
		    iconCls: 'refresh-icon',
		    handler : function(e) { refreshLogTree(); }
		}
	]
});

var log_tree_leaf_menu = new Ext.menu.Menu({
    items: [{
			text:'ϵͳ��־',
		    iconCls: 'cg-log-sys-icon',
		    handler : function(e) { showPptSystemLog(); }
		}, 	{
	    	text:'ˢ��',
		    iconCls: 'x-tbar-loading',
		    handler : function(e) { refreshLogTree(); }
		} 
	]
});

// Assign the function to be called on tree node click.
log_tree.on('contextmenu', function(node, e) {
	// e.preventDefault();
	if (node.attributes.ntype=='platform') {
	 	// do nothing for platform node.
		return;
	}
	if(node.isLeaf()){
        this.ctxNode = node;
        log_tree_leaf_menu.showAt(e.getXY());
        node.select();
        return;
     }
     else {
     	log_tree_folder_menu.showAt(e.getXY());
     }
});


log_tree.on('click', function(n, e) {
	if (n.attributes.ntype == 'platform') {
		showPlatformLog();
		return ;
	}
	
	activeTab(DeviceList4LogViewMain);
	
	if (n.leaf)
	{
		logview_current_pptip = n.attributes.ip;
		
		/* var ip = n.attributes.ip; */
		// 
		// activeTab(DeviceList4LogViewMain);
		var pptid = n.attributes.passportid;
		filterDeviceList4LogView(n.attributes.ntype, pptid);
	}
	else if (n.attributes.ntype=='district'){
		var distictid = n.attributes.districtid;
		filterDeviceList4LogView(n.attributes.ntype, distictid );
	}
	else if (n.attributes.ntype=='site') { 
		var siteid = n.attributes.siteid;
		filterDeviceList4LogView(n.attributes.ntype, siteid); 
	}
	else if (n.id == log_tree.root.id ){
		filterDeviceList4LogView('root'); 
	}
 
});
 
log_tree.on('dblclick', function(n, e) {
	if (n.leaf)	{
		logview_current_pptip = n.attributes.ip;
		showPptSystemLog();
		
		return;
	}
	if (n.attributes.ntype == 'platform'){
		showPlatformLog();
		return;
	}
});
	
function refreshLogTree(){
	// passport_admin_tree_root_menu.hide();
	log_tree.getRootNode().reload();
}

Ext.apply(cg_pptipComboBoxCfg, {id: 'log-query-host'});
var comboPptIpList = new Ext.form.ComboBox( cg_pptipComboBoxCfg );

var log_query_board_columns = 5*2;
var log_query_board_perWidth = 950/log_query_board_columns;

var log_query_board = new Ext.FormPanel({
    id:'log-query-board-id',
    frame:true,
    layout:'table', 
    region : 'north', 
    height : 70,    // style:'height:10%',
    layoutConfig: {columns:log_query_board_columns},
    defaults:{ border:false,layout:'form', frame:false, labelAlign:'right',
    	labelWidth:75, width:log_query_board_perWidth*2, height:30},
    items:[
    	{colspan:2, items:comboPptIpList }, //xtype:'textfield',anchor:'100%',fieldLabel:'Ӧ��ͨ��', id:'log-query-host'
    	{colspan:2, items:{xtype:'textfield',anchor:'100%',fieldLabel:'�ܹ��豸��', id:'log-query-port'}},
    	{colspan:2, items:{xtype:'textfield',anchor:'100%',fieldLabel:'����Ա', id:'log-query-operator'}},
    	{colspan:2, items:{xtype:'textfield',anchor:'100%',fieldLabel:'ִ�е�����', id:'log-query-inputcmd'}},
    	
    	{colspan:2, hidden:true},  //���ص�
    	
    	{colspan:2, items:{xtype:'datefield',anchor:'100%',fieldLabel:'��ʼʱ��', id:'log-query-starttime', format:'Y-m-d'}},
    	{colspan:2, items:{xtype:'datefield',anchor:'100%',fieldLabel:'����ʱ��', id:'log-query-endtime', format:'Y-m-d'}},
    	{colspan:2, items:{xtype:'textfield',anchor:'100%',fieldLabel:'�����ؼ���', id:'log-query-other'}},
    		
    	{colspan:1, width:log_query_board_perWidth, items:{text : '��ѯ', xtype: 'button', type : 'button', 
    		iconCls : 'refresh-icon', hideLabel : false, handler : do_log_query, anchor:'98%'}},

    	{colspan:1, width:log_query_board_perWidth, items:{text : '�浵', xtype: 'button', type : 'button', 
    		iconCls : 'cg-log-save', hideLabel : false, handler : do_log_save, anchor:'98%'}},

    	{colspan:1, width:log_query_board_perWidth, items:{text : 'ɾ��', xtype: 'button', type : 'button', 
    		iconCls : 'cg-log-delete', hideLabel : false, handler : do_log_delete, anchor:'98%'}}
    ]
});

log_query_board.on('afterrender', function(){
	var endtime = new Date();
	var starttime = endtime;
	Ext.getCmp('log-query-starttime').setValue ( starttime );
	Ext.getCmp('log-query-endtime').setValue ( endtime ); 
	
	Ext.getCmp('log-query-host').setValue (logview_current_pptip);
});
//log_query_board.addButton({text:'submit', handler:});


//=====================================================================================



var dvlist4log_ds = new Ext.data.GroupingStore({
	proxy : new Ext.data.HttpProxy({
		url : 'deviceData.action',
		listeners :  
		{   'exception' :  ds_exception  
		}
	}),
	reader : new Ext.data.JsonReader({
			root : 'list',
			totalProperty : 'totalCount',
			idProperty : 'id_id', //'id.portid',
			successProperty : '@success'
		}, [ 
		{ name : 'id_id', convert : function (v, record){ return record.id.passport.passportid + ':' + record.id.portid; } }, 
		{ name : 'passportid', mapping : 'id.passport.passportid' },
		{ name : 'portid', mapping : 'id.portid' },
		{ name : 'pptname', mapping : 'id.passport.givenname' },
		{ name : 'group', mapping : 'group' }, 
		{ name : 'title',  mapping : 'title' }, 
		{ name : 'port', mapping : 'port' },
		{ name : 'mode',  mapping : 'mode' }, 
		{ name : 'protocol', mapping : 'protocol' },
		{ name : 'serial_setting', mapping : 'serial_setting' },
		{ name : 'siteid', mapping : 'id.passport.site.siteid'},
		{ name : 'site', mapping : 'id.passport.site.sitename'},
		{ name : 'districtid', mapping : 'id.passport.site.district.districtid'},
		{ name : 'district', mapping : 'id.passport.site.district.districtname'},
		{ name : 'passportip', mapping : 'id.passport.ip'}
	]), 
	sortInfo:{ field: 'portid', direction: 'ASC'},
	groupField : 'district',
	listeners : {
		load : function(store, records){ 
			filterDeviceList4LogView(logview_filter_type, logview_filter_value); 
			}
	}
}); 


var dvlist4log_grouping_grid = new Ext.grid.GridPanel({
	region : 'center', 
	layout : 'fit',
	loadMask : true, // �������ֶ���
    // frame:true,
    stripeRows : true,
    store: dvlist4log_ds, 
    columns: [
		{ header : '����', width : 50,   sortable : true, dataIndex : 'district'	}, 
		{ header : '����', width : 100,  sortable : true, dataIndex : 'site' },
		{ header : 'ͨ������', width : 80, sortable : true,  dataIndex : 'pptname' }, 
		{ header : '�˿ڱ��', width : 50, sortable : true, groupable:false,  dataIndex : 'portid' },
		{ header : '�豸��', width : 80, sortable : true, groupable:false,  dataIndex : 'title' }, 
		{ header : 'Զ�̵�¼ģʽ', width : 80, groupable:false, dataIndex : 'mode' }, 
		{ header : 'ͨ�Ŷ˿�', width : 50, groupable:false, dataIndex : 'port' }, 
		{ header : 'ͨ��Э��', width : 100, groupable:false, dataIndex : 'protocol' }, 
		{ header : 'ͨ��IP', width : 100, sortable : false, groupable:false, dataIndex : 'passportip'}, 
		{ header : '���ڲ���', width : 120, groupable:false, dataIndex : 'serial_setting'}    
	],
	view: new Ext.grid.GroupingView({
		sortAscText : '˳������', sortDescText : '��������', columnsText : 'ѡ����', 
		groupByText : '�����з���',��showGroupsText : '������ʾ',
        forceFit:true,
        //groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
        groupTextTpl: '{text} ({[values.rs.length]} {["��"]})'
    }), 
	listeners : {
		render : function() {  this.store.load(); },
		rowcontextmenu : function (grid, rowIndex, e) {
			popupPortLogRowContextMenu(this, rowIndex, e);
		}, 
		rowdblclick : function (grid, rowIndex, e) {
			logview_current_port = getSelectedPort( grid );
			if (!logview_current_port) return;
			
			showPptPortLog();	
		}
	},
	tbar : [{
    	text:'ϵͳ��־',  iconCls: 'cg-log-sys-icon',
	    handler : function(e) { showPptSystemLog(); }
    }, {
    	text:'�˿���־',  iconCls: 'cg-log-port-icon',
	    handler : function(e) { showPptPortLog(); }
    },'-', {
    	text:'ˢ��',  iconCls: 'x-tbar-loading',
	    handler : function(e) { dvlist4log_ds.reload(); }
    }]
});

var DeviceList4LogViewMain = {
	id : 'device-list-for-logview-panel',
	autoDestroy: false,
	layout : 'fit',
	items:[	dvlist4log_grouping_grid ] 
};



//============================================================================================

var log_query_jsr = new Ext.data.JsonReader({
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


var log_query_proxy = new Ext.data.HttpProxy({
	url : 'QueryLog.action', 
	timeout : 60000,
	method 	: 'POST',
	listeners :  
	{   'exception' : ds_exception  
	}
});
 
var log_query_ds = new Ext.data.Store({
	proxy : log_query_proxy,
	reader : log_query_jsr,
	listeners : {
		//load : doFilterOnLoad
		beforeload : function(){	
			var myparm = getQueryCriterias();	
    		Ext.apply( this.baseParams, myparm );
    	}
	}
});

// var page_display_text = new Ext.Toolbar.TextItem({xtype: 'tbtext', text: '��ǰ��ʾ {0} �� / �� {1} ��¼' });
var log_paging_tb_cfg = {};
Ext.apply(log_paging_tb_cfg, cg_pagingToolbar_config);
Ext.apply(log_paging_tb_cfg, 
	{store : log_query_ds, 
	items : [{ xtype: 'tbspacer', width: 160}, ' ��ҳ  ']
	});

var log_detail_grid = new Ext.grid.GridPanel({
	id : 'log-detail-grid',
	region : 'center', 
	xtype : 'grid',
	layout : 'fit',
	loadMask : true, 
	store : log_query_ds,
	view : new Ext.grid.GridView(cg_grid_view_cfg),
	columns : [ 
		new Ext.grid.RowNumberer(),
		{ header : '��������', width : 100, sortable:true, dataIndex : 'host'}, 
		{ header : '����', width : 120, sortable:true, dataIndex : 'program' },
		{ header : '��־���', width : 80, sortable:false, dataIndex : 'facility' }, 
		{ header : '��־����', width : 80, sortable:false, dataIndex : 'level' }, 
		{ header : 'ʱ��', width : 120, sortable:true, dataIndex : 'datetime' }, 
		{ header : '��־����', width : 150, sortable:false, dataIndex : 'msg', id:'log-detail-msg-col' }  
    ],
	stripeRows : true,
	autoExpandColumn: 'log-detail-msg-col',
	bbar : new Ext.PagingToolbar(log_paging_tb_cfg ) 
	// tbar : new Ext.PagingToolbar(log_paging_tb_cfg )
/*	bbar : [ 
		{ xtype: 'tbspacer', width: 100}, 
		page_display_text, // '��ǰ��ʾ {0} �� / �� {1} ��¼', // same as {xtype: 'tbtext', text: 'text1'} to create Ext.Toolbar.TextItem
		{ xtype: 'tbspacer', width: 20}, 
		{	text : '��һҳ',
			iconCls : 'x-tbar-page-prev',
			handler : do_log_prevpage 
		}, 
		{	text : '��һҳ',
			iconCls : 'x-tbar-page-next',
			handler : do_log_nextpage 
		},
		'->', 
		'Ӧ��ͨ��ϵͳ��־' 
	]*/
});

log_paging_tb_cfg = null;

var logDetailViewPanel = {
	id : 'log-detail-view-panel',
	title:'ϵͳ��־',
	layout : 'border',
	items:[ log_query_board, log_detail_grid ]
};


/*function onlineUserListHandler() {
	
	var u_tab_id = 'online-user-list-panel';
	var mainp = Ext.getCmp('main-panel');
	var tab = mainp.getComponent(u_tab_id);
	if (!tab){
		mainp.add( OnlineUsersList );
	}
    mainp.layout.setActiveItem(u_tab_id); 
}
*/
var log_pageSize = 50;
var log_current_page = -1;

function getQueryCriterias(){
	var host = $('log-query-host').value.trim();
	var porttitle = $('log-query-port').value.trim();
	var operator = $('log-query-operator').value.trim();
	var starttime = $('log-query-starttime').value.trim();
	var endtime = $('log-query-endtime').value.trim(); 
	var inputcmd = $('log-query-inputcmd').value.trim();
	var other = $('log-query-other').value.trim();
	
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

function do_log_query(){
	var myparm = {}; 
	log_current_page = 0;
	Ext.apply(myparm, {
		start : 0,
		limit : log_pageSize
	});
	log_query_ds.load({params: myparm}); // , add:true
	
	//If using remote paging, the first load call must specify the start and limit properties in the options. 
	// params property to establish the initial position within the dataset,
	// and the number of Records to cache on each read from the Proxy.

}

function do_log_nextpage(){	
	var myparm = {}; 
	if (log_current_page ===-1){
		return;
	}
	log_current_page ++;
	Ext.apply(myparm, {
		start : log_current_page * log_pageSize,
		limit : log_pageSize
	});
	log_query_ds.load({params: myparm}); // , add:true
}

function do_log_prevpage(){	
	var myparm = {}; 
	if (log_current_page ===0){
		return;
	}
	log_current_page --;
	
	Ext.apply(myparm, {
		start : log_current_page * log_pageSize,
		limit : log_pageSize
	});
	log_query_ds.load({params: myparm}); // , add:true
}

var logview_filter_type ;
var logview_filter_value ;

var logview_selected_districtid = 0;
function logview_same_districtid(record, id){
	return (record.get('districtid') == logview_selected_districtid);
}

var logview_selected_siteid = 0;
function logview_same_siteid(record, id){
	return (record.get('siteid') == logview_selected_siteid);
}

var logview_selected_pptid = 0;
function logview_same_passportid(record, id){
	return (record.get('passportid') == logview_selected_pptid);
}



function filterDeviceList4LogView(type, value){
	if (!type) return;
	
	logview_filter_type = type;
	logview_filter_value = value;
	
	if (type == 'root'){
		if(dvlist4log_ds.isFiltered())
			dvlist4log_ds.clearFilter(false);
			// dvlist4log_ds.clearGrouping();
			dvlist4log_ds.groupBy('district');
	}else if (type == 'district'){
		logview_selected_districtid =  value;
		dvlist4log_ds.filterBy(logview_same_districtid);
		dvlist4log_ds.groupBy('site');
	}else if (type == 'site'){
		logview_selected_siteid = value;
		dvlist4log_ds.filterBy(logview_same_siteid);
		dvlist4log_ds.groupBy('pptname');
	}else if (type == 'passport'){
		logview_selected_pptid = value;
		dvlist4log_ds.filterBy(logview_same_passportid, this);
	}
}

function showPptSystemLog(){
	activeTab(logDetailViewPanel);	
	
	initPptSystemLogInputFields(); 
	Ext.getCmp('log-query-host').setValue (logview_current_pptip);
	
	do_log_query();
}

function showPptPortLog(){
	logview_current_port = getSelectedPort( dvlist4log_grouping_grid );
	if (!logview_current_port) {
		return;
	}

	activeTab(portLogViewPanel);
	initPptPortLogInputFields();
	
	if (!logview_current_pptip)
		logview_current_pptip = '';

	Ext.getCmp('port-log-query-host').setValue (logview_current_pptip);	
	Ext.getCmp('port-log-query-port').setValue (logview_current_port.get('title'));
	
	do_port_log_query();
}

var portlogDeviceRowContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '�˿���־',
		    iconCls: 'cg-log-port-icon',
		    handler : function(e) { showPptPortLog(); }
	    },
	    {   text : 'ϵͳ��־',
		    iconCls: 'cg-log-sys-icon',
		    handler: function(e) {��showPptSystemLog(); }
	    }��
		],
	listeners : {
		contextmenu : function (e){  e.stopEvent();}
	}
	});
	
function popupPortLogRowContextMenu(grid, rowIndex, e){
	e.preventDefault();��
	grid.getSelectionModel().selectRow(rowIndex);
	portlogDeviceRowContextMenu.showAt(e.getXY());
}

function initPptSystemLogInputFields(){
	Ext.getCmp('log-query-port').setValue ('');
	Ext.getCmp('log-query-operator').setValue ('');
	Ext.getCmp('log-query-inputcmd').setValue ('');
	Ext.getCmp('log-query-other').setValue ('');
	
	var now = new Date();
	Ext.getCmp('log-query-starttime').setValue ( now );
	Ext.getCmp('log-query-endtime').setValue ( now ); 
} 

function initPptPortLogInputFields(){	
	Ext.getCmp('port-log-query-port').setValue ('');
	Ext.getCmp('port-log-query-operator').setValue ('');
	Ext.getCmp('port-log-query-inputcmd').setValue ('');
	Ext.getCmp('port-log-query-other').setValue ('');

	var now = new Date();
	Ext.getCmp('port-log-query-starttime').setValue ( now );
	Ext.getCmp('port-log-query-endtime').setValue ( now ); 
} 


function do_log_save(){
	var myparm = getQueryCriterias();

	if (!Ext.fly('eid_download')) {
		var frm = document.createElement('form');
		frm.id = 'eid_download';
		frm.name = 'downloading_syslog';
		frm.style.display = 'none';
		document.body.appendChild(frm);
	}
	Ext.Ajax.request({
		url : 'DownloadSystemLog.action',
		form : Ext.fly('eid_download'),
		method : 'POST',
		isUpload : true,
		timeout : 60000,
		params : myparm
	}); 
}

function do_log_delete() {
	Ext.MessageBox.confirm('ȷ��ɾ��', '��ȷ��Ҫɾ����Щϵͳ��־��ɾ��ǰ���ȴ浵.', function(btn) {
		if (btn == "yes") {
			log_delete()
		}
	});
}
		
/*
 * 	var parm = {
		host: host,
		porttitle: porttitle,
		operator : operator,
		starttime: starttime,
		endtime : endtime,
		inputcmd : inputcmd,
		other : other
	};
*/
	
function log_delete(){
	var myparm = getQueryCriterias();
 
	if ( (myparm.porttitle != null) && (myparm.porttitle != '') ||
		 (myparm.operator != null) && (myparm.operator != '') ||
		 (myparm.inputcmd != null) && (myparm.inputcmd != '') ||
		 (myparm.other != null) && (myparm.other != '')){
		 	
		Ext.MessageBox.alert('��ʾ', 'ֻ����"ʱ��"��"Ӧ��ͨ��IP"Ϊ������ɾ��������')
		return;		
	}

	Ext.Ajax.request({
		url : 'DeleteSystemLog.action',
		timeout : 30000,
		params : myparm,
		
		success : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj && obj.success == true) {
				Ext.MessageBox.alert('�ɹ�', '���ѳɹ�ɾ��ϵͳ��־ (' + obj.affected + ' ��)');
				do_pt_log_query();
			}
			else
				Ext.MessageBox.alert('ɾ����־ʧ��', obj.error.reason);
		},
		failure : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.MessageBox.alert('ɾ����־ʧ��', obj.error.reason);
			}
		}
	}); 
}










//========================================================
// ����ƽ̨��־

















var pt_log_query_board_columns = 5*2;
var pt_log_query_board_perWidth = 950/pt_log_query_board_columns;

var pt_log_query_board = new Ext.FormPanel({
    id:'pt-pt-log-query-board-id',
    frame:true,
    layout:'table', 
    region : 'north', 
    height : 70,    // style:'height:10%',
    layoutConfig: {columns:pt_log_query_board_columns},
    defaults:{ border:false,layout:'form', frame:false, labelAlign:'right',
    	labelWidth:75, width:pt_log_query_board_perWidth*2, height:30},
    items:[
    	{colspan:2, items:{xtype:'textfield',anchor:'100%',fieldLabel:'�ͻ��˵�ַ', id:'pt-log-query-client-ip'}},
    	{colspan:2, items:{xtype:'textfield',anchor:'100%',fieldLabel:'����Ա', id:'pt-log-query-operator'}},
    	
    	{colspan:2, hidden:true},  //���ص�
    	{colspan:2, hidden:true}, 
    	{colspan:2, hidden:true},
    	
    	{colspan:2, items:{xtype:'datefield',anchor:'100%',fieldLabel:'��ʼʱ��', id:'pt-log-query-starttime', format:'Y-m-d'}},
    	{colspan:2, items:{xtype:'datefield',anchor:'100%',fieldLabel:'����ʱ��', id:'pt-log-query-endtime', format:'Y-m-d'}},
    		
    	{colspan:1, width:pt_log_query_board_perWidth, items:{text : '��ѯ', xtype: 'button', type : 'button', 
    		iconCls : 'refresh-icon', hideLabel : false, handler : do_pt_log_query, anchor:'98%'}},

    	{colspan:1, width:pt_log_query_board_perWidth, items:{text : '�浵', xtype: 'button', type : 'button', 
    		iconCls : 'pt-cg-log-save', hideLabel : false, handler : do_pt_log_save, anchor:'98%'}},

    	{colspan:1, width:pt_log_query_board_perWidth, items:{text : 'ɾ��', xtype: 'button', type : 'button', 
    		iconCls : 'pt-cg-log-delete', hideLabel : false, handler : do_pt_log_delete, anchor:'98%'}}
    ]
});


pt_log_query_board.on('afterrender', function(){
	var endtime = new Date();
	var starttime = endtime;
	Ext.getCmp('pt-log-query-starttime').setValue ( starttime );
	Ext.getCmp('pt-log-query-endtime').setValue ( endtime ); 
	
	Ext.getCmp('pt-log-query-client-ip').setValue ('');
	Ext.getCmp('pt-log-query-operator').setValue ('');
}); 

//============================================================================================

var pt_log_query_jsr = new Ext.data.JsonReader({
	root : 'list',
	totalProperty : 'totalCount',
	idProperty : 'id',
	successProperty : 'success' }, 
	[
	{ name : 'host', mapping : 'host'}, 
	{ name : 'program', mapping : 'program'}, 
	{ name : 'facility', mapping : 'facility' },
	{ name : 'level', mapping : 'level' },
	{ name : 'datetime', mapping : 'datetime' },
	{ name : 'msg', mapping : 'msg'}
]);


var pt_log_query_proxy = new Ext.data.HttpProxy({
	url : 'QueryLog.action', 
	timeout : 60000,
	method 	: 'POST',
	listeners :  
	{   'exception' : ds_exception  
	}
});
 
var pt_log_query_ds = new Ext.data.Store({
	proxy : pt_log_query_proxy,
	reader : pt_log_query_jsr,
	listeners : {
		//load : doFilterOnLoad
		beforeload : function(){	
			var myparm = getPtLogQueryCriterias();	
    		Ext.apply( this.baseParams, myparm );
    	}
	}
});

// var page_display_text = new Ext.Toolbar.TextItem({xtype: 'tbtext', text: '��ǰ��ʾ {0} �� / �� {1} ��¼' });
var pt_log_paging_tb_cfg = {};
Ext.apply(pt_log_paging_tb_cfg, cg_pagingToolbar_config);
Ext.apply(pt_log_paging_tb_cfg, 
	{store : pt_log_query_ds, 
	items : [{ xtype: 'tbspacer', width: 160}, ' ��ҳ  ']
	});

var pt_log_detail_grid = new Ext.grid.GridPanel({
	id : 'pt-log-detail-grid',
	region : 'center', 
	xtype : 'grid',
	layout : 'fit',
	loadMask : true, 
	store : pt_log_query_ds,
	view : new Ext.grid.GridView(cg_grid_view_cfg),
	columns : [ 
		new Ext.grid.RowNumberer(),
		{ header : '��¼��', width : 120, sortable:true, dataIndex : 'program' },
		{ header : '�������', width : 80, sortable:false, dataIndex : 'facility' }, 
		{ header : 'ʱ��', width : 120, sortable:true, dataIndex : 'datetime' }, 
		{ header : '��־����', width : 150, sortable:false, dataIndex : 'msg', id:'pt-log-detail-msg-col' }  
    ],
	stripeRows : true,
	autoExpandColumn: 'pt-log-detail-msg-col',
	bbar : new Ext.PagingToolbar(pt_log_paging_tb_cfg ) 
	// tbar : new Ext.PagingToolbar(log_paging_tb_cfg )
/*	bbar : [ 
		{ xtype: 'tbspacer', width: 100}, 
		page_display_text, // '��ǰ��ʾ {0} �� / �� {1} ��¼', // same as {xtype: 'tbtext', text: 'text1'} to create Ext.Toolbar.TextItem
		{ xtype: 'tbspacer', width: 20}, 
		{	text : '��һҳ',
			iconCls : 'x-tbar-page-prev',
			handler : do_log_prevpage 
		}, 
		{	text : '��һҳ',
			iconCls : 'x-tbar-page-next',
			handler : do_log_nextpage 
		},
		'->', 
		'Ӧ��ͨ��ϵͳ��־' 
	]*/
});

pt_log_paging_tb_cfg = null;

var pt_logDetailViewPanel = {
	id : 'pt-log-detail-view-panel',
	title:'����ƽ̨������־',
	layout : 'border',
	items:[ pt_log_query_board, pt_log_detail_grid ]
};

var pt_log_pageSize = 50;
var pt_log_current_page = -1;

function getPtLogQueryCriterias(){
	var operator = $('pt-log-query-operator').value.trim();
	var clientip = $('pt-log-query-client-ip').value.trim();
	var starttime = $('pt-log-query-starttime').value.trim();
	var endtime = $('pt-log-query-endtime').value.trim(); 
	
	var parm = {
		host: 'platform',
		operator : operator,
		starttime: starttime,
		endtime : endtime,
		other : clientip
	};
	
	return parm;
}

function do_pt_log_query(){
	var myparm = {}; // getPtLogQueryCriterias();
	pt_log_current_page = 0;
	Ext.apply(myparm, {
		start : 0,
		limit : pt_log_pageSize
	});
	pt_log_query_ds.load({params: myparm}); 

}

function do_pt_log_nextpage(){	
	var myparm = {}; 
	if (pt_log_current_page ===-1){
		return;
	}
	pt_log_current_page ++;
	Ext.apply(myparm, {
		start : pt_log_current_page * pt_log_pageSize,
		limit : pt_log_pageSize
	});
	pt_log_query_ds.load({params: myparm}); // , add:true
}

function do_pt_log_prevpage(){	
	var myparm = {}; 
	if (pt_log_current_page ===0){ 
		return;
	}
	pt_log_current_page --;
	
	Ext.apply(myparm, {
		start : pt_log_current_page * pt_log_pageSize,
		limit : pt_log_pageSize
	});
	pt_log_query_ds.load({params: myparm}); // , add:true
}

function showPlatformLog(){
	activeTab(pt_logDetailViewPanel);	
	
	initPtLogFields(); 
	
	do_pt_log_query();
}
 
function initPtLogFields(){
	Ext.getCmp('pt-log-query-client-ip').setValue ('');
	Ext.getCmp('pt-log-query-operator').setValue ('');
	
	var now = new Date();
	Ext.getCmp('pt-log-query-starttime').setValue ( now );
	Ext.getCmp('pt-log-query-endtime').setValue ( now ); 
} 

function do_pt_log_save(){
	var myparm = getPtLogQueryCriterias();

	if (!Ext.fly('eid_download')) {
		var frm = document.createElement('form');
		frm.id = 'eid_download';
		frm.name = 'downloading_syslog';
		frm.style.display = 'none';
		document.body.appendChild(frm);
	}
	Ext.Ajax.request({
		url : 'DownloadSystemLog.action',
		form : Ext.fly('eid_download'),
		method : 'POST',
		isUpload : true,
		timeout : 60000,
		params : myparm
	}); 
}

function do_pt_log_delete() {
	Ext.MessageBox.minWidth = 280;
	Ext.MessageBox.confirm('ȷ��ɾ��', '��ȷ��Ҫɾ����Щϵͳ��־��ɾ��ǰ���ȴ浵.', function(btn) {
		if (btn == "yes") {
			pt_log_delete()
		}
	});
}
	
function pt_log_delete(){
	var myparm = getPtLogQueryCriterias();
 
	if ( (myparm.operator != null) && (myparm.operator != '') ||
		 (myparm.other != null) && (myparm.other != '')){

		Ext.MessageBox.minWidth = 280;
		Ext.MessageBox.alert('��ʾ', 'ֻ����"ʱ��"Ϊ������ɾ��������')
		return;		
	}

	Ext.Ajax.request({
		url : 'DeleteSystemLog.action',
		timeout : 30000,
		params : myparm,
		
		success : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj && obj.success == true) {
				Ext.MessageBox.alert('�ɹ�', '���ѳɹ�ɾ��ϵͳ��־ (' + obj.affected + ' ��)');
				do_pt_log_query();
			}
			else
				Ext.MessageBox.alert('ɾ����־ʧ��', obj.error.reason);
		},
		failure : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.MessageBox.alert('ɾ����־ʧ��', obj.error.reason);
			}
		}
	}); 
}




