package com.cg.passportmanagement.database;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import org.hibernate.annotations.GenericGenerator;

/**
 * DigiLog entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "digi_log", catalog = "passport")
public class DigiLog implements java.io.Serializable {

	// Fields

	private Integer id;
	private String digiIp;
	private String userid;
	private Date dtime;
	private String content;

	// Constructors

	/** default constructor */
	public DigiLog() {
	}

	/** minimal constructor */
	public DigiLog(String digiIp) {
		this.digiIp = digiIp;
	}

	/** full constructor */
	public DigiLog(String digiIp, String userid, Date dtime, String content) {
		this.digiIp = digiIp;
		this.userid = userid;
		this.dtime = dtime;
		this.content = content;
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

	@Column(name = "digi_ip", nullable = false, length = 12)
	public String getDigiIp() {
		return this.digiIp;
	}

	public void setDigiIp(String digiIp) {
		this.digiIp = digiIp;
	}

	@Column(name = "userid", length = 20)
	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "dtime", length = 0)
	public Date getDtime() {
		return this.dtime;
	}

	public void setDtime(Date dtime) {
		this.dtime = dtime;
	}

	@Column(name = "content", length = 200)
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}