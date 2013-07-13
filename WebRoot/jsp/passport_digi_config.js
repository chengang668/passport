
var passport_form;
var passport_win;

/*
 * ================   Passport Admin Pannel config  =======================
 */

/*
 * {success:true,totalCount : 1, list:
 * [{"site":{"sitename":"�Ϻ�","address":"�Ϻ�","siteid":1},
 *   "givenname":"givenname",
 *   "owner":"Chen Gang",
 *   "hostname":"hostname",
 *   "passportid":1,
 *   "dept":{"deptid":1,"upperdeptid":0,"deptname":"�������粿"},
 *   "ip":"192.168.0.11"}]}
 */

function getDeptname(v) { 
    if (Ext.isEmpty(v))
        return '';
    else if (!Ext.isEmpty(v.deptname))
        return v.deptname;
    else
        return '';
};

function getSitename(v)
{
    if (Ext.isEmpty(v))
        return '';
    else if (!Ext.isEmpty(v.sitename))
        return v.sitename;
    else
        return '';
}

var passport_jsonReader = new Ext.data.JsonReader({
		root : 'list',
		totalProperty : 'totalCount',
		id : 'passportid',
		successProperty : '@success'
	}, [{ name : 'passportid', mapping : 'passportid' /* type :'int' */ }, 
		{ name : 'ip', mapping : 'ip' }, 
		//{ name : 'hostname',  mapping : 'hostname' }, 
		{ name : 'givenname', mapping : 'givenname' },
		{ name : 'owner',  mapping : 'owner' }, 
		//{ name : 'deptname', mapping : 'dept.deptname' }, 
		{ name : 'deptname', mapping : 'dept', convert:getDeptname }, 
		//{ name : 'sitename', mapping : 'site.sitename' }
		{ name : 'sitename', mapping : 'site', convert:getSitename }
		]);

var passportds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({
		url : 'passportData.action',
		method 	: 'POST',
		listeners :  
		{   'exception' :  ds_exception  
		}
	}),
	//
	reader : passport_jsonReader
});
// passportds.setDefaultSort('passportid', 'desc');

/*
 * passportds.load( { params : { start :0, limit :30, forumId :4 } });
 */

var showPassports = {
	id : 'passport-setting-panel',
	layout : 'border',
	items : [
	{
		id : 'passport-grid',
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // �������ֶ���
		store : passportds,
		view : cg_grid_view,
		columns : [{
				id : 'passportid',
				header : 'Passport���',
				width : 50,
				sortable : true,
				dataIndex : 'passportid'
			}, {
				header : 'IP ��ַ',
				width : 100,
				sortable : true,
				dataIndex : 'ip'
			}, {
				id : 'givenname',
				header : 'Ӧ��ͨ���豸����',
				width : 150,
				sortable : true,  
				dataIndex : 'givenname'
			}, {
				id : 'owner',
				header : '������',
				width : 150,
				sortable : true,  
				dataIndex : 'owner'
			}, {
				id : 'deptname',
				header : '��������',
				width : 150,
				sortable : true,  
				dataIndex : 'deptname'
			}, {
				id : 'sitename',
				header : '���ڻ���',
				width : 150,
				sortable : true,  
				dataIndex : 'sitename'
			} ],
		stripeRows : true,
		autoExpandColumn: 'sitename',

		// Add a listener to load the data only after the grid is rendered:
		listeners : {
			render : function() {
				// this.store.loadData(myPassportData);
				this.store.load();
			},
			rowdblclick : function(grid, index) {
				showSinglePassport(grid, index);
			},
			/*rowcontextmenu : function (grid, rowIndex, e) {
				popupPassportContextMenu(this, rowIndex, e);
			},*/
			contextmenu : function (e) {
				var rowIndex = this.view.findRowIndex(e.getTarget());   
				popupPassportContextMenu(this, rowIndex, e);
				/*if (false !== rowIndex) {   
      				// �����ǰ�Ҽ���������б��У���ôֹͣ�¼�   
      				e.stopEvent();   
    			} else{
    				popupPassportContextMenu(this, rowIndex, e);
    			} */   			
			}
		},
		tbar : [{
				// xtype:'button',
				id : 'tool-bar-new-passport',
				text : 'Ӧ��ͨ���豸',
				iconCls : 'user-add24',
				scale : 'large',
				handler : function() {
					addPassportPrompt();
				}
			}, '-', {
				text : '�޸�Ӧ��ͨ���豸',
				iconCls : 'user-mod24',
				scale : 'large',
				handler : function() {
					editPassportPrompt();
				}
			}, '-', {
				text : 'ɾ��Ӧ��ͨ���豸',
				iconCls : 'user-del24',
				scale : 'large',
				handler : function() {
					deletePassportPrompt();
				}
			}],
		// ��ӷ�ҳ������
		bbar : new Ext.PagingToolbar({
			pageSize : 30,
			store : passportds,
			displayInfo : true,
			displayMsg : '��ʾ {0}-{1}�� / �� {2} ��',
			emptyMsg : "�����ݡ�"
		})
	}]
};

var passportContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '�鿴Passport�豸',
		    iconCls: 'user-mod16',
		    handler : function(e) { editPassportPrompt(); }
	    },
	    {
		    text : '������Passport�豸',
		    iconCls: 'user-add16',
		    handler : function() { addPassportPrompt(); }
	    }, 
	    {
		    text : 'ɾ��Passport�豸',
		    iconCls: 'user-del16',
		    handler: function(e) {��deletePassportPrompt(); }
	    }]
	});

 function popupPassportContextMenu(grid, rowIndex, e){
	e.preventDefault();
	// grid.getView().focusRow(rowIndex); 
	passportContextMenu.showAt(e.getXY());
};


/* ����Passport�豸
 * ===================================================================================
 */

var ppt_site_jR = site_jsonReader;
var ppt_site_ds = siteds;

var ppt_dept_jr = dept_jsonReader;
var ppt_dept_ds = deptds;

// create the combo for site and dept
var comboSiteAdd = new Ext.form.ComboBox({
    typeAhead: true,
    triggerAction: 'all',
    forceSelection: true,
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'���ڻ���',
	name : 'passport.site.sitename',
    store: ppt_site_ds,
    valueField: 'siteid',
    displayField: 'sitename',
    loadingText : '������...'
});

var comboDeptAdd = new Ext.form.ComboBox({
    typeAhead: true,
    forceSelection: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'��������',
    name : 'passport.dept.deptname',
    store: ppt_dept_ds,
    valueField: 'deptid',
    displayField: 'deptname',
    loadingText : '������...'
});


add_passport_form = new Ext.FormPanel({
	// collapsible : true,// �Ƿ����չ��
	labelWidth : 75,  
	url : 'AddPassport.action',
	frame : true,
	// title : '���Passport�豸',
	bodyStyle : 'padding:5px 5px 0',
	//width : 350,
	waitMsgTarget : true,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
			fieldLabel : 'IP��ַ',
			id:'add_passport_ip_address', 
			name : 'passport.ip',
			allowBlank : false
		}, {
			fieldLabel : '����',
			name : 'passport.givenname',
			allowBlank : true
		}, {
			fieldLabel : '������',
			name : 'passport.owner',
			allowBlank : true
		}, 
		comboDeptAdd,
		comboSiteAdd
			/* {
				fieldLabel : '��������',
				name : 'passport.dept.deptname',
				allowBlank : true
			}, {
				fieldLabel : '���ڻ���',
				name : 'passport.site.sitename',
				allowBlank : true
			} */ ],

	buttons : [{
		text : '����', 
		handler : function() {
			if (add_passport_form.form.isValid()) {
				add_passport_form.form.submit({
					url : 'AddPassport.action',
					success : function(from, action) {
						// Ext.MessageBox.alert('����ɹ�', '���Passport�豸�ɹ���');
						passportds.load({
							params : {
								start : 0,
								limit : 30,
								forumId : 4
							}
						});
					},
					failure : function(form, action) {
						Ext.MessageBox.alert('����ʧ��', '���Passport�豸ʧ�ܣ�');
					},
					waitMsg : '���ڱ������ݣ����Ժ�...'
				});
				add_passport_win.hide();
			} else {
				Ext.Msg.alert('��Ϣ', '����д������ύ!');
			}
		}
	}, {
		text : 'ȡ��',
		handler : function() {
			add_passport_win.hide();
		}
	}]
});


var addPassportPrompt = function() {
	AddPassportForm();
}

var add_passport_win;
var AddPassportForm = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!add_passport_win) 
	{
		add_passport_win = new Ext.Window({
			layout : 'fit',
			width : 400,
			height : 300,
			closeAction : 'hide',
			plain : true,
			title : '���Passport�豸',
			iconCls: 'feed-icon',
			items : add_passport_form
		});
	}
	add_passport_win.show('tool-bar-new-passport');
}

/* �鿴���޸�Passport�豸
 * ========================================================================================
 */

