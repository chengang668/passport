package com.cg.passportmanagement.database;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity; 
import javax.persistence.FetchType;
import javax.persistence.Id; 
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import com.cg.passportmanagement.common.BaseEncoderUtil;

/**
 * user entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name="user", catalog="passport")
public class User implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	
	public static final short USER_STATUS_NEW = 0;
	public static final short USER_STATUS_VALID = 1;
	public static final short USER_STATUS_PWD_EXPIRED = 2;
	public static final short USER_STATUS_LOCKED = 3;
	
	private transient String clientip; // not stored in db, but for session use only...
	// Fields    

     private String userid;
     private String passwd;
     private String fullname;
     private Date lastlogin;
     private short status;
     private Date createtime;
     private long loginretry;
     private Date pwdexpiredate;
     private Date lockexpiredate;
     private String oldpasswds;

     private Groups groups;
     // private Set<UserPassportAcl> userPassportAcls = new HashSet<UserPassportAcl>(0);

    // Constructors

    /** default constructor */
    public User() {
    }

	/** minimal constructor */
    public User(String fullname) {
        this.fullname = fullname;
    }
    
    /** full constructor */
    public User(String passwd, String fullname, Date lastlogin, Byte status, Date createtime) {
        this.passwd = passwd;
        this.fullname = fullname;
        this.lastlogin = lastlogin;
        this.status = status;
        this.createtime = createtime;
    }

   
    // Property accessors
    @Id 
    @Column(name = "USERID", unique = true, nullable = false, length=20)
    public String getUserid() {
        return this.userid;
    }
    
    public void setUserid(String userid) {
        this.userid = userid;
    }
    
    @Column(name="passwd", length=100)

    public String getPasswd() {
        return this.passwd;
    }
    
    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }
    
    @Column(name="fullname", nullable=false, length=20)

    public String getFullname() {
        return this.fullname;
    }
    
    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="lastlogin", length=0)
    public Date getLastlogin() {
        return this.lastlogin;
    }
    
    public void setLastlogin(Date lastlogin) {
        this.lastlogin = lastlogin;
    }

    @Column(name="status")
    public short getStatus() {
        return this.status;
    }
    
    public void setStatus(short status) {
        this.status = status;
    }
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="createtime", length=0)
    public Date getCreatetime() {
        return this.createtime;
    }
    
    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    
	@ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="groupid", nullable = true)
	public Groups getGroups() {
		return groups;
	}

	public void setGroups(Groups groups) {
		this.groups = groups;
	}

    /*
    @OneToMany(cascade=CascadeType.ALL,
    		fetch=FetchType.LAZY, mappedBy="user")
    public Set<UserPassportAcl> getUserPassportAcls() {
        return this.userPassportAcls;
    }

    public void setUserPassportAcls(Set<UserPassportAcl> userPassportAcls) {
        this.userPassportAcls = userPassportAcls;
    } */
	
    
    @Transient
    public String getClientip() {
		return clientip;
	}

	public void setClientip(String clientip) {
		this.clientip = clientip;
	}

	public long getLoginretry() {
		return loginretry;
	}

	public void setLoginretry(long loginretry) {
		this.loginretry = loginretry;
	}

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="pwdexpiredate", length=0)
	public Date getPwdexpiredate() {
		return pwdexpiredate;
	}

	public void setPwdexpiredate(Date pwdexpiredate) {
		this.pwdexpiredate = pwdexpiredate;
	}
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="lockexpiredate", length=0)
	public Date getLockexpiredate() {
		return lockexpiredate;
	}

	public void setLockexpiredate(Date date) {
		this.lockexpiredate = date;
	}

	
    public String getOldpasswds() {
		return oldpasswds;
	}

	public void setOldpasswds(String oldpasswds) {
		this.oldpasswds = oldpasswds;
	}

	public String DecodedPasswd() {
    	if (passwd!=null && !passwd.isEmpty())
    		return BaseEncoderUtil.getFromBASE64(this.passwd);
    	return null;
    }
    
	public void EncodePasswd(String newpasswd) {
		// String oldpwd = this.passwd;
        this.passwd = BaseEncoderUtil.getBASE64(newpasswd);
        
        // save up to 5 passwords in the history
        if (oldpasswds==null || oldpasswds.trim().isEmpty()){
        	oldpasswds = this.passwd;
        	return;
        }
        
        String[] arr = oldpasswds.split(" ");
        if (arr!=null && arr.length > 4) {
        	oldpasswds = "";
        	for (int i=arr.length -4; i<arr.length; i++)
        	{
        		oldpasswds += (arr[i] + " ");
        	}
        	oldpasswds = oldpasswds.trim();
        }
        this.oldpasswds += " " + this.passwd;  
    	oldpasswds = oldpasswds.trim();
    }
	
	public boolean isInOldPasswds(String newpwd){
		if (oldpasswds==null || oldpasswds.trim().isEmpty())
			return false;
		
		String[] pwds = oldpasswds.split(" ");
		for (int i=0; i<pwds.length; i++){
			if (BaseEncoderUtil.getFromBASE64(pwds[i]).equals(newpwd)){
				return true;
			}
		}
		return false;
	}
}