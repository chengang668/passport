package com.cg.passportmanagement.action;

import java.util.List;
import java.util.ArrayList;

import com.cg.passportmanagement.database.District;
import com.cg.passportmanagement.service.IDistrictService;
import com.cg.passportmanagement.service.SiteService;

import net.sf.json.JSONArray;

import commons.utils.action.ExtJSONActionSuport;

/*
 *  DistrictAction is configured as prototype in spring IoC 
 */

public class DistrictAction extends ExtJSONActionSuport {
	private static final long serialVersionUID = 1L;
	private transient District district = null;
	private transient District district2 = null; // used for update district
	private List<District> districts = new ArrayList<District>(0);
	private IDistrictService districtService = null;
	private String delData;

	public String execute() {
		return SUCCESS;
	}

	@Override
	public String jsonExecute() throws Exception {
		if (this.getDelData() != null && !"".equals(this.getDelData())) {
			if (this.getDelData().indexOf(",") < 0) {
				this.districtService.removeDistrictById(Integer.valueOf(this.getDelData()));
				System.out.println("del_id:" + getDelData());
			} else {
				String id[] = this.getDelData().split(",");
				for (int i = 0; i < id.length; i++) {
					System.out.println("del:" + id[i]);
					this.districtService.removeDistrictById(Integer.valueOf(id[i]));
				}
			}
		}

		try {
			this.districts = this.getDistrictService().findAllDistricts();
			System.out.println("query database");
		} catch (Exception e) {
			e.printStackTrace();
		}

		this.setTotalCount(this.districts.size());
		JSONArray array = JSONArray.fromObject(this.districts);
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
	public String findDistrictById(String id) {
		try {
			this.district = this.getDistrictService().findDistrictById(Integer.valueOf(id));
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.districts);
		this.setJsonString(array.toString());
		return SUCCESS;
	}

	public String findDistrictById() {
		System.out.println(this.district.getDistrictid());
		try {
			this.district = this.getDistrictService().findDistrictById(	this.district.getDistrictid());
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.district);
		this.setJsonString(array.toString());
		this.setJsonString("{success:true,totalCount:1,list:"
				+ array.toString() + "}");
		System.out.println(array.toString());
		
		return SUCCESS;
	}

	/**
	 * @return Return all persistent instances of the <code>District</code> entity.
	 */
	public String getAllDistricts() {
		try {
			this.districts = this.getDistrictService().findAllDistricts();
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
	public String saveDistrict() {
		System.out.println(this.district.getDistrictid() + "---"
				+ this.district.getDistrictname()  + "---"
				+ this.district.getAddress() );
		
		// this.district.setCreatetime(new Date());
		
		this.setJsonString("{success:true}");
		try {
			this.getDistrictService().saveDistrict(this.getDistrict());
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false}");
		}
		return SUCCESS;
	}

	public String updateDistrict() {
		System.out.println(this.district2.getDistrictid() + "---"
				+ this.district2.getDistrictname()  + "---"
				+ this.district2.getAddress() );
		
		this.setJsonString("{success:true}");
		try {
			this.district = this.getDistrictService().findDistrictById(	this.district2.getDistrictid());
			
			this.district.setDistrictname( district2.getDistrictname() );
			this.district.setAddress( district2.getAddress() ); 
			
			this.getDistrictService().saveDistrict(this.district);
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
	public String removeDistrict() {
		try {
			// this.getDistrictService().removeDistrict(this.getDistrict());
			Integer districtid = district.getDistrictid();
			if ( 0 == SiteService.getInstance().findSiteByDistrict(districtid).size())
			{
				getDistrictService().removeDistrictById(districtid);
				this.setJsonString("{success:true}");
			}
			else {
				this.setJsonString("{success:false, error:{reason:'请先删除该地区的所有机房，然后删除该地区。'}}");
			}
		} catch (Exception e) {
			// e.printStackTrace();
			this.setJsonString("{success:false, error:{reason:'请先删除该地区的所有机房，然后删除该地区。'}}");
		}
		return SUCCESS;
	}

	/**
	 * Remove an entity by its id (primary key). *
	 * 
	 * @return
	 */
	public String removeDistrictById(String id) {
		try {
			this.getDistrictService().removeDistrictById(Integer.valueOf(id));
		} catch (Exception e) {
			this.setJsonString("{success:false}");
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public District getDistrict() {
		return district;
	}

	public void setDistrict(District district) {
		this.district = district;
	}

	public District getDistrict2() {
		return district2;
	}

	public void setDistrict2(District district) {
		this.district2 = district;
	}
	
	public List<District> getDistricts() {
		return districts;
	}

	public void setDistricts(List<District> districts) {
		this.districts = districts;
	}

	public IDistrictService getDistrictService() {
		return districtService;
	}

	public void setDistrictService(IDistrictService districtService) {
		this.districtService = districtService;
	}

	public String getDelData() {
		return delData;
	}

	public void setDelData(String delData) {
		this.delData = delData;
	}
}
