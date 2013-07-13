// used in passport setting to set digi ip
 
var digi_ip_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount', 
		successProperty :'@success'
	}, [ 
		{ name :'digi_ip',  	mapping :'setip' }, 
		{ name :'digi_ip_mask', mapping :'netmask' }, 
		{ name :'digi_ip_gateway', mapping :'gateway' }
   ]
);

var digi_ip_setting_form = new Ext.FormPanel({
	id : 'digi-ip-setting', 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // 标签与字段录入框之间的空白
	// url : 'UpdatePassport.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 400,
	waitMsgTarget : true,
	reader : digi_ip_jsonFormReader,
	defaults : {
		width : 260
	},
	defaultType : 'textfield',
	
 	items : [{
 			id : 'ip-config-panel-ip',
			fieldLabel : 'IP 地址',
			name : 'digi_ip',
			vtype : 'IPAddress',
			allowBlank : false 
		}, {
 			id : 'ip-config-panel-netmask',
			fieldLabel : '掩码', 
			vtype : 'IPAddress',
			name : 'digi_ip_mask',
			allowBlank : false
		}, { 
 			id : 'ip-config-panel-gateway',
			fieldLabel : '缺省网关',
			vtype : 'IPAddress',
			name : 'digi_ip_gateway', 
			allowBlank : false
		}],
	buttons : [{
		text : '修改',
		type : 'submit',
		disabled : false,
		handler : doSetPassortIP 
	}],
	listeners : {
		render : function() { loadDigiIP(); } 
	}			
});

function doSetPassortIP(){
	
	if (!digi_ip_setting_form.form.isValid()) {
		Ext.Msg.alert('提示', '请填写正确再提交!');
		return;
	}
	if (!digi_ip_setting_form.form.isDirty()) {
		Ext.Msg.alert('提示', '没有修改!');
		return;
	}
	
	var ip = digi_ip_setting_form.findById('ip-config-panel-ip').getEl().getValue();
	var netmask = digi_ip_setting_form.findById('ip-config-panel-netmask').getEl().getValue();
	var gateway = digi_ip_setting_form.findById('ip-config-panel-gateway').getEl().getValue();

	var passportid = select_ppt_id;
	
	Ext.Ajax.request({
		url: 'setPassportIP.action',
		timeout : 90000,
		success : function(response, opts) {
			Ext.MessageBox.hide();
			var obj = Ext.decode(response.responseText);
			if (obj && obj.success == true)
			{
				Ext.MessageBox.alert('成功', '您已成功修改IP地址');
			}
			else
				Ext.MessageBox.alert('失败', obj.error.reason);
		},
		failure : function(response, opts) {
			Ext.MessageBox.hide();
			var obj = Ext.decode(response.responseText);
			if (obj!=null && obj.success == false)
			{
				Ext.MessageBox.alert('失败', obj.error.reason);
			}
		},
		params: { 
			'passportid': passportid, 
			'newIP': ip,
			'newNetMask': netmask,
			'newGateway': gateway
		}
	});
	// port_title_win.hide();
	Ext.MessageBox.wait('正在修改应急通道设备IP，可能耗时较长，请稍候...', '操作进行中...');
}


