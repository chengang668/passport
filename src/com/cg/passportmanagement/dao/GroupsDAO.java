package com.cg.passportmanagement.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;
import com.cg.passportmanagement.database.Groups;

/**
 * A data access object (DAO) providing persistence and search support for
 * Groups entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see com.cg.passportmanagement.database.Groups
 * @author MyEclipse Persistence Tools
 */

public class GroupsDAO extends HibernateDaoSupport {
	private static final Log log = LogFactory.getLog(GroupsDAO.class);
	// property constants
	public static final String GROUPNAME = "groupname";
	public static final String DESCRIPTION = "description";

	protected void initDao() {
		// do nothing
	}

	public void save(Groups transientInstance) {
		log.debug("saving Groups instance");
		try {
			getHibernateTemplate().saveOrUpdate(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(Groups persistentInstance) {
		log.debug("deleting Groups instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public Groups findById(java.lang.Integer id) {
		log.debug("getting Groups instance with id: " + id);
		try {
			Groups instance = (Groups) getHibernateTemplate().get(
					"com.cg.passportmanagement.database.Groups", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List<Groups> findByExample(Groups instance) {
		log.debug("finding Groups instance by example");
		try {
			List<Groups> results = (List<Groups>) getHibernateTemplate()
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
		log.debug("finding Groups instance with property: " + propertyName
				+ ", value: " + value);
		try {
			String queryString = "from Groups as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	// since groupname is unique, we should return only an entity.
	public Groups findByGroupname(Object groupname) {
		List<Groups> list = findByProperty(GROUPNAME, groupname);
		if (list!=null && list.size()>0)
			return list.get(0);
		return null;
	}

	public List<Groups> findByDescription(Object description) {
		return findByProperty(DESCRIPTION, description);
	}

	public List findAll() {
		log.debug("finding all Groups instances");
		try {
			String queryString = "from Groups";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public Groups merge(Groups detachedInstance) {
		log.debug("merging Groups instance");
		try {
			Groups result = (Groups) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(Groups instance) {
		log.debug("attaching dirty Groups instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(Groups instance) {
		log.debug("attaching clean Groups instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void deleteById(final int groupid) {
       this.getHibernateTemplate().execute(new HibernateCallback() {
           public Object doInHibernate(Session session) {
              session.createQuery("delete from Groups o where o.groupid='" + Integer.toString(groupid) + "'").executeUpdate();
              return 1;
           }
       });
	}
	public static GroupsDAO getFromApplicationContext(ApplicationContext ctx) {
		return (GroupsDAO) ctx.getBean("GroupsDAO");
	}
}