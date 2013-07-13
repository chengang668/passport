
var passport_form;
var passport_win;

/*
 * ================   Passport Admin Pannel config  =======================
 */

/*
 * {success:true,totalCount : 1, list:
 * [{"site":{"sitename":"上海","address":"上海","siteid":1},
 *   "givenname":"givenname",
 *   "owner":"Chen Gang",
 *   "hostname":"hostname",
 *   "passportid":1,
 *   "dept":{"deptid":1,"upperdeptid":0,"deptname":"基础网络部"},
 *   "ip":"192.168.0.11"}]}
 */

function getDeptname(v) { 
    if (Ext.isEmpty(v))
        return '';
    else if (!Ext.isEmpty(v.deptname))
        return v.deptname;
    else
        return '';
};

function getSitename(v)
{
    if (Ext.isEmpty(v))
        return '';
    else if (!Ext.isEmpty(v.sitename))
        return v.sitename;
    else
        return '';
}

var passport_jsonReader = new Ext.data.JsonReader({
		root : 'list',
		totalProperty : 'totalCount',
		id : 'passportid',
		successProperty : '@success'
	}, [{ name : 'passportid', mapping : 'passportid' /* type :'int' */ }, 
		{ name : 'ip', mapping : 'ip' },  
		{ name : 'givenname', mapping : 'givenname' },
		{ name : 'owner',  mapping : 'owner' }, 
		//{ name : 'deptname', mapping : 'dept.deptname' }, 
		{ name : 'deptname', mapping : 'dept', convert:getDeptname }, 
		//{ name : 'sitename', mapping : 'site.sitename' }
		{ name : 'sitename', mapping : 'site', convert:getSitename },
		{ name : 'rootpwd', mapping : 'rootpwd' },
		{ name : 'pppnumber', mapping : 'pppnumber' }
		]);

var passportds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({
		url : 'passportData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		}
	}),
	//
	reader : passport_jsonReader
});
// passportds.setDefaultSort('passportid', 'desc');

/*
 * passportds.load( { params : { start :0, limit :30, forumId :4 } });
 */

var showPassports = {
	id : 'passport-setting-panel',
	layout : 'border',
	items : [
	{
		id : 'passport-grid',
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // 载入遮罩动画
		store : passportds,
		view : cg_grid_view,
		columns : [{
				id : 'passportid',
				header : '编号',
				width : 50,
				sortable : true,
				dataIndex : 'passportid'
			}, {
				header : 'IP 地址',
				width : 100,
				sortable : true,
				dataIndex : 'ip'
			}, {
				id : 'givenname',
				header : '设备别名',
				width : 150,
				sortable : true,  
				dataIndex : 'givenname'
			}, {
				id : 'owner',
				header : '负责人',
				width : 150,
				sortable : true,  
				dataIndex : 'owner'
			}, {
				id : 'deptname',
				header : '所属部门',
				width : 150,
				sortable : true,  
				dataIndex : 'deptname'
			}, {
				id : 'sitename',
				header : '所在机房',
				width : 150,
				sortable : true,  
				dataIndex : 'sitename'
			}, {
				id : 'pppnumber',
				header : 'PPP电话号码',
				width : 150,
				sortable : true,  
				dataIndex : 'pppnumber'
			} ],
		stripeRows : true,
		autoExpandColumn: 'sitename',

		// Add a listener to load the data only after the grid is rendered:
		listeners : {
			render : function() {
				// this.store.loadData(myPassportData);
				this.store.load();
			},
			rowdblclick : function(grid, index) {
				showSinglePassport(grid, index);
			},
			/*rowcontextmenu : function (grid, rowIndex, e) {
				popupPassportContextMenu(this, rowIndex, e);
			},*/
			contextmenu : function (e) {
				var rowIndex = this.view.findRowIndex(e.getTarget());   
				popupPassportContextMenu(this, rowIndex, e);
				/*if (false !== rowIndex) {   
      				// 如果当前右键点击的是列表行，那么停止事件   
      				e.stopEvent();   
    			} else{
    				popupPassportContextMenu(this, rowIndex, e);
    			}*/    			
			}
		},
		tbar : [{
				// xtype:'button',
				id : 'tool-bar-new-passport',
				text : '添加应急通道',
				iconCls : 'user-add24',
				scale : 'large',
				handler : function() {
					addPassportPrompt();
				}
			}, {
				text : '修改应急通道',
				iconCls : 'user-mod24',
				scale : 'large',
				handler : function() {
					editPassportPrompt();
				}
			}, {
				text : '删除应急通道',
				iconCls : 'user-del24',
				scale : 'large',
				handler : function() {
					deletePassportPrompt();
				}
			}, '-', {
				text : '高级功能配置',
				iconCls : 'telnet-ssh32',
				scale : 'large',
				handler : function() {
					openDirectWebSession();
				}
			}],
		// 添加分页工具栏
		bbar : new Ext.PagingToolbar({
			pageSize : 30,
			store : passportds,
			displayInfo : true,
			displayMsg : '显示 {0}-{1}条 / 共 {2} 条',
			emptyMsg : "无数据。"
		})
	}]
};

