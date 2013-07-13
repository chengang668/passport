Ext.BLANK_IMAGE_URL = '../resource/ext-3.0.0/resources/images/default/s.gif';
Ext.MessageBox.minWidth = 280;

// ================ Start page config =======================

// The default start page, also a simple example of a FitLayout.
var start_top = {
	id : 'cg-start-top-panel',
	title : '��ʼ',
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
			// passport_admin.js
			deviceAdminMain 
			//passportAdminPanel
		] 
	};

	var viewport = new Ext.Viewport({
		layout : 'border',
		title : 'Passport ���й���ϵͳ cg',
		items : [{
				xtype : 'box',
				region : 'north',
				applyTo : 'header',
				height : 30
			}, {
				region : 'west',
				id : 'west-panel',
				title : '��������',
				split : true,
				width : 200,
				minSize : 175,
				maxSize : 400,
				collapsible : true,
				margins : '2 0 5 5',
				cmargins : '2 5 5 5',
				layout : 'accordion',
				layoutConfig : { animate : true	},
				items : [{
					title : 'Ӧ��ͨ���豸����',
					autoScroll : true,
					border : false,
					iconCls : 'nav',
					items : [devicetree]
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
    	LeaveSystem(); } )
});

Ext.Ajax.request({
	url: 'getLoginUser.action',
	success: function(response, opts) {
        var obj = Ext.decode(response.responseText); 
        
        document.getElementById('header-login-name').innerHTML = '����Ա:' + obj.user.fullname ;
	},
	failure : function(reponse, opts) {
		Ext.MessageBox.alert('ʧ��', '��¼�û�ʧ�ܣ�');
		return; 
	} 
});

function doLogout() {
	Ext.MessageBox.buttonText.yes = 'ȷ��';
	Ext.MessageBox.buttonText.no = 'ȡ��';
	Ext.MessageBox.confirm('ȷ��', '��ȷ��Ҫ�˳�����ϵͳ��?', function(btn, msg) {
		if(btn=='yes'){
		    // window.location = '../logout.action';
		    Ext.Ajax.request({ url: 'logout.action'});
		    window.location = '../loginPrompt.html';
		}
	}); 
}