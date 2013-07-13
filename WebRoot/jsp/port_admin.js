

function createPortAdminReader()
{
	var port_admin_jsr = new Ext.data.JsonReader({
		root : 'list',
		totalProperty : 'totalCount',
		idProperty : 'id.portid',
		successProperty : '@success'}, 
		[{ name : 'portNo', mapping : 'id.portid'  }, 
		{ name : 'group', mapping : 'group' }, 
		{ name : 'title',  mapping : 'title' }, 
		{ name : 'port', mapping : 'port' },
		{ name : 'mode',  mapping : 'mode' }, 
		{ name : 'protocol', mapping : 'protocol' },
		{ name : 'serial_setting', mapping : 'serial_setting' }
	]);
	
	return port_admin_jsr;
};

function createPortAdminProxy(passportIP)
{
	var url = 'getPassportPortsList.action?passport.ip=' + passportIP;
	return new Ext.data.HttpProxy({
		url : url,
		method 	: 'POST',
		listeners :  
		{   'exception' :  conn_exception  
		}
	});
}

function createPortAdminDS(json_reader, httpProxy)
{
	var port_admin_ds = new Ext.data.Store({
		proxy : httpProxy,
		reader : json_reader
	});
	return port_admin_ds;
}

function createDeviceList(ppt_ip){
	
	var gridid = 'port-admin-grid-' + ppt_ip;
	
	var port_admin_jsr = createPortAdminReader();
	var port_admin_proxy = createPortAdminProxy(ppt_ip);
	var port_admin_ds = createPortAdminDS(port_admin_jsr, port_admin_proxy);
	
	var port_list_grid = new Ext.grid.GridPanel({
		id : gridid,
		region : 'center', 
		xtype : 'grid',
		layout : 'fit',
		loadMask : true, // �������ֶ���
		store : port_admin_ds,
		view : new Ext.grid.GridView(cg_grid_view_cfg),
		columns : [ 
			 {
				//id : 'portno',
				header : '�˿ڱ��',
				width : 60,
				sortable : true,
				dataIndex : 'portNo'
			},{
				// id : 'ppta_hostname',
				header : '�˿��豸����',
				width : 150,
				sortable : true,  
				dataIndex : 'title'
			},{
				header : '��',
				width : 80,
				sortable : true,
				dataIndex : 'group'
			}, { 
				header : 'Զ�̵�¼ģʽ',
				width : 150,
				sortable : true,  
				dataIndex : 'mode'
			}, { 
				header : 'ͨ�Ŷ˿�',
				width : 100,
				sortable : true,  
				dataIndex : 'port'
			}, { 
				header : 'ͨ��Э��',
				width : 100,
				sortable : true,  
				dataIndex : 'protocol'
			}, { 
				header : '���ڲ���',
				width : 150,
				sortable : true,  
				dataIndex : 'serial_setting'
			}],
		stripeRows : true,
		// autoExpandColumn: 'ppta_sitename',

		// Add a listener to load the data only after the grid is rendered:
		listeners : {
			render : function() {
				this.store.load();
			},
			rowdblclick : function(grid, index) {
				//showPptStatusTab(grid, index);
			},
			/*rowcontextmenu : function (grid, rowIndex, e) {
				//popupPassportAdminContextMenu(this, rowIndex, e);
			},*/
			contextmenu : function (e) {
				var rowIndex = this.view.findRowIndex(e.getTarget());   
				popupPassportAdminContextMenu(this, rowIndex, e);
				/*if (false !== rowIndex) {   
      				// �����ǰ�Ҽ���������б��У���ôֹͣ�¼�   
      				e.stopEvent();   
    			} else{
    				popupPassportAdminContextMenu(this, rowIndex, e);
    			}*/    			
			}
		},
		tbar : [{ 
			// id : 'tool-bar-port-admin',
			text : 'Telnet',
			iconCls : 'telnet-ssh32',
			scale : 'large',
			handler : function() {
				launchTelnetSession();
			}
		}, '-', {
			text : '�鿴��־',
			iconCls : 'refresh-icon',
			scale : 'large',
			handler : function() {
				viewPortLog();
			}
		},'-',{
	    	text:'ˢ��',
		    iconCls: 'refresh-icon',
			scale : 'large',
		    handler : function(e) { port_admin_ds.reload(); }
	    }]
	});

	return port_list_grid;
}
 