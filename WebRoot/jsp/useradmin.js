// Note that these are all defined as panel configs, rather than instantiated
// as panel objects. You could just as easily do this instead:
//
// var absolute = new Ext.Panel({ ... });
//
// However, by passing configs into the main container instead of objects, we
// can defer
// layout AND object instantiation until absolutely needed. Since most of these
// panels
// won't be shown by default until requested, this will save us some processing
// time up front when initially rendering the page.
//
// Since all of these configs are being added into a layout container, they are
// automatically assumed to be panel configs, and so the xtype of 'panel' is
// implicit. To define a config of some other type of component to be added into
// the layout, simply provide the appropriate xtype config explicitly.
//
// fake grid data used below in the tabsNestedLayouts config

// DateField重写
/*
 * Ext.override(Ext.form.DateField, { setValue : function(date) { if
 * (Ext.isEmpty(date)) { } else if (Ext.isEmpty(date.time)) { date = new
 * Date(date); } else { date = new Date(date.time); }
 * Ext.form.DateField.superclass.setValue.call(this,
 * this.formatDate(this.parseDate(date))); } });
 */ 

var myUserData = [[1, 'chengang', 'chengang', '陈罡', '9/1 12:00am'],
		[2, 'Johnson', 'Johnson', '乔森', '9/1 12:00am'],
		[3, 'yudan', 'yudan', '宇丹', '9/1 12:00am'],
		[4, 'dingjun', 'dingjun', '陈定军', '9/1 12:00am']];


//================ User Admin Pannel config =======================


// example of custom renderer function
function change(val) {
	if (val > 0) {
		return '<span style="color:green;">' + val + '</span>';
	} else if (val < 0) {
		return '<span style="color:red;">' + val + '</span>';
	}
	return val;
}

function fullname(val) {
	return '<span style="color:blue;">' + val + '</span>';
}

function formatJSONDate(jsonDate){
	var newDate = dateFormat(jsonDate, "mm/dd/yyyy");
	return newDate;
}

function lastlogin_date(val) {
	return formatJSONDate(new Date(val.time));
}

function renderDate(format) {
    return function(v) {
        var JsonDateValue;
        if (Ext.isEmpty(v))
            return '';
        else if (Ext.isEmpty(v.time))
            JsonDateValue = new Date(v);
        else
            JsonDateValue = new Date(v.time);
        return JsonDateValue.format(format || 'Y-m-d H:i:s');
    };
};

var userRecordDef = Ext.data.Record.create(
	[{ name : 'userid',  mapping : 'userid'  },// type :'int' 
	{ name : 'fullname', mapping : 'fullname' }, 
	{ name : 'createtime', mapping : 'createtime' }, 
	{ name : 'lastlogin', mapping : 'lastlogin' },
	{ name : 'groupname', mapping : 'groups.groupname' }
	]); 

var _jsonReader = new Ext.data.JsonReader({
			root : 'list',
			totalProperty : 'totalCount',
			id : 'userid',
			successProperty : 'success'
		}, userRecordDef );

var userds = new Ext.data.GroupingStore({
	proxy : new Ext.data.HttpProxy({
		url : 'UserAjaxJsonData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception 
		}
	}),
	reader : _jsonReader,

	sortInfo: { field: 'userid', direction: 'ASC'},
	groupField : 'groupname'
});

// userds.on('load', function (store, records, options) { ds_onload(store, records, options); });
// userds.setDefaultSort('userid', 'desc');

/*
 * userds.load( { params : { start :0, limit :30, forumId :4 } });
 */

// this is only for demo show
var userds2 = new Ext.data.ArrayStore({
	fields : [{
			name : 'userid'
		}, // name: 'userid', type: 'int'
		// {name: 'passwd'},
		{
			name : 'fullname'
		}, {
			name : 'lastlogin',
			type : 'date',
			dateFormat : 'n/j h:ia'
		}]
});
var gv_cfg = {};
Ext.apply(gv_cfg, cg_grid_groupingview_cfg);
gv_cfg.groupTextTpl = '{text} ({[values.rs.length]} {["人"]})';
gv_cfg.forceFit = false;

