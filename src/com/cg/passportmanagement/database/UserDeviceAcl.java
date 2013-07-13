package com.cg.passportmanagement.database;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * UserDeviceAcl entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "user_device_acl", catalog = "passport")
public class UserDeviceAcl implements java.io.Serializable {

	// Fields

	private UserDeviceAclId id;
	private User user;
	private Device device;
	private String username;
	private String pwd;

	// Constructors

	/** default constructor */
	public UserDeviceAcl() {
	}

	/** minimal constructor */
	public UserDeviceAcl(UserDeviceAclId id, User user, Device device) {
		this.id = id;
		this.user = user;
		this.device = device;
	}

	/** full constructor */
	public UserDeviceAcl(UserDeviceAclId id, User user, Device device,
			String username, String pwd) {
		this.id = id;
		this.user = user;
		this.device = device;
		this.username = username;
		this.pwd = pwd;
	}

	// Property accessors
	@EmbeddedId
	@AttributeOverrides( {
			@AttributeOverride(name = "userid", column = @Column(name = "userid", nullable = false, length = 20)),
			@AttributeOverride(name = "passportid", column = @Column(name = "passportid", nullable = false)),
			@AttributeOverride(name = "portid", column = @Column(name = "portid", nullable = false)) })
	public UserDeviceAclId getId() {
		return this.id;
	}

	public void setId(UserDeviceAclId id) {
		this.id = id;
	}
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "userid", nullable = false, insertable = false, updatable = false)
	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumns( {
			@JoinColumn(name = "passportid", referencedColumnName = "passportid", nullable = false, insertable = false, updatable = false),
			@JoinColumn(name = "portid", referencedColumnName = "portid", nullable = false, insertable = false, updatable = false) })
	public Device getDevice() {
		return this.device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}

	@Column(name = "username", length = 50)
	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Column(name = "pwd", length = 100)
	public String getPwd() {
		return this.pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

}