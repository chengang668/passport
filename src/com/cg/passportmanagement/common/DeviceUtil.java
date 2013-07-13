package com.cg.passportmanagement.common;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletContext; 
import org.apache.struts2.ServletActionContext; 

import com.cg.passportmanagement.database.DigiLog;
import com.cg.passportmanagement.database.Passport;
import com.cg.passportmanagement.digi.*; 

public class DeviceUtil {
	private static class Process_BR{
		public Process proc;
		public BufferedReader br;
		Process_BR(Process p, BufferedReader r){
			this.proc = p;
			this.br = r;
		}		
	}
	
	private static Process_BR exec(String cmdFile, Passport ppt)  throws IOException {
		return exec(cmdFile, ppt, null);
	}
	
	private static Process_BR exec(String cmdFile, Passport ppt, String[] extraPara)  throws IOException {
		ServletContext ctx = ServletActionContext.getServletContext();
		String strCmd = ctx.getRealPath("/admin/python/" + cmdFile);

		String pwd = ppt.getRootpwd();
		if (pwd==null || pwd.trim().length()==0)
			pwd = "\"\"";
		
		// start command running
		String ccmmdd = "python " + strCmd + " " + ppt.getIp() + " 23 root " + pwd;
		if (extraPara!=null){
			for (String para : extraPara){
				ccmmdd += " " + para + ""; // ccmmdd += " \"" + para + "\""; on linux, "" will pass as part of value 
			}
		}
		int xlen = extraPara==null? 0: extraPara.length;
		String[] cmds = new String[6 + xlen];
		cmds[0] = "python";
		cmds[1] = strCmd;
		cmds[2] = ppt.getIp();
		cmds[3] = "23";
		cmds[4] = "root";
		cmds[5] = pwd;
		
		if (extraPara!=null){
			System.arraycopy(extraPara, 0, cmds, 6, xlen);
		}
		
		System.out.println("executing: " + ccmmdd);
		Process proc = null;
		try{
			proc = Runtime.getRuntime().exec(cmds, null);
		}
		catch(IOException e){
			System.out.println("executing error: " + e.getMessage());
			throw e;
		}
		catch(RuntimeException e){
			System.out.println("executing error: " + e.getMessage());
			throw e;
		}

		// get command's output stream and put a buffered reader input stream on it
		InputStream istr = proc.getInputStream();
		BufferedReader br = new BufferedReader(new InputStreamReader(istr));

		// read output lines from command
		String str = br.readLine().trim();
		if(!("login successfully".equals(str))){
			throw new DigiConnectionError( str + ": " + cmdFile);
		}

		return new Process_BR(proc, br);
	}

	private static int execCmd(String pyFile, Passport ppt, String[] extraPara)  throws IOException {
		Process_BR pb = exec(pyFile, ppt, extraPara);
		
		Process proc = pb.proc;
		BufferedReader br = pb.br;

		int result;
		// capture command output lines  should be "done" 
		String str = br.readLine();
		result = str.trim().compareTo("done");
		br.close();

		if (result != 0)
			throw new DigiConnectionError( str + ": " + pyFile);

		// wait for command to terminate
		/*try {
			proc.waitFor();
		} catch (InterruptedException e) {
			System.err.println("process was interrupted");
		}*/
		// close stream

		return result;
	}
	