var showUsers = {
	id : 'user-admin-panel',
	// title: '用户管理',
	layout : 'border',
	items : [
			/*
			 * ** { region: 'south', // title: 'South', height: 75, maxSize:
			 * 150, // margins: '5 5 0 5', bodyStyle: 'padding:10px;', split:
			 * true // html: 'Some content' },
			 */
			{
		// A common mistake when adding grids to a layout is creating a panel first,
		// then adding the grid to it. GridPanel (xtype:'grid') is a Panel subclass,
		// so you can add it directly as an item into a container. Typically you will
		// want to specify layout:'fit' on GridPanels so that they'll size along with
		// their container and take up the available space.
		id : 'user-grid',
		region : 'center',
		// title: 'Nested Grid',
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // 载入遮罩动画
		store : userds,
		// view : new Ext.grid.GridView( cg_grid_view_cfg ),
		view : new Ext.grid.GroupingView( gv_cfg ),
		columns : [
			new Ext.grid.RowNumberer(),
			{ header : '组名', width :80, sortable : true, dataIndex : 'groupname' },
			{ id : 'userid', header : '登录名', width : 80, sortable : true, dataIndex : 'userid' }, 
			{ header : '姓名', width : 100, sortable : true, renderer : fullname, dataIndex : 'fullname' },
			{ id : 'createtime', header : '用户创建时间', width : 150, sortable : true, renderer : renderDate('Y-m-d H:i:s'), dataIndex : 'createtime' }, // renderer : Ext.util.Format.dateRenderer('m/d/Y h:ia'),
			{ id : 'id_lastlogin', header : '最近登录时间', width : 150, sortable : true, renderer : renderDate('Y-m-d H:i:s'), dataIndex : 'lastlogin' }
		],
		stripeRows : true,
		autoExpandColumn: 'id_lastlogin',

		// Add a listener to load the data only after the grid is rendered:
		listeners : {
			render : function() {
				// this.store.loadData(myUserData);
				this.store.load({ params : { start: 0, limit: 10}, callback : ds_callback });
			},
			rowdblclick : function(grid, index) {
				showSingleUser(grid, index);
			},
			/*rowcontextmenu : function (grid, rowIndex, e) {
				popupUserContextMenu(this, rowIndex, e);
			},*/
			contextmenu : function (e) {
				var rowIndex = this.view.findRowIndex(e.getTarget());   
				popupUserContextMenu(this, rowIndex, e);
				/*if (false !== rowIndex) {   
      				// 如果当前右键点击的是列表行，那么停止事件
      				e.stopEvent();   
    			} else{
    				popupUserContextMenu(this, rowIndex, e);
    			}*/			
			}
		},
		tbar : [{
				// xtype:'button',
				id : 'tool-bar-new-user',
				text : '添加用户',
				iconCls : 'user-add24',
				scale : 'large',
				handler : function() {
					addUserPrompt();
				}
			}, '-', {
				text : '修改用户',
				iconCls : 'user-mod24',
				scale : 'large',
				handler : function() {
					editUserPrompt();
				}
			}, '-', {
				text : '删除用户',
				iconCls : 'user-del24',
				scale : 'large',
				handler : function() {
					deleteUserPrompt();
				}
			}],
		// 添加分页工具栏
		bbar : new Ext.PagingToolbar({
			pageSize : 30,
			store : userds,
			displayInfo : true,
			displayMsg : '显示 {0}-{1}条 / 共 {2} 条',
			emptyMsg : "无数据。"
		})
	}]
};

var usergridContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '查看用户',
		    iconCls: 'user-mod16',
		    handler : function(e) { editUserPrompt(); }
	    },  {
		    text : '修改登陆密码',
		    iconCls: 'user-mod16',
		    handler: function(e) { changePassword(); }
	    },  {
		    text : '创建新用户',
		    iconCls: 'user-add16',
		    handler : function() { addUserPrompt(); }
	    },  {
		    text : '删除用户',
		    iconCls: 'user-del16',
		    handler: function(e) {　deleteUserPrompt(); }
	    }, '-', { 
		    text : '刷新',
		    iconCls: 'refresh-icon',
		    handler: function(e) {　userds.reload(); }
	    }]
	});

 function popupUserContextMenu(grid, rowIndex, e){
	e.preventDefault();
	grid.getSelectionModel().selectRow(rowIndex);
	usergridContextMenu.showAt(e.getXY());
};

