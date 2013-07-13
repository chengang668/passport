package com.cg.test;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

   /**
     * 无视Https证书是否正确的Java Http Client
     * 
     * <p>
     * <a href="HttpsUtil.java.html"><i>View Source</i></a>
     * </p>
     * 
     * @author <a href="mailto:twotwo.li@gmail.com">LiYan</a>
     *
     * @create Sep 10, 2009 9:59:35 PM
     * @version $Id$
     */
public class HttpsUtil {

    /**
     * 忽视证书HostName
     */
    private static HostnameVerifier ignoreHostnameVerifier = new HostnameVerifier() {
        public boolean verify(String s, SSLSession sslsession) {
            System.out.println("WARNING: Hostname is not matched for cert.");
            return true;
        }
    };

     /**
     * Ignore Certification
     */
    private static TrustManager ignoreCertificationTrustManger = new X509TrustManager() {

        private X509Certificate[] certificates;

        public void checkClientTrusted(X509Certificate certificates[],
                String authType) throws CertificateException {
            if (this.certificates == null) {
                this.certificates = certificates;
                System.out.println("init at checkClientTrusted");
            }

        }

        public void checkServerTrusted(X509Certificate[] ax509certificate, String s) throws CertificateException {
            if (this.certificates == null) {
                this.certificates = ax509certificate;
                System.out.println("init at checkServerTrusted");
            }

//            for (int c = 0; c < certificates.length; c++) {
//                X509Certificate cert = certificates[c];
//                System.out.println(" Server certificate " + (c + 1) + ":");
//                System.out.println("  Subject DN: " + cert.getSubjectDN());
//                System.out.println("  Signature Algorithm: "
//                        + cert.getSigAlgName());
//                System.out.println("  Valid from: " + cert.getNotBefore());
//                System.out.println("  Valid until: " + cert.getNotAfter());
//                System.out.println("  Issuer: " + cert.getIssuerDN());
//            }

        }

        public X509Certificate[] getAcceptedIssuers() {
            // TODO Auto-generated method stub
            return null;
        }

    };

    public static byte[] doGet(String urlString) {

        ByteArrayOutputStream buffer = new ByteArrayOutputStream(512);
        try {

            URL url = new URL(urlString);

            /*
             * use ignore host name verifier
             */
            HttpsURLConnection.setDefaultHostnameVerifier(ignoreHostnameVerifier);
            HttpsURLConnection connection = (HttpsURLConnection) url
                    .openConnection();

            // Prepare SSL Context
            TrustManager[] tm = { ignoreCertificationTrustManger };
            SSLContext sslContext = SSLContext.getInstance("SSL", "SunJSSE");
            sslContext.init(null, tm, new java.security.SecureRandom());

            // 从上述SSLContext对象中得到SSLSocketFactory对象
            SSLSocketFactory ssf = sslContext.getSocketFactory();
            connection.setSSLSocketFactory(ssf);
            
            InputStream reader = connection.getInputStream();
            byte[] bytes = new byte[512];
            int length = reader.read(bytes);

            do {
                buffer.write(bytes, 0, length);
                length = reader.read(bytes);
            } while (length > 0);

            // result.setResponseData(bytes);
            System.out.println(buffer.toString());
            reader.close();
            
            connection.disconnect();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
        }
        return buffer.toByteArray();
    }

    public static void main(String[] args) {
        // String urlString = "https://www.google.com/adsense/";
        String urlString = "https://192.168.161.5";
        String output = new String(HttpsUtil.doGet(urlString));
        System.out.println(output);    
    }
}

