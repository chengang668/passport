package com.cg.passportmanagement.action;

import java.io.InputStream;
import org.apache.struts2.ServletActionContext;
import com.opensymphony.xwork2.ActionSupport;

/*
 */

public class FileDownloadAction extends ActionSupport {
	private static final long serialVersionUID = 1L;
	
	//该属性是依赖注入的属性，可以在配置文件中动态指定该属性值
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
 
	//依赖注入该属性值的set方法

	public String getInputPath() {
	   return inputPath;
	}

	public void setInputPath(String inputPath) {
	   this.inputPath = inputPath;
	}

	
}
