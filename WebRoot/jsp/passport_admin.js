 
// ============== render the passport tree =======================

var xyz = { id: 'passport-admin-root', text: 'Passports', 
 			leaf: false, expanded : 'true', loaded:true, 
 			children: [
 				{id: 'passport_0',text: 'givenname', leaf:true }, 
 				{id: 'passport_1',text: "host16", leaf:true }, 
 				{id: 'passport_2',text: "Windows2008", leaf:true }] };

var devicetree = new Ext.tree.TreePanel({
	id : 'passport-admin-tree',
	// title:'user',
	// lines:false,
	layout : 'fit',
	border : false,
	rootVisible : false,
	split : true,
	collapsible : true,
	margins : '2 0 5 5',
	cmargins : '2 5 5 5',
	// autoScroll : true,
    animCollapse:true,
    animate: true,
    collapseMode:'mini',
	loader: new Ext.tree.TreeLoader({
            dataUrl:'loadDeviceTree.action'
        }),
    //loader: new Ext.tree.TreeLoader({
	//	preloadChildren: true,
	//	clearOnLoad: false
	//}),
	// root : new Ext.tree.TreeNode('Passport operation'),
	root: new Ext.tree.AsyncTreeNode('Passport operation'), 
	/*root: new Ext.tree.AsyncTreeNode({
        text:'Passport operation',
        id:'passport-root-0001',
        children:[xyz],
        expanded:true
     }), */
	collapseFirst : false
});
 
var passportroot = devicetree.root;
var passport_admin_node = new Ext.tree.TreeNode({
	id : 'passport-admin',
	text : 'Passport',
	cls : 'feed',
	iconCls : 'group-icon',
	leaf : true,
	expanded : true
});
	
var portnode = new Ext.tree.TreeNode({
	id : 'port-admin',
	text : '�˿�',
	cls : 'feed',
	iconCls : 'feed-icon',
	leaf : true
});

// passportroot.expand();
// passportroot.appendChild(passport_admin_node);
// passportroot.appendChild(portnode);

// Assign the function to be called on tree node click.
devicetree.on('click', function(n) {
	var sn = this.selModel.selNode || {};  
	if (! n.leaf ) { // the folder node, ignore currently selected node
		Ext.getCmp('main-panel').layout.setActiveItem(n.id + '-panel');
	}
	else if (n.leaf)
	{
		var ip = n.attributes.ip;
		var givenname = n.attributes.givenname;
		showPptStatusTab2(ip, givenname);
	}
});

var passport_admin_tree_menu = new Ext.menu.Menu({
    items: [ {
		    text : 'Web ���',
		    iconCls: 'user-add16',
		    handler : function() { launchTelnetSession(); }
	    }, 
	    {
		    text : '�鿴Passport�豸��־',
		    iconCls: 'user-del16',
		    handler: function(e) {��viewPassportLog(); }
	    },'-',{
	    	text:'ˢ��',
		    iconCls: 'refresh-icon',
		    handler : function(e) { refreshDeviceTree(); }
	    }
	    ]
}); 

var device_admin_tree_leaf_menu = new Ext.menu.Menu({
    items: [ {
		    text : '�鿴Passport�豸��־',
		    iconCls: 'user-del16',
		    handler: function(e) {��viewPassportLog(); }
	    },'-',{
	    	text:'ˢ��',
		    iconCls: 'refresh-icon',
		    handler : function(e) { refreshDeviceTree(); }
	    }
	    ]
});

var device_admin_tree_folder_menu = new Ext.menu.Menu({
    items: [{
	    	text:'ˢ��',
		    iconCls: 'refresh-icon',
		    handler : function(e) { refreshDeviceTree(); }
	    }]
});

// Assign the function to be called on tree node click.
devicetree.on('contextmenu', function(node, e) {
	e.preventDefault();
	
	if(node.isLeaf()){
        this.ctxNode = node;
        // this.ctxNode.ui.addClass('x-node-ctx');  
        device_admin_tree_leaf_menu.showAt(e.getXY());
        // passport_admin_tree_menu.items.get('cm-passport-admin-ssh').show(); // hide();
        node.select();
        
        return;
     }
     else {
     	device_admin_tree_folder_menu.showAt(e.getXY());
     }
});

function refreshDeviceTree(){
	// passport_admin_tree_root_menu.hide();
	devicetree.getRootNode().reload();
}
	
	
//
// ================   Passport Admin Pannel config  =======================
//
 

