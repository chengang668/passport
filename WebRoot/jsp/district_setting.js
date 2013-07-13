
var district_form;
var district_win;

//================   district Admin Pannel config  =======================


var district_jsonReader = new Ext.data.JsonReader(
	{
		root : 'list',
		totalProperty : 'totalCount',
		id : 'districtid',
		successProperty : '@success'
	}, 
	[{
		name : 'districtid',
		mapping : 'districtid' // type :'int'
	}, {
		name : 'districtname',
		mapping : 'districtname'
	}, {
		name : 'address',
		mapping : 'address'
	}
]);

var districtds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({
		url : 'districtData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		}
	}),
	//
	reader : district_jsonReader
});
// districtds.setDefaultSort('districtid', 'desc');

/*
 * districtds.load( { params : { start :0, limit :30, forumId :4 } });
 */


var showDistricts = {
	id : 'district-admin-panel',
	layout : 'border',
	items : [
	{
		id : 'district-grid',
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // 载入遮罩动画
		store : districtds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [{
					id : 'districtid',
					header : '地区ID',
					width : 50,
					sortable : true,
					dataIndex : 'districtid'
				}, {
					header : '地区名',
					width : 100,
					sortable : true,
					dataIndex : 'districtname'
				}, {
					id : 'address',
					header : '说明',
					width : 150,
					sortable : true,  
					dataIndex : 'address'
				}],
		stripeRows : true,
		autoExpandColumn: 'address',

		// Add a listener to load the data only after the grid is rendered:
		listeners : {
			render : function() {
				// this.store.loadData(mydistrictData);
				this.store.load();
			},
			rowdblclick : function(grid, index) {
				showSingledistrict(grid, index);
			},
			rowcontextmenu : function (grid, rowIndex, e) {
				popupdistrictContextMenu(this, rowIndex, e);
			},
			contextmenu : function (e) {
				var rowIndex = this.view.findRowIndex(e.getTarget());   
				// popupdistrictContextMenu(this, rowIndex, e);
				if (false !== rowIndex) {   
      				// 如果当前右键点击的是列表行，那么停止事件   
      				e.stopEvent();   
    			} else{
    				popupdistrictContextMenu(this, rowIndex, e);
    			}    			
			}
		},
		tbar : [{
					// xtype:'button',
					id : 'tool-bar-new-district',
					text : '添加地区',
					iconCls : 'user-add24',
					scale : 'large',
					handler : function() {
						adddistrictPrompt();
					}
				}, '-', {
					text : '修改地区',
					iconCls : 'user-mod24',
					scale : 'large',
					handler : function() {
						editdistrictPrompt();
					}
				}, '-', {
					text : '删除地区',
					iconCls : 'user-del24',
					scale : 'large',
					handler : function() {
						deletedistrictPrompt();
					}
				}],
		// 添加分页工具栏
		bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : districtds,
					displayInfo : true,
					displayMsg : '显示 {0}-{1}条 / 共 {2} 条',
					emptyMsg : "无数据。"
				})
	}]
};

var districtContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '查看地区',
		    iconCls: 'user-mod16',
		    handler : function(e) { editdistrictPrompt(); }
	    },
	    {
		    text : '添加新地区',
		    iconCls: 'user-add16',
		    handler : function() { adddistrictPrompt(); }
	    }, 
	    {
		    text : '删除地区',
		    iconCls: 'user-del16',
		    handler: function(e) { deletedistrictPrompt(); }
	    }]
	});

 function popupdistrictContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	districtContextMenu.showAt(e.getXY());
};


/* 新增地区
 * ===================================================================================
 */

var adddistrictPrompt = function() {
	AdddistrictForm();
}

var add_district_win;
var AdddistrictForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!add_district_win) {
		add_district_win = new Ext.Window({
					// el : 'topic-win',
					layout : 'fit',
					width : 380,
					height : 160,
					closeAction : 'hide',
					plain : true,
					title : '添加地区',
					iconCls: 'feed-icon',
					items : add_district_form
				});
	}
	add_district_win.show('tool-bar-new-district');
}