	/*
login successfully
 1. IP mode                     : static IP
 2. IP address                  : 192.168.161.5
 3. Subnet mask                 : 255.255.255.0
 4. Default gateway             : 192.168.161.1
 5. Enable/Disable secondary IP address  : Disable
*/
	public static DigiIP getDigiIP(Passport ppt)  throws IOException
	{
		String strCmd = "ppt_ip_list.py";
		Process_BR pb = exec(strCmd, ppt);
		BufferedReader br = pb.br;
		Process proc = pb.proc;

		String str;
		int pos = -1;
		DigiIP di = new DigiIP();
		
		/* read ip mode*/
		str = br.readLine().trim(); 
		if (str.startsWith("1. IP mode"))
		{
			pos = str.indexOf(':');
			str = str.substring(pos+1).trim();
			int ipmode = str.compareTo("static IP");
			di.setIpmode(ipmode);
			System.out.println("digi IP mode: " + ipmode);
		}

		/* read ip address */
		str = br.readLine().trim();
		if (str.isEmpty())
			str = br.readLine().trim();
		System.out.println("line2: [" + str + "]");
		if (str.startsWith("2. IP address"))
		{
			pos = str.indexOf(':');
			str = str.substring(pos+1).trim(); 
			di.setIp(str);
			System.out.println("digi IP: " + str);
		}
		
		/* read subnet mask */
		str = br.readLine().trim();
		if (str.isEmpty())
			str = br.readLine().trim();
		System.out.println("line3: [" + str + "]");
		if (str.startsWith("3. Subnet mask"))
		{
			pos = str.indexOf(':');
			str = str.substring(pos+1).trim(); 
			di.setMask(str);
			System.out.println("digi subnet mask: " + str);
		}
		
		/* read Default gateway */
		str = br.readLine().trim();
		if (str.isEmpty())
			str = br.readLine().trim();
		System.out.println("line4: [" + str + "]");
		if (str.startsWith("4. Default gateway"))
		{
			pos = str.indexOf(':');
			str = str.substring(pos+1).trim(); 
			di.setGateway(str);
			System.out.println("digi default gateway: " + str);
		}
		// close stream
		br.close();

		System.out.println("digi ip got " + di);
		
		return di;
	}
	
/*
login successfully
 1. Dynamic IP address pool for incomming connections  : Enable
 2. First IP address            : 192.168.161.168
 3. Number of address           : 4

*/
	public static DigiPPP getDigiPPP(Passport ppt)  throws IOException
	{
		String strCmd = "ppt_ppp_list.py";
		Process_BR pb = exec(strCmd, ppt);
		BufferedReader br = pb.br;
		Process proc = pb.proc;

		String str;		
		int pos = -1;
		DigiPPP ppp = new DigiPPP();
		int ipmode=0;
		
		/* read Dynamic IP enablement*/
		str = br.readLine().trim(); 
		if (str.startsWith("1. Dynamic IP"))
		{
			pos = str.indexOf(':');
			str = str.substring(pos+1).trim();
			ipmode = str.compareTo("Enable")==0?1:0;
			ppp.setIpPoolEnable(ipmode);
		}
		
		if (ipmode==1){
			/* read first ip address */
			str = br.readLine().trim();
			if (str.isEmpty())
				str = br.readLine().trim();
			System.out.println("line2: [" + str + "]");
			if (str.startsWith("2. First IP address"))
			{
				pos = str.indexOf(':');
				str = str.substring(pos+1).trim(); 
				ppp.setFirstip(str);
			}
			
			/* read Number of address */
			str = br.readLine().trim();
			if (str.isEmpty())
				str = br.readLine().trim();
			System.out.println("line3: [" + str + "]");
			if (str.startsWith("3. Number of address"))
			{
				pos = str.indexOf(':');
				str = str.substring(pos+1).trim(); 
				ppp.setNumberOfIP(Integer.parseInt(str));
			}
		}

		// close stream
		br.close();
		
		return ppp;
	}
	
/*
login successfully

  1. all        Normal  anywhere                  Telnet    23     ACCEPT
  2. all        Normal  192.168.0.45/255.255.255. Telnet    23     ACCEPT
  3. all        Normal  192.168.161.245/255.255.2 SSH       22     ACCEPT
*/
	
	public static List getDigiIpFilter(Passport ppt)  throws IOException
	{
		// start command running
		String strCmd = "ppt_ip_filter_list.py";
		Process_BR pb = exec(strCmd, ppt);
		BufferedReader br = pb.br;
		Process proc = pb.proc;

		String str;
		// set up list to capture command output lines
		ArrayList list = new ArrayList();
		while ((str = br.readLine()) != null)
			if (str.trim().length()!=0) 
				list.add(DigiIpFilter.fromTelnetLine(str));

		// close stream
		br.close();

		return list;
	}
		
