package com.cg.passportmanagement.action;

import java.util.List;
import com.cg.passportmanagement.dao.IpfilterDAO;
import com.cg.passportmanagement.database.Ipfilter;

import net.sf.json.JSONArray;

import commons.utils.action.ExtJSONActionSuport;

/*
 *  IpfilterAction is configured as prototype in spring IoC 
 */

public class IpfilterAction extends ExtJSONActionSuport {
	private static final long serialVersionUID = 1L;
	
	private Ipfilter ipfilter = null;
	private Ipfilter ipfilter2 = null; // used for update 
	
	private String delData;

	public String execute() {
		return SUCCESS;
	}

	@Override
	public String jsonExecute() throws Exception {
		if (this.getDelData() != null && !"".equals(this.getDelData())) {
			if (this.getDelData().indexOf(",") < 0) {
				IpfilterDAO.getInstance().deleteById(Integer.valueOf(this.getDelData()));
			} else {
				String id[] = this.getDelData().split(",");
				for (int i = 0; i < id.length; i++) {
					// System.out.println("del:" + id[i]);
					IpfilterDAO.getInstance().deleteById(Integer.valueOf(id[i]));
				}
			}
		}

		List<Ipfilter> ipfilters = null;
		
		try {
			ipfilters = IpfilterDAO.getInstance().findAll();
		} catch (Exception e) {
			e.printStackTrace();
		}

		this.setTotalCount(ipfilters==null? 0: ipfilters.size());
		JSONArray array = JSONArray.fromObject(ipfilters); 
		this.setJsonString("{success:true,totalCount : " + this.getTotalCount()
				+ ", list:" + array.toString() + "}");
		
		return super.jsonExecute();
	}

	/**
	 * Find an entity by its id (primary key).
	 */
	public String findIpfilterById() {
		try {
			this.ipfilter = IpfilterDAO.getInstance().findById(	this.ipfilter.getid());
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.ipfilter);
		this.setJsonString(array.toString());
		this.setJsonString("{success:true,totalCount:1,list:"
				+ array.toString() + "}");		
		return SUCCESS;
	}

	/**
	 * @return Return all persistent instances of the <code>Ipfilter</code> entity.
	 */
	public String getAllIpfilters() {
		try {
			// List<Ipfilter> ipfilters = IpfilterDAO.getInstance().findAll();
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
	public String saveIpfilter() {
		this.setJsonString("{success:true}");
		try {
			IpfilterDAO.getInstance().save(this.getIpfilter());
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false}");
		}
		return SUCCESS;
	}

	public String updateIpfilter() {
		this.setJsonString("{success:true}");
		try {
			this.ipfilter = IpfilterDAO.getInstance().findById( ipfilter2.getid());
			this.ipfilter.setip( ipfilter2.getip() );
			
			IpfilterDAO.getInstance().save(this.ipfilter);
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
	public String removeIpfilter() {
		try {
			IpfilterDAO.getInstance().delete(ipfilter);
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
	public String removeIpfilterById(String id) {
		try {
			IpfilterDAO.getInstance().deleteById(Integer.valueOf(id));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public Ipfilter getIpfilter() {
		return ipfilter;
	}

	public void setIpfilter(Ipfilter ipfilter) {
		this.ipfilter = ipfilter;
	}

	public Ipfilter getIpfilter2() {
		return ipfilter2;
	}

	public void setIpfilter2(Ipfilter ipfilter) {
		this.ipfilter2 = ipfilter;
	}

	public String getDelData() {
		return delData;
	}

	public void setDelData(String delData) {
		this.delData = delData;
	}
}
