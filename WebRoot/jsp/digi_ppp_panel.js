// used in passport setting to set digi ip
 

var digi_ppp_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount', 
		successProperty :'@success'
	}, [ { name :'ppp_first_ip', mapping :'pppip' }, 
		 { name :'ppp_ip_count', mapping :'pppipnum' }
	 ]
);

var digi_ppp_form = new Ext.FormPanel({
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,   
	// url : 'UpdatePassport.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 400,
	waitMsgTarget : true,
	reader :digi_ppp_jsonFormReader,
	defaults : {
		width : 260
	}, 
	defaultType : 'textfield', 
 	items : [{
				fieldLabel : '起始 IP 地址',
				name : 'ppp_first_ip',
				allowBlank : false 
			}, {
				fieldLabel : 'IP个数',
				name : 'ppp_ip_count',
				allowBlank : false
			} ],
	/*buttons : [{
		text : '修改',
		type : 'submit',
		disabled : false,
		handler : function() {
			if (passport_form.form.isValid()) { 
			} else {
				Ext.Msg.alert('信息', '请填写完成再提交!');
			}
		}
	}],*/
	listeners : {
		render : function() { loadDigiPPP(); } 
	}
});