/*
 init at checkServerTrusted
WARNING: Hostname is not matched for cert.
WARNING: Hostname is not matched for cert.
<html>
<head>
	<META HTTP-EQUIV="Expires" CONTENT="0">
	<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
	<link rel="stylesheet" href="/css/global.css" type="text/css"/>
	<script language="javascript" src="/jscript/global.js"></script>
	<script language="javascript" src="/jscript/devicejs.js"></script>

<title>Digi Configuration and Management</title>
</head>
<body class="BODY_CSS" onLoad="bodyOnLoad();">
<table cellpadding=0 cellspacing=0 width=98% bgcolor=white align=center>
<tr><td bgcolor="#FFFFFF" height=15></td></tr>
<tr><td bgcolor="#FFFFFF">
<table cellpadding=0 cellspacing=0 width=95% align=center>
<tr><td height=5></td></tr>
<tr>
        <td nowrap width=250 align=center><img src="/images/logo.jpg" border=0></td>
        <td nowrap width=10></td>
        <td valign=middle class="PAGE_BODY_HEADER"><table cellpadding=0 cellspacing=0 width=100% align=center>
                <tr>
                        <td nowrap valign=middle class="PAGE_BODY_HEADER">Digi Passport<sup>TM</sup> 4 &nbsp; Configuration and Management<br><hr><br></td>
                        <td width="300" align="right"><img src="/images/model.jpg" border=0></td>
                </tr>
        </table></td>
</tr>
<tr><td height=5></td></tr>
</table>
</td></tr>
<tr><td bgcolor="#FFFFFF" height=3></td></tr>
</table>
<br>


<table cellpadding=0 cellspacing=0 width=95% bgcolor=white align=center>
	<tr>

<script Language="JavaScript" src="jscript/login.js"></script><td valign=top><form action=/goform/svLogin name=login method=POST onSubmit="return checkLoginInfo(this)"><center><br><br><table border=0 width=400 cellspacing=0 bordercolordark=#000084 bordercolorlight=#000084 align=center><tr><td><!--applet codebase="." archive="login.jar" code="Login" width=0 height=0><a href="http://www.java.com"><img src=/images/alert.gif alt="Alert" width=12 height=11><b> Please, download the Java Runtime Environment to use Java Telnet Applet or freeKVM&nbsp</a> and check your browser options/preferences to be sure that JAVA is enabled.</b></applet--></td></tr><tr><td height=10></td></tr></table><table border=2 width=400 cellspacing=0 bordercolordark=#000084 bordercolorlight=#000084 align=center><tr><td bgcolor=#000084 height=22><font color=#FFFFFF><b>&nbsp;&nbsp;&nbsp;User authentication required. Login please.</b></font></td></tr><tr><td width=100%><table border=0 width=100% cellspacing=2 cellpadding=0 bgcolor=#FFFFFF><tr><td width=4% height=5></td><td width=48%></td><td width=48%></td></tr><tr><td></td><td>User ID : </td><td><input type=text name=userid size=20 maxlength=31 value=""></td></tr><tr><td></td><td>Password : </td><td><input type=password name=password size=20 maxlength=255 value=""></td></tr><tr><td height=5 colspan=3></td></tr><tr><td></td><td colspan=2><input type=submit name=login size=20 value="Login"></td></tr><tr><td height=5 colspan=3></td></tr></table></td></tr></table><br><br><br><br><br><br></center></form></td><tr><td align=right>&nbsp;&nbsp;<img src="images/ws_button3.gif" width=107 height=22 border=0></td></tr><!--script Language=JavaScript>disableUser();</script-->
	</tr>
</table>

<br><br>
<table cellpadding=0 cellspacing=0 width=98% bgcolor=white align=center>
<tr><td bgcolor="#FFFFFF" height=3></td></tr>
<tr>
        <td nowrap align="center" class="PAGE_BODY_COPYRIGHT" bgcolor="#FFFFFF"><br>Copyright &copy; 1996-2007 Digi International. All rights reserved.<br><br></td>
</tr>
<tr><td bgcolor="#FFFFFF" height=10></td></tr>
</table>

<form name="form_svutil" action="/goform/svUtil" method="post">
<input type="hidden" name="CURRENT_PATH" value="/serial/serial_config/ports/">
<input type="hidden" name="submitaction" value="apply">
<input type="hidden" name="wlocation" value="">
</form>
<br>

<script>
function pageOnLoadAlert() {
	var alert_str = "";
}
</script>
</body>
</html>



<html>
<head>
	<META HTTP-EQUIV="Expires" CONTENT="0">
	<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
	<link rel="stylesheet" href="/css/global.css" type="text/css"/>
	<script language="javascript" src="/jscript/global.js"></script>
	<script language="javascript" src="/jscript/devicejs.js"></script>

<title>Digi Configuration and Management</title>
</head>
<body class="BODY_CSS" onLoad="bodyOnLoad();">
<table cellpadding=0 cellspacing=0 width=98% bgcolor=white align=center>
<tr><td bgcolor="#FFFFFF" height=15></td></tr>
<tr><td bgcolor="#FFFFFF">
<table cellpadding=0 cellspacing=0 width=95% align=center>
<tr><td height=5></td></tr>
<tr>
        <td nowrap width=250 align=center><img src="/images/logo.jpg" border=0></td>
        <td nowrap width=10></td>
        <td valign=middle class="PAGE_BODY_HEADER"><table cellpadding=0 cellspacing=0 width=100% align=center>
                <tr>
                        <td nowrap valign=middle class="PAGE_BODY_HEADER">Digi Passport<sup>TM</sup> 4 &nbsp; Configuration and Management<br><hr><br></td>
                        <td width="300" align="right"><img src="/images/model.jpg" border=0></td>
                </tr>
        </table></td>
</tr>
<tr><td height=5></td></tr>
</table>
</td></tr>
<tr><td bgcolor="#FFFFFF" height=3></td></tr>
</table>
<br>


<table cellpadding=0 cellspacing=0 width=95% bgcolor=white align=center>
	<tr>

<script Language="JavaScript" src="jscript/login.js"></script><td valign=top><form action=/goform/svLogin name=login method=POST onSubmit="return checkLoginInfo(this)"><center><br><br><table border=0 width=400 cellspacing=0 bordercolordark=#000084 bordercolorlight=#000084 align=center><tr><td><!--applet codebase="." archive="login.jar" code="Login" width=0 height=0><a href="http://www.java.com"><img src=/images/alert.gif alt="Alert" width=12 height=11><b> Please, download the Java Runtime Environment to use Java Telnet Applet or freeKVM&nbsp</a> and check your browser options/preferences to be sure that JAVA is enabled.</b></applet--></td></tr><tr><td height=10></td></tr></table><table border=2 width=400 cellspacing=0 bordercolordark=#000084 bordercolorlight=#000084 align=center><tr><td bgcolor=#000084 height=22><font color=#FFFFFF><b>&nbsp;&nbsp;&nbsp;User authentication required. Login please.</b></font></td></tr><tr><td width=100%><table border=0 width=100% cellspacing=2 cellpadding=0 bgcolor=#FFFFFF><tr><td width=4% height=5></td><td width=48%></td><td width=48%></td></tr><tr><td></td><td>User ID : </td><td><input type=text name=userid size=20 maxlength=31 value=""></td></tr><tr><td></td><td>Password : </td><td><input type=password name=password size=20 maxlength=255 value=""></td></tr><tr><td height=5 colspan=3></td></tr><tr><td></td><td colspan=2><input type=submit name=login size=20 value="Login"></td></tr><tr><td height=5 colspan=3></td></tr></table></td></tr></table><br><br><br><br><br><br></center></form></td><tr><td align=right>&nbsp;&nbsp;<img src="images/ws_button3.gif" width=107 height=22 border=0></td></tr><!--script Language=JavaScript>disableUser();</script-->
	</tr>
</table>

<br><br>
<table cellpadding=0 cellspacing=0 width=98% bgcolor=white align=center>
<tr><td bgcolor="#FFFFFF" height=3></td></tr>
<tr>
        <td nowrap align="center" class="PAGE_BODY_COPYRIGHT" bgcolor="#FFFFFF"><br>Copyright &copy; 1996-2007 Digi International. All rights reserved.<br><br></td>
</tr>
<tr><td bgcolor="#FFFFFF" height=10></td></tr>
</table>

<form name="form_svutil" action="/goform/svUtil" method="post">
<input type="hidden" name="CURRENT_PATH" value="/serial/serial_config/ports/">
<input type="hidden" name="submitaction" value="apply">
<input type="hidden" name="wlocation" value="">
</form>
<br>

<script>
function pageOnLoadAlert() {
	var alert_str = "";
}
</script>
</body>
</html>




 */
 