package com.cg.passportmanagement.service;

import java.util.List;

import com.cg.passportmanagement.database.Site;

public interface ISiteService {
	public Site findSiteById(int siteid) throws Exception;

	public List<Site> findAllSites() throws Exception;
	
	public List<Site> findSiteByDistrict(Integer districtid) throws Exception;

	public void saveSite(Site site) throws Exception;

	public void removeSite(Site site) throws Exception;

	public void removeSiteById(int siteid) throws Exception;
	
	public Site findBySitename(String name) throws Exception;
}