var passportContextMenu = new Ext.menu.Menu( {
	items : [ 
	    {	text : '端口配置',
		    iconCls: 'settings',
		    handler: function(e) {　goPortSetting(); }},
	    {
		    text : '高级功能配置',
		    iconCls: 'telnet-ssh16',
		    handler: function(e) {　openDirectWebSession(); }
	    },'-',{
		    text : '电话拨号连接',
		    iconCls: 'phone-set',
		    handler: function(e) {　openDialupConnection(); }
	    },{
		    text : '断开电话拨号连接',
		    iconCls: 'phone-down',
		    handler: function(e) {　closeDialupConnection(); }
	    },'-',{
		    text : '查看应急通道设备',
		    iconCls: 'user-mod16',
		    handler : function(e) { editPassportPrompt(); }
	    },{
		    text : '添加应急通道设备',
		    iconCls: 'user-add16',
		    handler : function() { addPassportPrompt(); }
	    }, {
		    text : '删除应急通道设备',
		    iconCls: 'user-del16',
		    handler: function(e) {　deletePassportPrompt(); }
	    }]
	});

 function popupPassportContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	passportContextMenu.showAt(e.getXY());
	grid.getSelectionModel().selectRow(rowIndex);
};


/* 新增Passport设备
 * ===================================================================================
 */

var ppt_site_jR = site_jsonReader;
var ppt_site_ds = siteds;

var ppt_dept_jr = dept_jsonReader;
var ppt_dept_ds = deptds;

// create the combo for site and dept
var comboSiteAdd = new Ext.form.ComboBox({
    typeAhead: true,
    triggerAction: 'all',
    forceSelection: true,
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'所在机房',
	name : 'passport.site.sitename',
    store: ppt_site_ds,
    valueField: 'siteid',
    displayField: 'sitename',
    loadingText : '加载中...'
});

var comboDeptAdd = new Ext.form.ComboBox({
    typeAhead: true,
    forceSelection: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'所属部门',
    name : 'passport.dept.deptname',
    store: ppt_dept_ds,
    valueField: 'deptid',
    displayField: 'deptname',
    loadingText : '加载中...'
});


