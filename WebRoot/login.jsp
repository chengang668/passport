<%@ page language="java" pageEncoding="UTF-8"%>
<%
	String result;
	String loginUsername = request.getParameter("loginUsername");
	if (null != loginUsername && loginUsername.length() > 0) {
		if (loginUsername.equals("f"))
			result = "{success:true}";
		else
			result = "{success:false,errors:{reason:'登陆失败，请重试'}}";
 
	} else {
		result = "{success:false,errors:{reason:'登陆失败，请重试'}}";
	}
%>
<%=result %>