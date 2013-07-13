package com.cg.passportmanagement.service;

import java.util.List;
import org.springframework.context.ApplicationContext;

import com.cg.passportmanagement.dao.DigiLogDAO;
import com.cg.passportmanagement.database.DigiLog; 

public class DigiService  {
	private DigiLogDAO digiLogDao; 
	private static final String SERVICE_BEAN_ID = "DigiService";

	public DigiService() {
		super();
	}

	public List<DigiLog> findDigiLog(String digiIP) throws Exception{
		try {
			return getDigiLogDao().findByDigiIp(digiIP);
		} catch (RuntimeException e) {
			throw new Exception("findByDigiIp failed with the ip " + digiIP + ": "
					+ e.getMessage());
		} 
	}
	
	public void persistList(List<DigiLog> list) throws Exception{
		try {
			for (Object o : list){
				getDigiLogDao().save((DigiLog)o);
			}			
		} catch (RuntimeException e) {
			throw new Exception("persistuser failed: " + e.getMessage());
		}
	}
	
	
	public DigiLogDAO getDigiLogDao() {
		return digiLogDao;
	}

	public void setDigiLogDao(DigiLogDAO digiLogDao) {
		this.digiLogDao = digiLogDao;
	}
	
}