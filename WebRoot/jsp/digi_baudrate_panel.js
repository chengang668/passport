// used in passport setting to set digi baudrate
 

var dige_baudrate_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount', 
		successProperty :'@success'
	}, [ {
		name :'dige_baudrate',
		mapping :'siteid'   //		type :'int'
	}, {
		name :'dige_baudrate_mask',
		mapping :'sitename'
	}, {
		name :'dige_baudrate_gateway',
		mapping :'address'
    }
   ]
);

var dige_baudrate_setting_form = new Ext.FormPanel({
	id : 'digi-ip-setting', 
	labelWidth : 85, // label settings here cascade unless overridden
	labelAlign : 'left',
	// labelPad : 0,  // ��ǩ���ֶ�¼���֮��Ŀհ�
	// url : 'UpdatePassport.action',
	frame : true,
	bodyStyle : 'padding:5px 5px 0',
	width : 400,
	waitMsgTarget : true,
	reader :dige_baudrate_jsonFormReader,
	defaults : {
		width : 260
	},
	defaultType : 'textfield',
	
 	items : [{
				fieldLabel : 'IP ��ַ',
				name : 'dige_baudrate',
				allowBlank : false 
			}, {
				fieldLabel : '����', 
				name : 'dige_baudrate_mask',
				allowBlank : false
			}, { 
				fieldLabel : 'ȱʡ����',
				name : 'dige_baudrate_gateway', 
				allowBlank : false
			}],
	buttons : [{
		text : '�޸�',
		type : 'submit',
		disabled : false,
		handler : function() {
			if (passport_form.form.isValid()) { 
			} else {
				Ext.Msg.alert('��Ϣ', '����д������ύ!');
			}
		}
	}],
	listeners : {
		render : function() { 
			/* this.form.load({
				url : 'LoadUser.action?user.userid=' + _record.get('userid'),
				waitMsg : '������������...',
		
				failure : function() {
					Ext.MessageBox.alert('�༭', '��������ʧ��');
				}
			});*/
			Ext.MessageBox.alert('�༭', '��������ʧ��');
		} 
	}			
});



