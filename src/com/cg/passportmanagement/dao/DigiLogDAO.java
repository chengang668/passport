package com.cg.passportmanagement.dao;

import java.util.Date;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.cg.passportmanagement.database.DigiLog;

/**
 * A data access object (DAO) providing persistence and search support for
 * DigiLog entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see com.cg.passportmanagement.database.DigiLog
 * @author MyEclipse Persistence Tools
 */

public class DigiLogDAO extends HibernateDaoSupport {
	private static final Log log = LogFactory.getLog(DigiLogDAO.class);
	// property constants
	public static final String DIGI_IP = "digiIp";
	public static final String USERID = "userid";
	public static final String CONTENT = "content";

	protected void initDao() {
		// do nothing
	}

	public void save(DigiLog transientInstance) {
		log.debug("saving DigiLog instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(DigiLog persistentInstance) {
		log.debug("deleting DigiLog instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public DigiLog findById(java.lang.Integer id) {
		log.debug("getting DigiLog instance with id: " + id);
		try {
			DigiLog instance = (DigiLog) getHibernateTemplate().get(
					"com.cg.passportmanagement.database.DigiLog", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List<DigiLog> findByExample(DigiLog instance) {
		log.debug("finding DigiLog instance by example");
		try {
			List<DigiLog> results = (List<DigiLog>) getHibernateTemplate()
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
		log.debug("finding DigiLog instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from DigiLog as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List<DigiLog> findByDigiIp(Object digiIp) {
		return findByProperty(DIGI_IP, digiIp);
	}

	public List<DigiLog> findByUserid(Object userid) {
		return findByProperty(USERID, userid);
	}

	public List<DigiLog> findByContent(Object content) {
		return findByProperty(CONTENT, content);
	}

	public List findAll() {
		log.debug("finding all DigiLog instances");
		try {
			String queryString = "from DigiLog";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public DigiLog merge(DigiLog detachedInstance) {
		log.debug("merging DigiLog instance");
		try {
			DigiLog result = (DigiLog) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(DigiLog instance) {
		log.debug("attaching dirty DigiLog instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(DigiLog instance) {
		log.debug("attaching clean DigiLog instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static DigiLogDAO getFromApplicationContext(ApplicationContext ctx) {
		return (DigiLogDAO) ctx.getBean("DigiLogDAO");
	}
}