	/*
    1. NONE       abcdefghijklmnopqr CS   7001  Telnet   9600-N-8-1-NO
	 */
	
	public static List getPassportPortsList(Passport ppt)  throws IOException, DigiConnectionError
	{
		// start command running
		String strCmd = "ppt_device_list.py";
		Process_BR pb = exec(strCmd, ppt);
		BufferedReader br = pb.br;
		Process proc = pb.proc;

		// set up list to capture command output lines
		ArrayList list = new ArrayList();
		
		// read output lines from command
		String str;
		
		while ((str = br.readLine()) != null)
			if (str.trim().length()!=0) 
				list.add(DigiPort.fromTelnetLine(str));

		// close stream
		br.close();
		
		// return list of strings to caller
		return list ;
	}
	
	/*
	C:\work\PassportManagement\WebRoot\admin\python>ppt_who.py 192.168.161.5 23 root dbps
	login successfully
	USER       TTY      IDLE      FROM           HOST
	root       pts/0    00:00m    Nov  9 06:57   192.168.161.11
	*/
	
	public static List getLoggedUser(Passport ppt)  throws IOException {
		// start command running
		String strCmd = "ppt_who.py";
		Process_BR pb = exec(strCmd, ppt);
		BufferedReader br = pb.br;
		Process proc = pb.proc;

		String str;
		// set up list to capture command output lines
		ArrayList list = new ArrayList();
		
		while ((str = br.readLine()) != null)
			if (str.trim().length()!=0) 
				list.add(DigiUser.fromTelnetLine(str));

		// close stream
		br.close();

		//cg for test ArrayList list = new ArrayList();
		//cg for test String str = "root       pts/0    00:00m    Nov  9 06:57   192.168.161.11";
		//cg     list.add(DigiUser.fromTelnetLine(str));

		// return list of strings to caller
		return list ;
	}

	/*
	C:\work\PassportManagement\WebRoot\admin\python>ppt_log_file.py 192.168.161.5 23 root dbps messages
	login successfully
	 messages
	 */
	
	public static String getDigiLogFilename(Passport ppt)  throws IOException {
		// start command running
		String strCmd = "ppt_log_file.py";
		Process_BR pb = exec(strCmd, ppt);
		BufferedReader br = pb.br;
		Process proc = pb.proc;

		String str;
		// set up list to capture command output lines
		ArrayList list = new ArrayList();
		
		if((str = br.readLine()) == null){
			return null ;
		}

		// close stream
		br.close();
		return str.trim();
	}
	 
	/* 
	C:\work\PassportManagement\WebRoot\admin\python>ppt_sys_log.py 192.168.161.5 23 root dbps messages
	login successfully
	grep -E "login:"\|"Connection closed"\|"SSH authentication"\|"disconnected"  /var/log/messages
	
	Nov 15 17:59:35 Digi_Passport login: root login  on `pts/0' from `192.168.161.11'
	Nov 15 17:59:57 Digi_Passport login: root login  on `pts/1' from `192.168.161.11'
	Nov 15 18:02:03 Digi_Passport in.telnetd: Connection closed by 192.168.161.11
	Nov 15 18:02:03 Digi_Passport in.telnetd: Connection closed by 192.168.161.11
	Nov 15 20:12:01 Digi_Passport sshd: LOCAL/RADIUS - SSH authentication for 'root' passed.
	Nov 15 20:12:01 Digi_Passport sshd: LOCAL/RADIUS - SSH authentication for 'root' passed.
	Nov 15 20:12:08 Digi_Passport login: root login  on `pts/1' from `192.168.161.11'
	Nov 15 20:12:08 Digi_Passport login: root login  on `pts/1' from `192.168.161.11'
	*/
	
