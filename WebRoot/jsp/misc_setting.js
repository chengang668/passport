Ext.BLANK_IMAGE_URL = '../resource/ext-3.0.0/resources/images/default/s.gif';

var misc_tree = new Ext.tree.TreePanel({
	id : 'misc-operation-tree',
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
	root : new Ext.tree.TreeNode('Misc operations'),
	collapseFirst : false
});

misc_tree.root.appendChild([{ id:'misc-tree-root', text : '其他操作', leaf:false, expanded:true,
	children:[		
		{id : 'curr-user-info', text : '当前用户信息',cls : 'feed',iconCls : 'user-icon',leaf : true}, 
		{id : 'curr-user-chgpwd', text : '修改系统登录密码',cls : 'feed',iconCls : 'feed-icon', leaf : true},
		{id : 'online-user-list', text : '在线用户列表',cls : 'feed',iconCls : 'group-icon', leaf : true}
	] 
}]);
	
var misc_nav_panel	= {
	id : 'misc-nav-panel-id',
	title : '其它操作',
	border : false,
	autoScroll : true,
	iconCls : 'feed-icon',
	items : [misc_tree]
};

// Assign the function to be called on tree node click.
misc_tree.on('click', function(n) {
	var sn = this.selModel.selNode || {}; // selNode is null or initial selection
	if (!n.leaf)// && n.id != sn.id, ignore clicks on folders  
		return; 

	if (n.id == 'curr-user-info') { 
		/* var u_tab_id = 'curr-user-info-panel';
		var mainp = Ext.getCmp('main-panel');
		var tab = mainp.getComponent(u_tab_id);
		if (!tab){
			mainp.add( ShowCurrentUserInfo );
		}
	    mainp.layout.setActiveItem('curr-user-info-panel');
	    */
	    activeTab(ShowCurrentUserInfo);
	    loadUserInfoData();
	    return;
	}
	if (n.id == 'curr-user-chgpwd') { 
		chgpwdHandler();
		return;
	}
	if (n.id == 'online-user-list'){ 
		activeTab(OnlineUsersList);
		return;
	}
});

var pwd_win;
var pwd_form;

function chgpwdHandler()
{	
	ShowPasswordChangeDlg();
	pwd_form.form.reset();
}

var ShowPasswordChangeDlg = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!pwd_win) {
		pwd_win = new Ext.Window({
			layout : 'fit',
			width : 400,
			height : 180,
			closeAction : 'hide',
			plain : true,
			title : '修改密码',
			iconCls: 'feed-icon',
			items : pwd_form
		});
	}
	pwd_win.show('tool-bar-new-user');
};


var pwd_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'userid',
		successProperty :'success'
	}, [ {
		name :'user4.userid',
		mapping :'userid'   // type :'int'
	}, {
		name :'user4.fullname',
		mapping :'fullname'
	}
   ]
);

pwd_form = new Ext.FormPanel({ 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	url : 'ChangePassword.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 380,
	waitMsgTarget : true,
	reader :pwd_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
			fieldLabel : '原密码',
			id:'usr_pwd_password0',
            inputType:'password', 
			name : 'user4.passwd0',
			allowBlank : false
		},{
			fieldLabel : '新密码',
			id:'usr_pwd_password1',
            inputType:'password', 
			name : 'user4.passwd',
			allowBlank : false
		}, {
			fieldLabel : '确认新密码',
			id:'usr_pwd_password2',
            inputType:'password', 
			allowBlank : false
		}],

	buttons : 
	[{　		text : '确定',　
			type : 'submit',　
			disabled : false,　
			handler : doUserPwdChg 
		}, 
		{　	text : '取消',
		　	handler : function() {　pwd_win.hide();　}
	}],
		
	keys : [ { key:[10, 13], fn: doUserPwdChg} ]
});

function doUserPwdChg() {
	
	if (!pwd_form.form.isValid()) {
		Ext.Msg.alert('提示', '请填写完成再提交!');
		return;
	}
	
	var pwd0 = pwd_form.findById('usr_pwd_password0').getEl().getValue();
	var pwd1 = Ext.getCmp('usr_pwd_password1').getValue();
	var pwd2 = Ext.getCmp('usr_pwd_password2').getValue();

	if (pwd1 != pwd2){
		Ext.MessageBox.alert("输入错误", "确认密码与密码不一致！请重试。");
		return;
	}
	var pwd = pwd1; // hex_md5(pwd1); 
	var pwd00 = pwd0; // hex_md5(pwd0); 

	Ext.Ajax.request({
		url: 'ChangePassword.action',
		success : function(response, opts) {
			var obj = Ext.decode(response.responseText);
			if (obj.success == false) {
				Ext.MessageBox.alert('修改失败', obj.error.reason);
			}
			else {
				pwd_win.hide();
				Ext.MessageBox.alert('成功', '您已成功修改登录密码');
			}
		},
		failure : function(response, opts) {
			// Ext.MessageBox.alert('失败', '修改密码失败，请重试！');
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.MessageBox.alert('失败', obj.error.reason);
				// pwd_win.show();
			}
		},
		params: { 
			'user.passwd': pwd00, //old
			'user2.passwd': pwd
		} 
	});	
}

var user_info_jsonReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'userid',
		successProperty :'success'
	}, [ {
		name :'user_info.userid',
		mapping :'userid'   // type :'int'
	}, {
		name :'user_info.fullname',
		mapping :'fullname'
	}, {
		name :'user_info.createtime',
		mapping :'createtime',
		convert: renderDateF('Y-m-d H:i:s')  
    }, {
		name :'user_info.lastlogin',
		mapping :'lastlogin',
		convert: renderDateF('Y-m-d H:i:s') 
    }, {
		name :'user_info.pwdexpiredate',
		mapping :'pwdexpiredate',
		convert: renderDateF('Y-m-d H:i:s') 
    }, {
		name :'user_info.clientip',
		mapping :'clientip' 
    } 
   ]
);

var user_info_form = new Ext.FormPanel({ 
	labelWidth : 100, 
	// url : 'LoadUser.action',
	frame : true, 
	region : 'center',
	bodyStyle : 'padding:15px 15px 15px 15px',
	// width : 350,
	waitMsgTarget : true, 
	reader : user_info_jsonReader,
	defaults : {
		width : 260
	},
	defaultType : 'textfield',
	items : [{
			fieldLabel : '登录名',
			id : 'user_info_form_userid',
			name : 'user_info.userid',
			readOnly : true 
		}, {
			fieldLabel : '用户姓名',
			id : 'user_info_form_fullname',
			name : 'user_info.fullname',
			readOnly : true 
		}, { 
			fieldLabel : '创建日期',
			name : 'user_info.createtime', 
			readOnly : true  
		}, { 
			fieldLabel : '最近登陆时间',
			name : 'user_info.lastlogin',
			// anchor: '80%',
			readOnly : true 
		}, { 
			fieldLabel : '密码过期时间',
			name : 'user_info.pwdexpiredate',
			// anchor: '80%',
			readOnly : true 
		}, { 
			fieldLabel : '客户端IP地址',
			name : 'user_info.clientip',
			// anchor: '80%',
			readOnly : true 
		}]
});

var ShowCurrentUserInfo = {
	id : 'curr-user-info-panel',
	layout:'border',
	items: [user_info_form]
};

function loadUserInfoData(){ 
	user_info_form.form.load({
		url : 'GetCurrentUser.action',
		waitMsg : '正在载入数据...',

		failure : function() {
			Ext.MessageBox.alert('操作失败', '载入数据失败，可能连接超时');
		}
	}); 
}

