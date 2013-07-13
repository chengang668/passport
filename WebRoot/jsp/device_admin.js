
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
 
var deviceroot = devicetree.root;

// Assign the function to be called on tree node click.
devicetree.on('click', function(n, e) {
	var sn = this.selModel.selNode || {};  
	if (! n.leaf ) { // the folder node, ignore currently selected node
		showDeviceListPanel(); 
		filterDeviceGrid(n);
	}
	else if (n.leaf)
	{
		/* var ip = n.attributes.ip; */
		activeTab(deviceInfoPanel);
		
		var pptid = n.attributes.passportid;
		var portid = n.attributes.portid;
		loadUserDeviceInfoData(pptid, portid);
	}
});

function showDeviceListPanel()
{
    activeTab(deviceAdminMain);
}

//===================== For filtering =========================================
var selected_districtid = 0;
function equal_districtid(record, id){
	if(record.get('districtid') == selected_districtid){
		return true;
	}
	return false
}

var selected_siteid = 0;
function equal_siteid(record, id){
	if(record.get('siteid') == selected_siteid){
		return true;
	}
	return false
}

function filterDeviceGrid(treenode)
{
	if(!treenode) return;
	var type = treenode.attributes.ntype;
	if (!type) return;
	
	if (type == 'root'){
		// device_admin_ds.proxy.setUrl('LoadDevicesOfLoginUser.action');
		// device_admin_ds.reload();
		if(device_admin_ds.isFiltered())
			device_admin_ds.clearFilter(false);
			device_admin_ds.groupBy('district');
	}else if (type == 'district'){
		// var url = 'LoadDevicesOfLoginUser.action?districtid=' + treenode.attributes.districtid;
		// device_admin_ds.filter('districtid', treenode.attributes.districtid, true); //CG this matches 1 and 10
		selected_districtid = treenode.attributes.districtid;
		device_admin_ds.filterBy(equal_districtid);
		device_admin_ds.groupBy('site');
	}else if (type == 'site'){
		// var url = 'LoadDevicesOfLoginUser.action?siteid=' + treenode.attributes.siteid;
		// device_admin_ds.filter('siteid', treenode.attributes.siteid, true); //CG this matches 1 and 10
		selected_siteid = treenode.attributes.siteid;
		device_admin_ds.filterBy(equal_siteid);
	}else if (type == 'passportip'){
		;
	} 
}

function doFilterOnLoad(store, records){
	var treenode = devicetree.getSelectionModel().getSelectedNode();
	filterDeviceGrid(treenode);
}

var quick_search_title = '';
var quick_search_pptip = '';

function equal_title_pptip(record, id){
	if(record.get('title').toLowerCase().indexOf(quick_search_title.toLowerCase())!=-1 &&
	   record.get('passportip').indexOf(quick_search_pptip)!= -1 ){
		return true;
	}
	return false
}

function quickSearchDeviceGrid( title, pptip )
{
	if (title && title!='' && (!pptip || pptip==''))
		device_admin_ds.filter('title', title , true);

	else if (pptip && pptip!='' && (!title || title==''))
		device_admin_ds.filter('passportip', pptip , true);
		
	else if (title && title!='' && pptip && pptip!='') {
		quick_search_title = title;
		quick_search_pptip = pptip;
		device_admin_ds.filterBy(equal_title_pptip);
	}
	else
	{
		device_admin_ds.clearFilter(false);
	}
}
// =============================================================

var device_admin_tree_leaf_menu = new Ext.menu.Menu({
    items: [{
		    text : 'SSH/Telnet远程登录',
		    iconCls: 'cg-connect-icon',
		    scope: devicetree,
		    handler : function(item, e) { launchDeviceTelnetSession2(); }
	    }, '-',{
	    	text:'刷新',
		    iconCls: 'refresh-icon',
		    handler : function(item, e) { refreshDeviceTree(); }
	    }
	    ]
});