	public static List getDigiLog(String ip, int port, String user, String pwd, String fromTime )  throws IOException {
		ServletContext ctx = ServletActionContext.getServletContext();
		String strCmd = ctx.getRealPath("/admin/python/ppt_sys_log.py");
		
/*		String logFilename = getDigiLogFilename(ip, port, user, pwd);
		if (logFilename == null || "".equals(logFilename)){
			return null;
		}

		// start command running
		Process proc = Runtime.getRuntime().exec("c:\\Python25\\python " + strCmd + " " + ip + " " + 
				port + " " + user + " " + pwd + " " + logFilename);

		// get command's output stream and put a buffered reader input stream on it
		InputStream istr = proc.getInputStream();
		BufferedReader br = new BufferedReader(new InputStreamReader(istr));

		// set up list to capture command output lines
		ArrayList list = new ArrayList();
		
		// read output lines from command
		String str = br.readLine().trim();
		if(!("login successfully".equals(str))){
			return null;
		}
		// skip a line of "grep -E "login:"\|"Connection closed"\|"SSH authentication"\|"disconnected"  /var/log/messages"
		br.readLine();
		
		while ((str = br.readLine()) != null){
			str = str.trim();
			if (str.length()>=16) {
				String time = str.substring(0, 15);
				
				if (time.compareTo(fromTime) > 0)
				{
					DigiLog o = buildDigiLogFromString(ip, str);
					if ( o != null )
						list.add(o);
				}
			}
		}

		// close stream
		br.close();
*/
		String str = "Nov 15 17:59:57 Digi_Passport login: root login  on `pts/1' from `192.168.161.11'";
		DigiLog o = buildDigiLogFromString(ip, str);
		ArrayList<DigiLog> list = new ArrayList<DigiLog>();
		list.add(o);
		
		// return list of strings to caller
		return list ;
	}
	
	public static DigiLog buildDigiLogFromString(String ip, String line)
	{
		DigiLog o = null;
		/*
		Nov 15 17:59:57 Digi_Passport login: root login  on `pts/1' from `192.168.161.11'
		Nov 15 18:02:03 Digi_Passport in.telnetd: Connection closed by 192.168.161.11
		*/
		Date dt = null; //new Date();
		String userid = "";
		o = new DigiLog(ip, userid, dt, line);
		o.setDtime(dt); 
		return o;
	}

	
	/*
	ppt_syslogng_list.py 192.168.0.5 23 root dbps
	login successfully
	  1. F-Local0             UDP             192.168.0.126
	  2. F-Local1             UDP             192.168.0.126
	  3. F-Local3             TCP             192.168.0.126
	  4. F-Local0             systemlog       /var/log/messages
	 */
	
	public static List<DigiSyslogItem> getDigiSyslogngSetting(Passport ppt)  throws IOException, DigiConnectionError
	{
		// start command running
		String strCmd = "ppt_syslogng_list.py";
		Process_BR pb = exec(strCmd, ppt);
		BufferedReader br = pb.br;
		Process proc = pb.proc;

		String str;

		// set up list to capture command output lines
		ArrayList<DigiSyslogItem> list = new ArrayList<DigiSyslogItem>();
		
		while ((str = br.readLine()) != null)
			if (str.trim().length()!=0) 
				list.add(DigiSyslogItem.fromTelnetLine(str));

		// close stream
		br.close();
		
		// return list of strings to caller
		return list ;
	}
	
	public static int renamePortTitle(Passport ppt,	String[] extraPara)  throws IOException
	{
		// start command running
		String strCmd = "ppt_port_title_mod.py";
		return execCmd(strCmd, ppt, extraPara);
	}

	public static int setPortBaudrate(Passport ppt,	String[] extraPara)  throws IOException
	{
		// start command running
		String strCmd = "ppt_port_baudrate_mod.py";
		return execCmd(strCmd, ppt, extraPara);
	}

