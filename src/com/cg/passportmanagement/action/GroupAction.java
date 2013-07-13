package com.cg.passportmanagement.action;

import java.util.List;
import java.util.ArrayList;
import com.cg.passportmanagement.database.Groups;
import com.cg.passportmanagement.service.IGroupService;
import com.cg.passportmanagement.service.UserService;

import net.sf.json.JSONArray;

import commons.utils.action.ExtJSONActionSuport;

/*
 *  GroupAction is configured as prototype in spring IoC 
 */

public class GroupAction extends ExtJSONActionSuport {
	private static final long serialVersionUID = 1L;
	private transient Groups group = null;
	private transient Groups group2 = null; // used for update group
	private List<Groups> groups = new ArrayList<Groups>(0);
	private IGroupService groupService = null;
	private String delData;

	public String execute() {
		return SUCCESS;
	}

	@Override
	public String jsonExecute() throws Exception {
		if (this.getDelData() != null && !"".equals(this.getDelData())) {
			if (this.getDelData().indexOf(",") < 0) {
				this.groupService.removeGroupById(Integer.valueOf(this.getDelData()));
				System.out.println("del_id:" + getDelData());
			} else {
				String id[] = this.getDelData().split(",");
				for (int i = 0; i < id.length; i++) {
					System.out.println("del:" + id[i]);
					
					if (group.getGroupid()==1) { 
						// predefined amdin group, not removable.
						this.setJsonString("{success:false, error:{reason:'Admin组不能删除'}}");
						break;
					}
					this.groupService.removeGroupById(Integer.valueOf(id[i]));
				}
			}
		}
		//HttpSession session = ServletActionContext.getRequest().getSession();
		try {
			this.groups = this.getGroupService().findAllGroups();
			// session.setAttribute("Group_Data1", this.groups);
			System.out.println("query database");
		} catch (Exception e) {
			e.printStackTrace();
		}
		this.setTotalCount(this.groups.size());
		JSONArray array = JSONArray.fromObject(this.groups);
		// System.out.println(this.getStart() + "---" + this.getLimit());
		this.setJsonString("{success:true,totalCount : " + this.getTotalCount()
				+ ", list:" + array.toString() + "}");
		// System.out.println(this.getJsonString());
		return super.jsonExecute();
	}

	/**
	 * Find an entity by its id (primary key).
	 * 
	 * @param id
	 * @return The found entity instance or null if the entity does not exist.
	 */
	public String findGroupById(String id) {
		try {
			this.group = this.getGroupService().findGroupById(Integer.valueOf(id));
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.groups);
		this.setJsonString(array.toString());
		return SUCCESS;
	}

	public String findGroupById() {
		System.out.println(this.group.getGroupid());
		try {
			this.group = this.getGroupService().findGroupById(	this.group.getGroupid());
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.group);
		this.setJsonString(array.toString());
		this.setJsonString("{success:true,totalCount:1,list:"
				+ array.toString() + "}");
		System.out.println(array.toString());
		
		return SUCCESS;
	}

	/**
	 * @return Return all persistent instances of the <code>Groups</code> entity.
	 */
	public String getAllGroups() {
		try {
			this.groups = this.getGroupService().findAllGroups();
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
	public String saveGroup() {
		System.out.println(this.group.getGroupid() + "---"
				+ this.group.getGroupname()  + "---"
				+ this.group.getDescription() );
		
		// this.group.setCreatetime(new Date());
		
		this.setJsonString("{success:true}");
		try {
			this.getGroupService().saveGroup(this.getGroup());
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false}");
		}
		return SUCCESS;
	}

	public String updateGroup() {
		System.out.println(this.group2.getGroupid() + "---"
				+ this.group2.getGroupname()  + "---"
				+ this.group2.getDescription() );
		
		this.setJsonString("{success:true}");
		try {
			this.group = this.getGroupService().findGroupById(	this.group2.getGroupid());
			
			this.group.setGroupname( group2.getGroupname() );
			this.group.setDescription( group2.getDescription() ); 
			
			this.getGroupService().saveGroup(this.group);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}
	/**
	 * Remove the given persistent instance.
	 * struts action  RemoveGroup.action
	 * @return
	 */
	public String removeGroup() {
		Integer gid = group.getGroupid();
		try {
			if (gid==1 || 2 == gid) { 
				// predefined amdin group, not removable.
				this.setJsonString("{success:false, error:{reason:'Admin组或Operator组不能删除'}}");
				return SUCCESS;
			}
			group = getGroupService().findGroupById( gid );
			if (UserService.getInstance().findUserByGroupId(gid).size() > 0)
			{
				this.setJsonString("{success:false, error:{reason:'请先删除该用户组的所有用户，然后删除该组'}}");
				return SUCCESS;
			}
			this.getGroupService().removeGroupById(this.group.getGroupid());
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false, error:{reason:'用户组删除失败!'}}");
		}
		this.setJsonString("{success:true}");
		return SUCCESS;
	}

	public Groups getGroup() {
		return group;
	}

	public void setGroup(Groups group) {
		this.group = group;
	}

	public Groups getGroup2() {
		return group2;
	}

	public void setGroup2(Groups group) {
		this.group2 = group;
	}
	
	public List<Groups> getGroups() {
		return groups;
	}

	public void setGroups(List<Groups> groups) {
		this.groups = groups;
	}

	public IGroupService getGroupService() {
		return groupService;
	}

	public void setGroupService(IGroupService groupService) {
		this.groupService = groupService;
	}

	public String getDelData() {
		return delData;
	}

	public void setDelData(String delData) {
		this.delData = delData;
	}
}
