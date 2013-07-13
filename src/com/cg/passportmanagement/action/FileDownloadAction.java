package com.cg.passportmanagement.action;

import java.io.InputStream;
import org.apache.struts2.ServletActionContext;
import com.opensymphony.xwork2.ActionSupport;

/*
 */

public class FileDownloadAction extends ActionSupport {
	private static final long serialVersionUID = 1L;
	
	//������������ע������ԣ������������ļ��ж�ָ̬��������ֵ
	private String inputPath;  
	
	public String execute() {
		return SUCCESS;
	}
	
	public InputStream getTargetFile() throws Exception{
		   return ServletActionContext.getServletContext().getResourceAsStream(this.inputPath);
	}
	// struts action param
	public String getDownloadFileName() throws Exception{
		int beginIndex = this.inputPath.lastIndexOf('/');
		return this.inputPath.substring(beginIndex+1);
	}
	
	// struts action for downloadSecureCRT.action
	public String downloadSecureCRT(){
		this.inputPath = "/admin/SecureCRT.zip";
		return SUCCESS;
	}
 
	//����ע�������ֵ��set����

	public String getInputPath() {
	   return inputPath;
	}

	public void setInputPath(String inputPath) {
	   this.inputPath = inputPath;
	}

	
}
