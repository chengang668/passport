
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
		//{ name : 'hostname',  mapping : 'hostname' }, 
		{ name : 'givenname', mapping : 'givenname' },
		{ name : 'owner',  mapping : 'owner' }, 
		//{ name : 'deptname', mapping : 'dept.deptname' }, 
		{ name : 'deptname', mapping : 'dept', convert:getDeptname }, 
		//{ name : 'sitename', mapping : 'site.sitename' }
		{ name : 'sitename', mapping : 'site', convert:getSitename }
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
				header : 'Passport编号',
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
				header : '应急通道设备别名',
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
    			} */   			
			}
		},
		tbar : [{
				// xtype:'button',
				id : 'tool-bar-new-passport',
				text : '应急通道设备',
				iconCls : 'user-add24',
				scale : 'large',
				handler : function() {
					addPassportPrompt();
				}
			}, '-', {
				text : '修改应急通道设备',
				iconCls : 'user-mod24',
				scale : 'large',
				handler : function() {
					editPassportPrompt();
				}
			}, '-', {
				text : '删除应急通道设备',
				iconCls : 'user-del24',
				scale : 'large',
				handler : function() {
					deletePassportPrompt();
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
	items : [ {
		    text : '查看Passport设备',
		    iconCls: 'user-mod16',
		    handler : function(e) { editPassportPrompt(); }
	    },
	    {
		    text : '创建新Passport设备',
		    iconCls: 'user-add16',
		    handler : function() { addPassportPrompt(); }
	    }, 
	    {
		    text : '删除Passport设备',
		    iconCls: 'user-del16',
		    handler: function(e) {　deletePassportPrompt(); }
	    }]
	});

 function popupPassportContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	passportContextMenu.showAt(e.getXY());
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
	labelWidth : 75,  
	url : 'AddPassport.action',
	frame : true,
	// title : '添加Passport设备',
	bodyStyle : 'padding:5px 5px 0',
	//width : 350,
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
			} */ ],

	buttons : [{
		text : '保存', 
		handler : function() {
			if (add_passport_form.form.isValid()) {
				add_passport_form.form.submit({
					url : 'AddPassport.action',
					success : function(from, action) {
						// Ext.MessageBox.alert('保存成功', '添加Passport设备成功！');
						passportds.load({
							params : {
								start : 0,
								limit : 30,
								forumId : 4
							}
						});
					},
					failure : function(form, action) {
						Ext.MessageBox.alert('保存失败', '添加Passport设备失败！');
					},
					waitMsg : '正在保存数据，请稍候...'
				});
				add_passport_win.hide();
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
			title : '添加Passport设备',
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
	 {	name :'passport2.dept.deptname',	mapping : 'dept', convert:getDeptname },
	 {	name :'passport2.site.sitename',	mapping : 'site', convert:getSitename }
	]
);

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
		var _url = 'LoadPassport.action?passport.passportid=' + _record.get('passportid');
		passport_form.form.load({
			url : 'LoadPassport.action?passport.passportid='
					+ _record.get('passportid'),
			waitMsg : '正在载入数据...',

			failure : function() {
				Ext.MessageBox.alert('编辑', '载入失败');
			},
			success : function() {
				;//Ext.MessageBox.alert('编辑', '载入成功！');
			}
		});
	}
}

var ShowPassportForm = function() {
	// create the window on the first click and reuse on subsequent
	// clicks

	if (!passport_win) {
		passport_win = new Ext.Window({
			// el : 'topic-win',
			layout : 'fit',
			width : 400,
			height : 300,
			closeAction : 'hide',
			plain : true,
			title : '修改Passport设备',
			iconCls: 'feed-icon',
			items : passport_form 
		});
	}
	passport_win.show('tool-bar-new-passport');
}

		
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
	width : 480,
	waitMsgTarget : true,
	reader :get_passport_jsonFormReader,
	defaults : {
		width : 260
	},
	defaultType : 'textfield',
	items : [{
			fieldLabel : '标识',
			name : 'passport2.passportid',
			allowBlank : false,
			readOnly : true
		}, {　
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
			}*/ ],

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
	}]
});


/*==================================================================================*/

var deletePassportPrompt = function() {
	var grid = Ext.getCmp('passport-grid');
	var ds = grid.getStore();
	var _record = grid.getSelectionModel().getSelected();
	if (_record) {
		Ext.MessageBox.confirm('确认删除', '你确认要删除所选的Passport设备吗？', function(btn) {
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




