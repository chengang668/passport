package com.cg.passportmanagement.action;

import java.util.List;
import java.util.ArrayList;
import javax.servlet.http.HttpSession;
import org.apache.struts2.ServletActionContext;

import com.cg.passportmanagement.database.Manager;
import com.cg.passportmanagement.service.IManagerService;

import net.sf.json.JSONArray;

import commons.utils.action.ExtJSONActionSuport;

/*
 *  ManagerAction is configured as prototype in spring IoC 
 */

public class ManagerAction extends ExtJSONActionSuport {
	private static final long serialVersionUID = 1L;
	private Manager manager = null;
	private Manager manager2 = null; // used for update manager
	private List<Manager> managers = new ArrayList<Manager>(0);
	private IManagerService managerService = null;
	private String delData;

	public String execute() {
		return SUCCESS;
	}

	@SuppressWarnings("unchecked")
	@Override
	public String jsonExecute() throws Exception {
		HttpSession session = ServletActionContext.getRequest().getSession();
		Object o = null;// session.getAttribute("Manager_Data1");
		if (o == null) {
			try {
				this.managers = this.getManagerService().findAllManagers();
				session.setAttribute("Manager_Data1", this.managers);
				System.out.println("query database");
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			this.setManagers(((List<Manager>) o));
		}
		this.setTotalCount(this.managers.size());
		JSONArray array = JSONArray.fromObject(this.managers);
		// System.out.println(this.getStart() + "---" + this.getLimit());
		this.setJsonString("{success:true,totalCount : " + this.getTotalCount()
				+ ", list:" + array.toString() + "}");
		// System.out.println(this.getJsonString());
		return super.jsonExecute();
	}


	/**
	 * @return Return all persistent instances of the <code>Manager</code> entity.
	 */
	public String getAllManagers() {
		try {
			this.managers = this.getManagerService().findAllManagers();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public Manager getManager() {
		return manager;
	}

	public void setManager(Manager manager) {
		this.manager = manager;
	}

	public Manager getManager2() {
		return manager2;
	}

	public void setManager2(Manager manager) {
		this.manager2 = manager;
	}
	
	public List<Manager> getManagers() {
		return managers;
	}

	public void setManagers(List<Manager> managers) {
		this.managers = managers;
	}

	public IManagerService getManagerService() {
		return managerService;
	}

	public void setManagerService(IManagerService managerService) {
		this.managerService = managerService;
	}

	public String getDelData() {
		return delData;
	}

	public void setDelData(String delData) {
		this.delData = delData;
	}
}