// 新增用户
// ===================================================================================

var addUserPrompt = function() {
	AddUserForm();
}


var ua_group_jr = group_jsonReader;  // references group_setting.js
var ua_group_ds = groupds;　// references group_setting.js

// create the combo for adding user form
var comboGroupAdd = new Ext.form.ComboBox({
    typeAhead: true,
    triggerAction: 'all',
    forceSelection: true,
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'组别',
	name : 'user.groups.groupname',
    store: ua_group_ds,
    allowBlank : false,
    valueField: 'groupid',
    displayField: 'groupname',
    loadingText : '加载中...'
});

// create the combo instance for editing user form
var comboGroup = new Ext.form.ComboBox({
    typeAhead: true,
    forceSelection: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'组别',
	name : 'user2.groups.groupname',
    store: ua_group_ds,
    allowBlank : false,
    valueField: 'groupid',
    displayField: 'groupname',
    loadingText : '加载中...'
});

var statusArrayStore = new Ext.data.ArrayStore({
        id: 0,
        fields: [
            'status',
            'displayText'
        ],
        data: [[0, '新用户'], [1, '正常'], [2, '密码过期'], [3, '锁定']]
    });

/*
// create the combo for adding user form
var comboUserStatusAdd = new Ext.form.ComboBox({
    typeAhead: true,
    triggerAction: 'all',
    forceSelection: true,
    lazyRender:true,
    mode: 'local', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'状态',
	name : 'user.status',
    store: statusArrayStore,
    allowBlank : false,
    valueField: 'status',
    displayField: 'displayText',
    loadingText : '加载中...'
}); */ 

// create the combo instance for editing user form
var comboUserStatus = new Ext.form.ComboBox({
    typeAhead: true,
    forceSelection: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'local', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'状态',
	name : 'user2.status',
    store: statusArrayStore,
    allowBlank : false,
    valueField: 'status',
    displayField: 'displayText',
    loadingText : '加载中...'
});


add_user_form = new Ext.FormPanel({ 
	labelWidth : 75, 
	url : 'AddUser.action',
	// frame : true, 
	region : 'center',
	bodyStyle : 'padding:5px 5px 0',
	// width : 350,
	waitMsgTarget : true, 
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [ {
			fieldLabel : '登录名',
			id:'add_user_form_userid',
			name : 'user.userid',
			maxLength: 16,
			allowBlank : false
		}, {
			fieldLabel : '用户姓名',
			id:'add_user_form_fullname',
			name : 'user.fullname',
			allowBlank : false
		}, 
		comboGroupAdd, 
		{
			fieldLabel : '密码',
			id:'add_user_form_password1',
            inputType:'password', 
			name : 'user.passwd',
			allowBlank : false
		}, {
			fieldLabel : '确认密码',
			id:'add_user_form_password2',
            inputType:'password', 
			name : 'password2',
			allowBlank : false
		}] 
});


var add_user_tab = new Ext.TabPanel({
	activeTab: 0,
    margins: '0 0 0 0',
    border: false,
    deferredRender: true, //cg: set true to defer the tab rendering when it is activated.
	region : 'center',
    items: [
    {
        title: '一般信息',
        iconCls: 'user-icon',
    	frame : true,
    	layout:'fit',
	    bodyStyle : 'padding:5px 5px 0',
        items : [add_user_form]
    },/*{
        title: '所属组',
        iconCls: 'group-icon',
    	frame : true,
    	layout:'fit',
        items: [usersGroupTab]
    },{
        title: '拥有应急通道设备',
        iconCls: 'feed-icon',
    	frame : true,
    	layout:'fit',
        items: [addUserPassportTab]
    },*/{
        title: '拥有设备',
        iconCls: 'feed-icon',
    	frame : true,
    	layout:'fit',
        items: [addUserDeviceTab]
    }]
});