var device_admin_tree_folder_menu = new Ext.menu.Menu({
    items: [{
    	text:'刷新',
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
        // device_admin_tree_menu.items.get('cm-device-admin-ssh').show(); // hide();
        node.select();
        
        return;
     }
     else {
     	device_admin_tree_folder_menu.showAt(e.getXY());
     }
});

function refreshDeviceTree(){
	// device_admin_tree_root_menu.hide();
	devicetree.getRootNode().reload();
}

function devicePK(v, record){
    return record.id.passport.passportid + ':' + record.id.portid;
}

//------------------------------------

var device_admin_jsr = new Ext.data.JsonReader({
	root : 'list',
	totalProperty : 'totalCount',
	idProperty : 'id_id', //'id.portid',
	successProperty : '@success' }, 
	[
	{ name : 'id_id', convert:devicePK }, 
	{ name : 'passportid', mapping : 'id.passport.passportid' },
	{ name : 'portid', mapping : 'id.portid' },
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


var device_admin_proxy = new Ext.data.HttpProxy({
	url : 'LoadDevicesOfLoginUser.action', 
	method 	: 'POST',
	listeners :  
	{   'exception' :  conn_exception  
	}
});
 
var device_admin_ds = new Ext.data.GroupingStore({
	proxy : device_admin_proxy,
	reader : device_admin_jsr,
	
	sortInfo:{ field: 'title', direction: 'ASC'},
	groupField : 'district',
	listeners : {
		load : doFilterOnLoad
	}
});

var deviceFilterIPComboCfg = {};
Ext.apply(deviceFilterIPComboCfg, cg_pptipComboBoxCfg)
Ext.apply(deviceFilterIPComboCfg, {id: 'device-admin-combo-ip', width:120, 
	listeners: {
        specialkey: function(field, e){
            if (e.getKey() == e.ENTER) {
                // var form = field.ownerCt.getForm(); form.submit();
            	var title = deviceFilterPortTitle.getValue() ;  
            	var pptip = deviceFilterComboIP.getRawValue() ;					
				quickSearchDeviceGrid(title, pptip);
            }
        }
    }
});

var deviceFilterComboIP = new Ext.form.ComboBox( deviceFilterIPComboCfg );

var deviceFilterPortTitle = new Ext.form.TextField( 
	{width: 120, 
	listeners: {
        specialkey: function(field, e){
            // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
            // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
            if (e.getKey() == e.ENTER) { 
                // var form = field.ownerCt.getForm(); form.submit();
            	var title = deviceFilterPortTitle.getValue() ;  
            	var pptip = deviceFilterComboIP.getRawValue() ;					
				quickSearchDeviceGrid(title, pptip);
            }
        }
    }
} );


var device_list_rownum = new Ext.grid.RowNumberer();

var device_list_grid = new Ext.grid.GridPanel({
	id : 'device-admin-grid-main',
	region : 'center', 
	xtype : 'grid',
	layout : 'fit',
	loadMask : true, // 载入遮罩动画
	store : device_admin_ds,
	// view : new Ext.grid.GridView(cg_grid_view_cfg),
	columns : [ 
		device_list_rownum, 
		{ header : '地区', width : 30,   sortable : true, dataIndex : 'district'	}, 
		{ header : '机房', width : 60,  sortable : true, dataIndex : 'site' },
		{ header : '设备名', width : 60, sortable : true, groupable:false,  dataIndex : 'title' }, 
		{ header : '远程登录模式', width : 40, groupable:false, dataIndex : 'mode' }, 
		{ header : '通信端口', width : 30, groupable:false, dataIndex : 'port' }, 
		{ header : '通信协议', width : 50, groupable:false, dataIndex : 'protocol' }, 
		{ header : '通道IP', width : 60, sortable : false, groupable:false, dataIndex : 'passportip'}, 
		{ header : '串口参数', width : 120, groupable:false, dataIndex : 'serial_setting', id:'device-admin-grid-serial-setting-col'}    
    ],
	view: new Ext.grid.GroupingView({
		sortAscText : '顺序排序', sortDescText : '倒序排序', columnsText : '选择列', 
		groupByText : '按该列分组',　showGroupsText : '分组显示',
        forceFit:true,
        //groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
        groupTextTpl: '{text} ({[values.rs.length]} {["项"]})'
    }), 
	stripeRows : true,
	autoExpandColumn: 'device-admin-grid-serial-setting-col',
	listeners : {
		render : function() {
			this.store.load();
		},
		rowcontextmenu : function (grid, rowIndex, e) {
			popupDeviceAdminRowContextMenu(this, rowIndex, e);
		},
		contextmenu : function (e) {
			var rowIndex = this.view.findRowIndex(e.getTarget());   

			//CG rowIndex might be 0, indicates the first row.
			if (false === rowIndex) {
				popupDeviceAdminContextMenu(this, rowIndex, e);
			} else{
  				// 如果当前右键点击的是列表行，那么停止事件 , 由 rowcontextmenu 事件处理
  				e.stopEvent();   
			}    			
		},
		rowdblclick : function (grid, rowIndex, e) {
			var device = getSelectedDevice( grid );
			if (!device) return;
			
			activeTab(deviceInfoPanel);
			
			var pptid = device.get('passportid');
			var portid = device.get('portid'); 
			loadUserDeviceInfoData(pptid, portid);			
		}
	},
	tbar:['设备列表', { xtype: 'tbspacer', width: 80},
		'设备名: ', deviceFilterPortTitle, 
		'-', 
		'应急通道IP: ',
		deviceFilterComboIP, 
		{
			text : '快速定位',
			iconCls : 'refresh-icon',
			handler : function() {
            	var title = deviceFilterPortTitle.getValue() ;  
            	var pptip = deviceFilterComboIP.value ;					
				quickSearchDeviceGrid(title, pptip);
			}
		} ]
});

var deviceAdminMain = {
	id : 'device-admin-main-panel',
	// title:'设备列表',
	layout : 'border',
	items:[ device_list_grid ]
};


//=======================================================================


var user_device_info_jsr = new Ext.data.JsonReader( {
		root :'list',
		successProperty :'success'
	}, [ {
		name :'passportid', mapping: 'device.id.passport.passportid'},{
		name :'portid', mapping: 'device.id.portid'},{
		name :'districtname', mapping :'device.id.passport.site.district.districtname' 	},{
		name :'sitename', mapping :'device.id.passport.site.sitename' }, {
		name :'title', mapping :'device.title' }, {
		name :'remotemode', mapping :'device.mode' }, {
		name :'port', mapping :'device.port' }, {
		name :'protocol', mapping :'device.protocol' }, {
		name :'serial_setting', mapping :'device.serial_setting'  }, {
		name :'passportip', mapping :'device.passportip'  }, {
		name :'passportname', mapping :'device.id.passport.givenname'}, {
		name :'loginname', mapping : 'username' }, {
		name :'pwd'}
   ]
);

var user_device_info_form = new Ext.FormPanel({ 
	labelWidth : 100,  
	frame : true, 
	region : 'center',
	bodyStyle : 'padding:15px 15px 15px 15px',
	waitMsgTarget : true, 
	reader : user_device_info_jsr,
	// layout:'column', // arrange items in columns
	defaults : {
		layout:'form',
		width : 360
	},
	// buttonAlign : 'right',
	// defaultType : 'textfield',
	
	items : [{ 
		// Fieldset in Column 1
        xtype:'fieldset',
        columnWidth: 0.5,
        title: '设备详细信息',
        collapsible: true,
        autoHeight:true,
        defaults: {
        	// width : 260,
            anchor: '-10' // leave room for error icon
        },
        defaultType: 'textfield',
        items :[{
			fieldLabel : '地区', 
			name : 'districtname',
			readOnly : true 
		},{
			fieldLabel : '机房',
			name : 'sitename',
			readOnly : true 
		},{
			fieldLabel : '设备名',
			//id : 'user_info_form_userid',
			name : 'title',
			readOnly : true 
		},{
			fieldLabel : '远程登录模式',
			//id : 'user_info_form_userid',
			name : 'remotemode',
			readOnly : true 
		},{
			fieldLabel : '通信端口',
			id : 'user_device_info_port',
			name : 'port',
			readOnly : true 
		},{
			fieldLabel : '通信协议',
			//id : 'user_info_form_userid',
			name : 'protocol',
			readOnly : true 
		},{
			fieldLabel : '串口参数',
			//id : 'user_info_form_userid',
			name : 'serial_setting',
			readOnly : true 
		},{
			fieldLabel : '通道IP',
			id : 'user_device_info_pptip',
			name : 'passportip',
			readOnly : true 
		},{
			fieldLabel : '应急通道名称',
			//id : 'user_info_form_userid',
			name : 'passportname',
			readOnly : true 
		},{
			// fieldLabel : 'passportid hide',
			id : 'user_device_info_pptid',
			name : 'passportid',
			hidden : true,
			hideMode : 'offsets',
			hideLabel: true,
			readOnly : true 
		},{
			// fieldLabel : 'portid hide',
			id : 'user_device_info_portid',
			name : 'portid',
			readOnly : true,
			hideMode : 'offsets', // 'visibility',
			hideLabel: true,
			hidden : true
		}]

	}, /* { 
		// Fieldset in Column 2
        xtype:'fieldset',
        columnWidth: 1,
        title: '用户登录信息',
        collapsible: true,
        autoHeight:true,
        defaults: {
        	width : 260,
            anchor: '-10' // leave room for error icon
        },
        defaultType: 'textfield',
        items :[ { 
			fieldLabel : '登陆用户名',
			name : 'loginname',
			id : 'user_device_info_loginname',
			// anchor: '80%',
			readOnly : true 
		},{ 
			fieldLabel : '登陆密码',
			name : 'pwd',
			id : 'user_device_info_pwd',
			// anchor: '80%',
			inputType:'password', 
			readOnly : true 
		},{ 
			fieldLabel : ' ',
			labelSeparator : ' ',
			text : '修改登录信息',
			xtype: 'button',
			type : 'button',  // submit, reset or button - defaults to 'button'
			iconCls : 'refresh-icon',
			// hideLabel : false,
			handler : chgLoginInfo
		}]
	},*/ { 
        xtype:'fieldset',
        columnWidth: 1,
        title: '操作',
        collapsible: false,
        autoHeight:true,
        layout : 'column',
        defaults: {
        	// width : 260,
            anchor: '-10' // leave room for error icon
        },
        defaultType: 'button',
        items :[{ 
			text : 'SSH/Telnet 远程登录',
			xtype: 'button',
			type : 'button',  // submit, reset or button - defaults to 'button'
			iconCls : 'cg-connect-icon',
			hideLabel : false,
			handler : launchTelnet3
		}]
	}] 
});

var deviceInfoPanel = {
	id : 'device-admin-info-panel',
	title:'设备信息',
	layout : 'border',
	tools : [{id : 'close', qtip: '关闭', handler: function(event, toolEl, panel){ showDeviceListPanel(); }}],
	items:[ user_device_info_form ]
};


function loadUserDeviceInfoData(pptid, portid){ 
	var url = 'GetUserDeviceInfo.action?passportid=' + pptid + '&portid=' + portid;
	user_device_info_form.form.load({
		'url' : url,
		waitMsg : '正在载入数据...',
		failure : function(form, action) {
			var obj = Ext.util.JSON.decode(action.response.responseText);
 
			if ( obj.error.code && obj.error.code == 99) {  // timeout, refresh
				Ext.Msg.alert('操作失败', obj.error.reason, redirect2LoginPage);
			}
			else
				Ext.Msg.alert('操作失败', obj.error.reason);
		}
	}); 
}


var deviceLoginInfo_win;

function chgLoginInfo(btn, e)
{	
	ShowLoginInfoChangeDlg();
	deviceLoginInfo_form.form.reset();
}

var ShowLoginInfoChangeDlg = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!deviceLoginInfo_win) {
		deviceLoginInfo_win = new Ext.Window({
			layout : 'fit',
			width : 400,
			height : 180,
			closeAction : 'hide',
			plain : true,
			title : '修改登录信息',
			iconCls: 'feed-icon',
			items : deviceLoginInfo_form
		});
	}
	deviceLoginInfo_win.show('device-admin-info-panel');
};

deviceLoginInfo_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	url : 'ChangeDeviceLoginInfo.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 380,
	waitMsgTarget : true,
	// reader :xxxpwd_jsonFormReader,
	defaults : {
		width : 230,
		anchor: '-20' //cg  右边固定
	},
	defaultType : 'textfield',
	items : [{
			fieldLabel : '用户名',
			id:'user_device_login_name',
			name : 'loginname',
			allowBlank : false
		},{
			fieldLabel : '密码',
			id:'user_device_password1',
            inputType:'password', 
			name : 'pwd',
			allowBlank : false
		}, {
			fieldLabel : '确认密码',
			id:'user_device_password2',
            inputType:'password', 
			allowBlank : false
		}],

	buttons : 
	[{　		text : '确定',　
			type : 'submit',　
			disabled : false,　
			handler : doLoginInfoChg 
		}, 
		{　	text : '取消',
		　	handler : function() {　deviceLoginInfo_win.hide();　}
	}],

	keys : [ { key:[10, 13], fn: doLoginInfoChg} ]
});

