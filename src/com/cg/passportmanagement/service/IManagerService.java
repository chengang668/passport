package com.cg.passportmanagement.service;

import java.util.List;

import com.cg.passportmanagement.database.Manager; 

public interface IManagerService {
	public Manager findManagerById(int Managerid) throws Exception;

	public List<Manager> findAllManagers() throws Exception;

	public void persistManager(Manager manager) throws Exception;

	public void removeManager(Manager manager) throws Exception;
}
