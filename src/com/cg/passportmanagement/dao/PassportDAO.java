package com.cg.passportmanagement.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.cg.passportmanagement.common.SpringContextUtil;
import com.cg.passportmanagement.database.Passport;

/**
 * A data access object (DAO) providing persistence and search support for
 * Passport entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see com.cg.passportmanagement.database.Passport
 * @author MyEclipse Persistence Tools
 */

public class PassportDAO extends HibernateDaoSupport {
	private static final Log log = LogFactory.getLog(PassportDAO.class);
	// property constants
	public static final String IP = "ip";
	public static final String HOSTNAME = "hostname";
	public static final String GIVENNAME = "givenname";
	public static final String SITEID = "siteid";
	public static final String DEPTID = "deptid";
	public static final String OWNER = "owner";

	protected void initDao() {
		// do nothing
	}

	public void save(Passport transientInstance) {
		log.debug("saving Passport instance");
		try {
			getHibernateTemplate().saveOrUpdate(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(Passport persistentInstance) {
		log.debug("deleting Passport instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public void deleteById(final int passportid) {
		log.debug("deleting Passport instance");
		try {
			getHibernateTemplate().execute(new HibernateCallback() {
		           public Object doInHibernate(Session session) {
			              session.createQuery("delete from Passport o where o.passportid=" + passportid + "").executeUpdate();
			              return 1;
			           }
			       });
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			System.out.println("delete failed: " + re.getMessage());
			throw re;
		}
	}
	
	public Passport findById(java.lang.Integer id) {
		log.debug("getting Passport instance with id: " + id);
		try {
			Passport instance = (Passport) getHibernateTemplate().get(
					"com.cg.passportmanagement.database.Passport", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}
	
	public List<Passport> findByExample(Passport instance) {
		log.debug("finding Passport instance by example");
		try {
			List<Passport> results = (List<Passport>) getHibernateTemplate()
					.findByExample(instance);
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}

	public List<Passport> findByProperty(String propertyName, Object value) {
		log.debug("finding Passport instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from Passport as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List<Passport> findByIp(Object ip) {
		return findByProperty(IP, ip);
	}

	public List<Passport> findByHostname(Object hostname) {
		return findByProperty(HOSTNAME, hostname);
	}

	public List<Passport> findByGivenname(Object givenname) {
		return findByProperty(GIVENNAME, givenname);
	}

	public List<Passport> findBySiteid(Object siteid) {
		return findByProperty(SITEID, siteid);
	}

	public List<Passport> findByDeptid(Object deptid) {
		return findByProperty(DEPTID, deptid);
	}

	public List<Passport> findByOwner(Object owner) {
		return findByProperty(OWNER, owner);
	}

	@SuppressWarnings("unchecked")
	public List<Passport> findAll() {
		log.debug("finding all Passport instances");
		try {
			String queryString = "from Passport";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	@SuppressWarnings("unchecked")
	public List<String> findAllIP() {
		log.debug("finding all passport IP ");
		try {
			String queryString = "select ip from Passport order by ip";
			Query queryObject = getSession().createQuery(queryString);
			return queryObject.list(); 
		} catch (RuntimeException re) {
			log.error("finding all passport IP ", re);
			throw re;
		}
	}
	
	public Passport merge(Passport detachedInstance) {
		log.debug("merging Passport instance");
		try {
			Passport result = (Passport) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(Passport instance) {
		log.debug("attaching dirty Passport instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(Passport instance) {
		log.debug("attaching clean Passport instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static PassportDAO getFromApplicationContext(ApplicationContext ctx) {
		return (PassportDAO) ctx.getBean("PassportDAO");
	}
	
	public static PassportDAO getInstance() {
		return (PassportDAO) SpringContextUtil.getBean("PassportDAO");
	}
}