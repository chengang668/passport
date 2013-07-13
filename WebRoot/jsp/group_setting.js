
//================   Group Admin Pannel config  =======================

var group_form;
var group_win;

function groupLevel(v, record){
    return record.groupid==1? 'Administrator':'Operator';
}

var group_jsonReader = new Ext.data.JsonReader(
	{
		root : 'list',
		totalProperty : 'totalCount',
		id : 'groupid',
		successProperty : '@success'
	}, 
	[   { name : 'groupid', mapping : 'groupid'  }, 
		{ name : 'groupname', mapping : 'groupname' }, 
		{ name : 'description', mapping : 'description' },
		{ name : 'grouplevel', convert:groupLevel }
	]
);

var groupds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({ 
		url : 'groupData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		} 
	}),
	reader : group_jsonReader
});


var myGroupData2 = [[1, 'root', '超级管理员'], [2, 'admin', '管理员'], [3, 'operator', '操作员']];
var groupds2 = new Ext.data.ArrayStore({
	fields : [
		{ name : 'groupid',type : 'int'}, 
		{ name : 'groupname' }, 
		{ name : 'groupdesc' }
	]
});

var showGroups = {
	id : 'group-admin-panel',
	// title: '组管理',
	layout : 'border',
	items : [{
		id : 'group-grid',
		region : 'center',
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // 载入遮罩动画
		store : groupds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [{
			id : 'groupid',
			header : 'ID',
			width : 50,
			sortable : true,
			dataIndex : 'groupid'
		}, {
			header : '组名',
			width : 85,
			sortable : true,
			dataIndex : 'groupname'
		}, {
			header : '组权限',
			width : 85,
			sortable : true,
			dataIndex : 'grouplevel'
		}, {
			header : '组描述',
			width : 100,
			sortable : true,
			dataIndex : 'description'
		}],
		stripeRows : true,
		// autoExpandColumn: 'lastlogin',

		// Add a listener to load the data only after the grid is
		// rendered:
		listeners : {
			render : function() {
				// this.store.loadData(myGroupData);
				this.store.load();
			},
			rowdblclick : function(grid, index) {
				showSingleGroup(grid, index);
			},
			rowcontextmenu : function (grid, rowIndex, e) {
				popupGroupContextMenu(this, rowIndex, e);
			},
			contextmenu : function (e) {
				var rowIndex = this.view.findRowIndex(e.getTarget());   
				// popupGroupContextMenu(this, rowIndex, e);
				if (false !== rowIndex) {   
      				// 如果当前右键点击的是列表行，那么停止事件   
      				e.stopEvent();   
    			} else{
    				popupGroupContextMenu(this, rowIndex, e);
    			}    			
			}
		},
		tbar : [
			{
				text : '添加组',
				id : 'tool-bar-new-group',
				iconCls : 'group-add24',
				scale : 'large',
				handler : function() {
					addGroupPrompt();
				}
			}, '-', {
				text : '修改组',
				iconCls : 'group-mod24',
				scale : 'large',
				handler : function() {
					editGroupPrompt();
				}
			}, '-', {
				text : '删除组',
				iconCls : 'group-del24',
				scale : 'large',
				handler : function() {
					deleteGroupPrompt();
				}
			}
		],
		// 添加分页工具栏
		bbar : new Ext.PagingToolbar({
			pageSize : 30,
			store : groupds,
			displayInfo : true,
			displayMsg : '显示 {0}-{1}条 / 共 {2} 条',
			emptyMsg : "无数据。"
		})
	}]
};



var groupContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '查看组',
		    iconCls: 'user-mod16',
		    handler : function(e) { editGroupPrompt(); }
	    },
	    {
		    text : '添加组',
		    iconCls: 'user-add16',
		    handler : function() { addGroupPrompt(); }
	    }, 
	    {
		    text : '删除组',
		    iconCls: 'user-del16',
		    handler: function(e) {　deleteGroupPrompt(); }
	    }]
	});

 function popupGroupContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	groupContextMenu.showAt(e.getXY());
};


/* 新增组
 * ===================================================================================
 */

var addGroupPrompt = function() {
	AddGroupForm();
}

var add_group_win;
var AddGroupForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!add_group_win) {
		add_group_win = new Ext.Window({
			// el : 'topic-win',
			layout : 'fit',
			width : 350,
			height : 150,
			closeAction : 'hide',
			plain : true,
			title : '添加组',
			iconCls: 'feed-icon',
			items : add_group_form
		});
	}
	add_group_win.show('tool-bar-new-group');
}

add_group_form = new Ext.FormPanel({
	// collapsible : true,// 是否可以展开
	labelWidth : 50,  
	url : 'AddGroup.action',
	frame : true, 
	bodyStyle : 'padding:5px 5px 0',
	width : 350,
	waitMsgTarget : true, 
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
		fieldLabel : '组名称',
		name : 'group.groupname',
		allowBlank : false
	}, {
		fieldLabel : '组描述',
		id:'add_group_description', 
		name : 'group.description',
		allowBlank : false
	}],

	buttons : [{
			text : '保存',
			disabled : false,
			handler : function() {
				if (add_group_form.form.isValid()) {
					add_group_form.form.submit({
						url : 'AddGroup.action',
						success : function(from, action) {
							// Ext.MessageBox.alert('保存成功', '添加组成功！');
							groupds.load({
								params : {
									start : 0,
									limit : 30,
									forumId : 4
								}
							});
						},
						failure : function(form, action) {
							Ext.MessageBox.alert('保存失败', '添加组失败！');
						},
						waitMsg : '正在保存数据，请稍候...'
					});
					add_group_win.hide();
				} else {
					Ext.Msg.alert('信息', '请填写完成再提交!');
				}
			}
		}, {
			text : '取消',
			handler : function() {
				add_group_win.hide();
			}
		}]
});