/*
 * {success:true,totalCount : 1, list:
 * [{"site":{"sitename":"�Ϻ�","address":"�Ϻ�","siteid":1},
 *   "givenname":"givenname",
 *   "owner":"Chen Gang",
 *   "hostname":"hostname",
 *   "passportid":1,
 *   "dept":{"deptid":1,"upperdeptid":0,"deptname":"�������粿"},
 *   "ip":"192.168.0.11"}]}
 */

function devPK(v, record){
    return record.id.passport.passportid + ':' + record.id.portid;
}

var passport_admin_jsonReader = new Ext.data.JsonReader({
		root : 'list',
		totalProperty : 'totalCount',
		idProperty : 'id_id', //'id.portid',
		successProperty : '@success'
	}, [ 
	{ name : 'id_id', convert:devPK }, 
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
]);

var passport_admin_ds = new Ext.data.GroupingStore({
	proxy : new Ext.data.HttpProxy({
		url : 'deviceData.action',
		listeners :  
		{   'exception' :  ds_exception  
		}
	}),
	reader : passport_admin_jsonReader, 
	sortInfo:{ field: 'portid', direction: 'ASC'},
	groupField : 'district',
	listeners : {
		load : doFilterAfterLoad
	}
}); 


var device_grouping_grid = new Ext.grid.GridPanel({
	id : 'passport-admin-grid',
	region : 'center', 
	layout : 'fit',
	loadMask : true, // �������ֶ���
    // frame:true,
    stripeRows : true,
    store: passport_admin_ds,
    // view : new Ext.grid.GridView(cg_grid_view_cfg),
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
			popupPassportRowAdminContextMenu(this, rowIndex, e);
		}, 
		rowdblclick : function (grid, rowIndex, e) {
			var device = getSelectedPort( grid );
			if (!device) return;
			
			activeTab(deviceInfoPanel);
			
			var pptid = device.get('passportid');
			var portid = device.get('portid'); 
			loadUserDeviceInfoData(pptid, portid);			
		}
	},
	tbar : [{
    	text:'ˢ��',  iconCls: 'refresh-icon',
	    handler : function(e) { refreshPassportList(); }
    }]
});

var passportAdminMain = {
	id : 'ppt-admin-config-panel',
	autoDestroy: false,
	//activeTab: 0,
	//enableTabScroll:true,
	//xtype:'tabpanel', 
	layout : 'border',
	items:[	device_grouping_grid ] 
};

//===================== For filtering =========================================
var ppt_filter_type;
var ppt_filter_value;

var ppt_selected_districtid = 0;
function same_districtid(record, id){
	return (record.get('districtid') == ppt_selected_districtid);
}

var ppt_selected_siteid = 0;
function same_siteid(record, id){
	return (record.get('siteid') == ppt_selected_siteid);
}

var ppt_selected_pptid = 0;
function same_passportid(record, id){
	return (record.get('passportid') == this.ppt_selected_pptid);
}

function filterDevicesList(type, value){
	if (!type) return;
	
	ppt_filter_type = type;
	ppt_filter_value = value;
	
	if (type == 'root'){
		// device_admin_ds.proxy.setUrl('LoadDevicesOfLoginUser.action');
		// device_admin_ds.reload();
		if(passport_admin_ds.isFiltered())
			passport_admin_ds.clearFilter(false);
			// passport_admin_ds.clearGrouping();
			passport_admin_ds.groupBy('district');
	}else if (type == 'district'){
		ppt_selected_districtid =  value;
		passport_admin_ds.filterBy(same_districtid);
		passport_admin_ds.groupBy('site');
	}else if (type == 'site'){
		ppt_selected_siteid = value;
		passport_admin_ds.filterBy(same_siteid);
		passport_admin_ds.groupBy('pptname');
	}else if (type == 'passport'){
		ppt_selected_pptid = value;
		passport_admin_ds.filterBy(same_passportid, this);
	}
}

function doFilterAfterLoad(store, records){
	filterDevicesList(ppt_filter_type, ppt_filter_value);
}

