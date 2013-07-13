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
		
		// �������֮�����ƵĲ���
		limitActions.add("getSSHinfo.action");
		limitActions.add("GetUserDeviceInfo.action"); 
		limitActions.add("SaveUserDeviceInfo.action");
	}
	
	
	public void init(FilterConfig arg0) throws ServletException {
		this.config = arg0;
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {

		//RequestDispatcher dispatcher = request.getRequestDispatcher("/loginPrompt.html");// �����������û�е�½��Ҫת������ҳ��
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		HttpSession session = req.getSession(true);

		User usr = SessionUtil.getLoginUser(session);
		int level = SessionUtil.userLevel(session, usr);
		String uri = req.getRequestURI();
		System.out.println("uri: " + uri);
		
		// û�е�¼

		if (usr == null && (uri.endsWith("/loginPrompt.html") || uri.endsWith("/login.action"))){
			String clientip = req.getRemoteAddr();
			if (!IpFilterConfig.getInstance().allowIP(clientip))	{
				res.setCharacterEncoding("GB2312");
				PrintWriter out = res.getWriter();
				res.setStatus(HttpServletResponse.SC_OK);
				String result = "��̨����(IP)�����Ʒ��ʱ�ϵͳ������ϵϵͳ����Ա��";  
				out.print(result);
				return;
			}
		}

		if (usr == null 
			&& !uri.endsWith("/loginPrompt.html")  // ��Щ����һЩ��Ҫ�ų���ҳ��
			&& !uri.endsWith("/login.action"))
		{
			// System.out.println("========== loginFilter ʧ��, û�е�¼  =============");
			System.out.println("context path: " + req.getContextPath());
			
			// ����� action, �޷��� sendRedirect ��ת����¼ҳ�棬��Ϊ AJAX ���ͷ�������

			if( uri.endsWith(".action")) {
				res.setCharacterEncoding("UTF-8");
				PrintWriter out = res.getWriter();
				res.setStatus(HttpServletResponse.SC_OK);
				String result = "{success:false,totalCount:0, list:[], error:{reason:'�����ѳ�ʱ�������µ�¼!', code:99}}"; 
				out.print(result);
				// System.out.println(result); 
				return;
			}
			 
			// ��ת����½ҳ��
			// dispatcher.forward(request, response);
			res.sendRedirect(req.getContextPath() + "/loginPrompt.html");
			
			res.setHeader("Cache-Control","no-store");
			res.setDateHeader("Expires",0);
			res.setHeader("Pragma","no-cache");
			return;			
		} // ��¼ͨ�� �� �ж�ҳ�����Ȩ��
		else if (uri.endsWith("/start.html") && (level != 1) ) {
			// ��������Ա visit start.html
			// һ�����Ա���ض���start2.html
			
			RequestDispatcher dispatcher = req.getRequestDispatcher("start2.html");
			dispatcher.forward(req, res);
			
			//res.sendRedirect(req.getContextPath() + "/admin/start2.html");
			//res.setHeader("Cache-Control","no-store");
			//res.setDateHeader("Expires",0);
			//res.setHeader("Pragma","no-cache");	
			return;
		}// ��¼ͨ�� �� �ж� struts action �ķ���Ȩ��
		else if ((level != 1) && uri.endsWith(".action")){
			String act = uri.substring(uri.lastIndexOf('/')+1);
			// System.out.println("�û���������action: " + act );
			// userActions �����а��� ��ͨ�û��ܷ��ʵĲ�����
			if (!userActions.contains(act)){
				res.setCharacterEncoding("UTF-8");
				PrintWriter out = res.getWriter();
				res.setStatus(HttpServletResponse.SC_OK);
				out.print("{success:false,totalCount:0, list:[], error:{reason:'��û��Ȩ�޷��ʸù���'}}");
				System.out.println("error:{reason:'��û��Ȩ�޷��ʸù���'}"); 
				return;
			}
			
			if (limitActions.contains(act) && (usr.getStatus() == User.USER_STATUS_PWD_EXPIRED)){
				res.setCharacterEncoding("UTF-8");
				PrintWriter out = res.getWriter();
				res.setStatus(HttpServletResponse.SC_OK);
				out.print("{success:false,totalCount:0, list:[], error:{reason:'�����˺������Ѿ����ڣ����Ʒ��ʸù��ܣ����޸�����֮�����µ�¼��'}}");
				return;
			}
		}
		
		// �Ѿ���½,�����˴�����
		// System.out.println("�û����ڵ�¼�����Ѿ���½���������");
		chain.doFilter(request, response);
	}

	public void destroy() { 
	}
}
