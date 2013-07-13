package com.cg.passportmanagement.database;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table; 
import org.hibernate.annotations.GenericGenerator;

 
@Entity
@Table(name = "ipfilter", catalog = "passport")
public class Ipfilter implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
	// Fields	
	private Integer id;
	private String ip; 
	// Constructors

	/** default constructor */
	public Ipfilter() {
	}

	/** full constructor */
	public Ipfilter(String ip, Integer id) {
		this.ip = ip;
		this.id = id;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "identity")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "id", unique = true, nullable = false)
	public Integer getid() {
		return this.id;
	}

	public void setid(Integer id) {
		this.id = id;
	}

	@Column(name = "ip", unique = true, length = 50)
	public String getip() {
		return this.ip;
	}

	public void setip(String ip) {
		this.ip = ip;
	}
}