var add_user_win;
var AddUserForm = function() {
	// create the window on the first click and reuse on subsequent clicks
	if (!add_user_win) {
		add_user_win = new Ext.Window({
			// el : 'topic-win',
			layout : 'fit',
			width : 400,
			height : 300,
			closeAction : 'hide',
			plain : true,
			title : '添加用户',
			iconCls: 'user-icon',
			items : add_user_tab,
			buttons: 
			[{
				text : '保存',
				handler : addUserHandler
			}, {
				text : '取消',
				handler : function() { 	add_user_win.hide(); }
			}]
		});
		add_user_win.doLayout();
	}
	add_user_form.getForm().reset();
	add_user_win.show('tool-bar-new-user');
}

function addUserHandler(btn, event)
{
	if (!add_user_form.form.isValid()) {
		Ext.Msg.alert('信息', '请填写完成再提交!');
		return;
	}
	
	var pwd1 = Ext.getCmp('add_user_form_password1').getValue();
	var pwd2 = Ext.getCmp('add_user_form_password2').getValue();

	if (pwd1 != pwd2){
		Ext.MessageBox.alert("输入错误", "确认密码与密码不一致！请重试。");
		return;
	}
	var pwd = pwd1; // hex_md5(pwd1); 
	
	var groupid = comboGroupAdd.getValue();
	
	/*
	var groupData = "";
	var groupgrid = Ext.getCmp('user-group-setting-grid');
	var ds = groupgrid.getStore();
	var _record = groupgrid.getSelectionModel().getSelected();
	if (_record)
	{
		var m = groupgrid.getSelectionModel().getSelections();
		
		for (var i = 0, len = m.length; i < len; i++) {
			var ss = m[i].get("groupid");
			if (i == 0) {
				groupData = groupData + ss;
			} else {
				groupData = groupData + "," + ss;
			} 
		}
	}*/

	//=======================================================
	/*var passportData = "";
	var passportgrid = Ext.getCmp('user-passport-setting-grid');
	var ds = passportgrid.getStore();
	var _record = passportgrid.getSelectionModel().getSelected();
	if (_record)
	{
		var m = passportgrid.getSelectionModel().getSelections();
		
		for (var i = 0, len = m.length; i < len; i++) {
			var ss = m[i].get("passportid");
			if (i == 0) {
				passportData = passportData + ss;
			} else {
				passportData = passportData + "," + ss;
			} 
		}
	}*/
	//============================================================
	var deviceData = "";
	var devicegrid = Ext.getCmp('user-device-setting-grid');
	var ds = devicegrid.getStore();
	var _record = devicegrid.getSelectionModel().getSelected();
	if (_record)
	{
		var m = devicegrid.getSelectionModel().getSelections();
		
		var pptid;
		var portid;
		var ss;
		for (var i = 0, len = m.length; i < len; i++) {
			pptid = m[i].get("passportid");
			portid =  m[i].get("portid");
			ss = pptid + ':' + portid;
			if (i == 0) {
				deviceData = deviceData + ss;
			} else {
				deviceData = deviceData + "," + ss;
			} 
		}
	}
	
	Ext.Ajax.request({
		url: 'AddUser.action',
		success: function(from, action) {
			// Ext.MessageBox.alert('保存成功',
			// '添加用户成功！');
			userds.load({
				params : {
					start : 0,
					limit : 30 
				}
			});
		},
		failure : function(form, action) {
			Ext.MessageBox.alert('保存失败', '添加用户失败！');
		},
		// waitMsg : '正在保存数据，请稍候...',
		params: { 
			'user.userid'   : add_user_form.findById('add_user_form_userid').getEl().getValue(),
			'user.fullname' : add_user_form.findById('add_user_form_fullname').getEl().getValue(),
			'user.passwd' : pwd,
			'user.groups.groupid' : groupid,
			// groupIDs : groupData,
			// passportIDs : passportData,
			deviceIDs : deviceData
		} 
	});
	
	add_user_win.hide();
}

// 查看、修改用户
//========================================================================================

var edit_user_form;
var edit_user_win;

