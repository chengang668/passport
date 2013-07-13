package com.cg.passportmanagement.dao;

import java.util.List;

import com.cg.passportmanagement.database.*;

public interface IDistrictDAO {
	public District findById(Integer siteid);

	public List<District> findAll();

	public void save(District site);

	public void delete(District site);

	public void deleteById(int DistrictID);
	
	public List<District> findByDistrictname(Object districtname);
}