add_passport_form = new Ext.FormPanel({
	// collapsible : true,// 是否可以展开
	labelWidth : 90,  
	url : 'AddPassport.action',
	frame : true,
	// title : '添加Passport设备',
	bodyStyle : 'padding:5px 5px 0',
	//width : 350,
	timeout : 120000,
	waitMsgTarget : true,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
			fieldLabel : 'IP地址',
			id:'add_passport_ip_address', 
			name : 'passport.ip',
			allowBlank : false
		}, {
			fieldLabel : '别名',
			name : 'passport.givenname',
			allowBlank : true
		}, {
			fieldLabel : '负责人',
			name : 'passport.owner',
			allowBlank : true
		}, 
		comboDeptAdd,
		comboSiteAdd
			/* {
				fieldLabel : '所属部门',
				name : 'passport.dept.deptname',
				allowBlank : true
			}, {
				fieldLabel : '所在机房',
				name : 'passport.site.sitename',
				allowBlank : true
			} */, {
			fieldLabel : 'root密码',
			name : 'passport.rootpwd',
            inputType:'password', 
			allowBlank : true
		}, {
			fieldLabel : 'PPP电话号码',
			name : 'passport.pppnumber',
			allowBlank : true
		} ],

	buttons : [{
		text : '保存', 
		handler : function() {
			if (add_passport_form.form.isValid()) {
				add_passport_form.getForm().submit({
					url : 'AddPassport.action',
					timeout : 240000, // The timeout in milliseconds to be used for requests. (defaults to 30000),
					waitTitle : '正在验证',
					success : function(from, action) {
						Ext.MessageBox.hide();
						// Ext.MessageBox.alert('添加成功', '添加应急通道设备成功！');
						passportds.load({
							params : {
								start : 0,
								limit : 30,
								forumId : 4
							}
						});
					},
					failure : function(form, action) {
						Ext.MessageBox.hide();
						var obj = Ext.decode(action.response.responseText);
						Ext.MessageBox.alert('添加失败', '添加应急通道设备失败！' + obj.error.reason);
					}
				});
				
				add_passport_win.hide();
				Ext.MessageBox.wait('正在验证、初始化应急通道设备，将可能耗时1分钟，请稍候...', '操作中...');
			} else {
				Ext.Msg.alert('信息', '请填写完成再提交!');
			}
		}
	}, {
		text : '取消',
		handler : function() {
			add_passport_win.hide();
		}
	}]
}); 

var addPassportPrompt = function() {
	AddPassportForm();
}

var add_passport_win;
var AddPassportForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!add_passport_win) 
	{
		add_passport_win = new Ext.Window({
			layout : 'fit',
			width : 400,
			height : 300,
			closeAction : 'hide',
			plain : true,
			title : '添加应急通道设备',
			iconCls: 'feed-icon',
			items : add_passport_form
		});
	}
	add_passport_win.show('tool-bar-new-passport');
}

/* 查看、修改Passport设备
 * ========================================================================================
 */

var get_passport_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'passportid',
		successProperty :'@success'
	}, 
	[{ 	name :'passport2.passportid', 	mapping :'passportid' }, 
	 {	name :'passport2.ip',    		mapping :'ip' }, 
	 {	name :'passport2.givenname',	mapping :'givenname' },
	 {	name :'passport2.owner',		mapping :'owner' },
	 {	name :'passport2.rootpwd',		mapping :'rootpwd' },
	 {	name :'passport2.pppnumber',		mapping :'pppnumber' },
	 {	name :'passport2.dept.deptname',	mapping : 'dept', convert:getDeptname },
	 {	name :'passport2.site.sitename',	mapping : 'site', convert:getSitename }
	]
);


// create the combo instance
var comboSite = new Ext.form.ComboBox({
    typeAhead: true,
    forceSelection: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'所在机房',
	name : 'passport2.site.sitename',
    store: ppt_site_ds,
    valueField: 'siteid',
    displayField: 'sitename',
    loadingText : '加载中...'
});

var comboDept = new Ext.form.ComboBox({
    typeAhead: true,
    forceSelection: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'所属部门',
    name : 'passport2.dept.deptname',
    store: ppt_dept_ds,
    valueField: 'deptid',
    displayField: 'deptname',
    loadingText : '加载中...'
});