var get_passport_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'passportid',
		successProperty :'@success'
	}, 
	[{ 	name :'passport2.passportid', 	mapping :'passportid' }, 
	 {	name :'passport2.ip',    		mapping :'ip' },  
	 {	name :'passport2.givenname',	mapping :'givenname' },
	 {	name :'passport2.owner',		mapping :'owner' },
	 {	name :'passport2.dept.deptname',	mapping : 'dept', convert:getDeptname },
	 {	name :'passport2.site.sitename',	mapping : 'site', convert:getSitename }
	]
);

var editPassportPrompt = function() {
	loadPassportDetail(Ext.getCmp('passport-grid'));
}

function showSinglePassport(grid, index) {
	loadPassportDetail(grid, index);
}

var loadPassportDetail = function(grid, index) {
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('�޸Ĳ���', '��ѡ��Ҫ�޸ĵ�һ�');
	} else {
		ShowPassportForm();
		var _url = 'LoadPassport.action?passport.passportid=' + _record.get('passportid');
		passport_form.form.load({
			url : 'LoadPassport.action?passport.passportid='
					+ _record.get('passportid'),
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

var ShowPassportForm = function() {
	// create the window on the first click and reuse on subsequent
	// clicks

	if (!passport_win) {
		passport_win = new Ext.Window({
			// el : 'topic-win',
			layout : 'fit',
			width : 400,
			height : 300,
			closeAction : 'hide',
			plain : true,
			title : '�޸�Passport�豸',
			iconCls: 'feed-icon',
			items : passport_form 
		});
	}
	passport_win.show('tool-bar-new-passport');
}

		
// create the combo instance
var comboSite = new Ext.form.ComboBox({
    typeAhead: true,
    forceSelection: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'���ڻ���',
	name : 'passport2.site.sitename',
    store: ppt_site_ds,
    valueField: 'siteid',
    displayField: 'sitename',
    loadingText : '������...'
});

var comboDept = new Ext.form.ComboBox({
    typeAhead: true,
    forceSelection: true,
    triggerAction: 'all',
    lazyRender:true,
    mode: 'remote', // 'local' for Ext.data.ArrayStore 
    fieldLabel:'��������',
    name : 'passport2.dept.deptname',
    store: ppt_dept_ds,
    valueField: 'deptid',
    displayField: 'deptname',
    loadingText : '������...'
});

passport_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // ��ǩ���ֶ�¼���֮��Ŀհ�
	url : 'UpdatePassport.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 480,
	waitMsgTarget : true,
	reader :get_passport_jsonFormReader,
	defaults : {
		width : 260
	},
	defaultType : 'textfield',
	items : [{
			fieldLabel : '��ʶ',
			name : 'passport2.passportid',
			allowBlank : false,
			readOnly : true
		}, {��
			fieldLabel : 'IP��ַ',
			name : 'passport2.ip', 
			allowBlank : false
		}, {
			fieldLabel : '����',
			name : 'passport2.givenname',
			allowBlank : true
		}, {
			fieldLabel : '������',
			name : 'passport2.owner',
			allowBlank : true
		}, 
		comboDept,
		comboSite
			/*{
				fieldLabel : '��������',
				name : 'passport2.dept.deptname',
				allowBlank : true
			}, {
				fieldLabel : '���ڻ���',
				name : 'passport2.site.sitename',
				allowBlank : true
			}*/ ],

	buttons : [{
		text : '����',
		type : 'submit',
		disabled : false,
		handler : function() {
			if (passport_form.form.isValid()) {
				passport_form.form.submit({
					url : 'UpdatePassport.action',
					success : function(from, action) {
						passportds.load({
							params : {
								start : 0,
								limit : 30,
								forumId : 4
							}
						});
					},
					failure : function(form, action) {
						Ext.MessageBox.alert('ʧ��', '�޸�Passport�豸ʧ�ܣ�');
					},
					waitMsg : '���ڱ������ݣ��Ժ�...'
				});
				passport_win.hide();
			} else {
				Ext.Msg.alert('��Ϣ', '����д������ύ!');
			}
		}
	}, {
		text : 'ȡ��',
		handler : function() {
			passport_win.hide();
		}
	}]
});


/*==================================================================================*/

var deletePassportPrompt = function() {
	var grid = Ext.getCmp('passport-grid');
	var ds = grid.getStore();
	var _record = grid.getSelectionModel().getSelected();
	if (_record) {
		Ext.MessageBox.confirm('ȷ��ɾ��', '��ȷ��Ҫɾ����ѡ��Passport�豸��', function(btn) {
			if (btn == "yes") {
				// var m = grid.getSelections(); purged on Ext3.0
				// grid.selModel.selections.items;
				var m = grid.getSelectionModel().getSelections();
				var jsonData = "";
				for (var i = 0, len = m.length; i < len; i++) {
					var ss = m[i].get("passportid");
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