function doLoginInfoChg() {
	
	if (!deviceLoginInfo_form.form.isValid()) {
		Ext.Msg.alert('提示', '请填写完成再提交!');
		return;
	}
	
	var passportid = user_device_info_form.findById('user_device_info_pptid').getEl().getValue();
	var portid = user_device_info_form.findById('user_device_info_portid').getEl().getValue();
	var loginname = deviceLoginInfo_form.findById('user_device_login_name').getEl().getValue();
	
	var pwd1 = Ext.getCmp('user_device_password1').getValue();
	var pwd2 = Ext.getCmp('user_device_password2').getValue();

	if (pwd1 != pwd2){
		Ext.MessageBox.alert("输入错误", "确认密码与密码不一致！请重试。");
		return;
	}

	Ext.Ajax.request({
		url: 'SaveUserDeviceInfo.action',
		success : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj.success == false) {
				Ext.MessageBox.alert('修改失败', obj.error.reason);
			}
			else {
				deviceLoginInfo_win.hide();
				loadUserDeviceInfoData(passportid, portid);
				// Ext.MessageBox.alert('成功', '您已成功修改登录信息');
			}
		},
		failure : function(response, opts) {
			// Ext.MessageBox.alert('失败', '修改密码失败，请重试！');
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.MessageBox.alert('失败', obj.error.reason);
				// deviceLoginInfo_win.show();
			}
		},
		params: { 
			// 'user.userid': userid, // current user.
			'passportid': passportid,
			'portid': portid,
			'ud_acl.username': loginname,
			'ud_acl.pwd': pwd1		
		} 
	});	
}