passport_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // 标签与字段录入框之间的空白
	url : 'UpdatePassport.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 400,
	waitMsgTarget : true,
	reader :get_passport_jsonFormReader,
	defaults : {
		width : 260
	},
	defaultType : 'textfield',
	items : [ {
			fieldLabel : '标识',
			name : 'passport2.passportid',
			allowBlank : false,
			hidden : true, //CG 
			hideLabel:true, //CG
			readOnly : true
		}, 
		{　
			fieldLabel : 'IP地址',
			name : 'passport2.ip', 
			allowBlank : false
		}, {
			fieldLabel : '别名',
			name : 'passport2.givenname',
			allowBlank : true
		}, {
			fieldLabel : '负责人',
			name : 'passport2.owner',
			allowBlank : true
		}, 
		comboDept,
		comboSite
			/*{
				fieldLabel : '所属部门',
				name : 'passport2.dept.deptname',
				allowBlank : true
			}, {
				fieldLabel : '所在机房',
				name : 'passport2.site.sitename',
				allowBlank : true
			}*/, {
			fieldLabel : 'root密码',
			name : 'passport2.rootpwd',
            inputType:'password', 
			allowBlank : true
		}, {
			fieldLabel : 'PPP电话号码',
			name : 'passport2.pppnumber',
			allowBlank : true
		} ]
/*
	buttons : [{
		text : '保存',
		type : 'submit',
		disabled : false,
		handler : function() {
			if (passport_form.form.isValid()) {
				passport_form.form.submit({
					url : 'UpdatePassport.action',
					success : function(from, action) {
						passportds.load({
							params : {
								start : 0,
								limit : 30,
								forumId : 4
							}
						});
					},
					failure : function(form, action) {
						Ext.MessageBox.alert('失败', '修改Passport设备失败！');
					},
					waitMsg : '正在保存数据，稍后...'
				});
				passport_win.hide();
			} else {
				Ext.Msg.alert('信息', '请填写完成再提交!');
			}
		}
	}, {
		text : '取消',
		handler : function() {
			passport_win.hide();
		}
	}] */
});

var select_ppt_id = 0;

var editPassportPrompt = function() {
	loadPassportDetail(Ext.getCmp('passport-grid'));
}

function showSinglePassport(grid, index) {
	loadPassportDetail(grid, index);
}

var loadPassportDetail = function(grid, index) {
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('修改操作', '请选择要修改的一项！');
	} else {
		ShowPassportForm();
		
		select_ppt_id = _record.get('passportid');
		var _url = 'LoadPassport.action?passport.passportid=' + _record.get('passportid');
		passport_form.form.load({
			url : _url,
			waitMsg : '正在载入数据...',

			failure : function() {
				Ext.MessageBox.alert('编辑', '载入失败');
			},
			success : function() {
				;//Ext.MessageBox.alert('编辑', '载入成功！');
			}
		});
		
		if (edit_passport_tab.getItem('edit-digi-ip-tab').rendered)
			loadDigiIP();
	
		if (edit_passport_tab.getItem('edit-digi-ppp-tab').rendered)
			loadDigiPPP();
			
		if (edit_passport_tab.getItem('edit-digi-syslog-tab').rendered)
			loadDigiSyslog(); 
			
		//if (edit_passport_tab.getItem('edit-digi-ip-filter-tab').rendered)
		//	loadDigiIpFilter();		
	}
}

	
var ShowPassportForm = function() {
	// create the window on the first click and reuse on subsequent
	// clicks

	if (!passport_win) {
		passport_win = new Ext.Window({
			// el : 'topic-win',
			layout : 'fit',
			width : 440,
			height : 338,
			closeAction : 'hide',
			plain : true,
			title : '修改应急通道设备',
			iconCls: 'feed-icon',
			items : edit_passport_tab,			
			buttons: 
			[{
				text : '保存',
				handler : editPassportHandler
			}, {
				text : '取消',
				handler : function() { 	passport_win.hide(); }
			}]
		});
	}
	passport_win.show('tool-bar-new-passport');
}

		
var ftabchange = function(form, tab ) {
   // Ext.MessageBox.alert(tab.id, form.id); 
	if (tab.id == 'edit-digi-ip-tab') {
		loadDigiIP(); // we are loading from db instead of digi hardware
	}
	else if (tab.id == 'edit-digi-ppp-tab'){
		loadDigiPPP();
	}
	else if (tab.id == 'edit-digi-syslog-tab'){
		loadDigiSyslog();
	}
	//else if (tab.id == 'edit-digi-ip-filter-tab'){
	//	loadDigiIpFilter();
	//}
} 

