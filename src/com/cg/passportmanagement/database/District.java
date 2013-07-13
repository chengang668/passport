package com.cg.passportmanagement.database;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import org.hibernate.annotations.GenericGenerator;


/**
 * Site entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name="district",catalog="passport", uniqueConstraints = @UniqueConstraint(columnNames="districtname"))

public class District  implements java.io.Serializable {


    // Fields    

     private Integer districtid;
     private String districtname;
     private String address;
     // private Set<passport> passports = new HashSet<passport>(0);


    // Constructors

    /** default constructor */
    public District() {
    }

    
    /** full constructor */
    public District(String districtname, String address) {
        this.districtname = districtname;
        this.address = address;
        // this.passports = passports;
    }

   
    // Property accessors
    @GenericGenerator(name="generator", strategy="increment")
    @Id 
    @GeneratedValue(generator="generator")    
    @Column(name="districtid", unique=true, nullable=false)

    public Integer getDistrictid() {
        return this.districtid;
    }
    
    public void setDistrictid(Integer districtid) {
        this.districtid = districtid;
    }
    
    @Column(name="districtname", unique=true, length=50)

    public String getDistrictname() {
        return this.districtname;
    }
    
    public void setDistrictname(String districtname) {
        this.districtname = districtname;
    }
    
    @Column(name="address", length=100)

    public String getAddress() {
        return this.address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }

	/*

	/// @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "district")
	/// public Set<Manager> getManagers() {
	///	return this.managers;
	/// }

	/// public void setManagers(Set<Manager> managers) {
	///	this.managers = managers;
	/// }
	 * 
	 */

}