function convertDate(v)
{
    var JsonDateValue;
    if (Ext.isEmpty(v))
        return '';
    else if (Ext.isEmpty(v.time))
        JsonDateValue = new Date(v);
    else
        JsonDateValue = new Date(v.time);
    return JsonDateValue.format('Y-m-d H:i:s');
}

var user_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'userid',
		successProperty :'success'
	}, 
	[ { name :'user2.userid', mapping :'userid'   },// type :'int' }, {
	{ name :'user2.fullname', mapping :'fullname' }, 
	{ name :'user2.groups.groupname', mapping :'groups.groupname' } , 
	{ name :'user2.createtime', mapping :'createtime', convert: renderDate('Y-m-d H:i:s') },  // function(v){ format('Y-m-d H:i:s');}
	{ name :'user2.lastlogin', mapping :'lastlogin',   convert: renderDate('Y-m-d H:i:s') },  
	{ name :'user2.status', mapping :'status' },  
	{ name :'user2.passwd', mapping :'password' } , 
	{ name :'user2.passwd2', mapping :'password2' }
   ]
);


edit_user_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0, // 标签与字段录入框之间的空白
	url : 'UpdateUser.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 380,
	waitMsgTarget : true,
	reader :user_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
			fieldLabel : '登录名',
			id : 'user_edit_userid',
			name : 'user2.userid',
			readOnly : true,
			allowBlank : false
		}, {
			fieldLabel : '用户姓名',
			id : 'user_edit_user_fullname',
			name : 'user2.fullname',
			allowBlank : false
		},
		comboGroup,
		{
			// fieldType : 'datefield',
			fieldLabel : '创建日期',
			name : 'user2.createtime', 
			readOnly : true,
			allowBlank : true
		}, {
			// fieldType : 'datefield',
			fieldLabel : '最近登陆时间',
			name : 'user2.lastlogin',
			// anchor: '80%',
			readOnly : true,
			allowBlank : true
		},
		comboUserStatus
			/*{
			// fieldType : 'datefield',
			fieldLabel : '状态',
			id : 'user_edit_user_status',
			name : 'user2.status',
			// anchor: '80%',
			readOnly : false,
			allowBlank : false
		}*/ ]
});

var edit_user_tab = new Ext.TabPanel({
	activeTab: 0,
    margins: '0 0 0 0',
    border: false,
    deferredRender: true,
	region : 'center',
    items: [
    {
        title: '一般信息',
        iconCls: 'user-icon',
    	frame : true,
    	layout:'fit',
	    bodyStyle : 'padding:5px 5px 0',
        items : [edit_user_form]//
    },/*{
        title: '所属组',
        iconCls: 'group-icon',
        id: 'edit_user_tabs_group_tab',
    	frame : true,
    	layout:'fit',
        items: [editUsersGroupTab]
    },{
        title: '拥有应急通道设备',
        iconCls: 'feed-icon',
        id: 'edit_user_tabs_passport_tab',
    	frame : true,
    	layout:'fit',
        items: [editUserPassportPanel]
    },*/{
        title: '拥有设备',
        iconCls: 'feed-icon',
        id: 'edit_user_tabs_device_tab',
    	frame : true,
    	layout:'fit',
        items: [editUserDevicePanel]
    }]
});

var editUserPrompt = function() {
	loadUserDetail(Ext.getCmp('user-grid'));
}

function showSingleUser(grid, index) {
	loadUserDetail(grid, index);
}

var loadUserDetail = function(grid, index) {
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('修改操作', '请选择要修改的一项！');
		return;
	} 
	
	ShowUserForm();

	edit_user_form.form.load({
		url : 'LoadUser.action?user.userid=' + _record.get('userid'),
		waitMsg : '正在载入数据...',

		failure : function(form, action) {
			var obj = Ext.util.JSON.decode(action.response.responseText);
			Ext.Msg.alert('编辑', '载入数据失败' + obj.error.reason); 
		}
	}); 

	//CG if (edit_user_tab.getItem('edit_user_tabs_passport_tab').rendered)
	//CG	loadUserPassport();

	//CG if (edit_user_tab.getItem('edit_user_tabs_group_tab').rendered)
	//CG	loadUserGroup();

	if (edit_user_tab.getItem('edit_user_tabs_device_tab').rendered)
		loadUserDevice();
}

var ShowUserForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!edit_user_win) {
		edit_user_win = new Ext.Window({
			//el : 'topic-win',
			layout : 'fit',
			width : 400,
			height : 300,
			closeAction : 'hide',
			plain : true,
			title : '修改用户',
			iconCls: 'user-icon',
			items : edit_user_tab,
			buttons: 
			[{
				text : '保存',
				handler : editUserHandler
			}, {
				text : '取消',
				handler : function() { 	edit_user_win.hide();}
			}]
		});
	}
	edit_user_win.show('tool-bar-new-user');
}

function editUserHandler(btn, event)
{
	if (!edit_user_form.form.isValid()) {
		Ext.Msg.alert('信息', '请填写完成再提交!');
		return;
	}
	var groupname = comboGroup.getEl().getValue();  // groupid = comboGroup.getValue() may not function well here.
	var statusDisplay = comboUserStatus.getEl().getValue();
	var store = comboUserStatus.store;
	var userstatus=0;
	var hasDeviceData = 0;
	for (var i=0; i<store.getTotalCount(); i++){
		 if ( statusDisplay == store.getAt(i).get("displayText")){
		 	userstatus=i;
		 }
	}
/*	var groupData = "";
	var passportData = "";
	var groupgrid = Ext.getCmp('user-group-edit-grid');
	var ds = groupgrid.getStore();
	var _record = groupgrid.getSelectionModel().getSelected();
	if (_record)
	{
		var m = groupgrid.getSelectionModel().getSelections();
		
		for (var i = 0, len = m.length; i < len; i++) {
			var ss = m[i].get("groupid");
			if (i == 0) {
				groupData = groupData + ss;
			} else {
				groupData = groupData + "," + ss;
			} 
		}
	}

	//=============================================================
	// var passportData = "";
	var passportgrid = Ext.getCmp('user-passport-edit-grid');
	var ds = passportgrid.getStore();
	var _record = passportgrid.getSelectionModel().getSelected();
	if (_record)
	{
		var m = passportgrid.getSelectionModel().getSelections();
		
		for (var i = 0, len = m.length; i < len; i++) {
			var ss = m[i].get("passportid");
			if (i == 0) {
				passportData = passportData + ss;
			} else {
				passportData = passportData + "," + ss;
			} 
		}
	}*/
	//============================================================
	var deviceData = "";
	var devicegrid = Ext.getCmp('user-device-edit-grid');
	var ds = devicegrid.getStore();
	if (ds.getCount() > 0) {
		hasDeviceData = 1;
		var _record = devicegrid.getSelectionModel().getSelected();
		if (_record)
		{
			var m = devicegrid.getSelectionModel().getSelections();
			
			//var pptid;
			//var portid;
			var idid;
			for (var i = 0, len = m.length; i < len; i++) {
				// pptid = m[i].get("passportid");
				// portid =  m[i].get("portid");
				idid = m[i].get("id_id");
				if (i == 0) {
					deviceData = deviceData + idid;
				} else {
					deviceData = deviceData + "," + idid;
				} 
			}
		}
	}
	
	Ext.Ajax.request({
		url: 'UpdateUser.action',
		success: function(resp, opt) {
			// '保存成功',
			userds.load();
		},
		failure : function(resp, opt) {
			Ext.Msg.alert('保存失败', '修改用户失败！' + 'server-side status code: ' + resp.status);
		},
		timeout : 240000, // The timeout in milliseconds to be used for requests. (defaults to 30000)
		// waitMsg : '正在保存数据，请稍候...',
		params: { 
			'user2.userid'   : edit_user_form.findById('user_edit_userid').getEl().getValue(),
			'user2.fullname' : edit_user_form.findById('user_edit_user_fullname').getEl().getValue(),
			'user2.status' : userstatus,
			'user2.groups.groupname' : groupname,
			// groupIDs : groupData,
			// passportIDs : passportData,
			'hasDeviceData' : hasDeviceData,
			deviceIDs : deviceData
		} 
	});
	
	edit_user_win.hide();
};

