package com.cg.passportmanagement.common;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringContextUtil implements ApplicationContextAware {

	protected static ApplicationContext appCxt;
	
	public void setApplicationContext(ApplicationContext arg0)
			throws BeansException {
		appCxt = arg0;
	}
	
	public static Object getBean(String beanName){
		return appCxt.getBean(beanName);
	}
}
