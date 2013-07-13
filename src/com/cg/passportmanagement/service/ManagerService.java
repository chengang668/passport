package com.cg.passportmanagement.service;

import java.util.List;
import org.springframework.context.ApplicationContext;

import com.cg.passportmanagement.dao.ManagerDAO;
import com.cg.passportmanagement.database.Manager;

public class ManagerService implements IManagerService {
	private ManagerDAO dao;
	private static final String SERVICE_BEAN_ID = "ManagerService";

	public ManagerService() {
		super();
	}

	public static IManagerService getInstance(ApplicationContext context) {
		return (IManagerService) context.getBean(SERVICE_BEAN_ID);
	}

	public Manager findManagerById(int managerid) throws Exception {
		try {
			return getDao().findById(managerid);
		} catch (RuntimeException e) {
			throw new Exception("findmanagerById failed with the id " + managerid + ": "
					+ e.getMessage());
		}
	}

	public void persistManager(Manager manager) throws Exception {
		try {
			getDao().save(manager);
		} catch (RuntimeException e) {
			throw new Exception("persistmanager failed: " + e.getMessage());
		}
	}

	public void removeManager(Manager manager) throws Exception {
		try {
			getDao().delete(manager);
		} catch (RuntimeException e) {
			throw new Exception("removemanager failed: " + e.getMessage());
		}
	}

	public void setDao(ManagerDAO dao) {
		this.dao = dao;
	}

	public ManagerDAO getDao() {
		return this.dao;
	}

	public List<Manager> findAllManagers() throws Exception {
		try{
			return getDao().findAll();
		}catch (RuntimeException e) {
			throw new Exception("findAllmanagers failed: " + e.getMessage());
		}
	}

}