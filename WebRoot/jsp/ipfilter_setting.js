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
					header : '���',
					width : 50,
					sortable : true,
					dataIndex : 'id'
				}, {
					id : 'ipfilter-grid-ip',
					header : 'IP��ַ',
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
      				// �����ǰ�Ҽ���������б��У���ôֹͣ�¼�   
      				e.stopEvent();   
    			} else{
    				popupIpfilterContextMenu(this, rowIndex, e);
    			}    			
			}
		},
		tbar : [{
					// xtype:'button',
					id : 'tool-bar-new-ipfilter',
					text : '���IP',
					iconCls : 'user-add24',
					scale : 'large',
					handler : function() {
						addIpfilterPrompt();
					}
				}, '-', {
					text : '�޸�IP',
					iconCls : 'user-mod24',
					scale : 'large',
					handler : function() {
						editIpfilterPrompt();
					}
				}, '-', {
					text : 'ɾ��IP',
					iconCls : 'user-del24',
					scale : 'large',
					handler : function() {
						deleteIpfilterPrompt();
					}
				}],
		// ��ӷ�ҳ������
		bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : ipfilterds,
					displayInfo : true,
					displayMsg : '��ʾ {0}-{1}�� / �� {2} ��',
					emptyMsg : "�����ݡ�"
				})
	}]
};

var ipfilterContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '�鿴',
		    iconCls: 'user-mod16',
		    handler : function(e) { editIpfilterPrompt(); }
	    },
	    {
		    text : '���IP',
		    iconCls: 'user-add16',
		    handler : function() { addIpfilterPrompt(); }
	    }, 
	    {
		    text : 'ɾ��IP',
		    iconCls: 'user-del16',
		    handler: function(e) {��deleteIpfilterPrompt(); }
	    }]
	});

 function popupIpfilterContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	ipfilterContextMenu.showAt(e.getXY());
};


/* ����
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
				title : '���IP',
				iconCls: 'feed-icon',
				items : add_ipfilter_form
			});
		add_ipfilter_form.doLayout();
	}
	add_ipfilter_win.show('tool-bar-new-ipfilter');
}

add_ipfilter_form = new Ext.FormPanel({
	// collapsible : true,// �Ƿ����չ��
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
				fieldLabel : 'IP ��ַ',
				id:'add_ipfilter_address', 
				name : 'ipfilter.ip',
				allowBlank : false
			}],

	buttons : [{
				text : '���',
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
										Ext.MessageBox.alert('����ʧ��', '���IPʧ�ܣ�');
									},
									waitMsg : '���ڱ������ݣ����Ժ�...'
								});
						add_ipfilter_win.hide();
					} else {
						Ext.Msg.alert('��Ϣ', '����д������ύ!');
					}
				}
			}, {
				text : 'ȡ��',
				handler : function() {
					add_ipfilter_win.hide();
				}
			}]
});


/* �鿴���޸�
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
		Ext.MessageBox.alert('�޸Ĳ���', '��ѡ��Ҫ�޸ĵ�һ�');
	} else {
		ShowIpfilterForm();
		var _url = 'LoadIpfilter.action?ipfilter.id=' + _record.get('id');
		ipfilter_form.form.load({
					url : 'LoadIpfilter.action?ipfilter.id=' + _record.get('id'),
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
					title : '�޸�IP��ַ',
					iconCls: 'feed-icon',
					items : ipfilter_form
				});
	}
	ipfilter_win.show('tool-bar-new-ipfilter');
}

		
ipfilter_form = new Ext.FormPanel({ 
	labelWidth : 55,  
	labelAlign : 'left',
	// labelPad : 0,  // ��ǩ���ֶ�¼���֮��Ŀհ�
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
				fieldLabel : '���',
				name : 'ipfilter2.id',
				allowBlank : false,
				readOnly : true
			}, {��
				fieldLabel : 'IP��ַ',
				name : 'ipfilter2.ip', 
				allowBlank : true
			}],

	buttons : [{
				text : '����',
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
										Ext.MessageBox.alert('ʧ��', '�޸�IPʧ�ܣ�');
									},
									waitMsg : '���ڱ������ݣ��Ժ�...'
								});
						ipfilter_win.hide();
					} else {
						Ext.Msg.alert('��Ϣ', '����д������ύ!');
					}
				}
			}, {
				text : 'ȡ��',
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
		Ext.MessageBox.confirm('ȷ��ɾ��', '��ȷ��Ҫɾ����ѡ��IP��', function(btn) {
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

						// Ext.example.msg('---ɾ������---', '��ɾ����������');
					}
				});
	} else {
		Ext.MessageBox.alert('ɾ������', '��ѡ��Ҫɾ���������');
	}
}




