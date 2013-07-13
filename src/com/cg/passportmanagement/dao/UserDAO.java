package com.cg.passportmanagement.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.cg.passportmanagement.database.Groups;
import com.cg.passportmanagement.database.User;

public class UserDAO extends HibernateDaoSupport implements IUserDAO {
	private static final Log log = LogFactory.getLog(UserGroupDAO.class);
	
	public List<User> findAllUsers() { 
		return getHibernateTemplate().loadAll(User.class);// .find("from User o");//
	}

	public User findUserById(String userid) {
		User usr = (User) getHibernateTemplate().get(User.class, userid);
		// if (usr != null) 
		// 	Hibernate.initialize(usr.getUserPassportAcls());
		return usr;
	}

	@SuppressWarnings("unchecked")
	public List<User> findUserByGroupId(Integer gid) {
	    try {
	    	Groups grp = new Groups();
	    	grp.setGroupid(gid);
	    	String queryString = "from User as model where model.groups=?";
	    	return getHibernateTemplate().find(queryString, grp);
	    } catch (RuntimeException re) {
	       log.error("find by property name failed", re);
	       throw re;
	    }
	}
	
	public void persistUser(User user) {
		getHibernateTemplate().saveOrUpdate(user);
	}

	public void removeById(final String userid) {
	       this.getHibernateTemplate().execute(new HibernateCallback() {
	           public Object doInHibernate(Session session) {
	              session.createQuery("delete from User o where o.userid='" + userid + "'").executeUpdate();
	              return 1;
	           }
	       });
	}

	public void removeUser(User user) 
	{
		getHibernateTemplate().delete(user);
	}

}

