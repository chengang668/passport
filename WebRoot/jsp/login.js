// Create a variable to hold our EXT Form Panel. 
// Assign various config options as seen.	 

Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
Ext.BLANK_IMAGE_URL = '../resource/ext-3.0.0/resources/images/default/s.gif';

var login = new Ext.FormPanel({ 
    labelWidth:50,
    url:'login.action', 
    frame:true, 
	bodyStyle : 'padding:5px 5px 5px 5px',
    defaultType:'textfield',
    monitorValid:true,
	// bodyStyle: "padding: 5px 5px 3px 5px; border-width: 0; margin-bottom: 7px;",

    // Specific attributes for the text fields for username / password. 
    // The "name" attribute defines the name of variables sent to the server.
    width : 250,
    defaults : { width : 180 },
    items:[{ 
            fieldLabel:'用户名', 
            id : 'login_user_name',
            name:'loginUsername', 
            selectOnFocus : true,
            allowBlank:false, 
            blankText:'请输入用户名',
            maxLength:20,
            maxLengthText:'超过最大长度',
            autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'on'}
        },{ 
            fieldLabel:'密码', 
            id : 'login_password_id',
            name:'loginPassword', 
            inputType:'password', 
            selectOnFocus : true,
            allowBlank:false,
            blankText:'请输入密码',            
            autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'on'}
            // maxLength:20
            }],
 
        // All the magic happens after the user clicks the button     
    buttons:[{ 
        text:'登录',
        // iconCls:'yes-icon',
        type:'submit',
        formBind: true,	  
        handler: doLogin
        }],
        
        keys : [ { key:[10, 13], fn: doLogin} ]
    });
 
    /*
     * 	keys:({
		key: Ext.EventObject.ENTER,
		fn: submitForm,
		scope: this
	}),
	*/
    
 
// This just creates a window to wrap the login form. 
// The login object is passed to the items collection.       
var win = new Ext.Window({
    layout:'fit',
    title:'登录上海移动带外管理系统', 
	iconCls: 'login-icon',
    width:275,
    height:145,
    closable: false,
    resizable: false,
    plain: false,
    modal: true,
    border: false,
    items: [login],
    
    listeners: {
    	"show" : function () { 
    		// Ext.getCmp("login_user_name").focus(false, 100);
			var f = login.getComponent('login_user_name');
			f.focus(true, true);
			// var ff = login.items.items[0]; // 'login_user_name'];
			// ff.focus(true, true);
	    }
    }
});

function doLogin()
{ 
	if(!login.getForm().isValid())
		return;

	var username = login.getComponent('login_user_name').getValue();
	var pwd = login.getComponent('login_password_id').getValue();
	if (username.length==0 || pwd.length == 0)
		return;

	var pwd2 = pwd; // hex_md5(pwd);
	login.getComponent('login_password_id').setRawValue(pwd2);		
		
    login.getForm().submit({ 
    	url:'login.action', 
        method:'POST', 
        waitTitle:'请稍候', 
        waitMsg:'建立连接中...',
 
	// Functions that fire (success or failure) when the server responds. 
	// The one that executes is determined by the response that comes from login.asp as seen below. The server would 
	// actually respond with valid JSON, something like: response.write "{ success: true}" or 
	// response.write "{ success: false, errors: { reason: 'Login failed. Try again.' }}" 
	// depending on the logic contained within your server script. If a success occurs, the user is notified with an alert messagebox, 
	// and when they click "OK", they are redirected to whatever page you define as redirect. 
	 
        success:function(form, action){
        	saveUserNameCookie();
            var redirect = 'admin/start.html'; 
            window.location.replace( redirect );
            window.location = redirect;
            
            var obj = Ext.util.JSON.decode(action.response.responseText); 
            if (obj.info)
            	// Ext.Msg.alert('提示', obj.info);
            	alert(obj.info);
        },

        failure:function(form, action){ 
            if(action.failureType == 'server'){ 
                var obj = Ext.util.JSON.decode(action.response.responseText); 
                Ext.Msg.alert('登录失败!', obj.error.reason); 
            }else{ 
                var obj = Ext.util.JSON.decode(action.response.responseText); 
                Ext.Msg.alert('登录失败!', 'Authentication server is unreachable : ' + obj.error.reason); 
            } 
            //login.getForm().reset(); 
			login.getComponent('login_password_id').setRawValue('');
        } 
    }); 
} 

var loginNameCookie = "pptUserName";

function initUserName()
{
	var loginUser = getCookie(loginNameCookie);
	
	if (loginUser == null || loginUser == '')
		return;
		
	login.getComponent('login_user_name').autocomplete = "on";
	// login.getComponent('login_user_name').setValue(loginUser); // 可以在 win.show() 之前生效。
	$("login_user_name").value=loginUser; // 需要在 win.show() 之后才有效。
}

function saveUserNameCookie()
{
	setCookie(loginNameCookie, $("login_user_name").value, true );
}

Ext.onReady(function(){
    Ext.QuickTips.init();
    
    win.show();
    
    initUserName();
});