// ==================================================================================  
// Delete User

var deleteUserPrompt = function() {
	var grid = Ext.getCmp('user-grid');
	var ds = grid.getStore();
	var _record = grid.getSelectionModel().getSelected();
	if (_record) {
		var m = grid.getSelectionModel().getSelections();
		if ( m.length > 1 ){
			Ext.Msg.alert('删除用户', '请选择一个需要删除的用户！');
			return;
		}
		else if ( m.length == 1 )
			Ext.MessageBox.confirm('确认删除', '你确认要删除所选的用户吗？', function(btn) {
				if (btn == "yes") {
					doDeleteUser(ds, m[0]);
				}			
			});
	}
	else {
		Ext.MessageBox.alert('删除用户', '请选择要删除的用户！');
	}
}

function doDeleteUser(ds, select) {
	
	var userid = select.get("userid");
	var myparm = {
		'user.userid' : userid
	}
	
	if ( userid == 'root' ) {
		Ext.Msg.alert('删除失败','不能删除 root 用户');
		return;
	}

	Ext.Ajax.request({
		url : 'RemoveUser.action',
		timeout : 120000,
		params : myparm,

		success : function(response, opts) {
			Ext.Msg.hide(); 
			var obj = Ext.decode(response.responseText);
			if (obj && obj.success == true)
			{
				Ext.Msg.alert('成功', '您已成功删除用户');
				ds.remove(select); // cg	
				ds.load();
			}
			else
				Ext.Msg.alert('删除用户失败', '原因: ' + obj.error.reason);
		},
		failure : function(response, opts) {
			Ext.Msg.hide();  
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.Msg.alert('删除用户失败', '原因: ' + obj.error.reason);
			}
		}
	}); 
	
	Ext.Msg.wait('删除用户需要同步其所拥有操作权限的各个应急通道设备，可能将耗时几分钟，请稍候...', '正在删除用户, 请稍候......');
}

//=======================================================================
　
// change password 

var changePassword = function() {
	var grid = Ext.getCmp('user-grid');
	
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('修改操作', '请选择要修改的一项！');
		return;
	} 
	
	ShowPasswordChangeForm();

	chg_pwd_form.form.reset();
	chg_pwd_form.form.load({
		url : 'LoadUser.action?user.userid=' + _record.get('userid'),
		waitMsg : '正在载入数据...',

		failure : function() {
			Ext.MessageBox.alert('编辑', '载入数据失败');
		}
	}); 
}

var chg_pwd_win;
var chg_pwd_form;

var ShowPasswordChangeForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!chg_pwd_win) {
		chg_pwd_win = new Ext.Window({
			//el : 'topic-win',
			layout : 'fit',
			width : 400,
			height : 220,
			closeAction : 'hide',
			plain : true,
			title : '修改密码',
			iconCls: 'feed-icon',
			items : chg_pwd_form
		});
	}
	chg_pwd_win.show('tool-bar-new-user');
};


var pwd_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'userid',
		successProperty :'success'
	}, [ {
		name :'user3.userid',
		mapping :'userid'   // type :'int'
	}, {
		name :'user3.fullname',
		mapping :'fullname'
	}
   ]
);

chg_pwd_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // 标签与字段录入框之间的空白
	url : 'ChangePassword.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 380,
	waitMsgTarget : true,
	reader :pwd_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
			fieldLabel : '登录名',
			id : 'chg_pwd_userid',
			name : 'user3.userid',
			readOnly : true,
			allowBlank : false
		}, {
			fieldLabel : '用户姓名',
			name : 'user3.fullname',
			readOnly : true,
			allowBlank : false
		},{
			fieldLabel : '新密码',
			id:'chg_pwd_password1',
            inputType:'password', 
			name : 'user3.passwd',
			allowBlank : false
		}, {
			fieldLabel : '确认新密码',
			id:'chg_pwd_password2',
            inputType:'password', 
			name : 'password3',
			allowBlank : false
		}],

	buttons : [{
		text : '保存',
		type : 'submit',
		disabled : false,
		handler : doChgPwd }, {
		text : '取消',
		handler : function() {
			chg_pwd_win.hide();
		}
	}],
	keys : [ { key:[10, 13], fn: doChgPwd} ]
});

