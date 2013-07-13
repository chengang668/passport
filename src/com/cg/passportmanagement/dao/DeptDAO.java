package com.cg.passportmanagement.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.cg.passportmanagement.database.Dept;

/**
 	* A data access object (DAO) providing persistence and search support for Dept entities.
 			* Transaction control of the save(), update() and delete() operations 
		can directly support Spring container-managed transactions or they can be augmented	to handle user-managed Spring transactions. 
		Each of these methods provides additional information for how to configure it for the desired type of transaction control. 	
	 * @see .Dept
  * @author MyEclipse Persistence Tools 
 */

public class DeptDAO extends HibernateDaoSupport implements IDeptDAO  {
    private static final Log log = LogFactory.getLog(DeptDAO.class);
	//property constants
	public static final String DEPTNAME = "deptname";
	public static final String UPPERDEPTID = "upperdeptid";



	protected void initDao() {
		//do nothing
	}
    
    /* (non-Javadoc)
	 * @see com.cg.passportmanagement.dao.IDeptDAO#save(com.cg.passportmanagement.database.Dept)
	 */
    public void save(Dept transientInstance) {
        try {
            getHibernateTemplate().saveOrUpdate(transientInstance);
            log.debug("save successful");
        } catch (RuntimeException re) {
            log.error("save failed", re);
            throw re;
        }
    }
    
	/* (non-Javadoc)
	 * @see com.cg.passportmanagement.dao.IDeptDAO#delete(com.cg.passportmanagement.database.Dept)
	 */
	public void delete(Dept persistentInstance) {
        log.debug("deleting Dept instance");
        try {
            getHibernateTemplate().delete(persistentInstance);
            log.debug("delete successful");
        } catch (RuntimeException re) {
            log.error("delete failed", re);
            throw re;
        }
    }
    
    /* (non-Javadoc)
	 * @see com.cg.passportmanagement.dao.IDeptDAO#findById(java.lang.Integer)
	 */
    public Dept findById( java.lang.Integer id) {
        log.debug("getting Dept instance with id: " + id);
        try {
            Dept instance = (Dept) getHibernateTemplate()
                    .get(Dept.class, id);
            return instance;
        } catch (RuntimeException re) {
            log.error("get failed", re);
            throw re;
        }
    }
    
    
    public List<Dept> findByExample(Dept instance) {
        log.debug("finding Dept instance by example");
        try {
            List<Dept> results = (List<Dept>) getHibernateTemplate().findByExample(instance); 
            log.debug("find by example successful, result size: " + results.size());
            return results;
        } catch (RuntimeException re) {
            log.error("find by example failed", re);
            throw re;
        }
    }    
    
    public List findByProperty(String propertyName, Object value) {
      log.debug("finding Dept instance with property: " + propertyName
            + ", value: " + value);
      try {
         String queryString = "from Dept as model where model." 
         						+ propertyName + "= ?";
		 return getHibernateTemplate().find(queryString, value);
      } catch (RuntimeException re) {
         log.error("find by property name failed", re);
         throw re;
      }
	}

	public List<Dept> findByDeptname(Object deptname) {
		return findByProperty(DEPTNAME, deptname);
	}
	
	public List<Dept> findByUpperdeptid(Object upperdeptid) {
		return findByProperty(UPPERDEPTID, upperdeptid);
	}
	

	/* (non-Javadoc)
	 * @see com.cg.passportmanagement.dao.IDeptDAO#findAll()
	 */
	public List findAll() {
		log.debug("finding all Dept instances");
		try {
			String queryString = "from Dept";
		 	return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}
	
    public Dept merge(Dept detachedInstance) {
        log.debug("merging Dept instance");
        try {
            Dept result = (Dept) getHibernateTemplate()
                    .merge(detachedInstance);
            log.debug("merge successful");
            return result;
        } catch (RuntimeException re) {
            log.error("merge failed", re);
            throw re;
        }
    }

    public void attachDirty(Dept instance) {
        log.debug("attaching dirty Dept instance");
        try {
            getHibernateTemplate().saveOrUpdate(instance);
            log.debug("attach successful");
        } catch (RuntimeException re) {
            log.error("attach failed", re);
            throw re;
        }
    }
    
    public void attachClean(Dept instance) {
        log.debug("attaching clean Dept instance");
        try {
            getHibernateTemplate().lock(instance, LockMode.NONE);
            log.debug("attach successful");
        } catch (RuntimeException re) {
            log.error("attach failed", re);
            throw re;
        }
    }

	public static IDeptDAO getFromApplicationContext(ApplicationContext ctx) {
    	return (IDeptDAO) ctx.getBean("DeptDAO");
	}
	
	public void deleteById(final int deptID) {
		this.getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session) {
				session.createQuery(
						"delete from Dept o where o.deptid='"
								+ Integer.toString(deptID) + "'")
						.executeUpdate();
				return 1;
			}
		});
	}
}