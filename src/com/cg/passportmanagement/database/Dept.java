package com.cg.passportmanagement.database;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import org.hibernate.annotations.GenericGenerator;

/**
 * Dept entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "dept", catalog = "passport", uniqueConstraints = @UniqueConstraint(columnNames = "deptname"))
public class Dept implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
	// Fields	
	private Integer deptid;
	private String deptname;
	private String address;
	private Integer upperdeptid; 
	// Constructors

	/** default constructor */
	public Dept() {
	}

	/** full constructor */
	public Dept(String deptname, Integer upperdeptid) {
		this.deptname = deptname;
		this.upperdeptid = upperdeptid;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "deptid", unique = true, nullable = false)
	public Integer getDeptid() {
		return this.deptid;
	}

	public void setDeptid(Integer deptid) {
		this.deptid = deptid;
	}

	@Column(name = "deptname", unique = true, length = 50)
	public String getDeptname() {
		return this.deptname;
	}

	public void setDeptname(String deptname) {
		this.deptname = deptname;
	}

	@Column(name = "upperdeptid")
	public Integer getUpperdeptid() {
		return this.upperdeptid;
	}

	public void setUpperdeptid(Integer upperdeptid) {
		this.upperdeptid = upperdeptid;
	}


	@Column(name = "address", length = 200)
	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

}