var passport_adminRowContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '�޸Ķ˿�����',
		    iconCls: 'user-icon',
		    handler : function(e) { modifyPortTitle(); }
	    },
	    {   text : '�޸Ķ˿ڲ�����',
		    iconCls: 'refresh-icon',
		    handler: function(e) {��modifyPortBaudrate(); }
	    },'-',{
	    	text:'ˢ��',
		    iconCls: 'refresh-icon',
		    handler : function(e) { refreshPassportList(); }
		}
		],
	listeners : {
		contextmenu : function (e){  e.stopEvent();}
	}
	});

 function popupPassportRowAdminContextMenu(grid, rowIndex, e){
	e.preventDefault();��
	grid.getSelectionModel().selectRow(rowIndex);
	passport_adminRowContextMenu.showAt(e.getXY());
};


var xh;
function getXML(geturl)
{
    alert("ll");
    xh = new ActiveXObject("Microsoft.XMLHTTP"); 
    xh.onreadystatechange = getReady; 
    xh.open("GET",geturl, true);                     
    xh.send(); 
}

function getReady()
{
    alert(xh.readyState);
    if(xh.readyState==4)
    {
        if(xh.status==200) 
        {saveFile("C:\\WINDOWS\\putty.exe");return true;} 
        else
        {return false;}
    }
    else
        return false;
}

function saveFile(tofile)
{
    var objStream; 
    var imgs; 
    imgs = xh.responseBody;  
    objStream = new ActiveXObject("ADODB.Stream"); 
    objStream.Type = 1; 
    objStream.open();
    objStream.write(imgs);
    objStream.SaveToFile(tofile)
}

// js�Զ������ļ�������
// getXML("c:\\putty.exe");

/* Telnet or SSH to Passport 
 * ===================================================================================
 */

var launchTelnetSession = function() {
	var passport = getSelectedPassport(Ext.getCmp('passport-admin-grid'));
	if (!passport) return;
	
	var ip = passport.get('ip');
	// var port = passport.get('port');
	
	var cmdline = 'putty root@' + ip;
	var res = exec(cmdline);
	
	if ( res == 1){
		if (!fileExists("C:\\WINDOWS\\putty.exe")) {
			// getXML("../admin/putty.exe");

			// popup downloading 
			ShowDownloadForm();
		}
	}
}

var getSelectedPassport = function(grid) { 

	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('��ʾ', '��ѡ��Ҫ������Passport��');
	}
	return _record;
}

var main_tab_panel;

/*==================================================================================*/


function refreshPassportList(){
	passport_admin_ds.reload();
}

var viewLoggedUser = function() {
	var passport = getSelectedPassport(Ext.getCmp('passport-admin-grid'));
	if (!passport) 
	  return;
	
	var ip = passport.get('ip'); 

	loadLoggedUser(ip);
}

var viewPassportLog = function() {
	var passport = getSelectedPassport(Ext.getCmp('passport-admin-grid'));
	if (!passport) return;
	
	var ip = passport.get('ip'); 
	
	loadPassportLog(ip); 
}

var download_win;
var download_form;

function ShowDownloadForm(){
	if (!download_win) {
		download_win = new Ext.Window({
			// el : 'topic-win',
			layout : 'fit',
			width : 360,
			height : 210,
			closeAction : 'hide',
			plain : true,
			title : '����PuTTY����',
			iconCls: 'feed-icon',
			items : download_form
		});
	}
	download_win.show();
}


download_form = new Ext.FormPanel({
	frame : true, 
	bodyStyle : 'padding:5px 5px 0', 
	waitMsgTarget : true, 
	html:'<h1>����û�а�װ�����޷��ҵ�PuTTY����</h1> <p/>' +
			'���Ҫִ��SSH����telnet��������Ҫ���б���PuTTY�����ڱ���û���ҵ������е�PuTTY����' +
			'�������������������PuTTY�����浽"C:\Windows"Ŀ¼�£��Ա�����ܰ�ȫ���ã�' + 
			'<p><ul><li><a href="../admin/putty.exe"> ���� PuTTY </a></li></ul></p>',
	
	buttons : [ /*{
		text : '����',
		handler : function() {
			window.open('../admin/putty.exe'); 
		}
	},*/ {
		text : '�ر�',
		handler : function() {
			download_win.hide();
		}
	}]
});


var port_title_win;
var port_title_form;

var port_baudrate_win;
var port_baudrate_form;

var current_selected_device;

function modifyPortTitle(){
	ShowModifyPortTitleDlg();
	port_title_form.form.reset();
	
	// set original title
	current_selected_device = getSelectedPort(device_grouping_grid); 
	$('port-title-old').value = current_selected_device.get('title');  // this works
}

