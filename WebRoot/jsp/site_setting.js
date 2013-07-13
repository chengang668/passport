
var site_form;
var site_win;

//================   Site Admin Pannel config  =======================

function getDistrictname(v)
{
    if (Ext.isEmpty(v))
        return '';
    else if (!Ext.isEmpty(v.districtname))
        return v.districtname;
    else
        return '';
}

var site_jsonReader = new Ext.data.JsonReader(
	{
		root : 'list',
		totalProperty : 'totalCount',
		id : 'siteid',
		successProperty : '@success'
	}, 
	[{
		name : 'siteid',
		mapping : 'siteid' // type :'int'
	}, {
		name : 'sitename',
		mapping : 'sitename'
	}, { 
		name : 'districtname', 
		mapping : 'district', 
		convert:getDistrictname 
	}, {
		name : 'address',
		mapping : 'address'
	}
]);

var siteds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({
		url : 'siteData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		}
	}),
	//
	reader : site_jsonReader
});
// siteds.setDefaultSort('siteid', 'desc');

/*
 * siteds.load( { params : { start :0, limit :30, forumId :4 } });
 */

var site_district_jr = district_jsonReader;
var site_district_ds = districtds;

// create the combo for district
var comboDistrictAdd = new Ext.form.ComboBox({
    typeAhead: true,
    triggerAction: 'all',
    forceSelection: true,
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'地区',
	name : 'site.district.districtname',
    store: site_district_ds,
    valueField: 'districtid',
    displayField: 'districtname',
    loadingText : '加载中...'
});

// create the combo instance
var comboDistrict = new Ext.form.ComboBox({
    typeAhead: true,
    forceSelection: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'地区',
	name : 'site2.district.districtname',
    store: site_district_ds,
    valueField: 'districtid',
    displayField: 'districtname',
    loadingText : '加载中...'
});


var showSites = {
	id : 'site-admin-panel',
	layout : 'border',
	items : [
	{
		id : 'site-grid',
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // 载入遮罩动画
		store : siteds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [{
					id : 'siteid',
					header : '机房ID',
					width : 50,
					sortable : true,
					dataIndex : 'siteid'
				}, {
					header : '机房名称',
					width : 100,
					sortable : true,
					dataIndex : 'sitename'
				}, {
					header : '地区',
					width : 100,
					sortable : true,
					dataIndex : 'districtname'
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
				// this.store.loadData(mySiteData);
				this.store.load();
			},
			rowdblclick : function(grid, index) {
				showSingleSite(grid, index);
			},
			/*rowcontextmenu : function (grid, rowIndex, e) {
				popupSiteContextMenu(this, rowIndex, e);
			},*/
			contextmenu : function (e) {
				var rowIndex = this.view.findRowIndex(e.getTarget());   
				popupSiteContextMenu(this, rowIndex, e);
				/*if (false !== rowIndex) {   
      				// 如果当前右键点击的是列表行，那么停止事件   
      				e.stopEvent();   
    			} else{
    				popupSiteContextMenu(this, rowIndex, e);
    			}*/    			
			}
		},
		tbar : [{
					// xtype:'button',
					id : 'tool-bar-new-site',
					text : '添加机房',
					iconCls : 'user-add24',
					scale : 'large',
					handler : function() {
						addSitePrompt();
					}
				}, '-', {
					text : '修改机房',
					iconCls : 'user-mod24',
					scale : 'large',
					handler : function() {
						editSitePrompt();
					}
				}, '-', {
					text : '删除机房',
					iconCls : 'user-del24',
					scale : 'large',
					handler : function() {
						deleteSitePrompt();
					}
				}],
		// 添加分页工具栏
		bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : siteds,
					displayInfo : true,
					displayMsg : '显示 {0}-{1}条 / 共 {2} 条',
					emptyMsg : "无数据。"
				})
	}]
};

var siteContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '查看机房',
		    iconCls: 'user-mod16',
		    handler : function(e) { editSitePrompt(); }
	    },
	    {
		    text : '添加机房',
		    iconCls: 'user-add16',
		    handler : function() { addSitePrompt(); }
	    }, 
	    {
		    text : '删除机房',
		    iconCls: 'user-del16',
		    handler: function(e) { deleteSitePrompt(); }
	    }]
	});

 function popupSiteContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	siteContextMenu.showAt(e.getXY());
};


/* 新增机房
 * ===================================================================================
 */

var addSitePrompt = function() {
	AddSiteForm();
}

var add_site_win;
var AddSiteForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!add_site_win) {
		add_site_win = new Ext.Window({
					// el : 'topic-win',
					layout : 'fit',
					width : 400,
					height : 200,
					closeAction : 'hide',
					plain : true,
					title : '添加机房',
					iconCls: 'feed-icon',
					items : add_site_form
				});
	}
	add_site_win.show('tool-bar-new-site');
}

