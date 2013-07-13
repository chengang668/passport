package com.cg.passportmanagement.service;

import java.util.List;

import org.springframework.context.ApplicationContext;

import com.cg.passportmanagement.common.SpringContextUtil;
import com.cg.passportmanagement.dao.IDistrictDAO;
import com.cg.passportmanagement.database.District;

public class DistrictService implements IDistrictService {
	private IDistrictDAO dao;

	private static final String SERVICE_BEAN_ID = "DistrictService";

	public static IDistrictService getInstance(ApplicationContext context) {
		return (IDistrictService) context.getBean(SERVICE_BEAN_ID);
	}
	public static IDistrictService getInstance() {
		return (IDistrictService) SpringContextUtil.getBean(SERVICE_BEAN_ID);
	}
	
	public List<District> findAllDistricts() throws Exception {
		try{
			return getDao().findAll();
		}
		catch (RuntimeException e) {
			throw new Exception("findAllDistricts failed: " + e.getMessage());
		}
	}

	public District findDistrictById(int districtid) throws Exception {
		try{
			return getDao().findById(districtid); 
		}
		catch (RuntimeException e) {
			throw new Exception("findDistrictById failed: " + e.getMessage());
		}
	}

	public void saveDistrict(District district) throws Exception {
		try{
			getDao().save(district); 
		}
		catch (RuntimeException e) {
			throw new Exception("saveDistrict failed: " + e.getMessage());
		}
	} 

	public void removeDistrict(District district) throws Exception {
		try{
			getDao().delete(district); 
		}
		catch (RuntimeException e) {
			throw new Exception("removeDistrict failed: " + e.getMessage());
		}
	}

	public void removeDistrictById(int districtid) throws Exception {
		try{
			getDao().deleteById(districtid); 
		}
		catch (RuntimeException e) {
			e.printStackTrace();
			throw new Exception("removeDistrict failed: " + e.getMessage());
		}
	}
	
	public District findByDistrictname(String districtname) throws Exception{
		try{
			List<District> rs = getDao().findByDistrictname(districtname); 
			if (rs != null && rs.size()>0)
				return rs.get(0);
			return null;
		}
		catch (RuntimeException e) {
			throw new Exception("findByDistrictname failed: " + e.getMessage());
		}
	}
	
	public IDistrictDAO getDao() {
		return dao;
	}

	public void setDao(IDistrictDAO dao) {
		this.dao = dao;
	}

}
