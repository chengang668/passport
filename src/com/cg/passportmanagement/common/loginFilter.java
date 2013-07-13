package com.cg.passportmanagement.common;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Set;
import java.util.TreeSet;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.cg.passportmanagement.database.User;

public class loginFilter implements Filter {
	
	FilterConfig config; 
	private static Set<String> userActions = new TreeSet<String>();
	private static Set<String> limitActions = new TreeSet<String>();
	
	static {
		userActions.add("login.action");
		userActions.add("logout.action");
		userActions.add("getSSHinfo.action"); 
		userActions.add("getLoginUser.action");
		userActions.add("GetCurrentUser.action");
		userActions.add("passportTreeLoader.action");
		userActions.add("LoadPassportsOfLoginUser.action");
		userActions.add("ChangePassword.action");
		userActions.add("getOnlineUsers.action");
		userActions.add("getPassportPortsList.action");
		userActions.add("loadDeviceTree.action");
		userActions.add("SaveUserDeviceInfo.action");
		userActions.add("GetUserDeviceInfo.action"); 
		userActions.add("LoadDevicesOfLoginUser.action");
		userActions.add("getPassportIpList.action"); 
		userActions.add("DownloadSecureCRT.action"); 
		
		// 密码过期之后限制的操作
		limitActions.add("getSSHinfo.action");
		limitActions.add("GetUserDeviceInfo.action"); 
		limitActions.add("SaveUserDeviceInfo.action");
	}
	
	
	public void init(FilterConfig arg0) throws ServletException {
		this.config = arg0;
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {

		//RequestDispatcher dispatcher = request.getRequestDispatcher("/loginPrompt.html");// 这里设置如果没有登陆将要转发到的页面
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		HttpSession session = req.getSession(true);

		User usr = SessionUtil.getLoginUser(session);
		int level = SessionUtil.userLevel(session, usr);
		String uri = req.getRequestURI();
		System.out.println("uri: " + uri);
		
		// 没有登录

		if (usr == null && (uri.endsWith("/loginPrompt.html") || uri.endsWith("/login.action"))){
			String clientip = req.getRemoteAddr();
			if (!IpFilterConfig.getInstance().allowIP(clientip))	{
				res.setCharacterEncoding("GB2312");
				PrintWriter out = res.getWriter();
				res.setStatus(HttpServletResponse.SC_OK);
				String result = "这台机器(IP)被限制访问本系统，请联系系统管理员！";  
				out.print(result);
				return;
			}
		}

		if (usr == null 
			&& !uri.endsWith("/loginPrompt.html")  // 这些都是一些需要排除的页面
			&& !uri.endsWith("/login.action"))
		{
			// System.out.println("========== loginFilter 失败, 没有登录  =============");
			System.out.println("context path: " + req.getContextPath());
			
			// 如果是 action, 无法用 sendRedirect 跳转到登录页面，因为 AJAX 解释返回内容

			if( uri.endsWith(".action")) {
				res.setCharacterEncoding("UTF-8");
				PrintWriter out = res.getWriter();
				res.setStatus(HttpServletResponse.SC_OK);
				String result = "{success:false,totalCount:0, list:[], error:{reason:'连接已超时，请重新登录!', code:99}}"; 
				out.print(result);
				// System.out.println(result); 
				return;
			}
			 
			// 跳转到登陆页面
			// dispatcher.forward(request, response);
			res.sendRedirect(req.getContextPath() + "/loginPrompt.html");
			
			res.setHeader("Cache-Control","no-store");
			res.setDateHeader("Expires",0);
			res.setHeader("Pragma","no-cache");
			return;			
		} // 登录通过 － 判断页面访问权限
		else if (uri.endsWith("/start.html") && (level != 1) ) {
			// 超级管理员 visit start.html
			// 一般管理员，重定向到start2.html
			
			RequestDispatcher dispatcher = req.getRequestDispatcher("start2.html");
			dispatcher.forward(req, res);
			
			//res.sendRedirect(req.getContextPath() + "/admin/start2.html");
			//res.setHeader("Cache-Control","no-store");
			//res.setDateHeader("Expires",0);
			//res.setHeader("Pragma","no-cache");	
			return;
		}// 登录通过 － 判断 struts action 的访问权限
		else if ((level != 1) && uri.endsWith(".action")){
			String act = uri.substring(uri.lastIndexOf('/')+1);
			// System.out.println("用户正在请求action: " + act );
			// userActions 集合中包含 普通用户能访问的操作。
			if (!userActions.contains(act)){
				res.setCharacterEncoding("UTF-8");
				PrintWriter out = res.getWriter();
				res.setStatus(HttpServletResponse.SC_OK);
				out.print("{success:false,totalCount:0, list:[], error:{reason:'您没有权限访问该功能'}}");
				System.out.println("error:{reason:'您没有权限访问该功能'}"); 
				return;
			}
			
			if (limitActions.contains(act) && (usr.getStatus() == User.USER_STATUS_PWD_EXPIRED)){
				res.setCharacterEncoding("UTF-8");
				PrintWriter out = res.getWriter();
				res.setStatus(HttpServletResponse.SC_OK);
				out.print("{success:false,totalCount:0, list:[], error:{reason:'您的账号密码已经过期，限制访问该功能，请修改密码之后重新登录！'}}");
				return;
			}
		}
		
		// 已经登陆,继续此次请求
		// System.out.println("用户正在登录或者已经登陆，允许操作");
		chain.doFilter(request, response);
	}

	public void destroy() { 
	}
}