//===============================================================



var deviceAdminRowContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : 'SSH/Telnet 远程登录',
		    iconCls: 'cg-connect-icon',
		    handler : function(e) { launchDeviceTelnetSession(); }
	    },
	    /*{
		    // id:'rMenu-view-ppt-logged-user',
		    text : '查看应急通道在线用户',
		    iconCls: 'user-icon',
		    handler: function(e) {　viewLoggedUser(); }
	    },*/
	    '-',{
	    	text:'刷新',
		    iconCls: 'refresh-icon',
		    handler : function(e) { refreshDeviceAdminList(); }
		}
	],
	listeners : {
		contextmenu : function (e){  e.stopEvent();}
	}
});

var deviceAdminContextMenu = new Ext.menu.Menu( {
	items : [ {
    	text:'刷新',
	    iconCls: 'refresh-icon',
	    handler : function(e) { refreshDeviceAdminList(); }
	}],
	listeners : {
		contextmenu : function (e){  e.stopEvent();}
	}
});

function popupDeviceAdminRowContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	grid.getSelectionModel().selectRow(rowIndex);
	deviceAdminRowContextMenu.showAt(e.getXY());
};

function popupDeviceAdminContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	grid.getSelectionModel().selectRow(rowIndex);
	deviceAdminContextMenu.showAt(e.getXY());
};

