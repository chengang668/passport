package com.cg.passportmanagement.database;

import javax.persistence.Column;
import javax.persistence.Embeddable;


/**
 * UserPassportAclId entity. @author MyEclipse Persistence Tools
 */
@Embeddable

public class UserPassportAclId  implements java.io.Serializable {


    // Fields    

     private String userid;
     private Integer passportid;


    // Constructors

    /** default constructor */
    public UserPassportAclId() {
    }

    
    /** full constructor */
    public UserPassportAclId(String userid, Integer passportid) {
        this.userid = userid;
        this.passportid = passportid;
    }

   
    // Property accessors

    @Column(name="userid", nullable=false, length=20)

    public String getUserid() {
        return this.userid;
    }
    
    public void setUserid(String userid) {
        this.userid = userid;
    }

    @Column(name="passportid", nullable=false)

    public Integer getPassportid() {
        return this.passportid;
    }
    
    public void setPassportid(Integer passportid) {
        this.passportid = passportid;
    }
   



   public boolean equals(Object other) {
         if ( (this == other ) ) return true;
		 if ( (other == null ) ) return false;
		 if ( !(other instanceof UserPassportAclId) ) return false;
		 UserPassportAclId castOther = ( UserPassportAclId ) other; 
         
		 return ( (this.getUserid()==castOther.getUserid()) || ( this.getUserid()!=null && castOther.getUserid()!=null && this.getUserid().equals(castOther.getUserid()) ) )
 && ( (this.getPassportid()==castOther.getPassportid()) || ( this.getPassportid()!=null && castOther.getPassportid()!=null && this.getPassportid().equals(castOther.getPassportid()) ) );
   }
   
   public int hashCode() {
         int result = 17;
         
         result = 37 * result + ( getUserid() == null ? 0 : this.getUserid().hashCode() );
         result = 37 * result + ( getPassportid() == null ? 0 : this.getPassportid().hashCode() );
         return result;
   }   





}