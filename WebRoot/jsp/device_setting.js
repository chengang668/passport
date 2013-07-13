
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
		loadMask : true, // �������ֶ���
		store : deviceds,
		columns : [{
					id : 'deviceid',
					header : '����ID',
					width : 50,
					sortable : true,
					dataIndex : 'deviceid'
				}, {
					header : '������',
					width : 100,
					sortable : true,
					dataIndex : 'devicename'
				}, {
					id : 'address',
					header : '��ַ',
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
      				// �����ǰ�Ҽ���������б��У���ôֹͣ�¼�   
      				e.stopEvent();   
    			} else{
    				popupDeviceContextMenu(this, rowIndex, e);
    			}    			
			}
		},
		tbar : [{
					// xtype:'button',
					id : 'tool-bar-new-device',
					text : '��ӵ���',
					iconCls : 'user-add24',
					scale : 'large',
					handler : function() {
						addDevicePrompt();
					}
				}, '-', {
					text : '�޸ĵ���',
					iconCls : 'user-mod24',
					scale : 'large',
					handler : function() {
						editDevicePrompt();
					}
				}, '-', {
					text : 'ɾ������',
					iconCls : 'user-del24',
					scale : 'large',
					handler : function() {
						deleteDevicePrompt();
					}
				}],
		// ��ӷ�ҳ������
		bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : deviceds,
					displayInfo : true,
					displayMsg : '��ʾ {0}-{1}�� / �� {2} ��',
					emptyMsg : "�����ݡ�"
				})
	}]
};

var deviceContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '�鿴����',
		    iconCls: 'user-mod16',
		    handler : function(e) { editDevicePrompt(); }
	    },
	    {
		    text : '�����µ���',
		    iconCls: 'user-add16',
		    handler : function() { addDevicePrompt(); }
	    }, 
	    {
		    text : 'ɾ������',
		    iconCls: 'user-del16',
		    handler: function(e) {��deleteDevicePrompt(); }
	    }]
	});

 function popupDeviceContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	deviceContextMenu.showAt(e.getXY());
};


/* ��������
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
					title : '��ӵ���',
					items : add_device_form
				});
	}
	add_device_win.show('tool-bar-new-device');
}

add_device_form = new Ext.FormPanel({
	// collapsible : true,// �Ƿ����չ��
	labelWidth : 75,  
	url : 'AddDevice.action',
	frame : true,
	// title : '��ӵ���',
	bodyStyle : 'padding:5px 5px 0',
	width : 350,
	waitMsgTarget : true,
	// reader :_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '������',
				name : 'device.devicename',
				allowBlank : false
			}, {
				fieldLabel : '��ַ',
				id:'add_device_address', 
				name : 'device.address',
				allowBlank : false
			}],

	buttons : [{
				text : '����',
				disabled : false,
				handler : function() {
					if (add_device_form.form.isValid()) {
						add_device_form.form.submit({
									url : 'AddDevice.action',
									success : function(from, action) {
										// Ext.MessageBox.alert('����ɹ�', '��ӵ����ɹ���');
										deviceds.load({
													params : {
														start : 0,
														limit : 30,
														forumId : 4
													}
												});
									},
									failure : function(form, action) {
										Ext.MessageBox.alert('����ʧ��', '��ӵ���ʧ�ܣ�');
									},
									waitMsg : '���ڱ������ݣ����Ժ�...'
								});
						add_device_win.hide();
					} else {
						Ext.Msg.alert('��Ϣ', '����д������ύ!');
					}
				}
			}, {
				text : 'ȡ��',
				handler : function() {
					add_device_win.hide();
				}
			}]
});


/* �鿴���޸ĵ���
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
		Ext.MessageBox.alert('�޸Ĳ���', '��ѡ��Ҫ�޸ĵ�һ�');
	} else {
		ShowDeviceForm();
		var _url = 'LoadDevice.action?device.deviceid=' + _record.get('deviceid');
		device_form.form.load({
					url : 'LoadDevice.action?device.deviceid='
							+ _record.get('deviceid'),
					waitMsg : '������������...',

					failure : function() {
						Ext.MessageBox.alert('�༭', '����ʧ��');
					},
					success : function() {
						;//Ext.MessageBox.alert('�༭', '����ɹ���');
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
					title : '�޸ĵ���',
					items : device_form
				});
	}
	device_win.show('tool-bar-new-device');
}

		
device_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // ��ǩ���ֶ�¼���֮��Ŀհ�
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
				fieldLabel : '��ʶ',
				name : 'device2.deviceid',
				allowBlank : false,
				readOnly : true
			}, {
				fieldLabel : '������',
				name : 'device2.devicename',
				allowBlank : false
			}, {��
				fieldLabel : '��ַ',
				name : 'device2.address', 
				allowBlank : true
			}],

	buttons : [{
				text : '����',
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
										Ext.MessageBox.alert('ʧ��', '�޸ĵ���ʧ�ܣ�');
									},
									waitMsg : '���ڱ������ݣ��Ժ�...'
								});
						device_win.hide();
					} else {
						Ext.Msg.alert('��Ϣ', '����д������ύ!');
					}
				}
			}, {
				text : 'ȡ��',
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
		Ext.MessageBox.confirm('ȷ��ɾ��', '��ȷ��Ҫɾ����ѡ�ĵ�����', function(btn) {
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

						// Ext.example.msg('---ɾ������---', '��ɾ����������');
					}
				});
	} else {
		Ext.MessageBox.alert('ɾ������', '��ѡ��Ҫɾ���������');
	}
}