function refreshDeviceAdminList(){
	device_admin_ds.reload();
}

//

var viewLoggedUser = function() {
	var passport = getSelectedDevice( device_list_grid );
	if (!passport) 
	  return;
	
	var ip = passport.get('ip'); 

	loadLoggedUser(ip);
}


var viewPassportLog = function() {
	var passport = getSelectedDevice( device_list_grid );
	if (!passport) return;
	
	var ip = passport.get('ip'); 
	
	loadPassportLog(ip); 
}


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
        {saveFile("C:\\WINDOWS\\plink.exe");return true;} 
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

// js自动下载文件到本地
// getXML("c:\\plink.exe");

/* Telnet or SSH to Passport 
 * ===================================================================================
 */

var launchDeviceTelnetSession = function() {
	var device = getSelectedDevice( device_list_grid );
	if (!device) return;
	
	// var ip = device.get('passportip');
	// var port = device.get('port');
	var pptid = device.get('passportid');
	var portid = device.get('portid'); 
	
	getSSHcommand2(pptid, portid);
}

// event fired from navigate tree view
var launchDeviceTelnetSession2 = function(e) {

	var treenode = devicetree.selModel.selNode;
	if (!treenode) return;
	
	// var ip = treenode.attributes.ip ;
	// var port = treenode.attributes.port;

	var pptid = treenode.attributes.passportid;
	var portid = treenode.attributes.portid;
	
	getSSHcommand2(pptid, portid);
}

function launchTelnet3(){
	var passportid = user_device_info_form.findById('user_device_info_pptid').getEl().getValue();
	var portid = user_device_info_form.findById('user_device_info_portid').getEl().getValue();
	
	getSSHcommand2(passportid, portid);
}
 
// plink -pw root root@192.168.0.126 "plink -pw chengang2 chengang2@192.168.0.5 -P 7001"

function doSSH(cmdline) {
	// alert(cmdline);
	var res = exec(cmdline);

	if ( res == 1){
		if (!fileExists("C:\\WINDOWS\\plink.exe")) {
			// popup downloading 
			ShowDownloadForm();
		}
	}
}

function runSecureCRT(cmdline) {
	// alert(cmdline);
	var res = exec(cmdline);

	if ( res == 1 ){
		res = exec("C:\\SecureCRT\\" + cmdline);
	} else return;
	
	if (res == 1) {
		var exefile = getCookie(secureCRT_Path_Cookie);
		exefile = exefile.trim();
		if (exefile!='')
			res = exec( '"' + exefile + '"' + cmdline.substring(13));
	} else return;

	if ( res == 1){
		if (!fileExists("C:\\SecureCRT\\SecureCRT.exe")) {
			// popup downloading 
			ShowSecureCrtDownloadForm();
		}
	}
}

