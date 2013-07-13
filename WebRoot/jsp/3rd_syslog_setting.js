
var third_syslog_win;
var third_syslog_form;

function set3rdSyslogHandler()
{	
	Show3rdSyslogSettingDlg();
	third_syslog_form.form.reset();
}

var Show3rdSyslogSettingDlg = function() {
	// create the window on the first click and reuse on subsequent clicks

	if (!third_syslog_win) {
		third_syslog_win = new Ext.Window({
			layout : 'fit',
			width : 400,
			height : 180,
			closeAction : 'hide',
			plain : true,
			title : '第三方日志服务器',
			iconCls: 'feed-icon',
			items : third_syslog_form
		});
	}
	third_syslog_win.show('cg-start-top-panel');
};


third_syslog_form = new Ext.FormPanel({ 
	labelWidth : 100, // label settings here cascade unless overridden
	labelAlign : 'left',
	// url : 'Set3rdSyslog.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 380,
	waitMsgTarget : true,
	// reader :pwd_jsonFormReader,
	defaults : {
		width : 230
	},
	defaultType : 'textfield',
	items : [{
			fieldLabel : '日志服务器地址',
			id:'3rd-syslog-ip',
			name : 'user4.passwd0',
			allowBlank : false
		},{
			fieldLabel : '日志服务端口',
			id:'3rd-syslog-port',
			name : 'user4.passwd',
			allowBlank : false
		}, {
			fieldLabel : '日志服务协议',
			id:'3rd-syslog-protocol', 
			allowBlank : false
		}],

	buttons : 
	[{　		text : '确定',　
			type : 'submit',　
			disabled : false,　
			handler : doSet3rdSyslog 
		}, 
		{　	text : '取消',
		　	handler : function() {　third_syslog_win.hide();　}
	}],
		
	keys : [ { key:[10, 13], fn: doSet3rdSyslog } ]
});

function doSet3rdSyslog() {
	
	Ext.Ajax.request({
		url: 'todo.action',
		success : function(response, opts) {
		},
		failure : function(response, opts) {

		},
		params: { 
		} 
	});	
}
  