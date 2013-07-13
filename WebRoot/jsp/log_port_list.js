

//===================== For filtering =========================================
var ppt_filter_type;
var ppt_filter_value;

var ppt_selected_districtid = 0;
function same_districtid(record, id){
	return (record.get('districtid') == ppt_selected_districtid);
}

var ppt_selected_siteid = 0;
function same_siteid(record, id){
	return (record.get('siteid') == ppt_selected_siteid);
}

var ppt_selected_pptid = 0;
function same_passportid(record, id){
	return (record.get('passportid') == this.ppt_selected_pptid);
}

function filterDvlst4Log(type, value){
	if (!type) return;
	
	ppt_filter_type = type;
	ppt_filter_value = value;
	
	if (type == 'root'){
		// device_admin_ds.proxy.setUrl('LoadDevicesOfLoginUser.action');
		// device_admin_ds.reload();
		if(dvlist4log_ds.isFiltered())
			dvlist4log_ds.clearFilter(false);
			// dvlist4log_ds.clearGrouping();
			dvlist4log_ds.groupBy('district');
	}else if (type == 'district'){
		ppt_selected_districtid =  value;
		dvlist4log_ds.filterBy(same_districtid);
		dvlist4log_ds.groupBy('site');
	}else if (type == 'site'){
		ppt_selected_siteid = value;
		dvlist4log_ds.filterBy(same_siteid);
		dvlist4log_ds.groupBy('pptname');
	}else if (type == 'passport'){
		ppt_selected_pptid = value;
		dvlist4log_ds.filterBy(same_passportid, this);
	}
}
 

var passport_adminRowContextMenu = new Ext.menu.Menu( {
	items : [ {
		    text : '修改端口名称',
		    iconCls: 'user-icon',
		    handler : function(e) { modifyPortTitle(); }
	    },
	    {   text : '修改端口波特率',
		    iconCls: 'refresh-icon',
		    handler: function(e) {　modifyPortBaudrate(); }
	    },'-',{
	    	text:'刷新',
		    iconCls: 'refresh-icon',
		    handler : function(e) { refreshPassportList(); }
		}
		],
	listeners : {
		contextmenu : function (e){  e.stopEvent();}
	}
	});

 function popupPassportRowAdminContextMenu(grid, rowIndex, e){
	e.preventDefault();　
	grid.getSelectionModel().selectRow(rowIndex);
	passport_adminRowContextMenu.showAt(e.getXY());
};
 

function getSelectedPort(grid){
	var _record = grid.getSelectionModel().getSelected();
	if (!_record) {
		Ext.MessageBox.alert('提示', '请选择要操作的端口！');
	}
	return _record;
}
	
	

