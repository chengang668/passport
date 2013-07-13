
var device_form;
var device_win;

/*
 * ================   Device Admin Pannel config  =======================
 */
 
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

var _jsonReader = new Ext.data.JsonReader({
			root : 'list',
			totalProperty : 'totalCount',
			id : 'deviceid',
			successProperty : '@success'
		}, [{
					name : 'deviceid',
					mapping : 'deviceid' // type :'int'
				}, {
					name : 'devicename',
					mapping : 'devicename'
				}, {
					name : 'address',
					mapping : 'address'
				}
				]);

var deviceds = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : 'deviceData.action'
					}),
			//
			reader : _jsonReader
		});
// deviceds.setDefaultSort('deviceid', 'desc');

/*
 * deviceds.load( { params : { start :0, limit :30, forumId :4 } });
 */

var showDevices = {
	id : 'device-admin-panel',
	layout : 'border',
	items : [
	{
		id : 'device-grid',
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // 载入遮罩动画
		store : deviceds,
		columns : [{
					id : 'deviceid',
					header : '地区ID',
					width : 50,
					sortable : true,
					dataIndex : 'deviceid'
				}, {
					header : '地区名',
					width : 100,
					sortable : true,
					dataIndex : 'devicename'
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
				// this.store.loadData(myDeviceData);
				this.store.load();
			},
			rowdblclick : function(grid, index) {
				showSingleDevice(grid, index);
			},
			rowcontextmenu : function (grid, rowIndex, e) {
				popupDeviceContextMenu(this, rowIndex, e);
			},
			contextmenu : function (e) {
				var rowIndex = this.view.findRowIndex(e.getTarget());   
				// popupDeviceContextMenu(this, rowIndex, e);
				if (false !== rowIndex) {   
      				// 如果当前右键点击的是列表行，那么停止事件   
      				e.stopEvent();   
    			} else{
    				popupDeviceContextMenu(this, rowIndex, e);
    			}    			
			}
		},
		tbar : [{
					// xtype:'button',
					id : 'tool-bar-new-device',
					text : '添加地区',
					iconCls : 'user-add24',
					scale : 'large',
					handler : function() {
						addDevicePrompt();
					}
				}, '-', {
					text : '修改地区',
					iconCls : 'user-mod24',
					scale : 'large',
					handler : function() {
						editDevicePrompt();
					}
				}, '-', {
					text : '删除地区',
					iconCls : 'user-del24',
					scale : 'large',
					handler : function() {
						deleteDevicePrompt();
					}
				}],
		// 添加分页工具栏
		bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : deviceds,
					displayInfo : true,
					displayMsg : '显示 {0}-{1}条 / 共 {2} 条',
					emptyMsg : "无数据。"
				})
	}]
};

var deviceContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '查看地区',
		    iconCls: 'user-mod16',
		    handler : function(e) { editDevicePrompt(); }
	    },
	    {
		    text : '创建新地区',
		    iconCls: 'user-add16',
		    handler : function() { addDevicePrompt(); }
	    }, 
	    {
		    text : '删除地区',
		    iconCls: 'user-del16',
		    handler: function(e) {　deleteDevicePrompt(); }
	    }]
	});

 function popupDeviceContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	deviceContextMenu.showAt(e.getXY());
};


/* 新增地区
 * ===================================================================================
 */

var addDevicePrompt = function() {
	AddDeviceForm();
}

var add_device_win;
var AddDeviceForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!add_device_win) {
		add_device_win = new Ext.Window({
					// el : 'topic-win',
					layout : 'fit',
					width : 400,
					height : 300,
					closeAction : 'hide',
					plain : true,
					title : '添加地区',
					items : add_device_form
				});
	}
	add_device_win.show('tool-bar-new-device');
}

add_device_form = new Ext.FormPanel({
	// collapsible : true,// 是否可以展开
	labelWidth : 75,  
	url : 'AddDevice.action',
	frame : true,
	// title : '添加地区',
	bodyStyle : 'padding:5px 5px 0',
	width : 350,
	waitMsgTarget : true,
	// reader :_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '地区名',
				name : 'device.devicename',
				allowBlank : false
			}, {
				fieldLabel : '地址',
				id:'add_device_address', 
				name : 'device.address',
				allowBlank : false
			}],

	buttons : [{
				text : '保存',
				disabled : false,
				handler : function() {
					if (add_device_form.form.isValid()) {
						add_device_form.form.submit({
									url : 'AddDevice.action',
									success : function(from, action) {
										// Ext.MessageBox.alert('保存成功', '添加地区成功！');
										deviceds.load({
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
						add_device_win.hide();
					} else {
						Ext.Msg.alert('信息', '请填写完成再提交!');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					add_device_win.hide();
				}
			}]
});


/* 查看、修改地区
 * ========================================================================================
 */

var _jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'deviceid',
		successProperty :'@success'
	}, [ {
		name :'device2.deviceid',
		mapping :'deviceid'   //		type :'int'
	}, {
		name :'device2.devicename',
		mapping :'devicename'
	}, {
		name :'device2.address',
		mapping :'address'
    }
   ]
);

var editDevicePrompt = function() {
	loadDeviceDetail(Ext.getCmp('device-grid'));
}

function showSingleDevice(grid, index) {
	loadDeviceDetail(grid, index);
}

var loadDeviceDetail = function(grid, index) {
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('修改操作', '请选择要修改的一项！');
	} else {
		ShowDeviceForm();
		var _url = 'LoadDevice.action?device.deviceid=' + _record.get('deviceid');
		device_form.form.load({
					url : 'LoadDevice.action?device.deviceid='
							+ _record.get('deviceid'),
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

var ShowDeviceForm = function() {
	// create the window on the first click and reuse on subsequent
	// clicks

	if (!device_win) {
		device_win = new Ext.Window({
					// el : 'topic-win',
					layout : 'fit',
					width : 400,
					height : 300,
					closeAction : 'hide',
					plain : true,
					title : '修改地区',
					items : device_form
				});
	}
	device_win.show('tool-bar-new-device');
}

		
device_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // 标签与字段录入框之间的空白
	url : 'UpdateDevice.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 380,
	waitMsgTarget : true,
	reader :_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '标识',
				name : 'device2.deviceid',
				allowBlank : false,
				readOnly : true
			}, {
				fieldLabel : '地区名',
				name : 'device2.devicename',
				allowBlank : false
			}, {　
				fieldLabel : '地址',
				name : 'device2.address', 
				allowBlank : true
			}],

	buttons : [{
				text : '保存',
				type : 'submit',
				disabled : false,
				handler : function() {
					if (device_form.form.isValid()) {
						device_form.form.submit({
									url : 'UpdateDevice.action',
									success : function(from, action) {
										deviceds.load({
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
						device_win.hide();
					} else {
						Ext.Msg.alert('信息', '请填写完成再提交!');
					}
				}
			}, {
				text : '取消',
				handler : function() {
					device_win.hide();
				}
			}]
});


/*==================================================================================*/

var deleteDevicePrompt = function() {
	var grid = Ext.getCmp('device-grid');
	var ds = grid.getStore();
	var _record = grid.getSelectionModel().getSelected();
	if (_record) {
		Ext.MessageBox.confirm('确认删除', '你确认要删除所选的地区吗？', function(btn) {
					if (btn == "yes") {
						// var m = grid.getSelections(); purged on Ext3.0
						// grid.selModel.selections.items;
						var m = grid.getSelectionModel().getSelections();
						var jsonData = "";
						for (var i = 0, len = m.length; i < len; i++) {
							var ss = m[i].get("deviceid");
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




