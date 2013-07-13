
var dept_form;
var dept_win;

/*
 * ================   Dept Admin Pannel config  =======================
 */
 
var dept_jsonReader = new Ext.data.JsonReader({
		root : 'list',
		totalProperty : 'totalCount',
		id : 'deptid',
		successProperty : '@success'
	}, 
	[{ name : 'deptid', mapping : 'deptid'  }, 
	{ name : 'deptname', mapping : 'deptname' }, 
	{ name : 'address', mapping : 'address' }]
);

var deptds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({
		url : 'deptData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		}
	}),
	reader : dept_jsonReader
	});
// deptds.setDefaultSort('deptid', 'desc');

/*
 * deptds.load( { params : { start :0, limit :30, forumId :4 } });
 */

var showDepts = {
	id : 'dept-admin-panel',
	layout : 'border',
	items : [
	{
		id : 'dept-grid',
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // 载入遮罩动画
		store : deptds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [{
					id : 'deptid',
					header : '部门ID',
					width : 50,
					sortable : true,
					dataIndex : 'deptid'
				}, {
					header : '部门名称',
					width : 100,
					sortable : true,
					dataIndex : 'deptname'
				}, {
					id : 'address',
					header : '地址',
					width : 150,
					sortable : true,  
					dataIndex : 'address'
				}],
		stripeRows : true,
		autoExpandColumn: 'address',

		// Add a listener to load the data only after the grid is rendered:
		listeners : {
			render : function() {
				// this.store.loadData(myDeptData);
				this.store.load();
			},
			rowdblclick : function(grid, index) {
				showSingleDept(grid, index);
			},
			rowcontextmenu : function (grid, rowIndex, e) {
				popupDeptContextMenu(this, rowIndex, e);
			},
			contextmenu : function (e) {
				var rowIndex = this.view.findRowIndex(e.getTarget());   
				// popupDeptContextMenu(this, rowIndex, e);
				if (false !== rowIndex) {   
      				// 如果当前右键点击的是列表行，那么停止事件   
      				e.stopEvent();   
    			} else{
    				popupDeptContextMenu(this, rowIndex, e);
    			}    			
			}
		},
		tbar : [{
					// xtype:'button',
					id : 'tool-bar-new-dept',
					text : '添加部门',
					iconCls : 'user-add24',
					scale : 'large',
					handler : function() {
						addDeptPrompt();
					}
				}, '-', {
					text : '修改部门',
					iconCls : 'user-mod24',
					scale : 'large',
					handler : function() {
						editDeptPrompt();
					}
				}, '-', {
					text : '删除部门',
					iconCls : 'user-del24',
					scale : 'large',
					handler : function() {
						deleteDeptPrompt();
					}
				}],
		// 添加分页工具栏
		bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : deptds,
					displayInfo : true,
					displayMsg : '显示 {0}-{1}条 / 共 {2} 条',
					emptyMsg : "无数据。"
				})
	}]
};

var deptContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '查看部门',
		    iconCls: 'user-mod16',
		    handler : function(e) { editDeptPrompt(); }
	    },
	    {
		    text : '添加部门',
		    iconCls: 'user-add16',
		    handler : function() { addDeptPrompt(); }
	    }, 
	    {
		    text : '删除部门',
		    iconCls: 'user-del16',
		    handler: function(e) {　deleteDeptPrompt(); }
	    }]
	});

 function popupDeptContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	deptContextMenu.showAt(e.getXY());
};


/* 新增部门
 * ===================================================================================
 */

var addDeptPrompt = function() {
	AddDeptForm();
}

var add_dept_win;
var AddDeptForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!add_dept_win) {
		add_dept_win = new Ext.Window({
				// el : 'topic-win',
				layout : 'fit',
				width : 400,
				height : 190,
				closeAction : 'hide',
				plain : true,
				title : '添加部门',
				iconCls: 'feed-icon',
				items : add_dept_form
			});
		add_dept_form.doLayout();
	}
	add_dept_win.show('tool-bar-new-dept');
}

