package com.cg.test;

import org.apache.commons.httpclient.Cookie;
import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;

/** 
 * 
 */

/**
 * <p>
 * <b>Class: </b>.FormLoginDemo
 * </p>
 * 
 * <p>
 * <b>Create Date: </b>Jan 4, 2009
 * </p>
 * 
 * 
 */
public class FormLoginDemo {

	static final String LOGON_SITE = "http://mail.163.com";
	static final int LOGON_PORT = 80;

	public static void main(String[] args) throws Exception {
		HttpClient client = new HttpClient();
		client.getHostConfiguration().setHost(LOGON_SITE, LOGON_PORT);

		// 登录
		PostMethod post = new PostMethod(
				"http://reg.163.com/logins.jsp?type=1&url=http://fm163.163.com/coremail/fcg/ntesdoor2?lightweight=1&verifycookie=1&language=-1&style=16");
		NameValuePair username = new NameValuePair("username", "luckychengang@163.com");
		NameValuePair password = new NameValuePair("password", "gangch21");
		post.setRequestBody(new NameValuePair[] { username, password });
		client.executeMethod(post);
		String responseString = new String(post.getResponseBodyAsString()
				.getBytes("gbk"));
		System.out
				.println("******************************登录页面******************************");
		System.out.println(responseString);
		Cookie[] cookies = client.getState().getCookies();
		client.getState().addCookies(cookies);
		post.releaseConnection();

		int startPos = responseString
				.indexOf("http://reg.youdao.com/crossdomain.jsp?username=");
		int endPos = responseString.indexOf("\"", startPos + 1);
		String newUrl = responseString.substring(startPos, endPos);
		System.out
				.println("******************************第一次页面转向******************************");
		System.out.println(newUrl);

		// 以get方式请求跳转页面
		GetMethod get = new GetMethod(newUrl);
		get.setRequestHeader("Cookie", cookies.toString());
		client.executeMethod(get);
		responseString = new String(get.getResponseBodyAsString().getBytes(
				"gbk"));

		// 向控制台打印登陆后页面的html
		System.out
				.println("******************************第一次转向后的页面******************************");
		System.out.println(responseString);
		get.releaseConnection();

		startPos = responseString.indexOf("http://fm163.163");
		endPos = responseString.indexOf("\"", startPos + 1);
		newUrl = responseString.substring(startPos, endPos);
		System.out
				.println("******************************第二次页面转向******************************");
		System.out.println(newUrl);

		get = new GetMethod(newUrl);
		get.setRequestHeader("Cookie", cookies.toString());
		client.executeMethod(get);
		responseString = new String(get.getResponseBodyAsString().getBytes(
				"gbk"));
		System.out
				.println("******************************第二次转向后的页面******************************");
		System.out.println(responseString);
		get.releaseConnection();
	}
}
