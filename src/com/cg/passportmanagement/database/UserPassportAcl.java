package com.cg.passportmanagement.database;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.cg.passportmanagement.common.BaseEncoderUtil;

/**
 * UserPassportAcl entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name="user_passport_acl" ,catalog="passport")
public class UserPassportAcl  implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	// Fields    

	private UserPassportAclId id;
	private User user;
	private Passport passport;
     
 	private String username;
	private String pwd;
    // Constructors

    /** default constructor */
    public UserPassportAcl() {
    }

    
    /** full constructor */
    public UserPassportAcl(UserPassportAclId id, User user, Passport passport) {
        this.id = id;
        this.user = user;
        this.passport = passport;
    }

   
    // Property accessors
    @EmbeddedId
    @AttributeOverrides( {
    	@AttributeOverride(name="userid", column=@Column(name="userid", nullable=false, length=20) ), 
    	@AttributeOverride(name="passportid", column=@Column(name="passportid", nullable=false) ) } )

    public UserPassportAclId getId() {
        return this.id;
    }
    
    public void setId(UserPassportAclId id) {
        this.id = id;
    }
    
	@ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="userid", nullable=false, insertable=false, updatable=false)
    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    
	@ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="passportid", nullable=false, insertable=false, updatable=false)
    public Passport getPassport() {
        return this.passport;
    }

    public void setPassport(Passport passport) {
        this.passport = passport;
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
	
	public String DecodedPwd() {
		if (this.pwd!=null)
			return BaseEncoderUtil.getFromBASE64(this.pwd);
		return null;
	}
	public void EncodeAndSetPwd(String pwd) {
		this.pwd = BaseEncoderUtil.getBASE64(pwd);
	}
	
}