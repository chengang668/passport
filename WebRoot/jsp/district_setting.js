
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
		loadMask : true, // �������ֶ���
		store : districtds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [{
					id : 'districtid',
					header : '����ID',
					width : 50,
					sortable : true,
					dataIndex : 'districtid'
				}, {
					header : '������',
					width : 100,
					sortable : true,
					dataIndex : 'districtname'
				}, {
					id : 'address',
					header : '˵��',
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
      				// �����ǰ�Ҽ���������б��У���ôֹͣ�¼�   
      				e.stopEvent();   
    			} else{
    				popupdistrictContextMenu(this, rowIndex, e);
    			}    			
			}
		},
		tbar : [{
					// xtype:'button',
					id : 'tool-bar-new-district',
					text : '��ӵ���',
					iconCls : 'user-add24',
					scale : 'large',
					handler : function() {
						adddistrictPrompt();
					}
				}, '-', {
					text : '�޸ĵ���',
					iconCls : 'user-mod24',
					scale : 'large',
					handler : function() {
						editdistrictPrompt();
					}
				}, '-', {
					text : 'ɾ������',
					iconCls : 'user-del24',
					scale : 'large',
					handler : function() {
						deletedistrictPrompt();
					}
				}],
		// ��ӷ�ҳ������
		bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : districtds,
					displayInfo : true,
					displayMsg : '��ʾ {0}-{1}�� / �� {2} ��',
					emptyMsg : "�����ݡ�"
				})
	}]
};

var districtContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '�鿴����',
		    iconCls: 'user-mod16',
		    handler : function(e) { editdistrictPrompt(); }
	    },
	    {
		    text : '����µ���',
		    iconCls: 'user-add16',
		    handler : function() { adddistrictPrompt(); }
	    }, 
	    {
		    text : 'ɾ������',
		    iconCls: 'user-del16',
		    handler: function(e) { deletedistrictPrompt(); }
	    }]
	});

 function popupdistrictContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	districtContextMenu.showAt(e.getXY());
};


/* ��������
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
					title : '��ӵ���',
					iconCls: 'feed-icon',
					items : add_district_form
				});
	}
	add_district_win.show('tool-bar-new-district');
}

add_district_form = new Ext.FormPanel({
	// collapsible : true,// �Ƿ����չ��
	labelWidth : 75,  
	url : 'AddDistrict.action',
	frame : true,
	// title : '��ӵ���',
	bodyStyle : 'padding:5px 5px 0',
	width : 350,
	waitMsgTarget : true,
	// reader :district_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '������',
				name : 'district.districtname',
				allowBlank : false
			}, {
				fieldLabel : '˵��',
				id:'add_district_address', 
				name : 'district.address',
				allowBlank : false
			}],

	buttons : [{
				text : '����',
				disabled : false,
				handler : function() {
					if (add_district_form.form.isValid()) {
						add_district_form.form.submit({
									url : 'AddDistrict.action',
									success : function(from, action) {
										// Ext.MessageBox.alert('����ɹ�', '��ӵ����ɹ���');
										districtds.load({
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
						add_district_win.hide();
					} else {
						Ext.Msg.alert('��Ϣ', '����д������ύ!');
					}
				}
			}, {
				text : 'ȡ��',
				handler : function() {
					add_district_win.hide();
				}
			}]
});


/* �鿴���޸ĵ���
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
		Ext.MessageBox.alert('�޸Ĳ���', '��ѡ��Ҫ�޸ĵ�һ�');
	} else {
		ShowdistrictForm();
		var _url = 'LoadDistrict.action?district.districtid=' + _record.get('districtid');
		district_form.form.load({
			url : 'LoadDistrict.action?district.districtid=' + _record.get('districtid'),
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
					title : '�޸ĵ���',
					iconCls: 'feed-icon',
					items : district_form
				});
	}
	district_win.show('tool-bar-new-district');
}

		
district_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // ��ǩ���ֶ�¼���֮��Ŀհ�
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
				fieldLabel : '��ʶ',
				name : 'district2.districtid',
				allowBlank : false,
				readOnly : true
			}, {
				fieldLabel : '������',
				name : 'district2.districtname',
				allowBlank : false
			}, { 
				fieldLabel : '˵��',
				name : 'district2.address', 
				allowBlank : true
			}],

	buttons : [{
				text : '����',
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
										Ext.MessageBox.alert('ʧ��', '�޸ĵ���ʧ�ܣ�');
									},
									waitMsg : '���ڱ������ݣ��Ժ�...'
								});
						district_win.hide();
					} else {
						Ext.Msg.alert('��Ϣ', '����д������ύ!');
					}
				}
			}, {
				text : 'ȡ��',
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
			Ext.Msg.alert('ɾ������', '��ѡ��һ����Ҫɾ���ĵ�����');
			return;
		}
		else if ( m.length == 1 )
			Ext.MessageBox.confirm('ȷ��ɾ��', '��ȷ��Ҫɾ����ѡ�ĵ�����', function(btn) {
				if (btn == "yes") {
					doDeleteDistrict(ds, m[0]);
				}			
			});
	}
	else {
		Ext.MessageBox.alert('ɾ����', '��ѡ��Ҫɾ���������');
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
				Ext.Msg.alert('ɾ������ʧ��', obj.error.reason);
		},
		failure : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.Msg.alert('ɾ������ʧ��', obj.error.reason);
			}
		}
	}); 
}





