
var clientInfo = {};
clientInfo.userid = 'chengang';

function $( id )
{
    return document.getElementById( id );
}

function getDeptname(dept) { 
    if (Ext.isEmpty(dept))
        return '';
    else if (!Ext.isEmpty(dept.deptname))
        return dept.deptname;
    else
        return '';
};

function getSitename(site)
{
    if (Ext.isEmpty(site))
        return '';
    else if (!Ext.isEmpty(site.sitename))
        return site.sitename;
    else
        return '';
}

function renderDateF(format) {
    return function(v) {
        var JsonDateValue;
        if (Ext.isEmpty(v))
            return '';
        else if (Ext.isEmpty(v.time))
            JsonDateValue = new Date(v);
        else
            JsonDateValue = new Date(v.time);
        return JsonDateValue.format(format || 'Y-m-d H:i:s');
    };
};

function redirect2LoginPage(){
	var redirect = 'admin/start.html'; 
	window.location.replace( redirect );
	window.location = redirect;
}

function ds_callback (r, options, success) {
	if (success == false) {
		Ext.MessageBox.minWidth = 280;
		Ext.MessageBox.alert("错误", "会话中断，或者需要更高权限执行该操作，请重新登陆！");
	} 
}

// this is call only when success = true;
function ds_onload (store, records, options ) {
	// Ext.Msg.alert('test', 'test');
	//if (store.reader.jsonData.success == false ){
	//	Ext.MessageBox.alert("错误", "会话中断，或者需要更高权限执行该操作，请重新登陆！");
	// } 
}

function ds_exception(proxy, type, action, options, response, arg){
	// Ext.MessageBox.alert('exception type:', type);
	
	// A valid response was returned from the server having successProperty === false. 
	// This response might contain an error-message sent from the server. 
	// For example, the user may have failed authentication/authorization 
	// or a database validation error occurred.

	//if (type == 'remote'){
	//	Ext.MessageBox.alert('response', response.status);
	//} 
	Ext.MessageBox.minWidth = 280;
	// Ext.MessageBox.setIcon(Ext.MessageBox.ERROR);
	Ext.MessageBox.alert("错误", "会话中断，或者需要更高权限执行该操作，请重新登陆！", redirect2LoginPage);
}


function conn_exception(proxy, type, action, options, response, arg){
	// Ext.MessageBox.alert('exception type:', type);
	
	// A valid response was returned from the server having successProperty === false. 
	// This response might contain an error-message sent from the server. 
	// For example, the user may have failed authentication/authorization 
	// or a database validation error occurred.

	//if (type == 'remote'){
	//	Ext.MessageBox.alert('response', response.status);
	//} 
	Ext.MessageBox.minWidth = 280;
	// Ext.MessageBox.setIcon(Ext.MessageBox.ERROR);
	var obj = Ext.decode(response.responseText);
	Ext.MessageBox.alert("错误", "无法连接应急通道设备，请重试！" + obj.error.reason);
}


function setCookie(name, value, isForever) { // ";domain=www.chengang.com" +
    document.cookie = name + "=" + escape(value) +  (isForever?";expires="+  (new Date(2099,12,31)).toGMTString():"");
}

function getCookie(name) {
   var search = name + "="
   if(document.cookie.length > 0) {
      offset = document.cookie.indexOf(search)
      if(offset != -1) {
         offset += search.length
         end = document.cookie.indexOf(";", offset)
         if(end == -1) end = document.cookie.length
         return unescape(document.cookie.substring(offset, end))
      }
      else return ""
   }
}

function fSetLogType(){
    var logType = getCookie("logType");
    var selType = document.getElementById("selType");
    switch(logType){
        case "js":
            selType.selectedIndex = "1";
            break;
        case "jy":
            selType.selectedIndex = "2";
            break;
        default:
            selType.selectedIndex = "0";
    }
}


function saveLoginType(){
    var selType = document.getElementById("selType");
    var txtStyle = document.getElementById("txtStyle");
    switch(selType.value){
        case "js":
            txtStyle.value = "21";
            break;
        case "jy":
            txtStyle.value = "35";
            break;
        default:
            txtStyle.value = selType.value;
    }
    document.cookie = "logType="+ selType.value +";expires="+  (new Date(2099,12,31)).toGMTString() +";domain=www.chengang.com";
}
 

function LeaveSystem() {
    Ext.Ajax.request({ url: 'logout.action'});
}

function activeTab(panel)
{
	var mainp = Ext.getCmp('main-panel');
	var tab = mainp.getComponent(panel.id);
	if (!tab){
		mainp.add( panel );
	}
    mainp.layout.setActiveItem(panel.id); 
}

// custom Vtype for vtype:'time'
var timeTest = /^([1-9]|1[0-9]):([0-5][0-9])(\s[a|p]m)$/i;
Ext.apply(Ext.form.VTypes, {
    //  vtype validation function
    time: function(val, field) {
        return timeTest.test(val);
    },
    // vtype Text property: The error text to display when the validation function returns false
    timeText: 'Not a valid time.  Must be in the format "12:34 PM".',
    // vtype Mask property: The keystroke filter mask
    timeMask: /[\d\s:amp]/i
});
 
// custom Vtype for vtype:'IPAddress'
Ext.apply(Ext.form.VTypes, {
    IPAddress:  function(v) {
        return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(v);
    },
    IPAddressText: 'Must be a numeric IP address',
    IPAddressMask: /[\d\.]/i
});

var cg_pagingToolbar_config = {
	pageSize : 50,
	displayInfo : true,
	displayMsg : '当前显示 {0}-{1}条 / 共 {2} 条',
	emptyMsg : '无数据',
	prependButtons: true,
	afterPageText : '页, 共{0}页',
	beforePageText : '第',
	// labelSeparator :  '页',
	firstText :  '第一页',
	lastText :  '最后一页',
	nextText :  '下一页',
	prevText :  '上一页',
	refreshText :  '刷新',		
	items : [{ xtype: 'tbspacer', width: 160}, ' 分页  ']
};


var pptIpListds = new Ext.data.Store({
	proxy : new Ext.data.HttpProxy({ 
		url : 'getPassportIpList.action',
		method 	: 'POST',
		listeners :  { 
			'exception' :  ds_exception  
		} 
	}),
	reader : new Ext.data.JsonReader(
		{	root : 'list',
			totalProperty : 'totalCount',
			id : 'ip',
			successProperty : 'success'
		}, 
		[	{ name : 'ip' }	]
	)
});

//  used for comboBox 
var cg_pptipComboBoxCfg = {
    typeAhead: true,
    // id:'port-log-query-host',
    anchor:'100%',
    triggerAction: 'all',
    // forceSelection: true,
    lazyRender:false,
    mode: 'remote', 
    fieldLabel:'应急通道IP',
    store: pptIpListds,
    valueField: 'ip',
    displayField: 'ip',
    loadingText : '加载中...'
};

//CG 阻止退格键导致页面跳转
new Ext.KeyMap(document, [{   
    key: Ext.EventObject.BACKSPACE,   
    fn: function (key, e) { 
        var t = e.target.tagName;
        if (t !== "INPUT" && t !== "TEXTAREA" || e.target.readOnly==true) {   
            e.stopEvent();   
        } 
    }   
}]); 
