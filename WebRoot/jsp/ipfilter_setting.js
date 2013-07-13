/*
 * ================   Ipfilter Admin Pannel config  =======================
 */

var ipfilter_form;
var ipfilter_win;

var ipfilter_jsonReader = new Ext.data.JsonReader({
		root : 'list',
		totalProperty : 'totalCount',
		id : 'id',
		successProperty : '@success'
	}, 
	[{ name : 'id', mapping : 'id'  }, 
	{ name : 'ip', mapping : 'ip' }]
);

var ipfilterds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({
		url : 'ipfilterData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		}
	}),
	reader : ipfilter_jsonReader
	});
// ipfilterds.setDefaultSort('id', 'desc');

/*
 * ipfilterds.load( { params : { start :0, limit :30, forumId :4 } });
 */

var showIpfilters = {
	id : 'ipfilter-admin-panel',
	layout : 'border',
	items : [
	{
		id : 'ipfilter-grid',
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true,  
		store : ipfilterds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [{
					id : 'ipfilter-grid-id',
					header : '序号',
					width : 50,
					sortable : true,
					dataIndex : 'id'
				}, {
					id : 'ipfilter-grid-ip',
					header : 'IP地址',
					width : 150,
					sortable : true,  
					dataIndex : 'ip'
				}],
		stripeRows : true,
		autoExpandColumn: 'ipfilter-grid-ip',

		// Add a listener to load the data only after the grid is rendered:
		listeners : {
			render : function() { 
				this.store.load();
			},
			rowdblclick : function(grid, index) {
				showSingleIpfilter(grid, index);
			},
			rowcontextmenu : function (grid, rowIndex, e) {
				popupIpfilterContextMenu(this, rowIndex, e);
			},
			contextmenu : function (e) {
				var rowIndex = this.view.findRowIndex(e.getTarget());   
				// popupIpfilterContextMenu(this, rowIndex, e);
				if (false !== rowIndex) {   
      				// 如果当前右键点击的是列表行，那么停止事件   
      				e.stopEvent();   
    			} else{
    				popupIpfilterContextMenu(this, rowIndex, e);
    			}    			
			}
		},
		tbar : [{
					// xtype:'button',
					id : 'tool-bar-new-ipfilter',
					text : '添加IP',
					iconCls : 'user-add24',
					scale : 'large',
					handler : function() {
						addIpfilterPrompt();
					}
				}, '-', {
					text : '修改IP',
					iconCls : 'user-mod24',
					scale : 'large',
					handler : function() {
						editIpfilterPrompt();
					}
				}, '-', {
					text : '删除IP',
					iconCls : 'user-del24',
					scale : 'large',
					handler : function() {
						deleteIpfilterPrompt();
					}
				}],
		// 添加分页工具栏
		bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : ipfilterds,
					displayInfo : true,
					displayMsg : '显示 {0}-{1}条 / 共 {2} 条',
					emptyMsg : "无数据。"
				})
	}]
};

var ipfilterContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '查看',
		    iconCls: 'user-mod16',
		    handler : function(e) { editIpfilterPrompt(); }
	    },
	    {
		    text : '添加IP',
		    iconCls: 'user-add16',
		    handler : function() { addIpfilterPrompt(); }
	    }, 
	    {
		    text : '删除IP',
		    iconCls: 'user-del16',
		    handler: function(e) {　deleteIpfilterPrompt(); }
	    }]
	});

 function popupIpfilterContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	ipfilterContextMenu.showAt(e.getXY());
};


/* 新增
 * ===================================================================================
 */

var addIpfilterPrompt = function() {
	AddIpfilterForm();
}

var add_ipfilter_win;
var AddIpfilterForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!add_ipfilter_win) {
		add_ipfilter_win = new Ext.Window({
				// el : 'topic-win',
				layout : 'fit',
				width : 330,
				height : 120,
				closeAction : 'hide',
				plain : true,
				title : '添加IP',
				iconCls: 'feed-icon',
				items : add_ipfilter_form
			});
		add_ipfilter_form.doLayout();
	}
	add_ipfilter_win.show('tool-bar-new-ipfilter');
}

