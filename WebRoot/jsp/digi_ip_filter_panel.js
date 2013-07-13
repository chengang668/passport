// used in passport setting to set digi ip
 

var digi_ip_filter_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount', 
		successProperty :'@success'
	}, [{ name :'ipf_ip_1'}, 
		{ name :'ipf_ip_2'},
		{ name :'ipf_ip_3'}, 
		{ name :'ipf_ip_4'},
		{ name :'ipf_protocol_1'},
		{ name :'ipf_protocol_2'},
		{ name :'ipf_protocol_3'},
		{ name :'ipf_protocol_4'},
		{ name :'ipf_port_1'},
		{ name :'ipf_port_2'},
		{ name :'ipf_port_3'},
		{ name :'ipf_port_4'},
		{ name :'ipf_rule_1'},
		{ name :'ipf_rule_2'},
		{ name :'ipf_rule_3'},
		{ name :'ipf_rule_4'}
   ]
);

var fm_width_flt = 400;
var _columns_flt = 3*2;
var _perWidth_flt = fm_width_flt/_columns_flt;


var digi_ip_filter_form = new Ext.FormPanel({
	labelAlign : 'left',
	frame : true,
	layout:'table', 
    style:'height:100%',
    layoutConfig: {columns:_columns_flt},
	// bodyStyle : 'padding:5px 5px 0',
	width : fm_width_flt, 
	reader :digi_ip_filter_jsonFormReader,
	defaults : {border:false,layout:'form',frame:false,labelAlign:'left', labelWidth:1, width:_perWidth_flt, height:30},

 	items : [
 		{colspan:3,items:{xtype:'label',text:'地址/掩码:'}, width:_perWidth_flt*3}, 
 		{colspan:1,items:{xtype:'label',text:'协议:'}, width:_perWidth_flt },
 		{colspan:1,items:{xtype:'label',text:'端口:'}},
 		{colspan:1,items:{xtype:'label',text:'规则:'}},
 		
 		{colspan:3,items:{xtype:'textfield', labelWidth:20,fieldLabel:'1', anchor:'95%', name : 'ipf_ip_1'}, width:_perWidth_flt*3}, 
 		{colspan:1, width:_perWidth_flt*1,items:{xtype:'combo',anchor:'100%', 
			lazyRender:true,  mode: 'local', triggerAction : 'all',	name : 'ipf_protocol_1', store: ['telnet', 'SSH', 'UDP', 'TCP', 'HTTP', 'HTTPS']}}, 
 		{colspan:1,items:{xtype:'textfield',anchor:'100%', name : 'ipf_port_1'}},
 		{colspan:1,items:{xtype:'combo', anchor:'100%', name : 'ipf_rule_1',
			lazyRender:true, 
			mode: 'local',
			forceSelection: true,
			triggerAction : 'all', 
	 		store: new Ext.data.ArrayStore({
	        	fields: [ 'myId', 'displayText' ],
	        	data: [['ACCEPT', '接受'], ['DROP', '拒绝']]
	    	}),
		    valueField: 'myId',
		    displayField: 'displayText'}}, 
 		
 		////////////////////////////////////////
 		
 		{colspan:3,items:{xtype:'textfield', labelWidth:20,fieldLabel:'2', anchor:'95%', name : 'ipf_ip_2'}, width:_perWidth_flt*3}, 
 		{colspan:1, width:_perWidth_flt*1,items:{xtype:'combo',anchor:'100%', 
			lazyRender:true,  mode: 'local', triggerAction : 'all',	name : 'ipf_protocol_2', store: ['telnet', 'SSH', 'UDP', 'TCP', 'HTTP', 'HTTPS']}}, 
 		{colspan:1,items:{xtype:'textfield',anchor:'100%', name : 'ipf_port_2'}},
 		{colspan:1,items:{xtype:'combo', anchor:'100%', name : 'ipf_rule_2',
			lazyRender:true, 
			mode: 'local',
			forceSelection: true,
			triggerAction : 'all', 
	 		store: new Ext.data.ArrayStore({
	        	fields: [ 'myId', 'displayText' ],
	        	data: [['ACCEPT', '接受'], ['DROP', '拒绝']]
	    	}),
		    valueField: 'myId',
		    displayField: 'displayText'}}, 
 		
 		///////////////////////////////////////////////////////
 		
 		{colspan:3,items:{xtype:'textfield', labelWidth:20,fieldLabel:'3', anchor:'95%', name : 'ipf_ip_3'}, width:_perWidth_flt*3}, 
 		{colspan:1, width:_perWidth_flt*1,items:{xtype:'combo',anchor:'100%', 
			lazyRender:true,  mode: 'local', triggerAction : 'all',	name : 'ipf_protocol_3', store: ['telnet', 'SSH', 'UDP', 'TCP', 'HTTP', 'HTTPS']}}, 
 		{colspan:1,items:{xtype:'textfield',anchor:'100%', name : 'ipf_port_3'}},
 		{colspan:1,items:{xtype:'combo', anchor:'100%', name : 'ipf_rule_3',
			lazyRender:true, 
			mode: 'local',
			forceSelection: true,
			triggerAction : 'all', 
	 		store: new Ext.data.ArrayStore({
	        	fields: [ 'myId', 'displayText' ],
	        	data: [['ACCEPT', '接受'], ['DROP', '拒绝']]
	    	}),
		    valueField: 'myId',
		    displayField: 'displayText'}}, 
 		
 		///////////////////////////////
 		
 		{colspan:3,items:{xtype:'textfield', labelWidth:20,fieldLabel:'4', anchor:'95%', name : 'ipf_ip_4'}, width:_perWidth_flt*3}, 
 		{colspan:1, width:_perWidth_flt*1,items:{xtype:'combo',anchor:'100%', 
			lazyRender:true,  mode: 'local', triggerAction : 'all',	name : 'ipf_protocol_4', store: ['telnet', 'SSH', 'UDP', 'TCP', 'HTTP', 'HTTPS']}}, 
 		{colspan:1,items:{xtype:'textfield',anchor:'100%', name : 'ipf_port_4'}},
 		{colspan:1,items:{xtype:'combo', anchor:'100%', name : 'ipf_rule_4',
			lazyRender:true, 
			mode: 'local',
			forceSelection: true,
			triggerAction : 'all', 
	 		store: new Ext.data.ArrayStore({
	        	fields: [ 'myId', 'displayText' ],
	        	data: [['ACCEPT', '接受'], ['DROP', '拒绝']]
	    	}),
		    valueField: 'myId',
		    displayField: 'displayText'}}
 	  ],
	buttons : [{
		text : '修改',
		type : 'submit',
		disabled : false,
		handler : function() {
			if (passport_form.form.isValid()) { 
			} else {
				Ext.Msg.alert('信息', '请填写完成再提交!');
			}
		}
	}],
	listeners : {
		render : function() { loadDigiIpFilter(); } 
	}
});

