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

/**
 * A data access object (DAO) providing persistence and search support for District
 * entities. Transaction control of the save(), update() and delete() operations
 * can directly support Spring container-managed transactions or they can be
 * augmented to handle user-managed Spring transactions. Each of these methods
 * provides additional information for how to configure it for the desired type
 * of transaction control.
 * 
 * @see com.cg.passportmanagement.database.District
 * @author MyEclipse Persistence Tools
 */

public class DistrictDAO extends HibernateDaoSupport implements IDistrictDAO {
	private static final Log log = LogFactory.getLog(DistrictDAO.class);
	// property constants
	public static final String SITENAME = "districtname";
	public static final String ADDRESS = "address";

	protected void initDao() {
		// do nothing
	}

	public void save(District transientInstance) {
		log.debug("saving District instance");
		try {
			getHibernateTemplate().saveOrUpdate(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(District persistentInstance) {
		log.debug("deleting District instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public District findById(java.lang.Integer id) {
		log.debug("getting District instance with id: " + id);
		try {
			District instance = (District) getHibernateTemplate().get(
					"com.cg.passportmanagement.database.District", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List<District> findByExample(District instance) {
		log.debug("finding District instance by example");
		try {
			List<District> results = (List<District>) getHibernateTemplate()
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
		log.debug("finding District instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from District as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List<District> findByDistrictname(Object districtname) {
		return findByProperty(SITENAME, districtname);
	}

	public List<District> findByAddress(Object address) {
		return findByProperty(ADDRESS, address);
	}

	public List findAll() {
		log.debug("finding all District instances");
		try {
			String queryString = "from District";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public District merge(District detachedInstance) {
		log.debug("merging District instance");
		try {
			District result = (District) getHibernateTemplate().merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(District instance) {
		log.debug("attaching dirty District instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(District instance) {
		log.debug("attaching clean District instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static DistrictDAO getFromApplicationContext(ApplicationContext ctx) {
		return (DistrictDAO) ctx.getBean("DistrictDAO");
	}

	public void deleteById(final int districtID) {
       this.getHibernateTemplate().execute(new HibernateCallback() {
           public Object doInHibernate(Session session) {
              session.createQuery("delete from District o where o.districtid='" + Integer.toString(districtID) + "'").executeUpdate();
              return 1;
           }
       });
	}
}