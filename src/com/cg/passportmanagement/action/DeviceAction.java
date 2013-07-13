package com.cg.passportmanagement.action;

import java.util.List;
import java.util.ArrayList;

import com.cg.passportmanagement.common.SessionUtil;
import com.cg.passportmanagement.database.Device;
import com.cg.passportmanagement.database.User;
import com.cg.passportmanagement.database.UserDeviceAcl;
import com.cg.passportmanagement.service.IDeviceService;

import net.sf.json.JSONArray;

import commons.utils.action.ExtJSONActionSuport;

/*
 *  DevicesAction is configured as prototype in spring IoC 
 */

public class DeviceAction extends ExtJSONActionSuport {
	private static final long serialVersionUID = 1L;
	private Device device = null;
	private Device device2 = null; // used for update device
	private List<Device> devices = new ArrayList<Device>(0);
	private IDeviceService deviceService = null;
	private String delData;

	public String execute() {
		return SUCCESS;
	}

	@Override
	public String jsonExecute() throws Exception {

		try {
			this.devices = this.getDeviceService().findAll();
			// session.setAttribute("Devices_Data1", this.devices);
			System.out.println("query database");
		} catch (Exception e) {
			e.printStackTrace();
		}

		this.setTotalCount(this.devices.size());
		JSONArray array = JSONArray.fromObject(this.devices);
		// System.out.println(this.getStart() + "---" + this.getLimit());
		this.setJsonString("{success:true,totalCount : " + this.getTotalCount()
				+ ", list:" + array.toString() + "}");
		// System.out.println(this.getJsonString());
		return super.jsonExecute();
	}


	/**
	 * @return Return all persistent instances of the <code>Devices</code> entity.
	 */
	public String getAllDevicess() {
		try {
			this.devices = this.getDeviceService().findAll();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public String loadDeviceNavTree() throws Exception { 
		User sUser = SessionUtil.getLoginUser();

		if (sUser == null)
		{
			System.out.println("========== Initializing Device Tree failed, not logged in =============");
			return SUCCESS;
		}

		System.out.println("======= Initializing Device Tree.  Userid = " + sUser.getUserid() + "=============");

		List<UserDeviceAcl> lists;
		List<Device> deviceLists = new ArrayList<Device>(0);
		
		try {
			lists = null; // this.getUserService().findDevicesByUserId(this.user.getUserid());
			
			if (lists != null){
				for (int i=0; i < lists.size(); i++) {
					deviceLists.add(lists.get(i).getDevice());
				}				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		String jsRoot = 
				"id: 'Device-admin-root' , " +
				"text: '应急通道设备', " +
				"leaf: false, " +
				"expanded: true"; // children
		
		String jsDevices = "";
		
		for(int i=0; i < deviceLists.size(); i++){
			if ( i>0 ) jsDevices += ", "; 
			jsDevices += 
				"{" +
				"id: 'device_" + i + "'," +
				"text: '" + deviceLists.get(i).getTitle() + " (" + deviceLists.get(i).getId() + ")" + "', " +
				"leaf:true, " + 
				"ip: '" + deviceLists.get(i).getId() + "'," + 
				"givenname: '" + deviceLists.get(i).getTitle() + "'" + 
				"}"; 	
		}
		String jsTree = "[{" + jsRoot + ", " + "children: [" + jsDevices + "]" + " }]";
		this.setJsonString(jsTree);

		System.out.println(this.getJsonString());
		return SUCCESS;  
	}
	
	public Device getDevices() {
		return device;
	}

	public void setDevices(Device device) {
		this.device = device;
	}

	public Device getDevices2() {
		return device2;
	}

	public void setDevices2(Device device) {
		this.device2 = device;
	}
	
	public List<Device> getDevicess() {
		return devices;
	}

	public void setDevicess(List<Device> devices) {
		this.devices = devices;
	}

	public IDeviceService getDeviceService() {
		return deviceService;
	}

	public void setDeviceService(IDeviceService deviceService) {
		this.deviceService = deviceService;
	}

	public String getDelData() {
		return delData;
	}

	public void setDelData(String delData) {
		this.delData = delData;
	}
}