add_ipfilter_form = new Ext.FormPanel({
	// collapsible : true,// 是否可以展开
	labelWidth : 55,  
	url : 'AddIpfilter.action',
	frame : true, 
	bodyStyle : 'padding:5px 5px 0',
	width : 320,
	waitMsgTarget : true, 
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [ {
				fieldLabel : 'IP 地址',
				id:'add_ipfilter_address', 
				name : 'ipfilter.ip',
				allowBlank : false
			}],

	buttons : [{
				text : '添加',
				disabled : false,
				handler : function() {
					if (add_ipfilter_form.form.isValid()) {
						add_ipfilter_form.form.submit({
									url : 'AddIpfilter.action',
									success : function(from, action) { 
										ipfilterds.load({
													params : {
														start : 0,
														limit : 30,
														forumId : 4
													}
												});
									},
									failure : function(form, action) {
										Ext.MessageBox.alert('保存失败', '添加IP失败！');
									},
									waitMsg : '正在保存数据，请稍候...'
								});
						add_ipfilter_win.hide();
					} else {
						Ext.Msg.alert('信息', '请填写完成再提交!');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					add_ipfilter_win.hide();
				}
			}]
});


/* 查看、修改
 * ========================================================================================
 */

var ipfilter_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'id',
		successProperty :'@success'
	}, [ {
		name :'ipfilter2.id',
		mapping :'id'   //		type :'int'
	}, {
		name :'ipfilter2.ip',
		mapping :'ip'
	}
   ]
);

var editIpfilterPrompt = function() {
	loadIpfilterDetail(Ext.getCmp('ipfilter-grid'));
}

function showSingleIpfilter(grid, index) {
	loadIpfilterDetail(grid, index);
}

var loadIpfilterDetail = function(grid, index) {
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('修改操作', '请选择要修改的一项！');
	} else {
		ShowIpfilterForm();
		var _url = 'LoadIpfilter.action?ipfilter.id=' + _record.get('id');
		ipfilter_form.form.load({
					url : 'LoadIpfilter.action?ipfilter.id=' + _record.get('id'),
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

var ShowIpfilterForm = function() {
	// create the window on the first click and reuse on subsequent
	// clicks

	if (!ipfilter_win) {
		ipfilter_win = new Ext.Window({
					// el : 'topic-win',
					layout : 'fit',
					width : 330,
					height : 160,
					closeAction : 'hide',
					plain : true,
					title : '修改IP地址',
					iconCls: 'feed-icon',
					items : ipfilter_form
				});
	}
	ipfilter_win.show('tool-bar-new-ipfilter');
}

		
ipfilter_form = new Ext.FormPanel({ 
	labelWidth : 55,  
	labelAlign : 'left',
	// labelPad : 0,  // 标签与字段录入框之间的空白
	url : 'UpdateIpfilter.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 320,
	waitMsgTarget : true,
	reader :ipfilter_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '序号',
				name : 'ipfilter2.id',
				allowBlank : false,
				readOnly : true
			}, {　
				fieldLabel : 'IP地址',
				name : 'ipfilter2.ip', 
				allowBlank : true
			}],

	buttons : [{
				text : '保存',
				type : 'submit',
				disabled : false,
				handler : function() {
					if (ipfilter_form.form.isValid()) {
						ipfilter_form.form.submit({
									url : 'UpdateIpfilter.action',
									success : function(from, action) {
										ipfilterds.load({
													params : {
														start : 0,
														limit : 30,
														forumId : 4
													}
												});
									},
									failure : function(form, action) {
										Ext.MessageBox.alert('失败', '修改IP失败！');
									},
									waitMsg : '正在保存数据，稍后...'
								});
						ipfilter_win.hide();
					} else {
						Ext.Msg.alert('信息', '请填写完成再提交!');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					ipfilter_win.hide();
				}
			}]
});


/*==================================================================================*/

var deleteIpfilterPrompt = function() {
	var grid = Ext.getCmp('ipfilter-grid');
	var ds = grid.getStore();
	var _record = grid.getSelectionModel().getSelected();
	if (_record) {
		Ext.MessageBox.confirm('确认删除', '你确认要删除所选的IP吗？', function(btn) {
					if (btn == "yes") {
						// var m = grid.getSelections(); purged on Ext3.0
						// grid.selModel.selections.items;
						var m = grid.getSelectionModel().getSelections();
						var jsonData = "";
						for (var i = 0, len = m.length; i < len; i++) {
							var ss = m[i].get("id");
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




