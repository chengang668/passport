package com.cg.passportmanagement.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.cg.passportmanagement.database.Groups;
import com.cg.passportmanagement.database.User;
import com.cg.passportmanagement.database.UserGroup;
import com.cg.passportmanagement.database.UserGroupId;

public class UserGroupDAO extends HibernateDaoSupport  {
    private static final Log log = LogFactory.getLog(UserGroupDAO.class);
	//property constants

	protected void initDao() {
		//do nothing
	}
    
    public void save(UserGroup transientInstance) {
        log.debug("saving UserGroup instance");
        try {
            getHibernateTemplate().saveOrUpdate(transientInstance);
            log.debug("save successful");
        } catch (RuntimeException re) {
            log.error("save failed", re);
            throw re;
        }
    }
    
	public void delete(UserGroup persistentInstance) {
        log.debug("deleting UserGroup instance");
        try {
            getHibernateTemplate().delete(persistentInstance);
            log.debug("delete successful");
        } catch (RuntimeException re) {
            log.error("delete failed", re);
            throw re;
        }
    }
    
    public UserGroup findById( UserGroupId id) {
        log.debug("getting UserGroup instance with id: " + id);
        try {
            UserGroup instance = (UserGroup) getHibernateTemplate()
                    .get("com.cg.passportmanagement.database.UserGroup", id);
            return instance;
        } catch (RuntimeException re) {
            log.error("get failed", re);
            throw re;
        }
    }

    public List findByUserId(String userid) {
        log.debug("getting UserGroup List with userid: " + userid);
        
        User user = new User();
        user.setUserid(userid);        
        
        return findByProperty("user", user); 
    }
    
    public List findByGroupId(Integer groupid) {
        log.debug("getting UserGroup List with groupid: " + groupid);
        
        Groups grp = new Groups();
        grp.setGroupid(groupid);
        
        return findByProperty("group", grp);
    }
    
    public List<UserGroup> findByExample(UserGroup instance) {
        log.debug("finding UserGroup instance by example");
        try {
            List<UserGroup> results = (List<UserGroup>) getHibernateTemplate().findByExample(instance); 
            log.debug("find by example successful, result size: " + results.size());
            return results;
        } catch (RuntimeException re) {
            log.error("find by example failed", re);
            throw re;
        }
    }    
    
    public List findByProperty(String propertyName, Object value) {
      log.debug("finding UserGroup instance with property: " + propertyName
            + ", value: " + value);
      try {
         String queryString = "from UserGroup as model where model." 
         						+ propertyName + "= ?";
		 return getHibernateTemplate().find(queryString, value);
      } catch (RuntimeException re) {
         log.error("find by property name failed", re);
         throw re;
      }
	}


	public List findAll() {
		log.debug("finding all UserGroup instances");
		try {
			String queryString = "from UserGroup";
		 	return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}
	
    public UserGroup merge(UserGroup detachedInstance) {
        log.debug("merging UserGroup instance");
        try {
            UserGroup result = (UserGroup) getHibernateTemplate()
                    .merge(detachedInstance);
            log.debug("merge successful");
            return result;
        } catch (RuntimeException re) {
            log.error("merge failed", re);
            throw re;
        }
    }

    public void attachDirty(UserGroup instance) {
        log.debug("attaching dirty UserGroup instance");
        try {
            getHibernateTemplate().saveOrUpdate(instance);
            log.debug("attach successful");
        } catch (RuntimeException re) {
            log.error("attach failed", re);
            throw re;
        }
    }
    
    public void attachClean(UserGroup instance) {
        log.debug("attaching clean UserGroup instance");
        try {
            getHibernateTemplate().lock(instance, LockMode.NONE);
            log.debug("attach successful");
        } catch (RuntimeException re) {
            log.error("attach failed", re);
            throw re;
        }
    }

	public static UserGroupDAO getFromApplicationContext(ApplicationContext ctx) {
    	return (UserGroupDAO) ctx.getBean("UserGroupDAO");
	}
}