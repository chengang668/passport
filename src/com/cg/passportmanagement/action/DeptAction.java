package com.cg.passportmanagement.action;

import java.util.List;
import java.util.ArrayList;

import com.cg.passportmanagement.database.Dept;
import com.cg.passportmanagement.service.IDeptService;

import net.sf.json.JSONArray;

import commons.utils.action.ExtJSONActionSuport;

/*
 *  DeptAction is configured as prototype in spring IoC 
 */

public class DeptAction extends ExtJSONActionSuport {
	private static final long serialVersionUID = 1L;
	private Dept dept = null;
	private Dept dept2 = null; // used for update dept
	private List<Dept> depts = new ArrayList<Dept>(0);
	private IDeptService deptService = null;
	private String delData;

	public String execute() {
		return SUCCESS;
	}

	@SuppressWarnings("unchecked")
	@Override
	public String jsonExecute() throws Exception {
		if (this.getDelData() != null && !"".equals(this.getDelData())) {
			if (this.getDelData().indexOf(",") < 0) {
				this.deptService.removeDeptById(Integer.valueOf(this.getDelData()));
				System.out.println("del_id:" + getDelData());
			} else {
				String id[] = this.getDelData().split(",");
				for (int i = 0; i < id.length; i++) {
					System.out.println("del:" + id[i]);
					this.deptService.removeDeptById(Integer.valueOf(id[i]));
				}
			}
		}
		// HttpSession session = ServletActionContext.getRequest().getSession();
		Object o = null;// session.getAttribute("Dept_Data1");
		if (o == null) {
			try {
				this.depts = this.getDeptService().findAllDepts();
				// session.setAttribute("Dept_Data1", this.depts);
				System.out.println("query database");
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			this.setDepts(((List<Dept>) o));
		}
		this.setTotalCount(this.depts.size());
		JSONArray array = JSONArray.fromObject(this.depts);
		// System.out.println(this.getStart() + "---" + this.getLimit());
		this.setJsonString("{success:true,totalCount : " + this.getTotalCount()
				+ ", list:" + array.toString() + "}");
		// System.out.println(this.getJsonString());
		return super.jsonExecute();
	}

	public String findDeptById() {
		System.out.println(this.dept.getDeptid());
		try {
			this.dept = this.getDeptService().findDeptById(	this.dept.getDeptid());
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.dept);
		this.setJsonString(array.toString());
		this.setJsonString("{success:true,totalCount:1,list:"
				+ array.toString() + "}");
		System.out.println(array.toString());
		
		return SUCCESS;
	}

	/**
	 * @return Return all persistent instances of the <code>Dept</code> entity.
	 */
	public String getAllDepts() {
		try {
			this.depts = this.getDeptService().findAllDepts();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	/**
	 * Make the given instance managed and persistent.
	 * 
	 * @return
	 */
	public String saveDept() {
		System.out.println(this.dept.getDeptid() + "---"
				+ this.dept.getDeptname()  + "---"
				+ this.dept.getAddress()  + "---"
				+ this.dept.getUpperdeptid() );
		
		// this.dept.setCreatetime(new Date());
		
		this.setJsonString("{success:true}");
		try {
			this.getDeptService().saveDept(this.getDept());
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false}");
		}
		return SUCCESS;
	}

	public String updateDept() {
		System.out.println(this.dept2.getDeptid() + "---"
				+ this.dept2.getDeptname()  + "---"
				+ this.dept2.getAddress()  + "---"
				+ this.dept2.getUpperdeptid() );
		
		this.setJsonString("{success:true}");
		try {
			this.dept = this.getDeptService().findDeptById(	this.dept2.getDeptid());
			
			this.dept.setDeptname( dept2.getDeptname() );
			this.dept.setAddress( dept2.getAddress() );
			this.dept.setUpperdeptid( dept2.getUpperdeptid() ); 
			
			this.getDeptService().saveDept(this.dept);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}
	/**
	 * Remove the given persistent instance.
	 * 
	 * @return
	 */
	public String removeDept() {
		try {
			this.getDeptService().removeDept(this.getDept());
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false}");
		}
		return SUCCESS;
	}

	/**
	 * Remove an entity by its id (primary key). *
	 * 
	 * @return
	 */
	public String removeDeptById(String id) {
		try {
			this.getDeptService().removeDeptById(Integer.valueOf(id));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public Dept getDept() {
		return dept;
	}

	public void setDept(Dept dept) {
		this.dept = dept;
	}

	public Dept getDept2() {
		return dept2;
	}

	public void setDept2(Dept dept) {
		this.dept2 = dept;
	}
	
	public List<Dept> getDepts() {
		return depts;
	}

	public void setDepts(List<Dept> depts) {
		this.depts = depts;
	}

	public IDeptService getDeptService() {
		return deptService;
	}

	public void setDeptService(IDeptService deptService) {
		this.deptService = deptService;
	}

	public String getDelData() {
		return delData;
	}

	public void setDelData(String delData) {
		this.delData = delData;
	}
}
