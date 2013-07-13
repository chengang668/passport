package com.cg.passportmanagement.service;

import java.util.List;

import com.cg.passportmanagement.database.District;

public interface IDistrictService {
	public District findDistrictById(int districtid) throws Exception;

	public List<District> findAllDistricts() throws Exception;

	public void saveDistrict(District district) throws Exception;

	public void removeDistrict(District district) throws Exception;

	public void removeDistrictById(int districtid) throws Exception;
	
	public District findByDistrictname(String name) throws Exception;
}
