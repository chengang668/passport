
function exec (command){ 
	
	if (Ext.isIE){
		window.oldOnError = window.onerror;
		window._command = command;
		window.onerror = function (err){
			if (err.indexOf('utomation') != -1){
				alert('命令' + window._command + ' 已经被用户禁止！');
				return 2;
			}
			else return 3;
		}; 
		var wsh = new ActiveXObject('WScript.Shell');
		if (wsh){
		  try {
		  	wsh.Run(command);
		  }catch(err){
		  	return 1;
		  }
		}
	
		window.onerror = window.oldOnError; 
	
		return 0;
	}
	else if (Ext.isGecko){ // firefox{
		
	}
} 

var fso;
function fileExists(filename)
{
	if (!fso)
	    fso= new ActiveXObject("Scripting.FileSystemObject"); 
    var bExists = fso.FileExists(filename);  //  "c:\\myjstest.txt"  
    return bExists
}

function CreateTempFile()
{	
  if (!fso)
    fso= new ActiveXObject("Scripting.FileSystemObject"); 
    
  var tfolder, tfile, tname, fname, TemporaryFolder = 0;
  tfolder = fso.GetSpecialFolder(TemporaryFolder);
  tname = fso.GetTempName();
  tfile = tfolder.CreateTextFile(tname);
  alert ('文件位置：' + tfolder + '\n\n 文件名 ' + tname);
  return(tfile);
}

// tempfile = CreateTempFile();
// tempfile.writeline("Hello World");
// tempfile.close();

var cg_grid_view_cfg = {sortAscText : '顺序排序', sortDescText : '倒序排序', columnsText : '选择列'};
var cg_grid_view = new Ext.grid.GridView(cg_grid_view_cfg);
 
var cg_grid_groupingview_cfg = {
		sortAscText : '顺序排序', sortDescText : '倒序排序', columnsText : '选择列', 
		groupByText : '按该列分组',　showGroupsText : '分组显示',
        forceFit:false,
        //groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
        groupTextTpl: '{text} ({[values.rs.length]} {["项"]})'
    };

var $=getObject=function(element)
{
  if(arguments.length>1)
  {
    for(var i=0,elements=[],length=arguments.length;i<length;i++)
    {
      elements.push($(arguments[i]));
    }
    return elements;
  }
  if(typeof element=='string')
  {
  	return document.getElementById(element);
  }
  return element;
};

var createScript=function(cid,url,f,arg)
{
	try
	{
		var _f="function"==typeof f?f:false;
		if(url.indexOf(".js")>=0)
		{
			url=url.indexOf("?")==-1?url+"?t="+new Date().getTime():url+"&t="+new Date().getTime();
		};
		var v=document.createElement("script");
		v.setAttribute('type','text/javascript');
		v.setAttribute('id',""!=cid?cid:"createScript"+new Date().getTime());
		v.setAttribute('src',url);
		document.getElementsByTagName("head")[0].appendChild(v);
		if(document.all)
		{
			v.onreadystatechange=function()
			{
				var state=v.readyState;
				if(state=="loaded"||state=="interactive"||state=="complete")
				{
					this.parentNode.removeChild(this);
					if(_f)
					{
						return _f.apply(this,(arg||[]))
					}
				}
				else{
					v.src=url;
				}
			};
			}else{v.onload=function(){this.parentNode.removeChild(this);if(_f){return _f.apply(this,(arg||[]))}};}}catch(e){}return createScript;};
      
