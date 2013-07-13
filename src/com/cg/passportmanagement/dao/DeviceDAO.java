package com.cg.passportmanagement.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.cg.passportmanagement.database.Device;
import com.cg.passportmanagement.database.DeviceId;
import com.cg.passportmanagement.database.Passport;

/**
 * A data access object (DAO) providing persistence and search support for
 * Devices entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see com.cg.passportmanagement.database.Device
 * @author MyEclipse Persistence Tools
 */

public class DeviceDAO extends HibernateDaoSupport {
	private static final Log log = LogFactory.getLog(DeviceDAO.class);
	// property constants
	public static final String TITLE = "title"; 

	protected void initDao() {
		// do nothing
	}

	public void save(Device transientInstance) {
		log.debug("saving Device instance");
		try {
			getHibernateTemplate().saveOrUpdate(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void save(List<Device> dlist) {
		log.debug("saving List<Device>  ");
		try {
			for (Device dv : dlist)
				getHibernateTemplate().saveOrUpdate(dv);
			
			log.debug("saving List<Device> successful");
		} catch (RuntimeException re) {
			log.error("saving List<Device> failed", re);
			throw re;
		}
	}
	
	public void delete(Device persistentInstance) {
		log.debug("deleting Device instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}
	
	public int deleteByPassportid(int pptid) {
        String queryString;
        queryString = "delete Device as a where a.id.passport.passportid = " + pptid;

		int cnt = 0;
		try {
            cnt = getSession().createQuery(queryString).executeUpdate();
		} catch (RuntimeException re) {
			log.error("DeviceDAO.deleteByPassportId failed", re);
			throw re;
		}
		return cnt;
	}

	public Device findById(com.cg.passportmanagement.database.DeviceId id) {
		log.debug("getting Device instance with id: " + id);
		try {
			Device instance = (Device) getHibernateTemplate().get(
					"com.cg.passportmanagement.database.Device", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}
	public Device findById(Passport passport, int portid) {
		log.debug("getting Device instance with passportid: " + passport.getPassportid() + ", portid: " + portid);
		try {
			com.cg.passportmanagement.database.DeviceId id = 
				new com.cg.passportmanagement.database.DeviceId(passport, portid);
			Device instance = (Device) getHibernateTemplate().get(
					"com.cg.passportmanagement.database.Device", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}
	
	public List<Device> findByExample(Device instance) {
		log.debug("finding Device instance by example");
		try {
			List<Device> results = (List<Device>) getHibernateTemplate()
					.findByExample(instance);
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}

	public List findByProperty(String propertyName, Object value) {
		log.debug("finding Device instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from Device as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	@SuppressWarnings("unchecked")
	public List<Device> findByPassportid (Integer passportid){
		log.debug("finding Device instance with passportid" 
				+ ", value: " + passportid);
		try {
			String queryString = "from Device as model where model.id.passport.passportid"
					 + "= ?";
			return (List<Device>) getHibernateTemplate().find(queryString, passportid);
		} catch (RuntimeException re) {
			log.error("find by passportid failed", re);
			throw re;
		}
	}
	
	public List findAll() {
		log.debug("finding all Device instances");
		try {
			String queryString = "from Device";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public Device merge(Device detachedInstance) {
		log.debug("merging Device instance");
		try {
			Device result = (Device) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(Device instance) {
		log.debug("attaching dirty Device instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(Device instance) {
		log.debug("attaching clean Device instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static DeviceDAO getFromApplicationContext(ApplicationContext ctx) {
		return (DeviceDAO) ctx.getBean("DeviceDAO");
	}
}