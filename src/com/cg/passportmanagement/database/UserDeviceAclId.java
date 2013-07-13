package com.cg.passportmanagement.database;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 * UserDeviceAclId entity. @author MyEclipse Persistence Tools
 */
@Embeddable
public class UserDeviceAclId implements java.io.Serializable {

	// Fields

	private String userid;
	private Integer passportid;
	private Integer portid;

	// Constructors

	/** default constructor */
	public UserDeviceAclId() {
	}

	/** full constructor */
	public UserDeviceAclId(String userid, Integer passportid, Integer portid) {
		this.userid = userid;
		this.passportid = passportid;
		this.portid = portid;
	}

	// Property accessors

	@Column(name = "userid", nullable = false, length = 20)
	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	@Column(name = "passportid", nullable = false)
	public Integer getPassportid() {
		return this.passportid;
	}

	public void setPassportid(Integer passportid) {
		this.passportid = passportid;
	}

	@Column(name = "portid", nullable = false)
	public Integer getPortid() {
		return this.portid;
	}

	public void setPortid(Integer portid) {
		this.portid = portid;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof UserDeviceAclId))
			return false;
		UserDeviceAclId castOther = (UserDeviceAclId) other;

		return ((this.getUserid() == castOther.getUserid()) || (this
				.getUserid() != null
				&& castOther.getUserid() != null && this.getUserid().equals(
				castOther.getUserid())))
				&& ((this.getPassportid() == castOther.getPassportid()) || (this
						.getPassportid() != null
						&& castOther.getPassportid() != null && this
						.getPassportid().equals(castOther.getPassportid())))
				&& ((this.getPortid() == castOther.getPortid()) || (this
						.getPortid() != null
						&& castOther.getPortid() != null && this.getPortid()
						.equals(castOther.getPortid())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getUserid() == null ? 0 : this.getUserid().hashCode());
		result = 37
				* result
				+ (getPassportid() == null ? 0 : this.getPassportid()
						.hashCode());
		result = 37 * result
				+ (getPortid() == null ? 0 : this.getPortid().hashCode());
		return result;
	}

}