var loadDigiIP = function( ) {
	var _url = 'LoadPassport.action?passport.passportid=' + select_ppt_id; // getDigiIP.action
	digi_ip_setting_form.form.load({
		url : _url,
		waitMsg : '正在载入数据...',

		failure : function() {
			Ext.MessageBox.alert('编辑', '载入失败');
		},
		success : function() {
			; 
		}
	});
}

var loadDigiPPP = function( ) {
	//?? digi_ip_setting_form.form.reset();
	var _url = 'LoadPassport.action?passport.passportid=' + select_ppt_id; // getDigiPPP 
	digi_ppp_form.form.load({
		url : _url,
		waitMsg : '正在载入数据...',

		failure : function() {
			Ext.MessageBox.alert('编辑', '载入失败');
		},
		success : function() {
			; 
		}
	});
}

var loadDigiSyslog = function( ) {
	//?? digi_ip_setting_form.form.reset();
	var _url = 'LoadPassport.action?passport.passportid=' + select_ppt_id; // getDigiPPP 
	digi_syslog_setting_form.form.load({
		url : _url,
		waitMsg : '正在载入数据...',

		failure : function() {
			Ext.MessageBox.alert('编辑', '载入失败');
		},
		success : function() {
			; 
		}
	});
}

/*var loadDigiIpFilter = function( ) {
	//?? digi_ip_setting_form.form.reset();
	var _url = 'LoadPassport.action?passport.passportid=' + select_ppt_id; // getDigiPPP 
	digi_ip_filter_form.form.load({
		url : _url,
		waitMsg : '正在载入数据...',

		failure : function() {
			Ext.MessageBox.alert('编辑', '载入失败');
		},
		success : function() {
			; 
		}
	});
}*/


var edit_passport_tab = new Ext.TabPanel({
	activeTab: 0,
    margins: '0 0 0 0',
    border: false,
    deferredRender: true, //cg: set true to defer the tab rendering when it is activated.
	region : 'center',
    items: [
    {
        title: '一般信息',
        iconCls: 'feed-icon',
        id: 'edit-digi-general-tab',
    	frame : true,
    	layout:'fit',
	    bodyStyle : 'padding:5px 5px 0',
        items : [passport_form]//
    },{
        title: 'IP配置',
        iconCls: 'feed-icon',
        id: 'edit-digi-ip-tab',
    	frame : true,
    	layout:'fit',
        items: [ digi_ip_setting_form  ]
    },{
        title: '拨号IP分配',
        iconCls: 'feed-icon',
        id: 'edit-digi-ppp-tab',
    	frame : true,
    	layout:'fit',
        items: [ digi_ppp_form  ]
    },/*{
        title: 'IP过滤',
        iconCls: 'feed-icon',
        id: 'edit-digi-ip-filter-tab',
    	frame : true,
    	layout:'fit',
        items: [ digi_ip_filter_form ]
    },*/{
        title: 'syslog-ng',
        iconCls: 'feed-icon',
        id: 'edit-digi-syslog-tab',
    	frame : true,
    	layout:'fit',
        items: [ digi_syslog_setting_form  ]
    } ],
	listeners : {
		//CG tabchange : ftabchange
	}
});
 

/*==================================================================================*/