/* 查看、修改组
 * ========================================================================================
 */

var group_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'groupid',
		successProperty :'@success'
	}, [ {
		name :'group2.groupid',
		mapping :'groupid'   //		type :'int'
	}, {
		name :'group2.groupname',
		mapping :'groupname'
	}, {
		name :'group2.description',
		mapping :'description'
    }
   ]
);

var editGroupPrompt = function() {
	loadGroupDetail(Ext.getCmp('group-grid'));
}

function showSingleGroup(grid, index) {
	loadGroupDetail(grid, index);
}

var loadGroupDetail = function(grid, index) {
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('修改操作', '请选择要修改的一项！');
	} else {
		ShowGroupForm();
		var _url = 'LoadGroup.action?group.groupid=' + _record.get('groupid');
		group_form.form.load({
					url : 'LoadGroup.action?group.groupid='
							+ _record.get('groupid'),
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

var ShowGroupForm = function() {
	// create the window on the first click and reuse on subsequent
	// clicks

	if (!group_win) {
		group_win = new Ext.Window({
					// el : 'topic-win',
					layout : 'fit',
					width : 352,
					height : 186,
					closeAction : 'hide',
					plain : true,
					title : '修改组',
					iconCls: 'feed-icon',
					items : group_form
				});
	}
	group_win.show('tool-bar-new-group');
}

		
group_form = new Ext.FormPanel({ 
	labelWidth : 40, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // 标签与字段录入框之间的空白
	url : 'UpdateGroup.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 350,
	waitMsgTarget : true,
	reader :group_jsonFormReader,
	defaults : {
		width : 240
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '标识',
				name : 'group2.groupid',
				allowBlank : false,
				readOnly : true
			}, {
				fieldLabel : '组名',
				name : 'group2.groupname',
				allowBlank : false
			}, {　
				fieldLabel: '描述',
				name : 'group2.description',
				allowBlank : true
			}],

	buttons : [{
				text : '保存',
				type : 'submit',
				disabled : false,
				handler : function() {
					if (group_form.form.isValid()) {
						group_form.form.submit({
									url : 'UpdateGroup.action',
									success : function(from, action) {
										groupds.load({
													params : {
														start : 0,
														limit : 30,
														forumId : 4
													}
												});
									},
									failure : function(form, action) {
										Ext.MessageBox.alert('失败', '修改组失败！');
									},
									waitMsg : '正在保存数据，稍后...'
								});
						group_win.hide();
					} else {
						Ext.Msg.alert('信息', '请填写完成再提交!');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					group_win.hide();
				}
			}]
});


/*==================================================================================*/

var deleteGroupPrompt = function() {

    var grid = Ext.getCmp('group-grid');
	var ds = grid.getStore();
	var _record = grid.getSelectionModel().getSelected();
	
	if (_record) {
		var m = grid.getSelectionModel().getSelections();
		if ( m.length > 1 ){
			Ext.Msg.alert('删除用户组', '请选择一个需要删除的用户组！');
			return;
		}
		else if ( m.length == 1 )
			Ext.MessageBox.confirm('确认删除', '你确认要删除所选的用户组吗？', function(btn) {
				if (btn == "yes") {
					doDeleteGroup(ds, m[0]);
				}			
			});
	}
	else {
		Ext.MessageBox.alert('删除组', '请选择要删除的用户组！');
	}
}


function doDeleteGroup(ds, select) {
	
	var grpid = select.get("groupid");
	var myparm = {
		'group.groupid' : grpid
	}
	if (grpid == 1 || grpid == 2){
		Ext.MessageBox.minWidth = 280;
		Ext.Msg.alert('删除失败','不能删除系统定义的管理员组或者操作员组');
		return;
	}

	Ext.Ajax.request({
		url : 'RemoveGroup.action',
		timeout : 120000,
		params : myparm,

		success : function(response, opts) {
			// Ext.Msg.hide(); 
			var obj = Ext.decode(response.responseText);
			if (obj && obj.success == true)
			{
				Ext.Msg.alert('成功', '您已成功删除用户组');
				ds.remove(select); // cg	
				ds.load();
			}
			else
				Ext.Msg.alert('删除用户组失败', '原因: ' + obj.error.reason);
		},
		failure : function(response, opts) {
			Ext.Msg.hide();  
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.Msg.alert('删除用户组失败', '原因: ' + obj.error.reason);
			}
		}
	}); 
	
	// Ext.Msg.wait('删除用户需要同步其所拥有操作权限的各个应急通道设备，可能将耗时几分钟，请稍候...', '正在删除用户, 请稍候......');
}

