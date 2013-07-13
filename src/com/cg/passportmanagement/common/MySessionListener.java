package com.cg.passportmanagement.common;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import com.cg.passportmanagement.database.User;
import com.cg.passportmanagement.service.UserService;


public class MySessionListener implements HttpSessionListener {

	public void sessionCreated(HttpSessionEvent arg0) {
		System.out.println("==== 会话创建  ====");
	}

	public void sessionDestroyed(HttpSessionEvent event) {
		HttpSession session = event.getSession();
		User user = SessionUtil.getLoginUser(session);
		// String clientip = SessionUtil.getClientIP(session);
		
		// System.out.println("==== 用户退出，会话销毁  ====");
		if (user!=null){
			System.out.println("sessionDestroyed：从在线列表中删除用户: " + user.getFullname());
			//SessionUtil.removeOnlineUser(user);
			OnlineUserList.getInstance().remove(user);
			
			//logout
			try {
				UserService.getInstance().logout(user, session);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		else {
			System.out.println("sessionDestroyed：SessionUtil.getLoginUser(session)==null " );
		}
	}
}
