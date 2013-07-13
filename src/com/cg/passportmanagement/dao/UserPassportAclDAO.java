package com.cg.passportmanagement.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.cg.passportmanagement.common.SpringContextUtil;
import com.cg.passportmanagement.database.User;
import com.cg.passportmanagement.database.UserPassportAcl;
import com.cg.passportmanagement.database.UserPassportAclId;

public class UserPassportAclDAO extends HibernateDaoSupport  {
    private static final Log log = LogFactory.getLog(UserPassportAclDAO.class);
	//property constants

	protected void initDao() {
		//do nothing
	}
    
    public void save(UserPassportAcl transientInstance) {
        log.debug("saving UserPassportAcl instance");
        try {
            getHibernateTemplate().saveOrUpdate(transientInstance);
            log.debug("save successful");
        } catch (RuntimeException re) {
            log.error("save failed", re);
            throw re;
        }
    }
    
	public void delete(UserPassportAcl persistentInstance) {
        log.debug("deleting UserPassportAcl instance");
        try {
            getHibernateTemplate().delete(persistentInstance);
            log.debug("delete successful");
        } catch (RuntimeException re) {
            log.error("delete failed", re);
            throw re;
        }
    }
    
	public void deleteByUser(User user) {
        log.debug("deleting UserPassportAcl instances by userid");
        try {
        	List<UserPassportAcl> list = findByUserId(user.getUserid());
        	if (list!=null)
        		getHibernateTemplate().deleteAll(list);
            log.debug("delete successful");
        } catch (RuntimeException re) {
            log.error("deleteByUser failed", re);
            throw re;
        }
    }
	
	public int deleteByPassportid(int passportid) {
		/*
        log.debug("deleting UserPassportAcl instances by passportid");
        try {
        	List<UserPassportAcl> list = this.findByPassportId(passportid);
        	if (list!=null)
        		getHibernateTemplate().deleteAll(list);
            log.debug("delete successful");
        } catch (RuntimeException re) {
            log.error("deleteByUser failed", re);
            throw re;
        } */
        String queryString;
        queryString = "delete UserPassportAcl as a where a.id.passportid = " + passportid;

		int cnt = 0;
		try {
            cnt = getSession().createQuery(queryString).executeUpdate();
		} catch (RuntimeException re) {
			log.error("UserDeviceAclDAO.deleteByPassportId failed", re);
			throw re;
		}
		return cnt;
    }
	
	public void deleteList(List<UserPassportAcl> list) {
        log.debug("deleting a UserPassportAcl list");
        try {
        	if (list!=null)
        		getHibernateTemplate().deleteAll(list);
            log.debug("delete successful");
        } catch (RuntimeException re) {
            log.error("deleteList failed", re);
            throw re;
        }
    }
	
    public UserPassportAcl findById( com.cg.passportmanagement.database.UserPassportAclId id) {
        log.debug("getting UserPassportAcl instance with id: " + id);
        try {
            UserPassportAcl instance = (UserPassportAcl) getHibernateTemplate()
                    .get("com.cg.passportmanagement.database.UserPassportAcl", id);
            return instance;
        } catch (RuntimeException re) {
            log.error("get failed", re);
            throw re;
        }
    }

    public List findByUserId(String userid) {
        log.debug("getting UserPassportAcl List with userid: " + userid);
        
        User user = new User();
        user.setUserid(userid);        
        
        return findByProperty("user", user); 
    }
    
    public List<UserPassportAcl> findByPassportId(Integer passportid) {
        return (List<UserPassportAcl>) findByProperty("id.passportid", passportid);
    }
    
    public List<UserPassportAcl> findByExample(UserPassportAcl instance) {
        log.debug("finding UserPassportAcl instance by example");
        try {
            List<UserPassportAcl> results = (List<UserPassportAcl>) getHibernateTemplate().findByExample(instance); 
            log.debug("find by example successful, result size: " + results.size());
            return results;
        } catch (RuntimeException re) {
            log.error("find by example failed", re);
            throw re;
        }
    }    
    
    public List findByProperty(String propertyName, Object value) {
      try {
         String queryString = "from UserPassportAcl as model where model." 
         						+ propertyName + "= ?";
		 return getHibernateTemplate().find(queryString, value);
      } catch (RuntimeException re) {
         log.error("find by property name failed", re);
         throw re;
      }
	}


	public List findAll() {
		log.debug("finding all UserPassportAcl instances");
		try {
			String queryString = "from UserPassportAcl";
		 	return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}
	
    public UserPassportAcl merge(UserPassportAcl detachedInstance) {
        log.debug("merging UserPassportAcl instance");
        try {
            UserPassportAcl result = (UserPassportAcl) getHibernateTemplate()
                    .merge(detachedInstance);
            log.debug("merge successful");
            return result;
        } catch (RuntimeException re) {
            log.error("merge failed", re);
            throw re;
        }
    }

    public void attachDirty(UserPassportAcl instance) {
        log.debug("attaching dirty UserPassportAcl instance");
        try {
            getHibernateTemplate().saveOrUpdate(instance);
            log.debug("attach successful");
        } catch (RuntimeException re) {
            log.error("attach failed", re);
            throw re;
        }
    }
    
    public void attachClean(UserPassportAcl instance) {
        log.debug("attaching clean UserPassportAcl instance");
        try {
            getHibernateTemplate().lock(instance, LockMode.NONE);
            log.debug("attach successful");
        } catch (RuntimeException re) {
            log.error("attach failed", re);
            throw re;
        }
    }

	public static UserPassportAclDAO getFromApplicationContext(ApplicationContext ctx) {
    	return (UserPassportAclDAO) ctx.getBean("UserPassportAclDAO");
	}
	
	public static UserPassportAclDAO getInstance() {
    	return (UserPassportAclDAO)SpringContextUtil.getBean("UserPassportAclDAO");
	}
}