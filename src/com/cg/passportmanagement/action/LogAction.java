package com.cg.passportmanagement.action;

import java.io.InputStream;
import java.io.StringBufferInputStream;
import java.util.List;
import java.util.ArrayList;
import org.apache.struts2.ServletActionContext;

import com.cg.passportmanagement.dao.ILog4portDao;
import com.cg.passportmanagement.dao.ILogsDao;
import com.cg.passportmanagement.database.Log4port;
import com.cg.passportmanagement.database.Logs;

import net.sf.json.JSONArray;

import commons.utils.action.ExtJSONActionSuport;

/*
 *  SiteAction is configured as prototype in spring IoC 
 */

@SuppressWarnings("deprecation")
public class LogAction extends ExtJSONActionSuport {
	private static final long serialVersionUID = 1L;
	
	private ILogsDao logsdao;
	private ILog4portDao log4portdao;
	
	private String host;
	private String porttitle;
	private String operator;
	private String starttime;
	private String endtime;
	private String inputcmd;
	private String other;
	
	private final static String LOG_QUERY_TOTAL = "LOG_QUERY_TOTAL";
	private final static String PORT_LOG_QUERY_TOTAL = "PORT_LOG_QUERY_TOTAL";

	/*
	 * struts action 
	 */
	public String querylog() {
		System.out.println("======== query log ============");
		List<Logs> rs = null;
		try {
			// from Logs as a where 1=1 and a.ltxt like ? 
			StringBuilder qsb = new StringBuilder("from Logs as a where 1=1 ");
			ArrayList<String> vlist = new ArrayList<String>(5);

			if (host!=null && !host.trim().isEmpty()){
				qsb.append("and a.host=? ");
				vlist.add(host);
				//System.out.println(" host: " + host);
			}
			if (porttitle!=null && !porttitle.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + porttitle + "%");
				//System.out.println(" porttitle: " + porttitle);
			}
			if (operator!=null && !operator.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + operator + "%");
				//System.out.println(" operator: " + operator);
			}
			if (starttime!=null && !starttime.trim().isEmpty()){
				qsb.append("and a.datetime>=? ");
				vlist.add(starttime);
				//System.out.println(" starttime: " + starttime);
			}
			if (endtime!=null && !endtime.trim().isEmpty()){
				qsb.append("and a.datetime<=? ");
				vlist.add(endtime + " 23:59:59");
				//System.out.println(" endtime: " + endtime);
			}
			if (inputcmd!=null && !inputcmd.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + inputcmd + "%");
				//System.out.println(" inputcmd: " + inputcmd);
			}
			if (other!=null && !other.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + other + "%");
				//System.out.println(" other: " + other);
			}
			
			// qsb.append(" limit ");
			// qsb.append(getStart());
			// qsb.append(", ");
			// qsb.append(getLimit());
			
			System.out.println(" start: " + getStart() + ", limit: " + getLimit() );
			qsb.append(" order by a.id desc");
			String query = qsb.toString();
			System.out.println("======== " + query);
			// rs = (List<Logs>)getLogsdao().findAll();

			rs = (List<Logs>)getLogsdao().findlike(query, vlist, getStart(), getLimit());	
			JSONArray array = JSONArray.fromObject(rs);

			Long count = (Long)ServletActionContext.getRequest().
					getSession().getAttribute(LOG_QUERY_TOTAL);
			if (getStart()==0 || count == null ||
					(getStart() + rs.size() >= count)){
				count = getLogsdao().queryCount(query, vlist);
				ServletActionContext.getRequest().
					getSession().setAttribute(LOG_QUERY_TOTAL, new Long(count));
			}
			this.setJsonString("{success:true,totalCount : " + count // rs.size()
					+ ", list:" + array.toString() + "}");
			
			System.out.println("======== records: " + rs.size() );
			// System.out.println(this.getJsonString());
			return SUCCESS;			
			
		} catch (Exception e) {
			this.setJsonString("{success:false,totalCount:0}");
			e.printStackTrace();
		}
		return SUCCESS;
	}

	/*
	 * struts action 
	 */
	public String querylog4port() {
		System.out.println("======== query log ============");
		List<Log4port> rs = null;
		try {
			// from Log4port as a where 1=1 and a.ltxt like ? 
			StringBuilder qsb = new StringBuilder("from Log4port as a where 1=1 ");
			ArrayList<String> vlist = new ArrayList<String>(5);

			if (host!=null && !host.trim().isEmpty()){
				qsb.append("and a.host=? ");
				vlist.add(host);
				//System.out.println(" host: " + host);
			}
			if (porttitle!=null && !porttitle.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("% " + porttitle + " %");
				//System.out.println(" porttitle: " + porttitle);
			}
			if (operator!=null && !operator.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + operator + "%");
				//System.out.println(" operator: " + operator);
			}
			if (starttime!=null && !starttime.trim().isEmpty()){
				qsb.append("and a.datetime>=? ");
				vlist.add(starttime);
				//System.out.println(" starttime: " + starttime);
			}
			if (endtime!=null && !endtime.trim().isEmpty()){
				qsb.append("and a.datetime<=? ");
				vlist.add(endtime + " 23:59:59");
				//System.out.println(" endtime: " + endtime);
			}
			if (inputcmd!=null && !inputcmd.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + inputcmd + "%");
				//System.out.println(" inputcmd: " + inputcmd);
			}
			if (other!=null && !other.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + other + "%");
				//System.out.println(" other: " + other);
			}
			// qsb.append(" limit ");
			// qsb.append(getStart());
			// qsb.append(", ");
			// qsb.append(getLimit());
			
			System.out.println(" start: " + getStart() + ", limit: " + getLimit() );
			qsb.append(" order by a.id desc");
			String query = qsb.toString();
			System.out.println("======== " + query); 

			rs = (List<Log4port>) getLog4portdao().findlike(query, vlist, getStart(), getLimit()); 	
			JSONArray array = JSONArray.fromObject(rs);

			Long count = (Long)ServletActionContext.getRequest().
					getSession().getAttribute(PORT_LOG_QUERY_TOTAL);
			if (getStart()==0 || count == null ||
					(getStart() + rs.size() >= count)){
				count = getLog4portdao().queryCount(query, vlist);
				ServletActionContext.getRequest().
					getSession().setAttribute(PORT_LOG_QUERY_TOTAL, new Long(count));
			}
			this.setJsonString("{success:true,totalCount : " + count // rs.size()
					+ ", list:" + array.toString() + "}");
			
			System.out.println("======== records: " + rs.size() );
			// System.out.println(this.getJsonString());
			return SUCCESS;			
			
		} catch (Exception e) {
			this.setJsonString("{success:false,totalCount:0}");
			e.printStackTrace();
		}
		return SUCCESS;
	}
	
	public String savelog() {
		System.out.println("======== save log ============");
		List<Logs> rs = null;
		try {
			// from Logs as a where 1=1 and a.ltxt like ? 
			StringBuilder qsb = new StringBuilder("from Logs as a where 1=1 ");
			ArrayList<String> vlist = new ArrayList<String>(5);

			if (host!=null && !host.trim().isEmpty()){
				qsb.append("and a.host=? ");
				vlist.add(host);
				//System.out.println(" host: " + host);
			}
			if (porttitle!=null && !porttitle.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + porttitle + "%");
				//System.out.println(" porttitle: " + porttitle);
			}
			if (operator!=null && !operator.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + operator + "%");
				//System.out.println(" operator: " + operator);
			}
			if (starttime!=null && !starttime.trim().isEmpty()){
				qsb.append("and a.datetime>=? ");
				vlist.add(starttime);
				//System.out.println(" starttime: " + starttime);
			}
			if (endtime!=null && !endtime.trim().isEmpty()){
				qsb.append("and a.datetime<=? ");
				vlist.add(endtime + " 23:59:59");
				//System.out.println(" endtime: " + endtime);
			}
			if (inputcmd!=null && !inputcmd.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + inputcmd + "%");
				//System.out.println(" inputcmd: " + inputcmd);
			}
			if (other!=null && !other.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + other + "%");
				//System.out.println(" other: " + other);
			}
			
			setStart(0);
			setLimit(200000);

			System.out.println(" start: " + getStart() + ", limit: " + getLimit() );
			qsb.append(" order by a.id desc");
			String query = qsb.toString();
			System.out.println("======== " + query);
			// rs = (List<Logs>)getLogsdao().findAll();

			rs = (List<Logs>)getLogsdao().findlike(query, vlist, getStart(), getLimit());	
			// JSONArray array = JSONArray.fromObject(rs);
			StringBuilder sb = new StringBuilder(10000);
			if (rs != null){
				for (Logs line:rs){
					sb.append( line.getDatetime() );
					sb.append( ",	" );
					sb.append( line.getHost() );
					sb.append( ",	" );
					sb.append( line.getFacility() );
					sb.append( ",	" );
					sb.append( line.getLevel() );
					sb.append( ",	" );
					sb.append( line.getMsg());
					sb.append( "\r\n" );
				}
				this.setJsonString(sb.toString());
			}

			System.out.println("======== records: " + rs.size() );
			return SUCCESS;			
			
		} catch (Exception e) {
			this.setJsonString("{success:false,totalCount:0}");
			e.printStackTrace();
		}
		return SUCCESS;
	}


	public String savePortlog() {
		System.out.println("======== save port log ============");
		List<Log4port> rs = null;
		try {
			// from Log4port as a where 1=1 and a.ltxt like ? 
			StringBuilder qsb = new StringBuilder("from Log4port as a where 1=1 ");
			ArrayList<String> vlist = new ArrayList<String>(5);

			if (host!=null && !host.trim().isEmpty()){
				qsb.append("and a.host=? ");
				vlist.add(host);
				//System.out.println(" host: " + host);
			}
			if (porttitle!=null && !porttitle.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("% " + porttitle + " %");
				//System.out.println(" porttitle: " + porttitle);
			}
			if (operator!=null && !operator.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + operator + "%");
				//System.out.println(" operator: " + operator);
			}
			if (starttime!=null && !starttime.trim().isEmpty()){
				qsb.append("and a.datetime>=? ");
				vlist.add(starttime);
				//System.out.println(" starttime: " + starttime);
			}
			if (endtime!=null && !endtime.trim().isEmpty()){
				qsb.append("and a.datetime<=? ");
				vlist.add(endtime + " 23:59:59");
				//System.out.println(" endtime: " + endtime);
			}
			if (inputcmd!=null && !inputcmd.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + inputcmd + "%");
				//System.out.println(" inputcmd: " + inputcmd);
			}
			if (other!=null && !other.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				vlist.add("%" + other + "%");
				//System.out.println(" other: " + other);
			}

			setStart(0);
			setLimit(200000);
			
			System.out.println(" start: " + getStart() + ", limit: " + getLimit() );
			qsb.append(" order by a.id desc");
			
			String query = qsb.toString();
			System.out.println("======== " + query);

			rs = (List<Log4port>) getLog4portdao().findlike(query, vlist, getStart(), getLimit()); 	 

			StringBuilder sb = new StringBuilder(10000);
			if (rs != null){
				for (Log4port line : rs){
					sb.append( line.getDatetime() );
					sb.append( ",	" );
					sb.append( line.getHost() );
					sb.append( ",	" );
					sb.append( line.getFacility() );
					sb.append( ",	" );
					sb.append( line.getLevel() );
					sb.append( ",	" );
					sb.append( line.getMsg());
					sb.append( "\r\n" );
				}
				this.setJsonString(sb.toString());
			}

			System.out.println("======== records: " + rs.size() );
			return SUCCESS;			
			
		} catch (Exception e) {
			this.setJsonString("{success:false,totalCount:0}");
			e.printStackTrace();
		}
		return SUCCESS;
	}
	
	public String deleteSystemlog() {
		System.out.println("======== delete system log ============");
		int affected = 0;
		try {
			// delete Logs as a where 1=1  
			StringBuilder qsb = new StringBuilder("delete Logs as a where 1=1 ");
			ArrayList<String> vlist = new ArrayList<String>(5);
			boolean bAction = false;
			
			if (host!=null && !host.trim().isEmpty()){
				qsb.append("and a.host=? ");
				vlist.add(host);
				bAction = true;
			}
			if (starttime!=null && !starttime.trim().isEmpty()){
				qsb.append("and a.datetime>=? ");
				vlist.add(starttime);
				bAction = true;
			}
			if (endtime!=null && !endtime.trim().isEmpty()){
				qsb.append("and a.datetime<=? ");
				vlist.add(endtime + " 23:59:59");
				bAction = true;
			}

			if (bAction) {
				String query = qsb.toString();
				System.out.println("======== " + query);
				
				affected = getLogsdao().deletelike( query, vlist);
			}
		}catch (Exception e) {
			this.setJsonString("{success:false,error:{reason:'unknown'}}");
			e.printStackTrace();
		}
		this.setJsonString("{success:true, affected: '" + affected +"'}");
		return SUCCESS;
	}
	
	public String deletePortlog() {
		System.out.println("======== delete port log ============");
		int affected=0;
		try {
			// delete Logs as a where 1=1  
			StringBuilder qsb = new StringBuilder("delete Log4port as a where 1=1 ");
			ArrayList<String> vlist = new ArrayList<String>(5);

			boolean bAction = false;
			
			if (host!=null && !host.trim().isEmpty()){
				qsb.append("and a.host=? ");
				vlist.add(host);
				bAction = true;
			}			

			if (porttitle!=null && !porttitle.trim().isEmpty()){
				qsb.append("and a.msg like ? ");
				
				// 2010-04-18 00:00:00,	192.168.0.5,	local1,	info,	Digi_Passport: solaris [CAS login: aaddmmiinn ]
				// 2010-04-18 00:00:00,	192.168.0.5,	local1,	info,	Digi_Passport: solaris [  ]
				// 2010-04-18 00:00:00,	192.168.0.5,	local1,	info,	Digi_Passport: solaris [Password: 123456 ]
				// ': solaris ' seems to be the port characteristic 
				vlist.add("% " + porttitle + " %");
				//System.out.println(" porttitle: " + porttitle);
			}
			
			if (starttime!=null && !starttime.trim().isEmpty()){
				qsb.append("and a.datetime>=? ");
				vlist.add(starttime);
				bAction = true;
			}
			if (endtime!=null && !endtime.trim().isEmpty()){
				qsb.append("and a.datetime<=? ");
				vlist.add(endtime + " 23:59:59");
				bAction = true;
			}

			if (bAction) {
				String query = qsb.toString();
				System.out.println("======== " + query);
				
				affected = getLog4portdao().deletelike( query, vlist); 
			}
		}catch (Exception e) {
			this.setJsonString("{success:false,error:{reason:'unknown'}}");
			e.printStackTrace();
		}
		this.setJsonString("{success:true, affected: '" + affected +"'}");
		return SUCCESS;
	}
	
	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getPorttitle() {
		return porttitle;
	}
	
	public void setPorttitle(String porttitle) {
		this.porttitle = porttitle;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public String getStarttime() {
		return starttime;
	}

	public void setStarttime(String starttime) {
		this.starttime = starttime;
	}

	public String getEndtime() {
		return endtime;
	}

	public void setEndtime(String endtime) {
		this.endtime = endtime;
	}

	public String getInputcmd() {
		return inputcmd;
	}

	public void setInputcmd(String inputcmd) {
		this.inputcmd = inputcmd;
	}

	public String getOther() {
		return other;
	}

	public void setOther(String other) {
		this.other = other;
	}

	public void setLogsdao(ILogsDao logsdao) {
		this.logsdao = logsdao;
	}

	public ILogsDao getLogsdao() {
		return logsdao;
	}

	public ILog4portDao getLog4portdao() {
		return log4portdao;
	}

	public void setLog4portdao(ILog4portDao log4portdao) {
		this.log4portdao = log4portdao;
	}
	
	public InputStream getInputStream() {
		InputStream is = new StringBufferInputStream(this.getJsonString());
		return is;
	}
}
