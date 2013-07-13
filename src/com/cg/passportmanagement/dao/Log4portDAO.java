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
import com.cg.passportmanagement.database.Log4port;

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

public class Log4portDAO extends HibernateDaoSupport implements ILog4portDao {
	private static final Log log = LogFactory.getLog(Log4portDAO.class);
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
	public List<Log4port> findAll() {
		log.debug("finding all Log4port instances");
		try {
			String queryString = "from Log4port";
			return (List<Log4port>)getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}


	@SuppressWarnings("unchecked")
	public List<Log4port> findlike(String queryString, ArrayList<String> vlist, int start, int limit) {
        log.debug("querys Log4port");
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
	
	public int deletelike(String queryString, ArrayList<String> vlist) {
		int cnt=0;
		try {
			Query queryObject = getSession().createQuery(queryString);

            int i=0;
            for (String val : vlist ){
            	queryObject.setString(i, val);
            	++i;
            }
            cnt = queryObject.executeUpdate();
            
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
		return cnt;
	}
	
	public void save(Log4port transientInstance) {
		log.debug("saving Log4port instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(Log4port persistentInstance) {
		log.debug("deleting Log4port instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public Log4port findById(java.lang.Integer id) {
		log.debug("getting Log4port instance with id: " + id);
		try {
			Log4port instance = (Log4port) getHibernateTemplate().get(
					"com.cg.passportmanagement.database.Log4port", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List<Log4port> findByExample(Log4port instance) {
		log.debug("finding Log4port instance by example");
		try {
			List<Log4port> results = (List<Log4port>) getHibernateTemplate()
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
		log.debug("finding Log4port instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from Log4port as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List<Log4port> findByHost(Object host) {
		return findByProperty(HOST, host);
	}

	public List<Log4port> findByFacility(Object facility) {
		return findByProperty(FACILITY, facility);
	}

	public List<Log4port> findByPriority(Object priority) {
		return findByProperty(PRIORITY, priority);
	}

	public List<Log4port> findByLevel(Object level) {
		return findByProperty(LEVEL, level);
	}

	public List<Log4port> findByTag(Object tag) {
		return findByProperty(TAG, tag);
	}

	public List<Log4port> findByDatetime(Object datetime) {
		return findByProperty(DATETIME, datetime);
	}

	public List<Log4port> findByProgram(Object program) {
		return findByProperty(PROGRAM, program);
	}

	public List<Log4port> findByMsg(Object msg) {
		return findByProperty(MSG, msg);
	}

	public Log4port merge(Log4port detachedInstance) {
		log.debug("merging Log4port instance");
		try {
			Log4port result = (Log4port) getHibernateTemplate().merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(Log4port instance) {
		log.debug("attaching dirty Log4port instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(Log4port instance) {
		log.debug("attaching clean Log4port instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static ILog4portDao getFromApplicationContext(ApplicationContext ctx) {
		return (ILog4portDao) ctx.getBean("Log4portDAO");
	}
	
	public static ILog4portDao getInstance() {
		return (ILog4portDao) SpringContextUtil.getBean("Log4portDAO");
	}
}