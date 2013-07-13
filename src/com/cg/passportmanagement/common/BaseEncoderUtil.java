package com.cg.passportmanagement.common;

import java.security.MessageDigest;   
import java.security.NoSuchAlgorithmException;   
  
import sun.misc.BASE64Decoder;   
import sun.misc.BASE64Encoder;   
  
/**  
 * 程序功能：字符串编码（Base64、MD5/SHA）  
 * @version 1.00.00  
 * @since 2008-05-17  
 */  
public class BaseEncoderUtil {   
  
    public BaseEncoderUtil() {   
  
    }   
  
    public static void main(String[] args) {   
        BaseEncoderUtil b = new BaseEncoderUtil();   
        System.out.println(b.String2Hex("xmddl369"));   
        System.out.println(b.String2Hex("3"));   
        System.out.println(b.OctalString2Integer("10"));   
        System.out.println(b.Integer2OctalString(8));   
        System.out.println(b.Integer2OctalString(b.BinaryString2Integer("1010")));   
           
        System.out.println(b.EncoderString("MD5", "chengang")); 
        System.out.println(b.getBASE64("chengang"));  
        System.out.println(b.getFromBASE64("Y2hlbmdhbmc="));  
        System.out.println(b.getBASE64("dbps"));  
        System.out.println(b.getFromBASE64("cm9vdA=="));  
//      System.out.println(b.EncoderString("SHA-1", "10000000"));   
        // System.out.println(b.md5Encode("a"));   
        // System.out.println(b.shaEncode("XX"));   
        // System.out.println(b.sha256Encode("XX"));   
        // System.out.println(b.sha512Encode("XX"));   
    }   
  
    /**  
     * 功能：十进制数到十六进制  
     * @param value  
     * @return  
     */  
    public String Integer2HexString(int value)   
    {   
        return Integer.toHexString(value);   
    }   
       
    /**  
     * 功能：十进制数到八进制  
     * @param value  
     * @return  
     */  
    public String Integer2OctalString(int value)   
    {   
        return Integer.toOctalString(value);   
    }   
       
    /**  
     * 功能：十进制数到二进制  
     * @param value  
     * @return  
     */  
    public String Integer2BinaryString(int value)   
    {   
        return Integer.toBinaryString(value);   
    }   
       
    /**  
     * 功能：十六进制数到十进制  
     * @param value  
     * @return  
     */  
    public int HexString2Integer(String value)   
    {   
        return Integer.parseInt(value,16);   
    }   
       
    /**  
     * 功能：八进制数到十进制  
     * @param value  
     * @return  
     */  
    public int OctalString2Integer(String value)   
    {   
        return Integer.parseInt(value,8);   
    }   
       
    /**  
     * 功能：八进制数到十进制  
     * @param value  
     * @return  
     */  
    public int BinaryString2Integer(String value)   
    {   
        return Integer.parseInt(value,2);   
    }   
       
    /**  
     * 功能：字符串进行MD5编码，返回16进制字符串  
     *   
     * @param message  
     * @return  
     */  
    public String md5Encode(String message) {   
        return EncodeString2Hex("MD5", message);   
    }   
  
    /**  
     * 功能：字符串进行SHA编码，返回16进制字符串  
     *   
     * @param message  
     * @return  
     */  
    public String shaEncode(String message) {   
        return EncodeString2Hex("SHA", message);   
    }   
  
    /**  
     * 功能：字符串进行SHA-256编码，返回16进制字符串  
     *   
     * @param message  
     * @return  
     */  
    public String sha256Encode(String message) {   
        return EncodeString2Hex("SHA-256", message);   
    }   
  
    /**  
     * 功能：字符串进行SHA-512编码，返回16进制字符串  
     *   
     * @param message  
     * @return  
     */  
    public String sha512Encode(String message) {   
        return EncodeString2Hex("SHA-512", message);   
    }   
  
    /**  
     * 功能：将字符串进行BASE64编码，返回字符串  
     *   
     * @param src  
     * @return  
     */  
    public static String getBASE64(String src) {   
        if (src == null) {   
            return null;   
        }   
        byte[] b = src.getBytes();   
        BASE64Encoder encoder = new BASE64Encoder();   
        return encoder.encode(b);   
    }   
  