	public static int addUser(Passport ppt,	String[] extraPara)  throws IOException
	{
		// start command running
		String strCmd = "ppt_useradd.py";
		return execCmd(strCmd, ppt, extraPara);
	}
	
	public static int delUser(Passport ppt,	String[] extraPara)  throws IOException
	{
		// start command running
		String strCmd = "ppt_userdel.py";
		return execCmd(strCmd, ppt, extraPara);
	}
	
	public static int userPortAcl(Passport ppt,	String[] extraPara)  throws IOException
	{
		// start command running
		String strCmd = "ppt_user_acl.py";
		return execCmd(strCmd, ppt, extraPara);
	}
	
	public static int changePortProtocol(Passport ppt, String[] extraPara) throws IOException {
		// start command running
		String strCmd = "ppt_port_protocol_mod.py";
		return execCmd(strCmd, ppt, extraPara);
	}
	/*
	 * extraPara:
	 * ip of syslogng server
	 */
	public static int initSyslogngConfig(Passport ppt, String[] extraPara) throws IOException {
		// start command running
		// ppt_init_syslogng.py  192.168.0.5 23 root dbps 192.168.0.126"
		String strCmd = "ppt_init_syslogng.py";
		return execCmd(strCmd, ppt, extraPara);
	}
	/*
	 * extraPara:
	 * syslog-ng facility:  1, 2, 3, 4, 5, 6, 7 stands for local1, local2 ...
	 * 1 by default
	 */
	public static int initAllPorts(Passport ppt, String[] extraPara) throws IOException {
		// start command running
		// ppt_init_allports_1.py 192.168.0.5 23 root dbps [1:local1]
		String strCmd = "ppt_init_allports_1.py";
		return execCmd(strCmd, ppt, extraPara);
	}
	/*
	 * extraPara:
	 * ppt_ip_mod.py 192.168.0.6 23 root dbps 192.168.0.5 255.255.255.0 192.168.0.1"
	 */
	public static int ipconfig(Passport ppt, String[] extraPara) throws IOException {
		// start command running
		String strCmd = "ppt_ip_mod.py";
		return execCmd(strCmd, ppt, extraPara);
	}
	
	// return "success" when dialup successfully,
	// otherwise, return the reason of failure
	public static String dialupDigi(String ifcfg)  throws IOException {
		//ServletContext ctx = ServletActionContext.getServletContext();

		// start command running
		System.out.println("executing Dial-up connection to Passport: ifup " + ifcfg);
		String[] cmds = new String[2];
		cmds[0] = "ifup"; // /sbin/ifup
		cmds[1] = ifcfg;

		Process proc = null;
		try{
			proc = Runtime.getRuntime().exec(cmds, null);
		}
		catch(IOException e){
			System.out.println("executing error: " + e.getMessage());
			throw e;
		}
		catch(RuntimeException e){
			System.out.println("executing error: " + e.getMessage());
			throw e;
		}

		// get command's output stream and put a buffered reader input stream on it
		InputStream istr = proc.getErrorStream(); //.getInputStream();
		BufferedReader br = new BufferedReader(new InputStreamReader(istr));

		// read output lines from command
		String str = null;
		String stderr = "";
		while (null != (str = br.readLine())){
			stderr += str;
		}
		
		// wait for command to terminate
		try {
			int ret = proc.waitFor();
			System.out.println("Dial-up connection done, return=" + ret);
			
			if (ret==0){ // success
				return "success";
			}
			else 
				return stderr.isEmpty()==false? stderr : "失败：不明原因导致的拨号失败";
		} catch (InterruptedException e) {
			System.err.println("dialupDigi was interrupted");
			return "拨号被中断";
		}
	}
	