function doChgPwd() {
	
	if (!chg_pwd_form.form.isValid()) {
		Ext.Msg.alert('提示', '请填写完成再提交!');
		return;
	}
	
	var uid = chg_pwd_form.findById('chg_pwd_userid').getEl().getValue();
	var pwd1 = Ext.getCmp('chg_pwd_password1').getValue();
	var pwd2 = Ext.getCmp('chg_pwd_password2').getValue();

	if (pwd1 != pwd2){
		Ext.MessageBox.alert("输入错误", "确认密码与密码不一致！请重试。");
		return;
	}
	var pwd = pwd1; // hex_md5(pwd1); 
	
	Ext.Ajax.request({
		url: 'AdminChgPwd.action',
		success : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj && obj.success == true)
			{
				chg_pwd_win.hide();
				Ext.Msg.alert('成功', '成功修改密码！');
			}			
			else
				Ext.Msg.alert('修改密码失败', '原因: ' + obj.error.reason);
		},
		failure : function(form, action) {
			Ext.MessageBox.alert('失败', '修改密码失败，请重试！');
		},
		params: { 
			'user.userid'   : uid,
			'user.passwd' : pwd
		} 
	});	
}
 
//
// ================ FitLayout config =======================
//
var fit = {
	id : 'fit-panel',
	title : 'Fit Layout',
	layout : 'fit',
	items : {
		title : 'Inner Panel',
		html : '<p>This panel is fit within its container.</p>',
		bodyStyle : 'margin:15px',
		border : false
	}
};

/*
 * ================ FormLayout config =======================
 */
// NOTE: While you can create a basic Panel with layout:'form', practically
// you should usually use a FormPanel to also get its form-specific
// functionality.
// Note that the layout config is not required on FormPanels.
var form = {
	xtype : 'form', // since we are not using the default 'panel' xtype, we must
					// specify it
	id : 'form-panel',
	labelWidth : 75,
	title : 'Form Layout',
	bodyStyle : 'padding:15px',
	width : 350,
	labelPad : 20,
	layoutConfig : {
		labelSeparator : ''
	},
	defaults : {
		width : 230,
		msgTarget : 'side'
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : 'First Name',
				name : 'first',
				allowBlank : false
			}, {
				fieldLabel : 'Last Name',
				name : 'last'
			}, {
				fieldLabel : 'Company',
				name : 'company'
			}, {
				fieldLabel : 'Email',
				name : 'email',
				vtype : 'email'
			}],
	buttons : [{
				text : 'Save'
			}, {
				text : 'Cancel'
			}]
};

/*
 * ================ TableLayout config =======================
 */
var table = {
	id : 'table-panel',
	title : 'Table Layout',
	layout : 'table',
	layoutConfig : {
		columns : 4
	},
	defaults : {
		bodyStyle : 'padding:15px 20px'
	},
	items : [{
		title : 'Lots of Spanning',
		html : '<p>Row spanning.</p><br /><p>Row spanning.</p><br /><p>Row spanning.</p><br /><p>Row spanning.</p><br /><p>Row spanning.</p><br /><p>Row spanning.</p>',
		rowspan : 3
	}, {
		title : 'Basic Table Cell',
		html : '<p>Basic panel in a table cell.</p>',
		cellId : 'basic-cell',
		cellCls : 'custom-cls'
	}, {
		html : '<p>Plain panel</p>'
	}, {
		title : 'Another Cell',
		html : '<p>Row spanning.</p><br /><p>Row spanning.</p><br /><p>Row spanning.</p><br /><p>Row spanning.</p>',
		width : 300,
		rowspan : 2
	}, {
		html : 'Plain cell spanning two columns',
		colspan : 2
	}, {
		title : 'More Column Spanning',
		html : '<p>Spanning three columns.</p>',
		colspan : 3
	}, {
		title : 'Spanning All Columns',
		html : '<p>Spanning all columns.</p>',
		colspan : 4
	}]
};


