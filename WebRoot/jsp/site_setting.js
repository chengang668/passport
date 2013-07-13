
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
    fieldLabel:'����',
	name : 'site.district.districtname',
    store: site_district_ds,
    valueField: 'districtid',
    displayField: 'districtname',
    loadingText : '������...'
});

// create the combo instance
var comboDistrict = new Ext.form.ComboBox({
    typeAhead: true,
    forceSelection: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'����',
	name : 'site2.district.districtname',
    store: site_district_ds,
    valueField: 'districtid',
    displayField: 'districtname',
    loadingText : '������...'
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
		loadMask : true, // �������ֶ���
		store : siteds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [{
					id : 'siteid',
					header : '����ID',
					width : 50,
					sortable : true,
					dataIndex : 'siteid'
				}, {
					header : '��������',
					width : 100,
					sortable : true,
					dataIndex : 'sitename'
				}, {
					header : '����',
					width : 100,
					sortable : true,
					dataIndex : 'districtname'
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
      				// �����ǰ�Ҽ���������б��У���ôֹͣ�¼�   
      				e.stopEvent();   
    			} else{
    				popupSiteContextMenu(this, rowIndex, e);
    			}*/    			
			}
		},
		tbar : [{
					// xtype:'button',
					id : 'tool-bar-new-site',
					text : '��ӻ���',
					iconCls : 'user-add24',
					scale : 'large',
					handler : function() {
						addSitePrompt();
					}
				}, '-', {
					text : '�޸Ļ���',
					iconCls : 'user-mod24',
					scale : 'large',
					handler : function() {
						editSitePrompt();
					}
				}, '-', {
					text : 'ɾ������',
					iconCls : 'user-del24',
					scale : 'large',
					handler : function() {
						deleteSitePrompt();
					}
				}],
		// ��ӷ�ҳ������
		bbar : new Ext.PagingToolbar({
					pageSize : 30,
					store : siteds,
					displayInfo : true,
					displayMsg : '��ʾ {0}-{1}�� / �� {2} ��',
					emptyMsg : "�����ݡ�"
				})
	}]
};

var siteContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '�鿴����',
		    iconCls: 'user-mod16',
		    handler : function(e) { editSitePrompt(); }
	    },
	    {
		    text : '��ӻ���',
		    iconCls: 'user-add16',
		    handler : function() { addSitePrompt(); }
	    }, 
	    {
		    text : 'ɾ������',
		    iconCls: 'user-del16',
		    handler: function(e) { deleteSitePrompt(); }
	    }]
	});

 function popupSiteContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	siteContextMenu.showAt(e.getXY());
};


/* ��������
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
					title : '��ӻ���',
					iconCls: 'feed-icon',
					items : add_site_form
				});
	}
	add_site_win.show('tool-bar-new-site');
}

add_site_form = new Ext.FormPanel({
	// collapsible : true,// �Ƿ����չ��
	labelWidth : 75,  
	url : 'AddSite.action',
	frame : true,
	// title : '��ӻ���',
	bodyStyle : 'padding:5px 5px 0',
	width : 350,
	waitMsgTarget : true,
	// reader :site_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
				fieldLabel : '��������',
				name : 'site.sitename',
				allowBlank : false
			}, 
			comboDistrictAdd ,
			{
				fieldLabel : '��ַ',
				id:'add_site_address', 
				name : 'site.address',
				allowBlank : false
			}],

	buttons : [{
				text : '����',
				disabled : false,
				type:'submit',
        		formBind: true,
				handler : doAddSite
			}, {
				text : 'ȡ��',
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
				// Ext.MessageBox.alert('����ɹ�', '��ӻ����ɹ���');
				siteds.load({
							params : {
								start : 0,
								limit : 30,
								forumId : 4
							}
						});
			},
			failure : function(form, action) {
				Ext.MessageBox.alert('����ʧ��', '��ӻ���ʧ�ܣ�');
			},
			waitMsg : '���ڱ������ݣ����Ժ�...'
		});
		add_site_win.hide();
	} else {
		Ext.Msg.alert('��Ϣ', '����д������ύ!');
	}
}

/* �鿴���޸Ļ���
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
		Ext.MessageBox.alert('�޸Ĳ���', '��ѡ��Ҫ�޸ĵ�һ�');
	} else {
		ShowSiteForm();
		var _url = 'LoadSite.action?site.siteid=' + _record.get('siteid');
		site_form.form.load({
			url : 'LoadSite.action?site.siteid=' + _record.get('siteid'),
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
					title : '�޸Ļ���',
					iconCls: 'feed-icon',
					items : site_form
				});
	}
	site_win.show('tool-bar-new-site');
}

		
site_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // ��ǩ���ֶ�¼���֮��Ŀհ�
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
				fieldLabel : '��ʶ',
				name : 'site2.siteid',
				allowBlank : false,
				readOnly : true
			}, {
				fieldLabel : '��������',
				name : 'site2.sitename',
				allowBlank : false
			}, comboDistrict , 
			{ 
				fieldLabel : '��ַ',
				name : 'site2.address', 
				allowBlank : true
			}],

	buttons : [{
				text : '����',
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
										Ext.MessageBox.alert('ʧ��', '�޸Ļ���ʧ�ܣ�');
									},
									waitMsg : '���ڱ������ݣ��Ժ�...'
								});
						site_win.hide();
					} else {
						Ext.Msg.alert('��Ϣ', '����д������ύ!');
					}
				}
			}, {
				text : 'ȡ��',
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
		Ext.MessageBox.confirm('ȷ��ɾ��', '��ȷ��Ҫɾ����ѡ�Ļ�����', function(btn) {
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

						// Ext.example.msg('---ɾ������---', '��ɾ����������');
					}
				});
	} else {
		Ext.MessageBox.alert('ɾ������', '��ѡ��Ҫɾ���������');
	}
}


