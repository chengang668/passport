package com.cg.passportmanagement.service;

import java.util.List;

import com.cg.passportmanagement.dao.UserDeviceAclDAO;
import com.cg.passportmanagement.database.Device;
import com.cg.passportmanagement.database.Passport; 
import com.cg.passportmanagement.database.User;
import com.cg.passportmanagement.database.UserDeviceAcl;
import com.cg.passportmanagement.database.UserDeviceAclId;
import com.cg.passportmanagement.database.UserPassportAcl;

public interface IPassportService {
	public Passport findById(int passportid) throws Exception;
	
	public Passport findByIP(String passportip) throws Exception;

	public List<Passport> findAll() throws Exception;

	public void save(Passport passport) throws Exception;

	public void delete(Passport passport) throws Exception;
	
	public void deleteById(int passportid) throws Exception;

	public List<UserPassportAcl> findByUserId(String userid) throws Exception;

	public UserPassportAcl getUserPassportAcl(String userid, int passportid) throws Exception;
	public void saveUserPassportAcl(UserPassportAcl acl) throws Exception;

	public void populateDigiIP(Passport passport) throws Exception;
	
	public void populateDigiPPP(Passport passport) throws Exception;
	
	public void populateSyslogngSetting(Passport passport) throws Exception;
	public void populateIpFilterSetting(Passport passport) throws Exception;
	
	public List<String> findAllIP() throws Exception;
}
