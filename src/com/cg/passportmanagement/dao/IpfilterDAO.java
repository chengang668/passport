package com.cg.passportmanagement.dao;

import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.cg.passportmanagement.common.IpFilterConfig;
import com.cg.passportmanagement.common.SpringContextUtil;
import com.cg.passportmanagement.database.Ipfilter;


public class IpfilterDAO extends HibernateDaoSupport implements IIpfilterDao {
	private static final Log log = LogFactory.getLog(IpfilterDAO.class);

	@SuppressWarnings("unchecked")
	public List<Ipfilter> findAll() {
		try {
			String queryString = "from Ipfilter";
			return (List<Ipfilter>)getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}
 
	public void save(Ipfilter transientInstance) {
		try {
			getHibernateTemplate().saveOrUpdate(transientInstance); 
			IpFilterConfig.getInstance().reload();
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(Ipfilter persistentInstance) {
		try {
			getHibernateTemplate().delete(persistentInstance); 
			IpFilterConfig.getInstance().reload();
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}
	
	public void deleteById(final Integer id) {
		this.getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session) {
				session.createQuery(
						"delete from Ipfilter o where o.id='"
								+ Integer.toString(id) + "'")
						.executeUpdate();
				return 1;
			}
		});
		
		IpFilterConfig.getInstance().reload();
	}
	
	public Ipfilter findById(java.lang.Integer id) {
		try {
			Ipfilter instance = (Ipfilter) getHibernateTemplate().get(
					"com.cg.passportmanagement.database.Ipfilter", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public static IIpfilterDao getFromApplicationContext(ApplicationContext ctx) {
		return (IIpfilterDao) ctx.getBean("IpfilterDAO");
	}
	
	public static IIpfilterDao getInstance() {
		return (IIpfilterDao) SpringContextUtil.getBean("IpfilterDAO");
	}
}