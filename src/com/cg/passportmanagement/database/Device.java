package com.cg.passportmanagement.database;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Device entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "devices", catalog = "passport")
public class Device implements java.io.Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private DeviceId id;
	private String group;
	private String title;
	private String mode;
	private String port;
	private String protocol;
	private String serial_setting;
	private String passportip;

	// Constructors

	/** default constructor */
	public Device() {
	}

	/** minimal constructor */
	public Device(DeviceId id) {
		this.id = id;
	}

	/** full constructor */
	public Device(DeviceId id, String devicename, String owner,
			Site site , Dept dept ) {
		this.id = id;

	}

	// Property accessors
	@EmbeddedId
	@AttributeOverrides( {
			@AttributeOverride(name = "passportid", column = @Column(name = "passportid", nullable = false)),
			@AttributeOverride(name = "portid", column = @Column(name = "portid", nullable = false)) })
	public DeviceId getId() {
		return this.id;
	}

	public void setId(DeviceId id) {
		this.id = id;
	}

	@Column(name = "title", length = 50)
	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "grp", length = 50)
	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	@Column(name = "mode", length = 50)
	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	@Column(name = "port", length = 10)
	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	@Column(name = "protocol", length = 50)
	public String getProtocol() {
		return protocol;
	}

	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}

	@Column(name = "serial_setting", length = 50)
	public String getSerial_setting() {
		return serial_setting;
	}

	public void setSerial_setting(String serial_setting) {
		this.serial_setting = serial_setting;
	}

	@Column(name = "passportip", length = 16)
	public String getPassportip() {
		return passportip;
	}

	public void setPassportip(String passportip) {
		this.passportip = passportip;
	}
	
}