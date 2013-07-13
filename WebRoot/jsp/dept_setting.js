
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
		loadMask : true, // �������ֶ���
		store : deptds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [{
					id : 'deptid',
					header : '����ID',
					width : 50,
					sortable : true,
					dataIndex : 'deptid'
				}, {
					header : '��������',
					width : 100,
					sortable : true,
					dataIndex : 'deptname'
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
      				// �����ǰ�Ҽ���������б��У���ôֹͣ�¼�   
      				e.stopEvent();   
    			} else{
    				popupDeptContextMenu(this, rowIndex, e);
    			}    			
			}
		},
		tbar : [{
					// xtype:'button',
					id : 'tool-bar-new-dept',
					text : '��Ӳ���',
					iconCls : 'user-add24',
					scale : 'large',
					handler : function() {
						addDeptPrompt();
					}
				}, '-', {
					text : '�޸Ĳ���',
					iconCls : 'user-mod24',
					scale : 'large',
					handler : function() {
						editDeptPrompt();
					}
				}, '-', {
					text : 'ɾ������',
					iconCls : 'user-del24',
					scale : 'large',
					handler : function() {
						deleteDeptPrompt();
					}
				}],
		// ��ӷ�ҳ������
		bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : deptds,
					displayInfo : true,
					displayMsg : '��ʾ {0}-{1}�� / �� {2} ��',
					emptyMsg : "�����ݡ�"
				})
	}]
};

var deptContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '�鿴����',
		    iconCls: 'user-mod16',
		    handler : function(e) { editDeptPrompt(); }
	    },
	    {
		    text : '��Ӳ���',
		    iconCls: 'user-add16',
		    handler : function() { addDeptPrompt(); }
	    }, 
	    {
		    text : 'ɾ������',
		    iconCls: 'user-del16',
		    handler: function(e) {��deleteDeptPrompt(); }
	    }]
	});

 function popupDeptContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	deptContextMenu.showAt(e.getXY());
};


/* ��������
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
				title : '��Ӳ���',
				iconCls: 'feed-icon',
				items : add_dept_form
			});
		add_dept_form.doLayout();
	}
	add_dept_win.show('tool-bar-new-dept');
}

add_dept_form = new Ext.FormPanel({
	// collapsible : true,// �Ƿ����չ��
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
				fieldLabel : '��������',
				name : 'dept.deptname',
				allowBlank : false
			}, {
				fieldLabel : '��ַ',
				id:'add_dept_address', 
				name : 'dept.address',
				allowBlank : false
			}],

	buttons : [{
				text : '����',
				disabled : false,
				handler : function() {
					if (add_dept_form.form.isValid()) {
						add_dept_form.form.submit({
									url : 'AddDept.action',
									success : function(from, action) {
										// Ext.MessageBox.alert('����ɹ�', '��Ӳ��ųɹ���');
										deptds.load({
													params : {
														start : 0,
														limit : 30,
														forumId : 4
													}
												});
									},
									failure : function(form, action) {
										Ext.MessageBox.alert('����ʧ��', '��Ӳ���ʧ�ܣ�');
									},
									waitMsg : '���ڱ������ݣ����Ժ�...'
								});
						add_dept_win.hide();
					} else {
						Ext.Msg.alert('��Ϣ', '����д������ύ!');
					}
				}
			}, {
				text : 'ȡ��',
				handler : function() {
					add_dept_win.hide();
				}
			}]
});


/* �鿴���޸Ĳ���
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
		Ext.MessageBox.alert('�޸Ĳ���', '��ѡ��Ҫ�޸ĵ�һ�');
	} else {
		ShowDeptForm();
		var _url = 'LoadDept.action?dept.deptid=' + _record.get('deptid');
		dept_form.form.load({
					url : 'LoadDept.action?dept.deptid='
							+ _record.get('deptid'),
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
					title : '�޸Ĳ���',
					iconCls: 'feed-icon',
					items : dept_form
				});
	}
	dept_win.show('tool-bar-new-dept');
}

		
dept_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // ��ǩ���ֶ�¼���֮��Ŀհ�
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
				fieldLabel : '��ʶ',
				name : 'dept2.deptid',
				allowBlank : false,
				readOnly : true
			}, {
				fieldLabel : '������',
				name : 'dept2.deptname',
				allowBlank : false
			}, {��
				fieldLabel : '��ַ',
				name : 'dept2.address', 
				allowBlank : true
			}],

	buttons : [{
				text : '����',
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
										Ext.MessageBox.alert('ʧ��', '�޸Ĳ���ʧ�ܣ�');
									},
									waitMsg : '���ڱ������ݣ��Ժ�...'
								});
						dept_win.hide();
					} else {
						Ext.Msg.alert('��Ϣ', '����д������ύ!');
					}
				}
			}, {
				text : 'ȡ��',
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
		Ext.MessageBox.confirm('ȷ��ɾ��', '��ȷ��Ҫɾ����ѡ�Ĳ�����', function(btn) {
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

						// Ext.example.msg('---ɾ������---', '��ɾ����������');
					}
				});
	} else {
		Ext.MessageBox.alert('ɾ������', '��ѡ��Ҫɾ���������');
	}
}




