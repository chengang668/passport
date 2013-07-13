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

/**
 * UserGroup entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name="usergroup" ,catalog="passport")
public class UserGroup  implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	// Fields    

     private UserGroupId id;
     private User user;
     private Groups group;

    // Constructors

    /** default constructor */
    public UserGroup() {
    }

    
    /** full constructor */
    public UserGroup(UserGroupId id, User user, Groups group) {
        this.id = id;
        this.user = user;
        this.group = group;
    }

   
    // Property accessors
    @EmbeddedId
    @AttributeOverrides( {
    	@AttributeOverride(name="userid", column=@Column(name="userid", nullable=false, length=20) ), 
    	@AttributeOverride(name="groupid", column=@Column(name="groupid", nullable=false) ) } )

    public UserGroupId getId() {
        return this.id;
    }
    
    public void setId(UserGroupId id) {
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
    @JoinColumn(name="groupid", nullable=false, insertable=false, updatable=false)
    public Groups getGroup() {
        return this.group;
    }

    public void setGroup(Groups group) {
        this.group = group;
    }

}