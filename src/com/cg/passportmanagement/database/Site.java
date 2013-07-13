package com.cg.passportmanagement.database;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import org.hibernate.annotations.GenericGenerator;


/**
 * Site entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name="site",catalog="passport", uniqueConstraints = @UniqueConstraint(columnNames="sitename"))

public class Site  implements java.io.Serializable {


    // Fields    

     private Integer siteid;
     private String sitename;
     private String address;
     private District district;
     // private Set<passport> passports = new HashSet<passport>(0);


    // Constructors

    /** default constructor */
    public Site() {
    }

    
    /** full constructor */
    public Site(String sitename, String address) {
        this.sitename = sitename;
        this.address = address; 
    }

   
    // Property accessors
    @GenericGenerator(name="generator", strategy="increment")
    @Id 
    @GeneratedValue(generator="generator")    
    @Column(name="siteid", unique=true, nullable=false)

    public Integer getSiteid() {
        return this.siteid;
    }
    
    public void setSiteid(Integer siteid) {
        this.siteid = siteid;
    }
    
    @Column(name="sitename", unique=true, length=50)

    public String getSitename() {
        return this.sitename;
    }
    
    public void setSitename(String sitename) {
        this.sitename = sitename;
    }
    
    @Column(name="address", length=100)

    public String getAddress() {
        return this.address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }

	@ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="districtid", nullable = true)
    public District getDistrict() {
        return this.district;
    }
    
    public void setDistrict(District district) {
        this.district = district;
    }
 

}