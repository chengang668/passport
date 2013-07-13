// used in passport setting to set digi ip
 

var digi_syslog_jsonFormReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount', 
		successProperty :'@success'
	}, [
		{ name :'syslogfilter_1', mapping :'syslogfilter_1' }, 
		{ name :'syslogfilter_2', mapping :'syslogfilter_2' },
		{ name :'syslogfilter_3', mapping :'syslogfilter_3' }, 
		{ name :'syslogfilter_4', mapping :'syslogfilter_4' },
		{ name :'syslogdest_1'},
		{ name :'syslogdest_2'},
		{ name :'syslogdest_3'},
		{ name :'syslogdest_4'},
		{ name :'syslogip_1'},
		{ name :'syslogip_2'},
		{ name :'syslogip_3'},
		{ name :'syslogip_4'}
   	]
);

var fm_width = 400;
var _columns = 3*2;
var _perWidth = fm_width/_columns;


var digi_syslog_setting_form = new Ext.FormPanel({
	id : 'digi-syslog-ng-setting', 
	labelAlign : 'left',
	frame : true,
	layout:'table', 
    style:'height:100%',
    layoutConfig: {columns:_columns},
	// bodyStyle : 'padding:5px 5px 0',
	width : fm_width, 
	reader :digi_syslog_jsonFormReader,
	defaults : {border:false,layout:'form',frame:false,labelAlign:'left',labelWidth:1,width:_perWidth*2,height:30},

 	items : [
 		{colspan:2,items:{xtype:'label',text:'日志类型:'}}, 
 		{colspan:2,items:{xtype:'label',text:'日志目标:'}},
 		{colspan:2,items:{xtype:'label',text:'IP地址/文件:'}},
 		
 		{colspan:2,items:{xtype:'combo',labelWidth:20,fieldLabel:'1', anchor:'90%',
			lazyRender:true, 
			mode: 'local',
			forceSelection: true,
			triggerAction : 'all', name : 'syslogfilter_1',
	 		store: new Ext.data.ArrayStore({
	        	fields: [ 'myId', 'displayText' ],
	        	data: [['Local0', '系统日志'], ['Local1', '端口操作日志']]
	    	}),
		    valueField: 'myId',
		    displayField: 'displayText'
		}}, 
 		{colspan:2,items:{xtype:'combo',anchor:'100%', 
			lazyRender:true,  mode: 'local', triggerAction : 'all',	name : 'syslogdest_1', store: ['UDP', 'TCP', 'systemlog']}}, 
 		{colspan:2,items:{xtype:'textfield',anchor:'100%', name : 'syslogip_1'}}, 
 		
 		////////////////////////////////////////
 		
 		{colspan:2,items:{xtype:'combo',labelWidth:20,fieldLabel:'2',anchor:'90%',
			lazyRender:true, 
			mode: 'local',
			forceSelection: true,
			triggerAction : 'all', name : 'syslogfilter_2',
	 		store: new Ext.data.ArrayStore({
	        	fields: [ 'myId', 'displayText' ],
	        	data: [['Local0', '系统日志'], ['Local1', '端口操作日志']]
	    	}),
		    valueField: 'myId',
		    displayField: 'displayText'}}, 
 		{colspan:2,items:{xtype:'combo',anchor:'100%',
			lazyRender:true,  mode: 'local', forceSelection: true, triggerAction : 'all', name : 'syslogdest_2', store: ['UDP', 'TCP', 'systemlog']}}, 
 		{colspan:2,items:{xtype:'textfield',anchor:'100%', name : 'syslogip_2'}},
 		
 		///////////////////////////////////////////////////////
 		
 		{colspan:2,items:{xtype:'combo',labelWidth:20,fieldLabel:'3',anchor:'90%',
			lazyRender:true, 
			mode: 'local',
			forceSelection: true,
			triggerAction : 'all', name : 'syslogfilter_3',
	 		store: new Ext.data.ArrayStore({
	        	fields: [ 'myId', 'displayText' ],
	        	data: [['Local0', '系统日志'], ['Local1', '端口操作日志']]
	    	}),
		    valueField: 'myId',
		    displayField: 'displayText'}}, 
 		{colspan:2,items:{xtype:'combo',anchor:'100%',
			lazyRender:true,  mode: 'local', forceSelection: true, triggerAction : 'all', name : 'syslogdest_3', store: ['UDP', 'TCP', 'systemlog']}}, 
 		{colspan:2,items:{xtype:'textfield',anchor:'100%', name : 'syslogip_3'}},
 		
 		///////////////////////////////
 		
 		{colspan:2,items:{xtype:'combo',labelWidth:20,fieldLabel:'4',anchor:'90%',
			lazyRender:true, 
			mode: 'local',
			forceSelection: true,
			triggerAction : 'all', name : 'syslogfilter_4',
	 		store: new Ext.data.ArrayStore({
	        	fields: [ 'myId', 'displayText' ],
	        	data: [['Local0', '系统日志'], ['Local1', '端口操作日志']]
	    	}),
		    valueField: 'myId',
		    displayField: 'displayText'}}, 
 		{colspan:2,items:{xtype:'combo',anchor:'100%',
			lazyRender:true,  mode: 'local', forceSelection: true, triggerAction : 'all', name : 'syslogdest_4', store: ['UDP', 'TCP', 'systemlog']}}, 
 		{colspan:2,items:{xtype:'textfield',anchor:'100%', name : 'syslogip_4'}}
 	  ],
/*	buttons : [{
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
		render : function() { loadDigiSyslog(); } 
	}		
});



