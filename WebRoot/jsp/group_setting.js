
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


var myGroupData2 = [[1, 'root', '��������Ա'], [2, 'admin', '����Ա'], [3, 'operator', '����Ա']];
var groupds2 = new Ext.data.ArrayStore({
	fields : [
		{ name : 'groupid',type : 'int'}, 
		{ name : 'groupname' }, 
		{ name : 'groupdesc' }
	]
});

var showGroups = {
	id : 'group-admin-panel',
	// title: '�����',
	layout : 'border',
	items : [{
		id : 'group-grid',
		region : 'center',
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // �������ֶ���
		store : groupds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [{
			id : 'groupid',
			header : 'ID',
			width : 50,
			sortable : true,
			dataIndex : 'groupid'
		}, {
			header : '����',
			width : 85,
			sortable : true,
			dataIndex : 'groupname'
		}, {
			header : '��Ȩ��',
			width : 85,
			sortable : true,
			dataIndex : 'grouplevel'
		}, {
			header : '������',
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
      				// �����ǰ�Ҽ���������б��У���ôֹͣ�¼�   
      				e.stopEvent();   
    			} else{
    				popupGroupContextMenu(this, rowIndex, e);
    			}    			
			}
		},
		tbar : [
			{
				text : '�����',
				id : 'tool-bar-new-group',
				iconCls : 'group-add24',
				scale : 'large',
				handler : function() {
					addGroupPrompt();
				}
			}, '-', {
				text : '�޸���',
				iconCls : 'group-mod24',
				scale : 'large',
				handler : function() {
					editGroupPrompt();
				}
			}, '-', {
				text : 'ɾ����',
				iconCls : 'group-del24',
				scale : 'large',
				handler : function() {
					deleteGroupPrompt();
				}
			}
		],
		// ��ӷ�ҳ������
		bbar : new Ext.PagingToolbar({
			pageSize : 30,
			store : groupds,
			displayInfo : true,
			displayMsg : '��ʾ {0}-{1}�� / �� {2} ��',
			emptyMsg : "�����ݡ�"
		})
	}]
};



var groupContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '�鿴��',
		    iconCls: 'user-mod16',
		    handler : function(e) { editGroupPrompt(); }
	    },
	    {
		    text : '�����',
		    iconCls: 'user-add16',
		    handler : function() { addGroupPrompt(); }
	    }, 
	    {
		    text : 'ɾ����',
		    iconCls: 'user-del16',
		    handler: function(e) {��deleteGroupPrompt(); }
	    }]
	});

 function popupGroupContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	groupContextMenu.showAt(e.getXY());
};


/* ������
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
			title : '�����',
			iconCls: 'feed-icon',
			items : add_group_form
		});
	}
	add_group_win.show('tool-bar-new-group');
}

add_group_form = new Ext.FormPanel({
	// collapsible : true,// �Ƿ����չ��
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
		fieldLabel : '������',
		name : 'group.groupname',
		allowBlank : false
	}, {
		fieldLabel : '������',
		id:'add_group_description', 
		name : 'group.description',
		allowBlank : false
	}],

	buttons : [{
			text : '����',
			disabled : false,
			handler : function() {
				if (add_group_form.form.isValid()) {
					add_group_form.form.submit({
						url : 'AddGroup.action',
						success : function(from, action) {
							// Ext.MessageBox.alert('����ɹ�', '�����ɹ���');
							groupds.load({
								params : {
									start : 0,
									limit : 30,
									forumId : 4
								}
							});
						},
						failure : function(form, action) {
							Ext.MessageBox.alert('����ʧ��', '�����ʧ�ܣ�');
						},
						waitMsg : '���ڱ������ݣ����Ժ�...'
					});
					add_group_win.hide();
				} else {
					Ext.Msg.alert('��Ϣ', '����д������ύ!');
				}
			}
		}, {
			text : 'ȡ��',
			handler : function() {
				add_group_win.hide();
			}
		}]
});


/* �鿴���޸���
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
		Ext.MessageBox.alert('�޸Ĳ���', '��ѡ��Ҫ�޸ĵ�һ�');
	} else {
		ShowGroupForm();
		var _url = 'LoadGroup.action?group.groupid=' + _record.get('groupid');
		group_form.form.load({
					url : 'LoadGroup.action?group.groupid='
							+ _record.get('groupid'),
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
					title : '�޸���',
					iconCls: 'feed-icon',
					items : group_form
				});
	}
	group_win.show('tool-bar-new-group');
}

		
group_form = new Ext.FormPanel({ 
	labelWidth : 40, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // ��ǩ���ֶ�¼���֮��Ŀհ�
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
				fieldLabel : '��ʶ',
				name : 'group2.groupid',
				allowBlank : false,
				readOnly : true
			}, {
				fieldLabel : '����',
				name : 'group2.groupname',
				allowBlank : false
			}, {��
				fieldLabel: '����',
				name : 'group2.description',
				allowBlank : true
			}],

	buttons : [{
				text : '����',
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
										Ext.MessageBox.alert('ʧ��', '�޸���ʧ�ܣ�');
									},
									waitMsg : '���ڱ������ݣ��Ժ�...'
								});
						group_win.hide();
					} else {
						Ext.Msg.alert('��Ϣ', '����д������ύ!');
					}
				}
			}, {
				text : 'ȡ��',
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
			Ext.Msg.alert('ɾ���û���', '��ѡ��һ����Ҫɾ�����û��飡');
			return;
		}
		else if ( m.length == 1 )
			Ext.MessageBox.confirm('ȷ��ɾ��', '��ȷ��Ҫɾ����ѡ���û�����', function(btn) {
				if (btn == "yes") {
					doDeleteGroup(ds, m[0]);
				}			
			});
	}
	else {
		Ext.MessageBox.alert('ɾ����', '��ѡ��Ҫɾ�����û��飡');
	}
}


function doDeleteGroup(ds, select) {
	
	var grpid = select.get("groupid");
	var myparm = {
		'group.groupid' : grpid
	}
	if (grpid == 1 || grpid == 2){
		Ext.MessageBox.minWidth = 280;
		Ext.Msg.alert('ɾ��ʧ��','����ɾ��ϵͳ����Ĺ���Ա����߲���Ա��');
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
				Ext.Msg.alert('�ɹ�', '���ѳɹ�ɾ���û���');
				ds.remove(select); // cg	
				ds.load();
			}
			else
				Ext.Msg.alert('ɾ���û���ʧ��', 'ԭ��: ' + obj.error.reason);
		},
		failure : function(response, opts) {
			Ext.Msg.hide();  
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.Msg.alert('ɾ���û���ʧ��', 'ԭ��: ' + obj.error.reason);
			}
		}
	}); 
	
	// Ext.Msg.wait('ɾ���û���Ҫͬ������ӵ�в���Ȩ�޵ĸ���Ӧ��ͨ���豸�����ܽ���ʱ�����ӣ����Ժ�...', '����ɾ���û�, ���Ժ�......');
}

