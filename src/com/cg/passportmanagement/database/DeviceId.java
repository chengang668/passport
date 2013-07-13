package com.cg.passportmanagement.database;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * DevicesId entity. @author MyEclipse Persistence Tools
 */
@Embeddable
public class DeviceId implements java.io.Serializable {

	// Fields

	//cg private Integer passportid;
	private Passport passport;
	private Integer portid;

	// Constructors

	/** default constructor */
	public DeviceId() {
	}

	/** full constructor */
	public DeviceId(Passport passport, Integer portid) {
		this.passport = passport;
		this.portid = portid;
	}

	// Property accessors

/*cg	@Column(name = "passportid", nullable = false)
	public Integer getPassportid() {
		return this.passportid;
	}

	public void setPassportid(Integer passportid) {
		this.passportid = passportid;
	}*/
	
	@ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="passportid", nullable = true)
	public Passport getPassport() {
		return passport;
	}

	public void setPassport(Passport passport) {
		this.passport = passport;
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
		if (!(other instanceof DeviceId))
			return false;
		DeviceId castOther = (DeviceId) other;

		return ((this.getPassport().getPassportid() == castOther.getPassport().getPassportid()) || (this
				.getPassport().getPassportid() != null
				&& castOther.getPassport().getPassportid() != null && this.getPassport().getPassportid()
				.equals(castOther.getPassport().getPassportid())))
				&& ((this.getPortid() == castOther.getPortid()) || (this.getPortid() != null
						&& castOther.getPortid() != null && this.getPortid()
						.equals(castOther.getPortid())));
	}

	public int hashCode() {
		int result = 17;

		result = 37
				* result
				+ (getPassport().getPassportid() == null ? 0 : this.getPassport().getPassportid()
						.hashCode());
		result = 37 * result
				+ (getPortid() == null ? 0 : this.getPortid().hashCode());
		return result;
	}

}