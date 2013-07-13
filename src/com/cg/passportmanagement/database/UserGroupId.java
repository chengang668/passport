package com.cg.passportmanagement.database;

import javax.persistence.Column;
import javax.persistence.Embeddable;


/**
 * UserGroupId entity. @author MyEclipse Persistence Tools
 */
@Embeddable

public class UserGroupId  implements java.io.Serializable {


    // Fields    

     private String userid;
     private Integer groupid;


    // Constructors

    /** default constructor */
    public UserGroupId() {
    }

    
    /** full constructor */
    public UserGroupId(String userid, Integer groupid) {
        this.userid = userid;
        this.groupid = groupid;
    }

   
    // Property accessors

    @Column(name="userid", nullable=false, length=20)

    public String getUserid() {
        return this.userid;
    }
    
    public void setUserid(String userid) {
        this.userid = userid;
    }

    @Column(name="groupid", nullable=false)

    public Integer getGroupid() {
        return this.groupid;
    }
    
    public void setGroupid(Integer groupid) {
        this.groupid = groupid;
    }
   



   public boolean equals(Object other) {
         if ( (this == other ) ) return true;
		 if ( (other == null ) ) return false;
		 if ( !(other instanceof UserGroupId) ) return false;
		 UserGroupId castOther = ( UserGroupId ) other; 
         
		 return ( (this.getUserid()==castOther.getUserid()) || ( this.getUserid()!=null && castOther.getUserid()!=null && this.getUserid().equals(castOther.getUserid()) ) )
 && ( (this.getGroupid()==castOther.getGroupid()) || ( this.getGroupid()!=null && castOther.getGroupid()!=null && this.getGroupid().equals(castOther.getGroupid()) ) );
   }
   
   public int hashCode() {
         int result = 17;
         
         result = 37 * result + ( getUserid() == null ? 0 : this.getUserid().hashCode() );
         result = 37 * result + ( getGroupid() == null ? 0 : this.getGroupid().hashCode() );
         return result;
   }   





}