package com.cg.passportmanagement.service;

import java.util.List;

import com.cg.passportmanagement.database.Device; 
import com.cg.passportmanagement.database.Passport;
import com.cg.passportmanagement.database.UserDeviceAcl;

public interface IDeviceService {
	public Device findById(Passport passport, int portid) throws Exception;

	public UserDeviceAcl findUserDeviceInfo(String userid, int passportid, int portid) throws Exception;

	public void saveUserDeviceInfo(UserDeviceAcl acl) throws Exception;

	public List<Device> findAll() throws Exception;

	public void save(Device device) throws Exception;

	public void delete(Device device) throws Exception;
	
	public void deleteById(int deviceid) throws Exception;

	public void save(List<Device> ds) throws Exception;

	public List<Device> findByPassportId(int passportid) throws Exception;
	
	public List<Device> findByUserId(String userid) throws Exception;

	public void deleteByPassportId(int passportid) throws Exception;

	public int populateDevices(Passport passport);
	
	public List<Device> retrieveDevicesFromDigi(Passport passport) throws Exception;
}
