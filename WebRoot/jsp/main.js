Ext.BLANK_IMAGE_URL = '../resource/ext-3.0.0/resources/images/default/s.gif';
Ext.MessageBox.minWidth = 280;

// ================ Start page config =======================

// The default start page, also a simple example of a FitLayout.
var start_top = {
	id : 'cg-start-top-panel',
	title : '开始',
	layout : 'fit',
	region : 'center', 
	border : false,
	bodyStyle : 'padding:25px',
	contentEl : 'start-div' // pull existing content from the page
};

var start_bottom = {
	id : 'start-buttom-panel',
	layout : 'fit',
	region : 'south', 
	heigth : 50,
	border : false,
	bodyStyle : 'padding:25px',
	contentEl : 'start-bottom-div' // pull existing content from the page
};

var start = {
	id : 'start-panel',
	layout : 'border',
	items : [start_top, start_bottom]
};

Ext.onReady(function() {

	// NOTE: This is showing simple state management. During
	// development, it is generally best to disable state management as
	// dynamically-generated ids can change across page loads, 
	// leading to unpredictable results.
	// The developer should ensure that stable state ids are set for stateful
	// components in real apps.
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

	Ext.QuickTips.init();
	// turn on validation errors beside the field globally 
    Ext.form.Field.prototype.msgTarget = 'side'; 

	var useradmintree = new Ext.tree.TreePanel({
				id : 'user-admin-tree',
				// title:'user',
				// lines:false,
				layout : 'fit',
				border : false,
				rootVisible : false,
				split : true,
				collapsible : true,
				margins : '2 0 5 5',
				cmargins : '2 5 5 5',
				// autoScroll : true,
				root : new Ext.tree.TreeNode('User Administration'),
				collapseFirst : false
			});

	var useradminroot = useradmintree.root;
	var groupnode = new Ext.tree.TreeNode({
		id : 'group-admin',
		text : '用户组',
		cls : 'feed',
		iconCls : 'group-icon',
		leaf : true,
		expanded : true
	});
	var usernode = new Ext.tree.TreeNode({
		id : 'user-admin',
		text : '用户',
		cls : 'feed',
		iconCls : 'user-icon',
		leaf : true
	});

	useradminroot.appendChild(groupnode);
	useradminroot.appendChild(usernode);
	// useradminroot.appendChild(userpassportnode);

	// Assign the function to be called on tree node click.
	useradmintree.on('click', function(n) {
		if (!n) return;

		var sn = this.selModel.selNode || {}; 
		var panel = n.id + '-panel';
		if (n.leaf) { //  && n.id != sn.id
			// ignore clicks on folders and currently selected node
			Ext.getCmp('main-panel').layout.setActiveItem(panel);
		} 
	});

	/*
	 * *********************************************************************************************
	 */
	var settingstree = new Ext.tree.TreePanel({
		id : 'setting-tree',
		// title:'user',
		lines : true,
		layout : 'fit',
		border : false,
		rootVisible:false,
		split : true,
		collapsible : true,
		expanded : true,
		margins : '2 0 5 5',
		cmargins : '2 5 5 5',
		// autoScroll : true,
		animCollapse:true,
		animate: true,
		collapseMode:'mini',
		root : new Ext.tree.TreeNode(),
		collapseFirst : false
	});
    
	var settingsroot = settingstree.root;
	
	settingsroot.appendChild([
		{ id:'setting-tree-root', text : '系统基本配置', leaf:false, expanded:true,
			children:[
				{id : 'district-admin', text : '地区', iconCls : 'group-icon',leaf : true}, //cls : 'feed', //CG: this matters
				{id : 'site-admin', text : '节点机房', iconCls : 'feed-icon',leaf : true},  
				{id : 'dept-admin', text : '部门', iconCls : 'group-icon', leaf : true},
				{id : 'ipfilter-admin', text : 'IP地址过滤', iconCls : 'cg-log-icon', leaf : true},
				// {id : 'syslog-3rd-admin',text : '第三方syslog服务器', iconCls : 'cg-log-icon',leaf : true}, 
				{id : 'passport-setting',text : '应急通道设备', iconCls : 'feed-icon',leaf : true}
			] 
		}//, 
		// { id:'port-setting-tree-root', text : '应急通道端口配置', leaf:false, expanded:false}
	]);
	
	var port_setting_root = new Ext.tree.TreeNode({
		id : 'port-setting-tree-root',
		text : '应急通道端口配置',
		iconCls : 'settings',
		leaf : false,
		children : [],
		expanded : false
	});
	settingsroot.appendChild([port_setting_root]);
/*
	var sitenode = new Ext.tree.TreeNode({
		id : 'site-admin-cg',
		text : '节点机房',
		cls : 'feed',
		iconCls : 'group-icon',
		leaf : true
	});
	var deptnode = new Ext.tree.TreeNode({
		id : 'dept-admin-cg',
		text : '部门',
		cls : 'feed',
		iconCls : 'feed-icon',
		leaf : true
	});
	var passport_setting_node = new Ext.tree.TreeNode({
		id : 'passport-setting',
		text : '应急通道设备',
		cls : 'feed',
		iconCls : 'feed-icon',
		leaf : true
	});

	//settingsroot.appendChild(sitenode);
	//settingsroot.appendChild(deptnode);
	//settingsroot.appendChild(passport_setting_node);
	// settingstree.expand(); 
*/
	
var port_setting_tree_menu = new Ext.menu.Menu({
    items: [ {
    	text:'刷新',
	    iconCls: 'refresh-icon',
	    handler : function(e) { refreshPortSettingTree(); }
    	}
	]
});

// Assign the function to be called on tree node click.
settingstree.on('contextmenu', function(node, e) {
	e.preventDefault();

	// if(node.isLeaf()){
	var ntype = node.attributes.ntype || {};
	if (node.id == port_setting_root.id || 
		ntype == 'district' || ntype == 'site' || ntype == 'passport'){
        this.ctxNode = node;
        // this.ctxNode.ui.addClass('x-node-ctx');  
        port_setting_tree_menu.showAt(e.getXY());
        node.select();

        return;
     }
});

function refreshPortSettingTree()
{
	// Ext.Msg.alert('cg', port_setting_root.id);
	port_setting_root.leaf = false;
	// port_setting_root.appendChild([sitenode, deptnode]);
	
	Ext.Ajax.request({
		url: 'passportTreeLoader.action',
		success: function(resp, opts) { 
			var obj = Ext.decode(resp.responseText); 
			if (obj && obj.length > 0)
			{
				var node; var i=0;
				
				if (port_setting_root.childNodes && port_setting_root.childNodes.length>0)
				{
					var len = port_setting_root.childNodes.length;
					// Ext.Msg.alert('cg', len);
					for (i=0; i< len; i++){
						port_setting_root.removeChild(port_setting_root.childNodes[0]);
					}
				}
		 
				port_setting_root.appendChild(obj[0].children); //CG: we need only it's child nodes.
				port_setting_root.expand(true);
			}
		},
		failure : function(form, action) {
			Ext.MessageBox.alert('失败', '读取数据失败！');
		},
		params: { 
			'user.userid' : 'root' 
		} 
	});
}

settingstree.on('dblclick', function(node, event) {
	if (node.id == port_setting_root.id){
        event.preventDefault();
        if (!port_setting_root.childNodes || port_setting_root.childNodes.length==0)
        {
        	refreshPortSettingTree();
        } 
     }
});

function showPassportAdminPanel(){
	Ext.getCmp('main-panel').layout.setActiveItem(passportAdminMain.id);
}
// Assign the function to be called on tree node click.
settingstree.on('click', function(n) {
	var sn = this.selModel.selNode || {}; // selNode is null on
	// initial selection
	if (n.leaf) { // && n.id != sn.id, ignore clicks on folders  
		if (n.id == 'district-admin' || n.id == 'site-admin' || 
			n.id == 'dept-admin' || n.id == 'passport-setting' ||
			n.id == 'ipfilter-admin' )
			Ext.getCmp('main-panel').layout.setActiveItem(n.id + '-panel');
		else if (n.id == 'syslog-3rd-admin') {
			set3rdSyslogHandler();
		}
		else if (n.attributes.ntype=='passport') {
			showPassportAdminPanel();
			var pptid = n.attributes.passportid;
			filterDevicesList(n.attributes.ntype, pptid);
		}
	}
	else if (n.attributes.ntype=='district') {
		showPassportAdminPanel();
		var distictid = n.attributes.districtid;
		filterDevicesList(n.attributes.ntype, distictid );
	}
	else if (n.attributes.ntype=='site') {
		showPassportAdminPanel();
		var siteid = n.attributes.siteid;
		filterDevicesList(n.attributes.ntype, siteid); 
	}
	else if (n.id == port_setting_root.id ){
        if (!port_setting_root.childNodes || port_setting_root.childNodes.length==0)
        {
        	refreshPortSettingTree();
        }
        showPassportAdminPanel();
		filterDevicesList('root'); 
	}
});
	

	/*
	 * Card Layout, See setActiveItem, it does check the current ActiveItem.
    setActiveItem : function(item){
        item = this.container.getComponent(item);
        if(this.activeItem != item){
            if(this.activeItem){
                this.activeItem.hide();
            }
            this.activeItem = item;
            item.show();
            this.container.doLayout();
            if(this.layoutOnCardChange && item.doLayout){
                item.doLayout();
            }
        }
    },
	*/
	
// ====================================================================================

	var card_layout = new Ext.layout.CardLayout({deferredRender:'true'});
	// also can utilize "layout:'card', layoutConfig:{deferredRender:'true'}"
	var mainPanel = {
		id : 'main-panel',
		region : 'center',
		autoScroll : true,
		layout : card_layout, // 'card'
		margins : '2 5 5 0',
		activeItem : 0,
		border : false,
		items : [start,
			// from useradmin.js
			showUsers,
			// from group_setting.js
			showGroups,
			// site_setting.js
			showSites,
			// district_setting.js
			showDistricts,
			// dept_setting.js
			showDepts,
			// passport_setting.js
			showIpfilters,
			showPassports,
			// passport_admin.js
			deviceAdminMain,
			passportAdminMain
			//passportAdminPanel
 
		] 
	};

	var viewport = new Ext.Viewport({
		layout : 'border',
		title : 'OOB Manager集中管理系统 cg',
		items : [{
				xtype : 'box',
				region : 'north',
				applyTo : 'header',
				height : 30
			}, {
				region : 'west',
				id : 'west-panel',
				title : '操作导航',
				split : true,
				width : 200,
				minSize : 175,
				maxSize : 400,
				collapsible : true,
				margins : '2 0 5 5',
				cmargins : '2 5 5 5',
				layout : 'accordion',
				layoutConfig : {
					animate : true
				},
				items : [{
						title : '应急通道设备操作',
						autoScroll : true,
						border : false,
						iconCls : 'nav',
						items : [devicetree]
					},
					log_nav_panel,
					port_online_users_nav_panel,
					{
						title : '用户管理',
						border : false,
						autoScroll : true,
						iconCls : 'user-admin',
						items : [useradmintree]
					}, {
						title : '系统设置',
						border : false,
						autoScroll : true,
						iconCls : 'settings',
						items : [settingstree]
					},
					misc_nav_panel
				]
			}, mainPanel
		],
		renderTo : Ext.getBody()
	});
	
	/* This prevent the overall default context menu */
	viewport.el.on('contextmenu', function(e){
            e.preventDefault();
        });

    viewport.on('destroy', function(e) { 
    	/*LeaveSystem();*/ } )
});


Ext.Ajax.request({
	url: 'getLoginUser.action',
	success: function(response, opts) {
        var obj = Ext.decode(response.responseText); 
        
        document.getElementById('header-login-name').innerHTML = '操作员:' + obj.user.fullname ;
	},
	failure : function(reponse, opts) {
		Ext.MessageBox.alert('失败', '登录用户失败！');
		return ''; 
	} 
});
 
function doLogout() {
	Ext.MessageBox.buttonText.yes = '确定';
	Ext.MessageBox.buttonText.no = '取消';
	Ext.MessageBox.confirm('确认', '您确定要退出管理系统吗?', function(btn, msg) {
		if(btn=='yes'){
		    // window.location = '../logout.action';
		    Ext.Ajax.request({ url: 'logout.action'});
		    window.location = '../loginPrompt.html';
		}
	}); 
}

function LeaveSystem() {
    Ext.Ajax.request({ url: 'logout.action'});
}
