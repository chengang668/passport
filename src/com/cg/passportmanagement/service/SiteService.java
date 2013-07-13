package com.cg.passportmanagement.service;

import java.util.List;

import org.springframework.context.ApplicationContext;

import com.cg.passportmanagement.common.SpringContextUtil;
import com.cg.passportmanagement.dao.ISiteDAO;
import com.cg.passportmanagement.database.Site;

public class SiteService implements ISiteService {
	private ISiteDAO dao;

	private static final String SERVICE_BEAN_ID = "SiteService";

	public static ISiteService getInstance(ApplicationContext context) {
		return (ISiteService) context.getBean(SERVICE_BEAN_ID);
	}
	public static ISiteService getInstance() {
		return (ISiteService) SpringContextUtil.getBean(SERVICE_BEAN_ID);
	}
	
	public List<Site> findAllSites() throws Exception {
		try{
			return getDao().findAll();
		}
		catch (RuntimeException e) {
			throw new Exception("findAllSites failed: " + e.getMessage());
		}
	}
	
	public List<Site> findSiteByDistrict(Integer districtid) throws Exception {
		try{
			return getDao().findByDistrictid(districtid);
		}
		catch (RuntimeException e) {
			throw new Exception("findSiteByDistrict failed: " + e.getMessage());
		}
	}

	public Site findSiteById(int siteid) throws Exception {
		try{
			return getDao().findById(siteid); 
		}
		catch (RuntimeException e) {
			throw new Exception("findSiteById failed: " + e.getMessage());
		}
	}

	public void saveSite(Site site) throws Exception {
		try{
			getDao().save(site); 
		}
		catch (RuntimeException e) {
			throw new Exception("saveSite failed: " + e.getMessage());
		}
	} 

	public void removeSite(Site site) throws Exception {
		try{
			getDao().delete(site); 
		}
		catch (RuntimeException e) {
			throw new Exception("removeSite failed: " + e.getMessage());
		}
	}

	public void removeSiteById(int siteid) throws Exception {
		try{
			getDao().deleteById(siteid); 
		}
		catch (RuntimeException e) {
			throw new Exception("removeSite failed: " + e.getMessage());
		}
	}
	
	public Site findBySitename(String sitename) throws Exception{
		try{
			List<Site> rs = getDao().findBySitename(sitename); 
			if (rs != null && rs.size()>0)
				return rs.get(0);
			return null;
		}
		catch (RuntimeException e) {
			throw new Exception("findBySitename failed: " + e.getMessage());
		}
	}
	
	public ISiteDAO getDao() {
		return dao;
	}

	public void setDao(ISiteDAO dao) {
		this.dao = dao;
	}

}