add_district_form = new Ext.FormPanel({
	// collapsible : true,// 是否可以展开
	labelWidth : 75,  
	url : 'AddDistrict.action',
	frame : true,
	// title : '添加地区',
	bodyStyle : 'padding:5px 5px 0',
	width : 350,
	waitMsgTarget : true,
	// reader :district_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '地区名',
				name : 'district.districtname',
				allowBlank : false
			}, {
				fieldLabel : '说明',
				id:'add_district_address', 
				name : 'district.address',
				allowBlank : false
			}],

	buttons : [{
				text : '保存',
				disabled : false,
				handler : function() {
					if (add_district_form.form.isValid()) {
						add_district_form.form.submit({
									url : 'AddDistrict.action',
									success : function(from, action) {
										// Ext.MessageBox.alert('保存成功', '添加地区成功！');
										districtds.load({
													params : {
														start : 0,
														limit : 30,
														forumId : 4
													}
												});
									},
									failure : function(form, action) {
										Ext.MessageBox.alert('保存失败', '添加地区失败！');
									},
									waitMsg : '正在保存数据，请稍候...'
								});
						add_district_win.hide();
					} else {
						Ext.Msg.alert('信息', '请填写完成再提交!');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					add_district_win.hide();
				}
			}]
});


/* 查看、修改地区
 * ========================================================================================
 */

var district_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'districtid',
		successProperty :'@success'
	}, [ {
		name :'district2.districtid',
		mapping :'districtid'   //		type :'int'
	}, {
		name :'district2.districtname',
		mapping :'districtname'
	}, {
		name :'district2.address',
		mapping :'address'
    }
   ]
);

var editdistrictPrompt = function() {
	loaddistrictDetail(Ext.getCmp('district-grid'));
}

function showSingledistrict(grid, index) {
	loaddistrictDetail(grid, index);
}

var loaddistrictDetail = function(grid, index) {
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('修改操作', '请选择要修改的一项！');
	} else {
		ShowdistrictForm();
		var _url = 'LoadDistrict.action?district.districtid=' + _record.get('districtid');
		district_form.form.load({
			url : 'LoadDistrict.action?district.districtid=' + _record.get('districtid'),
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

var ShowdistrictForm = function() {
	// create the window on the first click and reuse on subsequent
	// clicks

	if (!district_win) {
		district_win = new Ext.Window({
					// el : 'topic-win',
					layout : 'fit',
					width : 400,
					height : 190,
					closeAction : 'hide',
					plain : true,
					title : '修改地区',
					iconCls: 'feed-icon',
					items : district_form
				});
	}
	district_win.show('tool-bar-new-district');
}

		
district_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // 标签与字段录入框之间的空白
	url : 'UpdateDistrict.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 380,
	waitMsgTarget : true,
	reader :district_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '标识',
				name : 'district2.districtid',
				allowBlank : false,
				readOnly : true
			}, {
				fieldLabel : '地区名',
				name : 'district2.districtname',
				allowBlank : false
			}, { 
				fieldLabel : '说明',
				name : 'district2.address', 
				allowBlank : true
			}],

	buttons : [{
				text : '保存',
				type : 'submit',
				disabled : false,
				handler : function() {
					if (district_form.form.isValid()) {
						district_form.form.submit({
									url : 'UpdateDistrict.action',
									success : function(from, action) {
										districtds.load({
													params : {
														start : 0,
														limit : 30,
														forumId : 4
													}
												});
									},
									failure : function(form, action) {
										Ext.MessageBox.alert('失败', '修改地区失败！');
									},
									waitMsg : '正在保存数据，稍后...'
								});
						district_win.hide();
					} else {
						Ext.Msg.alert('信息', '请填写完成再提交!');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					district_win.hide();
				}
			}]
});


/*==================================================================================*/

var deletedistrictPrompt = function() {
	
	var grid = Ext.getCmp('district-grid');
	var ds = grid.getStore();
	var _record = grid.getSelectionModel().getSelected();
	
	if (_record) {
		var m = grid.getSelectionModel().getSelections();
		if ( m.length > 1 ){
			Ext.Msg.alert('删除地区', '请选择一个需要删除的地区！');
			return;
		}
		else if ( m.length == 1 )
			Ext.MessageBox.confirm('确认删除', '你确认要删除所选的地区吗？', function(btn) {
				if (btn == "yes") {
					doDeleteDistrict(ds, m[0]);
				}			
			});
	}
	else {
		Ext.MessageBox.alert('删除组', '请选择要删除的数据项！');
	}
}


function doDeleteDistrict(ds, select) {
	
	var disid = select.get("districtid");
	var myparm = {
		'district.districtid' : disid
	}

	Ext.Ajax.request({
		url : 'RemoveDistrict.action',
		timeout : 30000,
		params : myparm,

		success : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj && obj.success == true)
			{
				ds.remove(select);  
				ds.load();
			}
			else
				Ext.Msg.alert('删除地区失败', obj.error.reason);
		},
		failure : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.Msg.alert('删除地区失败', obj.error.reason);
			}
		}
	}); 
}





