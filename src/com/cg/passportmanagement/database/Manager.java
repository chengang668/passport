package com.cg.passportmanagement.database;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

/**
 * Manager entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "manager", catalog = "passport")
public class Manager implements java.io.Serializable {

	// Fields

	private Integer id;
	private Dept dept;
	private Site site;
	private String name;

	// Constructors

	/** default constructor */
	public Manager() {
	}

	/** minimal constructor */
	public Manager(Dept dept, Site site) {
		this.dept = dept;
		this.site = site;
	}

	/** full constructor */
	public Manager(Dept dept, Site site, String name) {
		this.dept = dept;
		this.site = site;
		this.name = name;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "id", unique = true, nullable = false)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "deptid", nullable = false)
	public Dept getDept() {
		return this.dept;
	}

	public void setDept(Dept dept) {
		this.dept = dept;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "siteid", nullable = false)
	public Site getSite() {
		return this.site;
	}

	public void setSite(Site site) {
		this.site = site;
	}

	@Column(name = "name", length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

}