function runSecureCRT_firefox(args){
  try {
	  netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	  var process = Components.classes['@mozilla.org/process/util;1'].getService(Components.interfaces.nsIProcess);
	  var targetFile = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
	
	  targetFile.initWithPath("C:\\WINDOWS\\system32\\cmd.exe");
	  process.init(targetFile); 
	  var arguments = ["/c", "start"];
	  arguments = arguments.concat(args);

	  try {
	  	process.run(false, arguments, arguments.length, {}); 
	  }
	  catch(err){
	  	ShowSecureCrtDownloadForm();
	  }
  }
  catch(e)
  {
	Ext.Msg.alert('执行命令失败', "!!被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
  }
}

function doTelnet(ip, port, user, pwd) {
	var cmdline = 'plink -P ' + port + ' -pw ' + pwd + ' ' + user + '@' + ip;
	var res = exec(cmdline);

	if ( res == 1){
		if (!fileExists("C:\\WINDOWS\\plink.exe")) {
			// popup downloading 
			ShowDownloadForm();
		}
	}
}

// old version, using plink to connect
function getSSHcommand(pptid, portid)
{
	var url = 'getSSHinfo.action?passportid=' + pptid + '&portid=' + portid;

	Ext.Ajax.request({
		'url': url,
		timeout : 60000,
		success : function(response, opts) {
			var obj = Ext.util.JSON.decode(response.responseText);
			if (obj.success == false) {
				Ext.MessageBox.alert('远程连接失败', obj.error.reason);
				return;
			}
			doSSH(obj.commandline); 
		},
		failure : function(response, opts) { 
			var obj = Ext.util.JSON.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.MessageBox.alert('远程连接失败', obj.error.reason); 
			}
		} 
	});	
}

// newer version, using SecureCRT to connect
function getSSHcommand2(pptid, portid)
{
	var url = 'getSSHinfo.action?passportid=' + pptid + '&portid=' + portid;

	Ext.Ajax.request({
		'url': url,
		timeout : 60000,
		success : function(response, opts) {
			var obj = Ext.util.JSON.decode(response.responseText);
			
			if (obj.success == false) {
				if ( obj.error.code && obj.error.code == 99) {  // timeout, refresh
					Ext.Msg.alert('操作失败', obj.error.reason, redirect2LoginPage);
					return;
				}
				Ext.MessageBox.alert('远程连接失败', obj.error.reason);
				return;
			}

			if (obj.pptReachable == false && obj.directaccess == false){
				Ext.MessageBox.confirm('提示', '应急通道的IP可能无法到达，是否需要电话拨号连接该应急通道？',
				function(btn) {
					if (btn == 'yes') {
						requestDialup(pptid);
					}
					else if (btn == 'no'){
						doSecureCrtConnect(obj);
					}
				});
				return;
			}
			
			doSecureCrtConnect(obj);
		},
		failure : function(response, opts) { 
			var obj = Ext.util.JSON.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				if ( obj.error.code && obj.error.code == 99) {  // timeout, refresh
					Ext.Msg.alert('操作失败', obj.error.reason, redirect2LoginPage);
					return;
				}
				Ext.MessageBox.alert('远程连接失败', obj.error.reason); 
			}
		} 
	});	
}

function doSecureCrtConnect(connInfo){
	if (connInfo.directaccess == true){
		// SecureCRT.exe /T /SSH2 /PASSWORD "dbps" root@192.168.0.5 /P 7002
		
		if (Ext.isIE){
			var cmdline = 'SecureCRT.exe /T /N "' + connInfo.device.title + '" /SSH2 /PASSWORD "'+ connInfo.device.pwd + '" ' + 
				connInfo.device.username + '@' + connInfo.device.pptip + ' /P ' + connInfo.device.port;
			runSecureCRT(cmdline);
		}
		// firefox 
		else if (Ext.isGecko){  
			var arguments = ['SecureCRT.exe', '/T', '/N', connInfo.device.title, '/SSH2', 
				'/PASSWORD', connInfo.device.pwd, 
				connInfo.device.username + '@' + connInfo.device.pptip, '/P', connInfo.device.port ];
				
			runSecureCRT_firefox(arguments);
		}
	}
	else{
		// create a temp vbs file
		// plink -pw dbps root@192.168.0.5 -P 7001
		// var shline = 'plink -pw \'' + connInfo.device.pwd + '\' ' + connInfo.device.username + '@' + connInfo.device.pptip + ' -P ' + connInfo.device.port;
		// var shline = 'plink ' + connInfo.device.username + '@' + connInfo.device.pptip + ' -P ' + connInfo.device.port;
		var shline = 'ssh ' + connInfo.device.username + '@' + connInfo.device.pptip + ' -p ' + connInfo.device.port;
		var pwd = connInfo.device.pwd;
		var vbsfile = CreateTempVbsFile(shline, pwd);
		
		if (Ext.isIE){					
			var cmdline = 'SecureCRT.exe /T /N "' + connInfo.device.title + '"' + 
					' /SCRIPT "' + vbsfile + '" /SSH2 /PASSWORD "'+ connInfo.server.pwd + '" ' + 
				connInfo.server.username + '@' + connInfo.server.serverip;
				
			runSecureCRT(cmdline);
		}
		else if (Ext.isGecko) { // Firefox
			var arguments = ['SecureCRT.exe', '/T', '/N', connInfo.device.title, 
				'/SCRIPT', vbsfile, 
				'/SSH2', 
				'/PASSWORD', connInfo.server.pwd, 
				connInfo.server.username + '@' + connInfo.server.serverip];
				
			runSecureCRT_firefox(arguments);
		}
		
		// delete tmp file
		// DeleteTempVbsFile(vbsfile);
	}
}