add_dept_form = new Ext.FormPanel({
	// collapsible : true,// 是否可以展开
	labelWidth : 75,  
	url : 'AddDept.action',
	frame : true, 
	bodyStyle : 'padding:5px 5px 0',
	width : 350,
	waitMsgTarget : true, 
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '部门名称',
				name : 'dept.deptname',
				allowBlank : false
			}, {
				fieldLabel : '地址',
				id:'add_dept_address', 
				name : 'dept.address',
				allowBlank : false
			}],

	buttons : [{
				text : '保存',
				disabled : false,
				handler : function() {
					if (add_dept_form.form.isValid()) {
						add_dept_form.form.submit({
									url : 'AddDept.action',
									success : function(from, action) {
										// Ext.MessageBox.alert('保存成功', '添加部门成功！');
										deptds.load({
													params : {
														start : 0,
														limit : 30,
														forumId : 4
													}
												});
									},
									failure : function(form, action) {
										Ext.MessageBox.alert('保存失败', '添加部门失败！');
									},
									waitMsg : '正在保存数据，请稍候...'
								});
						add_dept_win.hide();
					} else {
						Ext.Msg.alert('信息', '请填写完成再提交!');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					add_dept_win.hide();
				}
			}]
});


/* 查看、修改部门
 * ========================================================================================
 */

var dept_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'deptid',
		successProperty :'@success'
	}, [ {
		name :'dept2.deptid',
		mapping :'deptid'   //		type :'int'
	}, {
		name :'dept2.deptname',
		mapping :'deptname'
	}, {
		name :'dept2.address',
		mapping :'address'
    }
   ]
);

var editDeptPrompt = function() {
	loadDeptDetail(Ext.getCmp('dept-grid'));
}

function showSingleDept(grid, index) {
	loadDeptDetail(grid, index);
}

var loadDeptDetail = function(grid, index) {
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('修改操作', '请选择要修改的一项！');
	} else {
		ShowDeptForm();
		var _url = 'LoadDept.action?dept.deptid=' + _record.get('deptid');
		dept_form.form.load({
					url : 'LoadDept.action?dept.deptid='
							+ _record.get('deptid'),
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

var ShowDeptForm = function() {
	// create the window on the first click and reuse on subsequent
	// clicks

	if (!dept_win) {
		dept_win = new Ext.Window({
					// el : 'topic-win',
					layout : 'fit',
					width : 400,
					height : 186,
					closeAction : 'hide',
					plain : true,
					title : '修改部门',
					iconCls: 'feed-icon',
					items : dept_form
				});
	}
	dept_win.show('tool-bar-new-dept');
}

		
dept_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // 标签与字段录入框之间的空白
	url : 'UpdateDept.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 380,
	waitMsgTarget : true,
	reader :dept_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '标识',
				name : 'dept2.deptid',
				allowBlank : false,
				readOnly : true
			}, {
				fieldLabel : '部门名',
				name : 'dept2.deptname',
				allowBlank : false
			}, {　
				fieldLabel : '地址',
				name : 'dept2.address', 
				allowBlank : true
			}],

	buttons : [{
				text : '保存',
				type : 'submit',
				disabled : false,
				handler : function() {
					if (dept_form.form.isValid()) {
						dept_form.form.submit({
									url : 'UpdateDept.action',
									success : function(from, action) {
										deptds.load({
													params : {
														start : 0,
														limit : 30,
														forumId : 4
													}
												});
									},
									failure : function(form, action) {
										Ext.MessageBox.alert('失败', '修改部门失败！');
									},
									waitMsg : '正在保存数据，稍后...'
								});
						dept_win.hide();
					} else {
						Ext.Msg.alert('信息', '请填写完成再提交!');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					dept_win.hide();
				}
			}]
});


/*==================================================================================*/

var deleteDeptPrompt = function() {
	var grid = Ext.getCmp('dept-grid');
	var ds = grid.getStore();
	var _record = grid.getSelectionModel().getSelected();
	if (_record) {
		Ext.MessageBox.confirm('确认删除', '你确认要删除所选的部门吗？', function(btn) {
					if (btn == "yes") {
						// var m = grid.getSelections(); purged on Ext3.0
						// grid.selModel.selections.items;
						var m = grid.getSelectionModel().getSelections();
						var jsonData = "";
						for (var i = 0, len = m.length; i < len; i++) {
							var ss = m[i].get("deptid");
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