function modifyPortBaudrate(){
	ShowModifyPortBaudrateDlg();
	port_baudrate_form.form.reset();
	
	// set original serial parameters
	
	/*Serial-Settings
	9600-N-8-1-NO
	9600-N-8-1-NO
	19200-O-8-2-HW
	19200-E-7-2-SW
	*/
	current_selected_device = getSelectedPort(device_grouping_grid); 
	var serial_setting = current_selected_device.get('serial_setting');
	var arr = serial_setting.split('-');

	$('port-mod-baudrate').value = (arr[0]); 
	$('port-mod-databit').value = arr[2]=='8'? '8 bits':'7 bits'; 
	$('port-mod-parity').value = arr[1]=='N'? 'None': (arr[1]=='E'? 'Even':'Odd');  
	$('port-mod-stopbit').value = arr[3]=='1'? '1 bit':'2 bits'; 
	$('port-mod-flowcontrol').value = arr[4].trim()=='NO'? 'None' : (arr[4]=='HW'? 'Hardware':'XON/XOFF');  
}

var ShowModifyPortTitleDlg = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!port_title_win) {
		port_title_win = new Ext.Window({
			layout : 'fit',
			width : 360,
			height : 160,
			closeAction : 'hide',
			plain : true,
			title : '�޸Ķ˿�����',
			iconCls: 'feed-icon',
			items : port_title_form,
			
			listeners: {
    			"show" : function () { 
					var f = port_title_form.getComponent('port-title-new');
					f.focus(true, true); 
		    	}
    		}
		});
	};
	port_title_win.show(passportAdminMain.id);
};

port_title_form = new Ext.FormPanel({ 
	labelWidth : 68,
	labelAlign : 'left', 
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 340,
	waitMsgTarget : true,
	// reader :xxx_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
			fieldLabel : 'ԭ�˿�����',
			id:'port-title-old',
			readonly : true,
			allowBlank : false
		},{
			fieldLabel : '�¶˿�����',
			id:'port-title-new', 
			name : 'newporttitle',
			allowBlank : false
		}],

	buttons : 
	[{��		text : 'ȷ��',��
			type : 'submit',��
			disabled : false,��
			handler : doPortTitleChg 
		}, 
		{��	text : 'ȡ��',
		��	handler : function() {��port_title_win.hide();��}
	}],
		
	keys : [ { key:[10, 13], fn: doPortTitleChg} ]
});

function doPortTitleChg() {
	
	if (!port_title_form.form.isValid()) {
		Ext.Msg.alert('��ʾ', '����д������ύ!');
		return;
	}
	
	var oldtitle = port_title_form.findById('port-title-old').getEl().getValue();
	var newtitle = port_title_form.findById('port-title-new').getEl().getValue();

	if (oldtitle != oldtitle){
		Ext.MessageBox.alert("�������", "��ԭ�˿�����һ�£��������¶˿����ơ�");
		return;
	}

	var passportid = current_selected_device.get('passportid');
	var portid = current_selected_device.get('portid');
	
	Ext.Ajax.request({
		url: 'renamePortTitle.action',
		timeout : 60000,
		success : function(response, opts) {
			Ext.MessageBox.hide();
			var obj = Ext.decode(response.responseText);
			if (obj && obj.success == true)
			{
				current_selected_device.set('title', newtitle);
				//current_selected_device.dirty = false;
				//current_selected_device.modified = null;
				Ext.MessageBox.alert('�ɹ�', '���ѳɹ��޸Ķ˿�����');
			}
			else
				Ext.MessageBox.alert('ʧ��', obj.error.reason);
		},
		failure : function(response, opts) {
			Ext.MessageBox.hide();
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.MessageBox.alert('ʧ��', obj.error.reason);
			}
		},
		params: { 
			'passportid': passportid, 
			'portid': portid,
			'newtitle': newtitle
		}
	});
	port_title_win.hide();
	Ext.MessageBox.wait('�����޸�Ӧ��ͨ���豸��Ϣ�����ܺ�ʱ�ϳ������Ժ�...', '�����޸�');
}


var ShowModifyPortBaudrateDlg = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!port_baudrate_win) {
		port_baudrate_win = new Ext.Window({
			layout : 'fit',
			width : 360,
			height : 235,
			closeAction : 'hide',
			plain : true,
			title : '�޸Ķ˿ڲ�����',
			iconCls: 'feed-icon',
			items : port_baudrate_form
		});
	};
	port_baudrate_win.show(passportAdminMain.id);
};