function requestDialup(pptid){
	Ext.Ajax.request({
		'url': 'dialPPP.action?passportid='+ pptid,
		timeout : 120000,
		success : function(response, opts) { 
			Ext.MessageBox.hide();
			var obj2 = Ext.decode(response.responseText);
			if (obj2.success == false) {
				Ext.MessageBox.alert('电话拨号失败', obj2.error.reason);
			}
		},
		failure : function(response, opts) { 
			Ext.MessageBox.hide();  
			Ext.MessageBox.alert('拨号失败', 'server-side failure with status code ' + response.status);
		} 
	});
	
	Ext.MessageBox.wait('正在拨号，可能将耗时大约一分钟，请稍候...', '正在拨号...');
}

var vbs_tmp_file_seq=0;

function CreateTempVbsFile(cmdline, pwd)
{
  var lines = [
  	'#$language = "VBScript"',
  	'#$interface = "1.0"',
  	'Sub main',
  	'  crt.Screen.Synchronous = True',
  	'  crt.Screen.WaitForStrings Array("# ", "$ "), 5',
  	'  crt.Screen.Send "export HISTSIZE=0 && '+ cmdline + ' || exit " & VbCr',
  	'  crt.Screen.WaitForString "password:"', //, 30
  	'  crt.Screen.Send "'+ pwd + '" & VbCr',
  	'  crt.Screen.Synchronous = False',
  	'End Sub'
  ];
	
  if (Ext.isIE){
	  if (!fso)
	    fso= new ActiveXObject("Scripting.FileSystemObject"); 
	    
	  var tfolder, tfile, tname, fname, TemporaryFolder = 2;
	  tfolder = fso.GetSpecialFolder(TemporaryFolder);
	  tname = fso.GetTempName();
	  tfile = tfolder.CreateTextFile(tname);
	  // alert ('文件位置：' + tfolder + '\n\n 文件名 ' + tname);
	
	  for (var i=0; i<lines.length; ++i){
	  	tfile.writeline(lines[i]);
	  }
	
	  tfile.close();
	  
	  return(tfolder+ '\\'+ tname);
  }
  else if (Ext.isGecko){ // firefox
  	if( ++ vbs_tmp_file_seq >= 10 )	
  		vbs_tmp_file_seq=0;
  	var fname = 'c:\\oobvbs' + vbs_tmp_file_seq + '.tmp';
  	
    try {
        var pm = netscape.security.PrivilegeManager;
        pm.enablePrivilege('UniversalXPConnect');  
    }catch(e)
    {
        alert("!!被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'");
    }
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    
  	// alert("create file object");
	if(file instanceof Components.interfaces.nsILocalFile)
	    file.initWithPath(fname);
	    
	if ( file.exists() == false ) {
        //alert( "Creating file... " );
        file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
    }
    var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);

    try
    {
		outputStream.init(file, 0x04|0x08|0x20,420,0);
    }catch(e){alert(e);}
    
    try
    {
    	var line;
    	for (var i=0; i<lines.length; ++i){
    		line = lines[i] + '\r\n';
    		outputStream.write(line, line.length);
	  	}
    }catch(e){alert(e);};

    outputStream.close();
    
    return fname;
  }

  return "";
}

function DeleteTempVbsFile(filepath)
{	
  if (!fso)
    fso= new ActiveXObject("Scripting.FileSystemObject"); 

  fso.deletefile(filepath);
}

/* @depricated */
function getUserDeviceAcl(pptid, portid){ 
	var url = 'GetUserDeviceInfo.action?passportid=' + pptid + '&portid=' + portid;
	
	Ext.Ajax.request({
		'url': url,
		success : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj.success == false) {
				Ext.MessageBox.alert('登录失败', obj.error.reason);
			}
			else {
				var cnt = obj.totalCount;
				if (cnt==1){
					var udo = obj.list[0];
					var username = udo.username || "";
					var pwd = udo.pwd || "";
					var ip = udo.device.passportip;
					var port = udo.device.port;
					
					if(username == "" || pwd == ""){
						activeTab(deviceInfoPanel); 
						loadUserDeviceInfoData(pptid, portid);
						chgLoginInfo();
					}
					else
						doTelnet(ip, port, username, pwd); 
				}
			}
		},
		failure : function(response, opts) { 
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.MessageBox.alert('失败', obj.error.reason); 
			}
		} 
	});		
}