    /**  
     * 功能：将BASE64编码的字符串src进行解码  
     *   
     * @param src  
     * @return  
     */  
    public static String getFromBASE64(String src) {   
        if (src == null) {   
            return null;   
        }   
        BASE64Decoder decoder = new BASE64Decoder();   
        try {   
            byte[] b = decoder.decodeBuffer(src);   
            return new String(b);   
        } catch (Exception e) {   
            return null;   
        }   
    }   
       
    /**  
     * 功能：将字符串转为16进制字符串表示  
     * @param src  
     * @return  
     */  
    public String String2Hex(String src){   
        if(src==null)   
            return null;   
        byte[] b=src.getBytes();   
        StringBuffer sb = new StringBuffer(b.length);   
        String sTemp;   
        for (int i = 0; i < b.length; i++) {   
         sTemp = Integer.toHexString(0xFF & b[i]);   
         if (sTemp.length() < 2)   
          sb.append(0);   
         sb.append(sTemp.toUpperCase());   
        }   
        return sb.toString();   
           
//      if(src==null)   
//          return null;   
//      byte[] b=src.getBytes();   
//      String ret = "";   
//      for (int i = 0; i < b.length; i++) {   
//          String hex = Integer.toHexString(b[i] & 0xFF);   
//          if (hex.length() == 1) {   
//              hex = '0' + hex;   
//          }   
//          ret += hex.toUpperCase();   
//      }   
//      return ret;   
    }   
  
    /**  
     * 功能：将字符串进行编码，并返回字符串  
     *   
     * @param src  
     * @return  
     */  
    public String EncoderString(String code, String src) {   
        try {   
            byte[] strTemp = src.getBytes();   
            MessageDigest messageDigest = MessageDigest.getInstance(code);   
            messageDigest.update(strTemp);   
            byte[] md = messageDigest.digest();   
            return byteArray2String(md);   
        } catch (Exception e) {   
            return null;   
        }   
    }   
  
    /**  
     * 功能：将字节数组转为字符串  
     *   
     * @param byteArray  
     * @return encode  
     */  
    private String byteArray2String(byte[] byteArray) {   
        String encode = null;   
        int j = byteArray.length;   
        char str[] = new char[j * 2];   
        int k = 0;   
        for (int i = 0; i < j; i++) {   
            byte byte0 = byteArray[i];   
            str[k++] = hexDigits[byte0 >>> 4 & 0xf];   
            str[k++] = hexDigits[byte0 & 0xf];   
        }   
        encode = new String(str);   
        return encode;   
    }   
  
    /**  
     * 功能：将字符串进行编码，并返回16进制字符串  
     *   
     * @param code  
     * @param message  
     * @return encode  
     */  
    private String EncodeString2Hex(String code, String message) {   
        MessageDigest md;   
        String encode = null;   
        try {   
            md = MessageDigest.getInstance(code);   
            encode = byteArrayToHexString(md.digest(message.getBytes()));   
        } catch (NoSuchAlgorithmException e) {   
            e.printStackTrace();   
        }   
        return encode;   
    }   
  
    /**  
     * 功能：对字节数组编码  
     *   
     * @param byteArray  
     * @return  
     */  
    private String byteArrayToHexString(byte[] byteArray) {   
        StringBuffer sb = new StringBuffer();   
        for (int i = 0; i < byteArray.length; i++) {   
            sb.append(byteToHexString(byteArray[i]));   
        }   
        return sb.toString();   
    }   
  
    /**  
     * 功能：将字节进行16进制编码  
     *   
     * @param byt  
     * @return  
     */  
    private String byteToHexString(byte byt) {   
        int n = byt;   
        if (n < 0)   
            n = 256 + n;   
        return String.valueOf(hexDigits[n / 16] + hexDigits[n % 16]);   
    }   
  
    private char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8',   
            '9', 'a', 'b', 'c', 'd', 'e', 'f' };   
}   