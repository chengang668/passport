package privilege.database;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
 
@Entity
@Table(name = "CG_LEVEL")
public class Level implements Serializable {
    private Long levelid;
    private String levelname;
    private String description;
 
    public Level() {
    }
 
    public Level(Long levelid) {
       this.levelid = levelid;
    }
 
    public Level(Long levelid, String levelname, String description) {
       this.levelid = levelid;
       this.levelname = levelname;
       this.description = description;
    }
 
    @Id
    @Column(name = "LEVELID", unique = true, nullable = false, precision = 5, scale = 0)
    public Long getLevelid() {
       return this.levelid;
    }
 
    public void setLevelid(Long levelid) {
       this.levelid = levelid;
    }
 
    @Column(name = "LEVELNAME", length = 64)
    public String getLevelname() {
       return this.levelname;
    }
 
    public void setLevelname(String levelname) {
       this.levelname = levelname;
    }
 
    @Column(name = "DESCRIPTION", length = 256)
    public String getDescription() {
       return this.description;
    }
 
    public void setDescription(String description) {
       this.description = description;
    }
}
