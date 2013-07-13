package com.cg.passportmanagement.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.context.ApplicationContext;

import com.cg.passportmanagement.common.DeviceUtil;
import com.cg.passportmanagement.common.SpringContextUtil;
import com.cg.passportmanagement.dao.DeviceDAO;
import com.cg.passportmanagement.dao.PassportDAO;
import com.cg.passportmanagement.dao.UserDeviceAclDAO;
import com.cg.passportmanagement.database.Device;
import com.cg.passportmanagement.database.DeviceId;
import com.cg.passportmanagement.database.Passport;
import com.cg.passportmanagement.database.UserDeviceAcl;
import com.cg.passportmanagement.database.UserDeviceAclId;
import com.cg.passportmanagement.digi.DigiPort;

public class DeviceService implements IDeviceService {
	private DeviceDAO dao;
	private static final String SERVICE_BEAN_ID = "DeviceService";
	private static IDeviceService instance = null;

	public DeviceService() {
		super();
	}

	public static IDeviceService getInstance() {
		if (instance == null)
			instance = (IDeviceService) SpringContextUtil.getBean(SERVICE_BEAN_ID);
		return instance;
	}
	
	public static IDeviceService getInstance(ApplicationContext context) {
		return (IDeviceService) context.getBean(SERVICE_BEAN_ID);
	}

	public Device findById(Passport passport, int portid) throws Exception {
		try {
			return getDao().findById(passport, portid);
		} catch (RuntimeException e) {
			throw new Exception("findById failed with the passport: " + passport.getPassportid() + ": "
					+ e.getMessage());
		}
	}

	public void save(Device device) throws Exception {
		try {
			getDao().save(device);
		} catch (RuntimeException e) {
			throw new Exception("persistdevice failed: " + e.getMessage());
		}
	}

	public void save(List<Device> ds) throws Exception {
		try {
			//for (Device dv : ds) getDao().save(dv);
			getDao().save(ds);
		} catch (RuntimeException e) {
			throw new Exception("save(List<Device> ds) failed: " + e.getMessage());
		}
	}
	
	public void delete(Device device) throws Exception {
		try {
			getDao().delete(device);
		} catch (RuntimeException e) {
			throw new Exception("removedevice failed: " + e.getMessage());
		}
	}

	public void deleteById(int deviceid) throws Exception {
		// TODO Auto-generated method stub
		
	}
	
	public List<Device> findByPassportId(int passportid) throws Exception {
		List<Device> ds = getDao().findByPassportid(passportid);
		return ds; 
	}
	
	public List<Device> findByUserId(String userid) throws Exception {
		List<UserDeviceAcl> lists;
		List<Device> deviceLists = new ArrayList<Device>(0);
		try{ 
			lists = (List<UserDeviceAcl>) UserDeviceAclDAO.getInstance().findByUserId(userid);
			if (lists != null){
				for (int i=0; i < lists.size(); i++) {
					deviceLists.add(lists.get(i).getDevice());
				}
			}
		}catch (RuntimeException e) {
			throw new Exception("DeviceService.findByUserId failed: " + e.getMessage());
		}
		
		return deviceLists; 
	}

	public UserDeviceAcl findUserDeviceInfo(String userid, int passportid, int portid) throws Exception {
		try {
			UserDeviceAclId id = new UserDeviceAclId(userid, passportid, portid);
			UserDeviceAcl ud = UserDeviceAclDAO.getInstance().findById(id);
			
			if ((ud==null || 
					ud.getPwd()==null || ud.getPwd().isEmpty() || 
					ud.getUsername()==null || ud.getUsername().isEmpty()) 
					&& userid.compareTo("root")==0)
			{
				// for 'root', we are going to build a record if not found.
				Passport ppt = PassportService.getInstance().findById(passportid);
				if (ppt==null) 
					return null;
				
				Device dv = dao.findById(ppt, portid);
				if (dv!=null){
					ud = new UserDeviceAcl();
					ud.setDevice(dv);
					ud.setId(id);
					ud.setUsername(userid);
					ud.setPwd(ppt.getRootpwd());
				}
				return ud;
			}
			return ud;
		} catch (RuntimeException e) {
			throw new Exception("findUserDeviceInfo failed with the userid: " + userid + ", passportid: " + passportid + ", "
				+ e.getMessage());
		}
	}
	
	public void saveUserDeviceInfo(UserDeviceAcl acl) throws Exception {
		try {
			UserDeviceAclDAO.getInstance().save(acl); 
		} catch (RuntimeException e) {
			throw new Exception( "saveUserDeviceInfo failed " );
		}
	}

	public void deleteByPassportId(int passportid) throws Exception {
		List<Device> ds = getDao().findByPassportid(passportid);
		if (ds!=null && ds.size()>0){
			for (Device dv : ds){
				getDao().delete(dv);
			}
		}		
	}
	
	public void setDao(DeviceDAO dao) {
		this.dao = dao;
	}

	public DeviceDAO getDao() {
		return this.dao;
	}

	public List<Device> findAll() throws Exception {
		try{
			return getDao().findAll();
		}catch (RuntimeException e) {
			throw new Exception("findAlldevices failed: " + e.getMessage());
		}
	}
	
	public int populateDevices(Passport passport){ 
		try {
			List<Device> dvlist = retrieveDevicesFromDigi(passport);
			if (dvlist!=null){
				this.save(dvlist);
				return 1;
			}
		} catch (Exception e) {
			e.printStackTrace();	
		}
		return 0;
	}

	public List<Device> retrieveDevicesFromDigi(Passport passport) throws Exception{ 
		List<DigiPort> ports = null;
		ports = DeviceUtil.getPassportPortsList(passport);
		
		if (ports==null)
			return null;
		
		List<Device> dvlist = new ArrayList<Device>();
		for (DigiPort pd : ports)
		{
			Device dv = new Device ();
			DeviceId dvid = new DeviceId();
			dvid.setPassport(passport);
			dvid.setPortid(pd.getPortNo());
			dv.setId(dvid);
			dv.setPassportip(passport.getIp());
			dv.setGroup(pd.getGroup());
			dv.setMode(pd.getMode());
			dv.setPort(pd.getPort());
			dv.setProtocol(pd.getProtocol());
			dv.setSerial_setting(pd.getSerial_setting());
			dv.setTitle(pd.getTitle());

			dvlist.add(dv);
		}
		return dvlist;
	}
}