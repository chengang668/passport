package com.cg.passportmanagement.dao;

import java.util.List;

import com.cg.passportmanagement.database.*;

public interface ISiteDAO {
	public Site findById(Integer siteid);

	public List<Site> findAll();

	public void save(Site site);

	public void delete(Site site);

	public void deleteById(int SiteID);
	
	public List<Site> findBySitename(Object sitename);
	
	public List<Site> findByDistrictid(Integer districtid);
}