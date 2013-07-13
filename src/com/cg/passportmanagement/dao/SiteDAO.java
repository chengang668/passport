package com.cg.passportmanagement.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;
 
import com.cg.passportmanagement.database.District;
import com.cg.passportmanagement.database.Site;

/**
 * A data access object (DAO) providing persistence and search support for Site
 * entities. Transaction control of the save(), update() and delete() operations
 * can directly support Spring container-managed transactions or they can be
 * augmented to handle user-managed Spring transactions. Each of these methods
 * provides additional information for how to configure it for the desired type
 * of transaction control.
 * 
 * @see com.cg.passportmanagement.database.Site
 * @author MyEclipse Persistence Tools
 */

public class SiteDAO extends HibernateDaoSupport implements ISiteDAO {
	private static final Log log = LogFactory.getLog(SiteDAO.class);
	// property constants
	public static final String SITENAME = "sitename";
	public static final String ADDRESS = "address";
	public static final String DISTRICT = "district";

	protected void initDao() {
		// do nothing
	}

	public void save(Site transientInstance) {
		log.debug("saving Site instance");
		try {
			getHibernateTemplate().saveOrUpdate(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(Site persistentInstance) {
		log.debug("deleting Site instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public Site findById(java.lang.Integer id) {
		log.debug("getting Site instance with id: " + id);
		try {
			Site instance = (Site) getHibernateTemplate().get(
					"com.cg.passportmanagement.database.Site", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List<Site> findByExample(Site instance) {
		log.debug("finding Site instance by example");
		try {
			List<Site> results = (List<Site>) getHibernateTemplate()
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
		log.debug("finding Site instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from Site as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List<Site> findBySitename(Object sitename) {
		return findByProperty(SITENAME, sitename);
	}

	public List<Site> findByAddress(Object address) {
		return findByProperty(ADDRESS, address);
	}
	
	@SuppressWarnings("unchecked")
	public List<Site> findByDistrictid(Integer districtid) {
		District ob = new District();
		ob.setDistrictid(districtid);
		return findByProperty(DISTRICT, ob);
	}
	
	public List findAll() {
		log.debug("finding all Site instances");
		try {
			String queryString = "from Site";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public Site merge(Site detachedInstance) {
		log.debug("merging Site instance");
		try {
			Site result = (Site) getHibernateTemplate().merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(Site instance) {
		log.debug("attaching dirty Site instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(Site instance) {
		log.debug("attaching clean Site instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static SiteDAO getFromApplicationContext(ApplicationContext ctx) {
		return (SiteDAO) ctx.getBean("SiteDAO");
	}

	public void deleteById(final int siteID) {
       this.getHibernateTemplate().execute(new HibernateCallback() {
           public Object doInHibernate(Session session) {
              session.createQuery("delete from Site o where o.siteid='" + Integer.toString(siteID) + "'").executeUpdate();
              return 1;
           }
       });
	}
}