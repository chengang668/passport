package com.cg.passportmanagement.action;

import java.util.List;
import java.util.ArrayList;
import com.cg.passportmanagement.database.District;
import com.cg.passportmanagement.database.Site;
import com.cg.passportmanagement.service.IDistrictService;
import com.cg.passportmanagement.service.ISiteService;

import net.sf.json.JSONArray;

import commons.utils.action.ExtJSONActionSuport;

/*
 *  SiteAction is configured as prototype in spring IoC 
 */

public class SiteAction extends ExtJSONActionSuport {
	private static final long serialVersionUID = 1L;
	private transient Site site = null;
	private transient Site site2 = null; // used for update site
	private List<Site> sites = new ArrayList<Site>(0);
	private ISiteService siteService = null;
	private IDistrictService districtService = null;
	private String delData;

	public String execute() {
		return SUCCESS;
	}

	@Override
	public String jsonExecute() throws Exception {
		if (this.getDelData() != null && !"".equals(this.getDelData())) {
			if (this.getDelData().indexOf(",") < 0) {
				this.siteService.removeSiteById(Integer.valueOf(this.getDelData()));
				System.out.println("del_id:" + getDelData());
			} else {
				String id[] = this.getDelData().split(",");
				for (int i = 0; i < id.length; i++) {
					System.out.println("del:" + id[i]);
					this.siteService.removeSiteById(Integer.valueOf(id[i]));
				}
			}
		}
		// HttpSession session = ServletActionContext.getRequest().getSession();
		try {
			this.sites = this.getSiteService().findAllSites();
			// session.setAttribute("Site_Data1", this.sites);
			System.out.println("query database");
		} catch (Exception e) {
			e.printStackTrace();
		}
		this.setTotalCount(this.sites.size());
		JSONArray array = JSONArray.fromObject(this.sites);
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
	public String findSiteById(String id) {
		try {
			this.site = this.getSiteService().findSiteById(Integer.valueOf(id));
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.sites);
		this.setJsonString(array.toString());
		return SUCCESS;
	}

	public String findSiteById() {
		System.out.println(this.site.getSiteid());
		try {
			this.site = this.getSiteService().findSiteById(	this.site.getSiteid());
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.site);
		this.setJsonString(array.toString());
		this.setJsonString("{success:true,totalCount:1,list:"
				+ array.toString() + "}");
		System.out.println(array.toString());
		
		return SUCCESS;
	}

	/**
	 * @return Return all persistent instances of the <code>Site</code> entity.
	 */
	public String getAllSites() {
		try {
			this.sites = this.getSiteService().findAllSites();
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
	public String saveSite() {
		System.out.println(this.site.getSiteid() + "---"
				+ this.site.getSitename()  + "---"
				+ this.site.getAddress() );
		
		// this.site.setCreatetime(new Date());
		
		this.setJsonString("{success:true}");
		try {
			District ddd = this.getDistrictService().findByDistrictname(this.getSite().getDistrict().getDistrictname());
			this.getSite().setDistrict(ddd);
			this.getSiteService().saveSite(this.getSite());
		} catch (Exception e) {
			e.printStackTrace();
			this.setJsonString("{success:false}");
		}
		return SUCCESS;
	}

	public String updateSite() {
		String districtname = this.site2.getDistrict().getDistrictname().trim();
		
		System.out.println(this.site2.getSiteid() + "---"
				+ this.site2.getSitename()  + "---"
				+ this.site2.getAddress() + "---"
				+ districtname);
		
		this.setJsonString("{success:true}");
		try {
			this.site = this.getSiteService().findSiteById(	this.site2.getSiteid());
			
			this.site.setSitename( site2.getSitename() );
			this.site.setAddress( site2.getAddress() ); 
			
			if (districtname.length()>0)
			{
				District district = districtService.findByDistrictname(districtname);
				this.site.setDistrict(district);
			}
			else
				this.site.setDistrict(null);
			
			this.getSiteService().saveSite(this.site);
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
	public String removeSite() {
		try {
			// this.getSiteService().removeSite(this.getSite());
			this.getSiteService().removeSiteById(this.site.getSiteid());
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
	public String removeSiteById(String id) {
		try {
			this.getSiteService().removeSiteById(Integer.valueOf(id));
		} catch (Exception e) {
			this.setJsonString("{success:false}");
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public Site getSite() {
		return site;
	}

	public void setSite(Site site) {
		this.site = site;
	}

	public Site getSite2() {
		return site2;
	}

	public void setSite2(Site site) {
		this.site2 = site;
	}
	
	public List<Site> getSites() {
		return sites;
	}

	public void setSites(List<Site> sites) {
		this.sites = sites;
	}

	public ISiteService getSiteService() {
		return siteService;
	}

	public void setSiteService(ISiteService siteService) {
		this.siteService = siteService;
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
