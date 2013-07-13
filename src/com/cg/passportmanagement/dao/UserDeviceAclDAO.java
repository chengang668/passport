package com.cg.passportmanagement.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.cg.passportmanagement.common.SpringContextUtil;
import com.cg.passportmanagement.database.*;

/**
 * A data access object (DAO) providing persistence and search support for
 * UserDeviceAcl entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.cg.passportmanagement.database.UserDeviceAcl
 * @author MyEclipse Persistence Tools
 */

public class UserDeviceAclDAO extends HibernateDaoSupport {
	private static final Log log = LogFactory.getLog(UserDeviceAclDAO.class);
	// property constants
	public static final String USERNAME = "username";
	public static final String PWD = "pwd";
	public static final String USER = "user";
	public static final String DEVICE = "device";

	protected void initDao() {
		// do nothing
	}

	public void save(UserDeviceAcl transientInstance) {
		log.debug("saving UserDeviceAcl instance");
		try {
			getHibernateTemplate().saveOrUpdate(transientInstance);
			log.debug("saveOrUpdate successful");
		} catch (RuntimeException re) {
			log.error("saveOrUpdate failed", re);
			throw re;
		}
	}

	public void delete(UserDeviceAcl persistentInstance) {
		log.debug("deleting UserDeviceAcl instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}
	
	public void deleteAll(List list) {
		log.debug("deleting a list of entities");
		try {
			getHibernateTemplate().deleteAll(list);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}
	
    @SuppressWarnings("unchecked")
	public void deleteByUserId(String userid) {
        log.debug("deleting UserDeviceAcl List with userid: " + userid);
        
        User user = new User();
        user.setUserid(userid);        
        
        try{
	        List list =  (List<UserDeviceAcl>) findByProperty(USER, user);
	        getHibernateTemplate().deleteAll(list);
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
    }
    
	public int deleteByPassportId(int pptid) {
        String queryString;
        queryString = "delete UserDeviceAcl as a where a.id.passportid = " + pptid;

		int cnt = 0;
		try {
            cnt = getSession().createQuery(queryString).executeUpdate();
		} catch (RuntimeException re) {
			log.error("UserDeviceAclDAO.deleteByPassportId failed", re);
			throw re;
		}
		return cnt;
    }

	public UserDeviceAcl findById(
			com.cg.passportmanagement.database.UserDeviceAclId id) {
		log.debug("getting UserDeviceAcl instance with id: " + id);
		try {
			UserDeviceAcl instance = (UserDeviceAcl) getHibernateTemplate()
					.get("com.cg.passportmanagement.database.UserDeviceAcl", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

    @SuppressWarnings("unchecked")
	public List<UserDeviceAcl> findByUserId(String userid) {
        log.debug("getting UserDeviceAcl List with userid: " + userid);
        
        User user = new User();
        user.setUserid(userid);        
        
        return (List<UserDeviceAcl>) findByProperty(USER, user); 
    }
    
	@SuppressWarnings("unchecked")
	public List<UserDeviceAcl> findByDevice(int pptid, int portid) {
		log.debug("finding UserDeviceAcl instance by device");
//		UserDeviceAcl acl = new UserDeviceAcl();
//		Device dv = new Device();
//		DeviceId dvid = new DeviceId();
//		Passport ppt = new Passport();
//		ppt.setPassportid(pptid);
//		dvid.setPassport(ppt);
//		dvid.setPortid(portid);
//		dv.setId(dvid);
//
//        return (List<UserDeviceAcl>) findByProperty(DEVICE, dv); 

		try {
			String queryString = "from UserDeviceAcl as model where model.device.id.passport.passportid= ? and model.device.id.portid= ?";
			return getHibernateTemplate().find(queryString, new Object[]{new Integer(pptid), new Integer(portid)});
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}
    
	public List<UserDeviceAcl> findByExample(UserDeviceAcl instance) {
		log.debug("finding UserDeviceAcl instance by example");
		try {
			List<UserDeviceAcl> results = (List<UserDeviceAcl>) getHibernateTemplate()
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
		log.debug("finding UserDeviceAcl instance with property: "
				+ propertyName + ", value: " + value);
		try {
			String queryString = "from UserDeviceAcl as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List<UserDeviceAcl> findByUsername(Object username) {
		return findByProperty(USERNAME, username);
	}

	public List<UserDeviceAcl> findByPwd(Object pwd) {
		return findByProperty(PWD, pwd);
	}

	public List findAll() {
		log.debug("finding all UserDeviceAcl instances");
		try {
			String queryString = "from UserDeviceAcl";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public UserDeviceAcl merge(UserDeviceAcl detachedInstance) {
		log.debug("merging UserDeviceAcl instance");
		try {
			UserDeviceAcl result = (UserDeviceAcl) getHibernateTemplate()
					.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(UserDeviceAcl instance) {
		log.debug("attaching dirty UserDeviceAcl instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(UserDeviceAcl instance) {
		log.debug("attaching clean UserDeviceAcl instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static UserDeviceAclDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (UserDeviceAclDAO) ctx.getBean("UserDeviceAclDAO");
	}
	
	public static UserDeviceAclDAO getInstance() {
		return (UserDeviceAclDAO) SpringContextUtil.getBean("UserDeviceAclDAO"); 
	}
}