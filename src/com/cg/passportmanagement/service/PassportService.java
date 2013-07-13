package com.cg.passportmanagement.service;

import java.util.List;
import org.springframework.context.ApplicationContext;

import com.cg.passportmanagement.common.DeviceUtil;
import com.cg.passportmanagement.common.SpringContextUtil;
import com.cg.passportmanagement.dao.PassportDAO;
import com.cg.passportmanagement.dao.UserDeviceAclDAO;
import com.cg.passportmanagement.dao.DeviceDAO;
import com.cg.passportmanagement.dao.UserPassportAclDAO;
import com.cg.passportmanagement.database.Device;
import com.cg.passportmanagement.database.Passport;
import com.cg.passportmanagement.database.UserDeviceAcl;
import com.cg.passportmanagement.database.UserDeviceAclId;
import com.cg.passportmanagement.database.UserPassportAcl;
import com.cg.passportmanagement.database.UserPassportAclId;
import com.cg.passportmanagement.digi.DigiIP;
import com.cg.passportmanagement.digi.DigiIpFilter;
import com.cg.passportmanagement.digi.DigiPPP;
import com.cg.passportmanagement.digi.DigiSyslogItem;

public class PassportService implements IPassportService {
	private PassportDAO dao;
	private UserPassportAclDAO aclDao;
	private DeviceDAO deviceDao;
	
	private static final String SERVICE_BEAN_ID = "PassportService";

	public PassportService() {
		super();
	}

	public static IPassportService getInstance(ApplicationContext context) {
		return (IPassportService) context.getBean(SERVICE_BEAN_ID);
	}
	
	public static IPassportService getInstance() {
		return (IPassportService) SpringContextUtil.getBean(SERVICE_BEAN_ID);
	}
	
	public Passport findById(int passportid) throws Exception {
		try {
			return getDao().findById(passportid);
		} catch (RuntimeException e) {
			throw new Exception("findById failed with the id " + passportid + ": "
					+ e.getMessage());
		}
	}

	public Passport findByIP(String passportip) throws Exception {
		try {
			List rl = getDao().findByIp(passportip);
			if(rl!=null)
				return (Passport)rl.get(0);
			return null;
		} catch (RuntimeException e) {
			throw new Exception("findById failed with the ip " + passportip + ": "
					+ e.getMessage());
		}
	}
	
	public void save(Passport passport) throws Exception {
		try {
			getDao().save(passport);
		} catch (RuntimeException e) {
			throw new Exception("save Passport failed: " + e.getMessage());
		}
	}

	public void delete(Passport passport) throws Exception {
		try {
			getDao().delete(passport);
		} catch (RuntimeException e) {
			throw new Exception("removepassport failed: " + e.getMessage());
		}
	}

	public void deleteById(int passportid) throws Exception {
		try {
			getAclDao().deleteByPassportid(passportid);
			UserDeviceAclDAO.getInstance().deleteByPassportId(passportid);
			getDeviceDao().deleteByPassportid(passportid);
			getDao().deleteById(passportid); 
		} catch (RuntimeException e) {
			throw new Exception("deleteById failed: " + e.getMessage());
		}
	}
	
	public List<Passport> findAll() throws Exception {
		try{
			return getDao().findAll();
		}catch (RuntimeException e) {
			throw new Exception("findAllpassports failed: " + e.getMessage());
		}
	}
	
	@SuppressWarnings("unchecked")
	public List<UserPassportAcl> findByUserId(String userid) throws Exception{
		try{
			return getAclDao().findByUserId(userid);
		}catch (RuntimeException e) {
			throw new Exception("findByUserId failed: " + e.getMessage());
		}
	}

	public void populateDigiIP(Passport passport) throws Exception{
		DigiIP di = null;
		di = DeviceUtil.getDigiIP(passport);
		passport.setSetip(di.getIp());
		passport.setNetmask(di.getMask());
		passport.setGateway(di.getGateway());
	}
	
	public void populateDigiPPP(Passport passport) throws Exception{
		DigiPPP ppp = null;
		ppp = DeviceUtil.getDigiPPP(passport);
		passport.setPppip(ppp.getFirstip());
		passport.setPppipnum(ppp.getNumberOfIP());
	}
	