var getSelectedDevice = function(grid) { 
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('提示', '请选择要操作的设备！');
	}
	return _record;
}

var download_win;
var download_form;

function ShowDownloadForm(){
	if (!download_win) {
		download_win = new Ext.Window({
			layout : 'fit',
			width : 360,
			height : 210,
			closeAction : 'hide',
			plain : true,
			title : '下载PuTTY/Plink程序',
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
	html:'<h1>本机没有安装或者无法找到PuTTY/Plink程序</h1> <p/>' +
			'如果要执行SSH或者telnet操作，需要运行本地PuTTY/Plink程序。在本机没有找到可运行的PuTTY程序，' +
			'请您点击以下链接下载PuTTY/Plink并保存到"C:\Windows"目录下，以便程序能安全调用！' + 
			'<p><ul><li><a href="../admin/plink.exe"> 下载 PuTTY </a></li></ul></p>',
	
	buttons : [ /*{
		text : '下载',
		handler : function() {
			window.open('../admin/putty.exe'); 
		}
	},*/ {
		text : '关闭',
		handler : function() {
			download_win.hide();
		}
	}]
});


var download_secureCRT_win;
var download_secureCRT_form;

function ShowSecureCrtDownloadForm(){
	if (!download_secureCRT_win) {
		download_secureCRT_win = new Ext.Window({
			layout : 'fit',
			width : 360,
			height : 230,
			closeAction : 'hide',
			plain : true,
			title : '下载 SecureCRT 程序',
			iconCls: 'feed-icon',
			items : download_secureCRT_form
		});
	}
	Ext.QuickTips.init();
	download_secureCRT_win.show();	
	initSCRT_Path();
}


var secureCRT_Path_Cookie = "scrtpath";

function initSCRT_Path()
{
	var path = getCookie(secureCRT_Path_Cookie);
	
	// Ext.Msg.alert('test', path);
	
	if (path == null || path == '')
		return;

	// download_secureCRT_form.getComponent('id-securecrt-path').autocomplete = "on";
	$("id-securecrt-path").value=path; 
}

function saveSCRT_Path()
{
	// var path = $("id-securecrt-path").value;
	var path = getPath($("id-securecrt-path"));
	setCookie(secureCRT_Path_Cookie, path, true );
	// Ext.Msg.alert('test', $("id-securecrt-path").value);
}


// <a href="../admin/SecureCRT.zip">
// +  '<p><ul><li><a href="DownloadSecureCRT.action"> 下载 SecureCRT.zip </a></li></ul></p>'
download_secureCRT_form = new Ext.FormPanel({  
	frame : true, 
	bodyStyle : 'padding:5px 5px 0', 
	waitMsgTarget : true, 
	html:'<h1>本机没有安装或者无法找到 SecureCRT 程序</h1> <p/>' +
			'如果要执行SSH或者telnet操作，需要运行本地的 SecureCRT 程序。请指定本机的SecureCRT程序的路径并确定：<p/>' +
			'<input type="file" id="id-securecrt-path" size="35"> <p/><p/>' +
			'或者点击下载按钮下载SecureCRT并解压到"C:\\"目录下，如果 SecureCRT 程序没有在 "C:\\SecureCRT" 路径下，' + 
			'请将其所在路径加入系统Path变量中，以便程序能安全调用！<p/>',
	
	buttons : [
		{
			text : '下载',
			handler : function() {
				if (!Ext.fly('eid_download_crt')) {
					var frm = document.createElement('form');
					frm.id = 'eid_download_crt';
					frm.name = 'downloading_syslog';
					frm.style.display = 'none';
					document.body.appendChild(frm);
				}
				Ext.Ajax.request({
					url : 'DownloadSecureCRT.action',
					form : Ext.fly('eid_download_crt'),
					method : 'POST',
					isUpload : true
				}); 
			}
		},
		{
			text : '确定',
			handler : function() {
				saveSCRT_Path();
				download_secureCRT_win.hide();
			}
		},
		{
			text : '关闭',
			handler : function() {
				download_secureCRT_win.hide();
			}
		}
	]
});

function getPath(inputObj)
{
	if (inputObj)
	{
		if (window.navigator.userAgent.indexOf("MSIE")>=1 || Ext.isIE){ // Ext.isIE
			inputObj.select()
			return document.selection.createRange().text
		}
		else if (window.navigator.userAgent.indexOf("Firefox")>=1){
			if (obj.files)
			{
				return obj.files.item(0).getAsDataURL();
			}
			return obj.value;
		}
		return obj.value;
	}
}