var deletePassportPrompt = function() {
	var grid = Ext.getCmp('passport-grid');
	var ds = grid.getStore();
	var _record = grid.getSelectionModel().getSelected();
	if (_record) {
		Ext.MessageBox.confirm('确认删除', '你确认要删除所选的应急通道设备吗？', function(btn) {
			if (btn == "yes") {
				// var m = grid.getSelections(); purged on Ext3.0
				// grid.selModel.selections.items;
				var m = grid.getSelectionModel().getSelections();
				var jsonData = "";
				for (var i = 0, len = m.length; i < len; i++) {
					var ss = m[i].get("passportid");
					if (i == 0) {
						jsonData = jsonData + ss;
					} else {
						jsonData = jsonData + "," + ss;
					}
					ds.remove(m[i]); // cg
				}
				ds.load({
					params : {
						start : 0,
						limit : 30,
						delData : jsonData
					}
				});

				// Ext.example.msg('---删除操作---', '你删除的数据是');
			}
		});
	} else {
		Ext.MessageBox.alert('删除操作', '请选择要删除的数据项！');
	}
}

var editPassportHandler = function() {
	if (! passport_form.form.isValid()) {
		Ext.Msg.alert('信息', '请填写完成再提交!');
		return;
	}
	passport_form.form.submit({
		url : 'UpdatePassport.action',
		success : function(from, action) {
			passportds.load({
				params : {
					start : 0,
					limit : 30,
					forumId : 4
				}
			});
		},
		failure : function(form, action) {
			Ext.MessageBox.alert('失败', '修改应急通道设备失败！');
		},
		waitMsg : '正在保存数据，稍后...'
	});
	passport_win.hide();
}

function getSelectedPassport(grid) { 

	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('提示', '请选择要操作的Passport！');
	}
	return _record;
}

function openDirectWebSession() {
	var passport = getSelectedPassport(Ext.getCmp('passport-grid'));
	if (!passport) return;
	
	var ip = passport.get('ip');
	var url = 'https://' + ip;

	window.open(url);
}

function openDialupConnection()
{
	var passport = getSelectedPassport(Ext.getCmp('passport-grid'));
	if (!passport) return;
	
	var pptid = passport.get('passportid');

	Ext.Ajax.request({
		'url': 'dialPPP.action?passportid='+ pptid,
		timeout : 120000,
		success : function(response, opts) { 
			Ext.Msg.hide();
			var obj2 = Ext.decode(response.responseText);
			if (obj2.success == false) {
				Ext.Msg.alert('电话拨号失败', obj2.error.reason);
			}
		},
		failure : function(response, opts) { 
			Ext.Msg.hide();  
			Ext.Msg.alert('电话拨号失败', 'server-side failure with status code ' + response.status);
		} 
	});

	Ext.MessageBox.wait('正在拨号，可能将耗时大约一分钟，请稍候...', '正在拨号...');
}

function closeDialupConnection()
{
	var passport = getSelectedPassport(Ext.getCmp('passport-grid'));
	if (!passport) return;
	
	var pptid = passport.get('passportid');

	Ext.Ajax.request({
		'url': 'closePPP.action?passportid='+ pptid,
		timeout : 120000,
		success : function(response, opts) { 
			Ext.MessageBox.hide();
			var obj2 = Ext.decode(response.responseText);
			if (obj2.success == false) {
				Ext.MessageBox.alert('断开拨号连接失败', obj2.error.reason);
			}
		},
		failure : function(response, opts) { 
			Ext.MessageBox.hide();  
			Ext.MessageBox.alert('断开拨号连接失败', 'server-side failure with status code ' + response.status);
		} 
	});

	Ext.MessageBox.wait('正在断开拨号链接，可能将耗时大约一分钟，请稍候...', '正在断开拨号链接...');
}

function goPortSetting(){
	Ext.getCmp('main-panel').layout.setActiveItem(passportAdminMain.id);
	var passport = getSelectedPassport(Ext.getCmp('passport-grid'));
	if (!passport) return;
	
	var pptid = passport.get('passportid');
	filterDevicesList('passport', pptid);
}