	// return "success" when dialup successfully,
	// otherwise, return the reason of failure
	public static String dialdownDigi(String ifcfg)  throws IOException {
		//ServletContext ctx = ServletActionContext.getServletContext();

		// start command running
		System.out.println("executing Dial-down connection to Passport: ifdown " + ifcfg);
		String[] cmds = new String[2];
		cmds[0] = "ifdown"; // /sbin/ifup
		cmds[1] = ifcfg;

		Process proc = null;
		try{
			proc = Runtime.getRuntime().exec(cmds, null);
		}
		catch(IOException e){
			System.out.println("executing error: " + e.getMessage());
			throw e;
		}
		catch(RuntimeException e){
			System.out.println("executing error: " + e.getMessage());
			throw e;
		}

		// get command's output stream and put a buffered reader input stream on it
		InputStream istr = proc.getErrorStream();// .getInputStream();
		BufferedReader br = new BufferedReader(new InputStreamReader(istr));

		// read output lines from command
		String str = null;
		String stderr = "";
		while (null != (str = br.readLine())){
			stderr += str;
		}
		
		// wait for command to terminate
		try {
			int ret = proc.waitFor();
			System.out.println("Dial-down connection done, return=" + ret);
			
			if (ret==0){ // success
				return "success";
			}
			else {
				System.out.println(stderr);
				return stderr.isEmpty()==false? stderr : "失败：不明原因导致的拨号失败";
			}
		} catch (InterruptedException e) {
			System.err.println("dialdown Digi was interrupted");
			return "拨号操作被中断";
		}
	}
	/*
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("Test DeviceUtil");
		String[] strs = runCommand("python C:\\work\\Consol~1\\python\\telnet_passport.py");
		
		for (String line : strs)
			System.out.println(line);
	} */

	
	/*
	 * 
Telnet: login & logout

Nov  9 19:33:28 Digi_Passport xinetd[273]: START: telnet pid=1437 from=192.168.161.11
Nov  9 19:33:42 Digi_Passport pam_local_auth: session opened for user root by (uid=0)
Nov  9 19:33:42 Digi_Passport pam_local_auth: session opened for user root by (uid=0)
Nov  9 19:33:42 Digi_Passport pam_local_auth: session opened for user root by (uid=0)
Nov  9 19:33:42 Digi_Passport pam_local_auth: session opened for user root by (uid=0)
Nov  9 19:33:42 Digi_Passport login: root login  on `pts/1' from `192.168.161.11'
Nov  9 19:33:42 Digi_Passport login: root login  on `pts/1' from `192.168.161.11'
Nov  9 19:33:59 Digi_Passport in.telnetd: Connection closed by 192.168.161.11
Nov  9 19:33:59 Digi_Passport in.telnetd: Connection closed by 192.168.161.11

SSH: 

Nov  9 19:38:30 Digi_Passport pam_local_auth: session opened for user root by (uid=0)
Nov  9 19:38:30 Digi_Passport pam_local_auth: session opened for user root by (uid=0)
Nov  9 19:38:30 Digi_Passport pam_local_auth: session opened for user root by (uid=0)
Nov  9 19:38:30 Digi_Passport pam_local_auth: session opened for user root by (uid=0)
Nov  9 19:38:30 Digi_Passport sshd: LOCAL/RADIUS - SSH authentication for 'root' passed.
Nov  9 19:38:30 Digi_Passport sshd: LOCAL/RADIUS - SSH authentication for 'root' passed.
Nov  9 19:38:30 Digi_Passport sshd[1552]: Accepted password for root from 192.168.161.11 port 17619 ssh2
Nov  9 19:38:31 Digi_Passport : LOCAL - Port Access Menu authentication for 'root' passed.
Nov  9 19:38:31 Digi_Passport : LOCAL - Port Access Menu authentication for 'root' passed.
Nov  9 19:38:31 Digi_Passport portaccessmenu: Port access menu connected by 'root'(localhost).
Nov  9 19:38:31 Digi_Passport portaccessmenu: Port access menu connected by 'root'(localhost).
Nov  9 19:38:39 Digi_Passport portaccessmenu: Port access menu disconnected.
Nov  9 19:38:39 Digi_Passport portaccessmenu: Port access menu disconnected.




	 */
}
