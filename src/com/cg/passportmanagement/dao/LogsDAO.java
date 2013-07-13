package com.cg.passportmanagement.dao;

import java.util.ArrayList;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.cg.passportmanagement.common.SpringContextUtil;
import com.cg.passportmanagement.database.Logs;

/**
 * A data access object (DAO) providing persistence and search support for Logs
 * entities. Transaction control of the save(), update() and delete() operations
 * can directly support Spring container-managed transactions or they can be
 * augmented to handle user-managed Spring transactions. Each of these methods
 * provides additional information for how to configure it for the desired type
 * of transaction control.
 * 
 * @see com.cg.passportmanagement.database.Logs
 * @author MyEclipse Persistence Tools
 */

public class LogsDAO extends HibernateDaoSupport implements ILogsDao {
	private static final Log log = LogFactory.getLog(LogsDAO.class);
	// property constants
	public static final String HOST = "host";
	public static final String FACILITY = "facility";
	public static final String PRIORITY = "priority";
	public static final String LEVEL = "level";
	public static final String TAG = "tag";
	public static final String DATETIME = "datetime";
	public static final String PROGRAM = "program";
	public static final String MSG = "msg";

	protected void initDao() {
		// do nothing
	}
	
	@SuppressWarnings("unchecked")
	public List<Logs> findAll() {
		log.debug("finding all Logs instances");
		try {
			String queryString = "from Logs";
			return (List<Logs>)getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	/* (non-Javadoc)
	 * @see com.cg.passportmanagement.dao.ILogsDao#findlike(java.lang.String, java.util.ArrayList)
	 */
	@SuppressWarnings("unchecked")
	public List<Logs> findlike(String queryString, ArrayList<String> vlist, int start, int limit) {
        log.debug("querys Logs");
        try {
            Query queryObject = getSession().createQuery(queryString);

            int i=0;
            for (String val : vlist ){
            	queryObject.setString(i, val);
            	++i;
            }
            queryObject.setFirstResult(start);
            queryObject.setMaxResults(limit);
            List rs = queryObject.list();

            return rs;
        } catch (RuntimeException re) {
            log.error("findlike failed", re);
            throw re;
        }
	}
	
	public int deletelike(String queryString, ArrayList<String> vlist) {
		int cnt = 0;
		try {
			Query queryObject = getSession().createQuery(queryString);

            int i=0;
            for (String val : vlist ){
            	queryObject.setString(i, val);
            	++i;
            }
            cnt = queryObject.executeUpdate(); 
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
		return cnt;
	}
	
	@SuppressWarnings("unchecked")
	public long queryCount(String queryString, ArrayList<String> vlist ) {
        log.debug("querys count(*)");
        try {
            Query queryObject = getSession().createQuery("select count(*) " + queryString);

            int i=0;
            for (String val : vlist ){
            	queryObject.setString(i, val);
            	++i;
            } 
            List rs = queryObject.list();
            List<Long> rr = rs;
            return rr.get(0);   
        } catch (RuntimeException re) {
            log.error("findlike failed", re);
            throw re;
        }
	}
	public void save(Logs transientInstance) {
		log.debug("saving Logs instance");
		try {
			getHibernateTemplate().save(transientInstance); 
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(Logs persistentInstance) {
		log.debug("deleting Logs instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public Logs findById(java.lang.Integer id) {
		log.debug("getting Logs instance with id: " + id);
		try {
			Logs instance = (Logs) getHibernateTemplate().get(
					"com.cg.passportmanagement.database.Logs", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List<Logs> findByExample(Logs instance) {
		log.debug("finding Logs instance by example");
		try {
			List<Logs> results = (List<Logs>) getHibernateTemplate()
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
		log.debug("finding Logs instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from Logs as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List<Logs> findByHost(Object host) {
		return findByProperty(HOST, host);
	}

	public List<Logs> findByFacility(Object facility) {
		return findByProperty(FACILITY, facility);
	}

	public List<Logs> findByPriority(Object priority) {
		return findByProperty(PRIORITY, priority);
	}

	public List<Logs> findByLevel(Object level) {
		return findByProperty(LEVEL, level);
	}

	public List<Logs> findByTag(Object tag) {
		return findByProperty(TAG, tag);
	}

	public List<Logs> findByDatetime(Object datetime) {
		return findByProperty(DATETIME, datetime);
	}

	public List<Logs> findByProgram(Object program) {
		return findByProperty(PROGRAM, program);
	}

	public List<Logs> findByMsg(Object msg) {
		return findByProperty(MSG, msg);
	}

	public Logs merge(Logs detachedInstance) {
		log.debug("merging Logs instance");
		try {
			Logs result = (Logs) getHibernateTemplate().merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(Logs instance) {
		log.debug("attaching dirty Logs instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(Logs instance) {
		log.debug("attaching clean Logs instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static ILogsDao getFromApplicationContext(ApplicationContext ctx) {
		return (ILogsDao) ctx.getBean("LogsDAO");
	}
	
	public static ILogsDao getInstance() {
		return (ILogsDao) SpringContextUtil.getBean("LogsDAO");
	}
}