	public void populateSyslogngSetting(Passport passport) throws Exception{
		List<DigiSyslogItem> list = null;
		list = DeviceUtil.getDigiSyslogngSetting(passport);
		
		if (list!=null && list.size()>0){
			passport.setSyslogfilter_1(list.get(0).getFilter());
			passport.setSyslogdest_1(list.get(0).getDestination());
			passport.setSyslogip_1(list.get(0).getServerip());
			
			if (list.size()>1){
				passport.setSyslogfilter_2(list.get(1).getFilter());
				passport.setSyslogdest_2(list.get(1).getDestination());
				passport.setSyslogip_2(list.get(1).getServerip());
			
				if (list.size()>2){
					passport.setSyslogfilter_3(list.get(2).getFilter());
					passport.setSyslogdest_3(list.get(2).getDestination());
					passport.setSyslogip_3(list.get(2).getServerip());
				
					if (list.size()>3){
						passport.setSyslogfilter_4(list.get(3).getFilter());
						passport.setSyslogdest_4(list.get(3).getDestination());
						passport.setSyslogip_4(list.get(3).getServerip());
					}
				}
			}
		}
	}
	public void populateIpFilterSetting(Passport passport) throws Exception{
		List<DigiIpFilter> list = null;
		list = DeviceUtil.getDigiIpFilter(passport);

		if (list!=null && list.size()>0){
			passport.setIpf_ip_1(list.get(0).getIpaddress());
			passport.setIpf_protocol_1(list.get(0).getProtocol());
			passport.setIpf_port_1(list.get(0).getPort());
			passport.setIpf_rule_1(list.get(0).getRule());

			if (list.size()>1){
				passport.setIpf_ip_2(list.get(1).getIpaddress());
				passport.setIpf_protocol_2(list.get(1).getProtocol());
				passport.setIpf_port_2(list.get(1).getPort());
				passport.setIpf_rule_2(list.get(1).getRule());
			
				if (list.size()>2){
					passport.setIpf_ip_3(list.get(2).getIpaddress());
					passport.setIpf_protocol_3(list.get(2).getProtocol());
					passport.setIpf_port_3(list.get(2).getPort());
					passport.setIpf_rule_3(list.get(2).getRule());

					if (list.size()>3){
						passport.setIpf_ip_4(list.get(3).getIpaddress());
						passport.setIpf_protocol_4(list.get(3).getProtocol());
						passport.setIpf_port_4(list.get(3).getPort());
						passport.setIpf_rule_4(list.get(3).getRule());
					}
				}
			}
		}
	}

	public UserPassportAcl getUserPassportAcl(String userid, int passportid) throws Exception {

		UserPassportAcl acl = null;
		UserPassportAclId id = new UserPassportAclId(userid, passportid);
		
		/* for 'root', use pwd saved in passport  */ 
		if ( userid.compareTo("root" )==0) 
		{
			// for 'root', we are going to build a record anyway
			Passport ppt = PassportService.getInstance().findById(passportid);
			if (ppt==null) 
				return null;

			acl = new UserPassportAcl();
			acl.setPassport(ppt);
			acl.setId(id);
			acl.setUsername(userid);
			acl.setPwd(ppt.getRootpwd());
			
			// saveUserPassportAcl(acl);

			return acl;
		}
		acl = UserPassportAclDAO.getInstance().findById(id);

		return acl;
	}
	public List<String> findAllIP() throws Exception {
		return getDao().findAllIP();
	}
	
	public void saveUserPassportAcl(UserPassportAcl acl) {
			UserPassportAclDAO.getInstance().save(acl); 
	}
	

	public void setDao(PassportDAO dao) {
		this.dao = dao;
	}

	public PassportDAO getDao() {
		return this.dao;
	}

	public void setAclDao(UserPassportAclDAO dao) {
		this.aclDao = dao;
	}

	public UserPassportAclDAO getAclDao() {
		return this.aclDao;
	}

	public DeviceDAO getDeviceDao() {
		return deviceDao;
	}

	public void setDeviceDao(DeviceDAO deviceDao) {
		this.deviceDao = deviceDao;
	}	
}