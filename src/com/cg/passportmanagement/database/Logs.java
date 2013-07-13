package com.cg.passportmanagement.database;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

/**
 * Logs entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "logs", catalog = "passport")
public class Logs implements java.io.Serializable {

	// Fields

	private Integer id;
	private String host;
	private String facility;
	private String priority;
	private String level;
	private String tag;
	private String datetime;
	private String program;
	private String msg;

	// Constructors

	/** default constructor */
	public Logs() {
	}

	/** minimal constructor */
	public Logs(Integer id) {
		this.id = id;
	}

	/** full constructor */
	public Logs(Integer id, String host, String facility, String priority,
			String level, String tag, String datetime, String program,
			String msg) {
		this.id = id;
		this.host = host;
		this.facility = facility;
		this.priority = priority;
		this.level = level;
		this.tag = tag;
		this.datetime = datetime;
		this.program = program;
		this.msg = msg;
	}

	// Property accessors
	@GenericGenerator(name="generator", strategy = "identity")
	@Id 
	@GeneratedValue(generator="generator")
	@Column(name = "id", unique = true, nullable = false)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "host", length = 50)
	public String getHost() {
		return this.host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	@Column(name = "facility", length = 50)
	public String getFacility() {
		return this.facility;
	}

	public void setFacility(String facility) {
		this.facility = facility;
	}

	@Column(name = "priority", length = 20)
	public String getPriority() {
		return this.priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	@Column(name = "level", length = 20)
	public String getLevel() {
		return this.level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	@Column(name = "tag", length = 20)
	public String getTag() {
		return this.tag;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}

	@Column(name = "datetime", length = 20)
	public String getDatetime() {
		return this.datetime;
	}

	public void setDatetime(String datetime) {
		this.datetime = datetime;
	}

	@Column(name = "program", length = 50)
	public String getProgram() {
		return this.program;
	}

	public void setProgram(String program) {
		this.program = program;
	}

	@Column(name = "msg", length = 200)
	public String getMsg() {
		return this.msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

}