Ext.BLANK_IMAGE_URL = '../resource/ext-3.0.0/resources/images/default/s.gif';

var online_port_users_tree = new Ext.tree.TreePanel({
	id : 'port-online-users-view-tree',
	layout : 'fit',
	border : false,
	rootVisible:false,
	split : true,
	collapsible : true, 
	margins : '2 0 5 5',
	cmargins : '2 5 5 5',
	// autoScroll : true,
    animCollapse:true,
    animate: true,
    collapseMode:'mini',
    
    loader : new Ext.tree.TreeLoader({
            dataUrl:'loadDeviceTree.action?user.userid=root'
        }),

	root : new Ext.tree.AsyncTreeNode('port online users'), 
	collapseFirst : false
});
 
var port_online_users_nav_panel	= {
	id : 'port-online-users-nav-panel-id',
	title : '端口当前登录用户',
	border : false,
	autoScroll : true,
	iconCls : 'cg-online-user-icon',
	items : [online_port_users_tree]
};

var port_online_users_folder_menu = new Ext.menu.Menu({
    items: [
    	{
	    	text:'刷新',
		    iconCls: 'refresh-icon',
		    handler : function(e) { refreshPortOnlineUsersTree(); }
		}
	]
});

var port_online_users_leaf_menu = new Ext.menu.Menu({
    items: [
    	{
	    	text:'刷新',
		    iconCls: 'x-tbar-loading',
		    handler : function(e) { refreshPortOnlineUsersTree(); }
		}
	]
});

// Assign the function to be called on tree node click.
online_port_users_tree.on('contextmenu', function(node, e) {
	// e.preventDefault();
	if(node.isLeaf()){
        this.ctxNode = node;
        port_online_users_leaf_menu.showAt(e.getXY());
        node.select();
        return;
     }
     else {
     	port_online_users_folder_menu.showAt(e.getXY());
     }
});


online_port_users_tree.on('click', function(n, e) {
	var sn = this.selModel.selNode || {};  
	if (! n.leaf ) { // the folder node, ignore currently selected node
	}
	else if (n.leaf)
	{
		/* var ip = n.attributes.ip; */
		activeTab(portOnlineUsersMainPanel);
		var pptid = n.attributes.passportid;
		var pptip = n.attributes.ip;
		var portid = n.attributes.portid;
		loadPortLoggedUsers(pptid, portid);
	}
});

function refreshPortOnlineUsersTree(){
	// passport_admin_tree_root_menu.hide();
	online_port_users_tree.getRootNode().reload();
}

var port_online_users_ds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({
		url : 'getLoggedUser.action',
		method 	: 'POST',
		timeout : 60000,
		listeners :  
		{ 'exception' :  conn_exception } 
	}),
	reader : new Ext.data.JsonReader({
		root : 'list',
		totalProperty : 'totalCount',
		// id : 'userid',
		successProperty : '@success'
	}, 
	[{ name : 'userid'}, 
	 { name : 'tty'}, 
	 { name : 'from'}, 
	 { name : 'host'}])
	}
);
 
var port_online_users_grid = new Ext.grid.GridPanel({
	id : 'port-online-users-list-grid',
	region : 'center', 
	xtype : 'grid',
	layout : 'fit',
	loadMask : true, 
	store : port_online_users_ds,
	view : new Ext.grid.GridView(cg_grid_view_cfg),
	columns : [ 
		new Ext.grid.RowNumberer(),
		{ header : '登录名称', width : 85, sortable:true, dataIndex : 'userid'}, 
		{ header : 'TTY', width : 60, sortable:true, dataIndex : 'tty' },
		{ header : '登录时间', width : 120, sortable:false, dataIndex : 'from' }, 
		{ header : '登录的IP地址', width : 120, sortable:false, dataIndex : 'host',id: 'port-logged-user-host' } 
    ],
	stripeRows : true,
	autoExpandColumn: 'port-logged-user-host' 
});
 
var portOnlineUsersMainPanel = {
	id : 'port-online-users-list-panel',
	title:'查看端口当前登录用户',
	layout : 'fit',
	items:[ port_online_users_grid ]
};

var loadPortLoggedUsers = function(pptid, portid) {
	var _url = 'getPortLoggedUser.action?passport.passportid=' + pptid + '&portid=' + portid;
	port_online_users_ds.proxy.setUrl( _url );

	port_online_users_ds.load(); 
}

