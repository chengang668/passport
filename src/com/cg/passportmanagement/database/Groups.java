package com.cg.passportmanagement.database;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import org.hibernate.annotations.GenericGenerator;

/**
 * Usergroup entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "groups", catalog = "passport", uniqueConstraints = @UniqueConstraint(columnNames = "groupname"))
public class Groups implements java.io.Serializable {

	// Fields

	private Integer groupid;
	private String groupname;
	private String description;

	// Constructors

	/** default constructor */
	public Groups() {
	}

	/** full constructor */
	public Groups(String groupname, String description) {
		this.groupname = groupname;
		this.description = description;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "groupid", unique = true, nullable = false)
	public Integer getGroupid() {
		return this.groupid;
	}

	public void setGroupid(Integer groupid) {
		this.groupid = groupid;
	}

	@Column(name = "groupname", unique = true, length = 20)
	public String getGroupname() {
		return this.groupname;
	}

	public void setGroupname(String groupname) {
		this.groupname = groupname;
	}

	@Column(name = "description", length = 100)
	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}