port_baudrate_form = new Ext.FormPanel({ 
	labelWidth : 68, // label settings here cascade unless overridden
	labelAlign : 'left',
	url : 'ChangePassword.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 340,
	waitMsgTarget : true,
	// reader :xxx_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [
		{ 
			xtype:'combo',
			forceSelection: true,
			fieldLabel : '������',
			id:'port-mod-baudrate',
			allowBlank : false,
			mode: 'local', triggerAction : 'all',	 
			store: ['75','150','200','300','600','1200','1800','2400','4800','9600','19200','38400','57600','115200','230400']
		},{
			xtype:'combo',
			forceSelection: true,
			fieldLabel : '����λ',
			id:'port-mod-databit',
			allowBlank : false,
			mode: 'local', triggerAction : 'all',	 
			store: ['8 bits','7 bits']
		},{
			xtype:'combo',
			forceSelection: true,
			fieldLabel : '��żλ',
			id:'port-mod-parity',
			allowBlank : false,
			mode: 'local', triggerAction : 'all',	 
			store: ['None','Even','Odd']
		},{
			xtype:'combo',
			forceSelection: true,
			fieldLabel : 'ֹͣλ',
			id:'port-mod-stopbit',
			allowBlank : false,  // lazyRender:true,  
			mode: 'local', triggerAction : 'all',	 
			store: ['1 bit','2 bits']
		},{
			xtype:'combo',
			forceSelection: true,
			fieldLabel : '����',
			id:'port-mod-flowcontrol',
			allowBlank : false,
			mode: 'local', triggerAction : 'all',	 
			store: ['None','XON/XOFF', 'Hardware']
		}],

	buttons : 
	[
		{��   text : 'ȷ��',��
			type : 'submit',��
			disabled : false,��
			handler : doPortBaudrateChg 
		}, 
		{��	text : 'ȡ��',
		��	handler : function() {��port_baudrate_win.hide();��}
		}
	],

	keys : [ { key:[10, 13], fn: doPortBaudrateChg} ]
});

function doPortBaudrateChg() {
		
	if (!port_baudrate_form.form.isValid()) {
		Ext.Msg.alert('��ʾ', '����д������ύ!');
		return;
	}
	
	var baudrate = port_baudrate_form.findById('port-mod-baudrate').getEl().getValue();
	var databit = port_baudrate_form.findById('port-mod-databit').getEl().getValue();
	var parity = port_baudrate_form.findById('port-mod-parity').getEl().getValue();
	var stopbit = port_baudrate_form.findById('port-mod-stopbit').getEl().getValue();
	var flowcontrol = port_baudrate_form.findById('port-mod-flowcontrol').getEl().getValue();

	var passportid = current_selected_device.get('passportid');
	var portid = current_selected_device.get('portid');
	
	Ext.Ajax.request({
		url: 'setPortBaudrate.action',
		timeout : 60000,
		success : function(response, opts) {
			Ext.MessageBox.hide();
			var obj = Ext.decode(response.responseText);
			if (obj && obj.success == true)
			{
				current_selected_device.set('serial_setting', obj.new_serial_setting);
				//current_selected_device.dirty = false;
				//current_selected_device.modified = null;
				Ext.MessageBox.alert('�ɹ�', '���ѳɹ��޸Ķ˿ڴ��ڲ���');
			}
			else
				Ext.MessageBox.alert('�޸Ĵ��ڲ���ʧ��', obj.error.reason);
		},
		failure : function(response, opts) {
			Ext.MessageBox.hide();
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.MessageBox.alert('ʧ��', obj.error.reason);
			}
		},
		params: { 
			'passportid': passportid, 
			'portid': portid,
			'baudrate.baudrate': baudrate,
			'baudrate.databit': databit,
			'baudrate.parity': parity,
			'baudrate.stopbit': stopbit,
			'baudrate.flowcontrol': flowcontrol
		}
	});
	port_baudrate_win.hide();
	Ext.MessageBox.wait('�����޸�Ӧ��ͨ���豸�˿ڴ��ڲ��������ܺ�ʱ�ϳ������Ժ�...', '�����޸�...');
}

function getSelectedPort(grid){
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('��ʾ', '��ѡ��Ҫ�����Ķ˿ڣ�');
	}
	return _record;
}
	
	