add_site_form = new Ext.FormPanel({
	// collapsible : true,// 是否可以展开
	labelWidth : 75,  
	url : 'AddSite.action',
	frame : true,
	// title : '添加机房',
	bodyStyle : 'padding:5px 5px 0',
	width : 350,
	waitMsgTarget : true,
	// reader :site_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '机房名称',
				name : 'site.sitename',
				allowBlank : false
			}, 
			comboDistrictAdd ,
			{
				fieldLabel : '地址',
				id:'add_site_address', 
				name : 'site.address',
				allowBlank : false
			}],

	buttons : [{
				text : '保存',
				disabled : false,
				type:'submit',
        		formBind: true,
				handler : doAddSite
			}, {
				text : '取消',
				handler : function() {
					add_site_win.hide();
				}
			}],
	keys : [ { key:[10, 13], fn: doAddSite} ]
});

function doAddSite()
{
	if (add_site_form.form.isValid()) {
		add_site_form.form.submit({
			url : 'AddSite.action',
			success : function(from, action) {
				// Ext.MessageBox.alert('保存成功', '添加机房成功！');
				siteds.load({
							params : {
								start : 0,
								limit : 30,
								forumId : 4
							}
						});
			},
			failure : function(form, action) {
				Ext.MessageBox.alert('保存失败', '添加机房失败！');
			},
			waitMsg : '正在保存数据，请稍候...'
		});
		add_site_win.hide();
	} else {
		Ext.Msg.alert('信息', '请填写完成再提交!');
	}
}

/* 查看、修改机房
 * ========================================================================================
 */

var site_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'siteid',
		successProperty :'@success'
	}, [ {
		name :'site2.siteid',
		mapping :'siteid'   //		type :'int'
	}, {
		name :'site2.sitename',
		mapping :'sitename'
	}, {
		name :'site2.address',
		mapping :'address'
    }, { 
		name : 'site2.district.districtname', 
		mapping : 'district', 
		convert:getDistrictname 
	}
   ]
);

var editSitePrompt = function() {
	loadSiteDetail(Ext.getCmp('site-grid'));
}

function showSingleSite(grid, index) {
	loadSiteDetail(grid, index);
}

var loadSiteDetail = function(grid, index) {
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('修改操作', '请选择要修改的一项！');
	} else {
		ShowSiteForm();
		var _url = 'LoadSite.action?site.siteid=' + _record.get('siteid');
		site_form.form.load({
			url : 'LoadSite.action?site.siteid=' + _record.get('siteid'),
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

var ShowSiteForm = function() {
	// create the window on the first click and reuse on subsequent
	// clicks

	if (!site_win) {
		site_win = new Ext.Window({
					// el : 'topic-win',
					layout : 'fit',
					width : 400,
					height : 220,
					closeAction : 'hide',
					plain : true,
					title : '修改机房',
					iconCls: 'feed-icon',
					items : site_form
				});
	}
	site_win.show('tool-bar-new-site');
}

		
site_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // 标签与字段录入框之间的空白
	url : 'UpdateSite.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 380,
	waitMsgTarget : true,
	reader :site_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '标识',
				name : 'site2.siteid',
				allowBlank : false,
				readOnly : true
			}, {
				fieldLabel : '机房名称',
				name : 'site2.sitename',
				allowBlank : false
			}, comboDistrict , 
			{ 
				fieldLabel : '地址',
				name : 'site2.address', 
				allowBlank : true
			}],

	buttons : [{
				text : '保存',
				type : 'submit',
				disabled : false,
				handler : function() {
					if (site_form.form.isValid()) {
						site_form.form.submit({
									url : 'UpdateSite.action',
									success : function(from, action) {
										siteds.load({
													params : {
														start : 0,
														limit : 30,
														forumId : 4
													}
												});
									},
									failure : function(form, action) {
										Ext.MessageBox.alert('失败', '修改机房失败！');
									},
									waitMsg : '正在保存数据，稍后...'
								});
						site_win.hide();
					} else {
						Ext.Msg.alert('信息', '请填写完成再提交!');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					site_win.hide();
				}
			}]
});


/*==================================================================================*/

var deleteSitePrompt = function() {
	var grid = Ext.getCmp('site-grid');
	var ds = grid.getStore();
	var _record = grid.getSelectionModel().getSelected();
	if (_record) {
		Ext.MessageBox.confirm('确认删除', '你确认要删除所选的机房吗？', function(btn) {
					if (btn == "yes") {
						// var m = grid.getSelections(); purged on Ext3.0
						// grid.selModel.selections.items;
						var m = grid.getSelectionModel().getSelections();
						var jsonData = "";
						for (var i = 0, len = m.length; i < len; i++) {
							var ss = m[i].get("siteid");
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


