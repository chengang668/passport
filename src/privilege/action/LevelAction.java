package privilege.action;

import java.util.List;
import java.util.ArrayList;
import javax.servlet.http.HttpSession;
import org.apache.struts2.ServletActionContext;
import net.sf.json.JSONArray;
import privilege.database.Level;
import privilege.service.*;
import commons.utils.action.ExtJSONActionSuport;

public class LevelAction extends ExtJSONActionSuport {
	private static final long serialVersionUID = 1L;
	private Level level = null;
	private List<Level> levels = new ArrayList<Level>(0);
	private ILevelService levelService = null;
	private String delData;

	public String execute() {
		return this.SUCCESS;
	}

	@Override
	public String jsonExecute() throws Exception {
		if (this.getDelData() != null && !"".equals(this.getDelData())) {
			if (this.getDelData().indexOf(",") < 0) {
				this.levelService.removeLevelById(Long.parseLong(this
						.getDelData()));
				System.out.println("del_id:" + getDelData());
			} else {
				String id[] = this.getDelData().split(",");
				for (int i = 0; i < id.length; i++) {
					System.out.println("del:" + id[i]);
					this.levelService.removeLevelById(Long.parseLong(id[i]));
				}
			}
		}
		HttpSession session = ServletActionContext.getRequest().getSession();
		Object o = null;// session.getAttribute("Level_Data1");
		if (o == null) {
			try {
				this.levels = this.getLevelService().findAllLevels();
				session.setAttribute("Level_Data1", this.levels);
				System.out.println("query database");
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {
			this.setLevels(((List<Level>) o));
		}
		this.setTotalCount(this.levels.size());
		JSONArray array = JSONArray.fromObject(this.levels);
		// System.out.println(this.getStart() + "---" + this.getLimit());
		this.setJsonString("{success:true,totalCount : " + this.getTotalCount()
				+ ", list:" + array.toString() + "}");
		// System.out.println(this.getJsonString());
		return super.jsonExecute();
	}

	/**
	 * Find an entity by its id (primary key).
	 * 
	 * @param id
	 * @return The found entity instance or null if the entity does not exist.
	 */
	public String findLevelById(Long id) {
		try {
			this.level = this.getLevelService().findLevelById(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.levels);
		this.setJsonString(array.toString());
		return SUCCESS;
	}

	public String findLevelById() {
		System.out.println(this.level.getLevelid());
		try {
			this.level = this.getLevelService().findLevelById(
					this.level.getLevelid());
		} catch (Exception e) {
			e.printStackTrace();
		}
		JSONArray array = JSONArray.fromObject(this.level);
		this.setJsonString(array.toString());
		this.setJsonString("{success:true,totalCount:1,list:"
				+ array.toString() + "}");
		System.out.println(array.toString());
		return SUCCESS;
	}

	/**
	 * @return Return all persistent instances of the <code>Level</code> entity.
	 */
	public String getAllLevels() {
		try {
			this.levels = this.getLevelService().findAllLevels();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	/**
	 * Make the given instance managed and persistent.
	 * 
	 * @return
	 */
	public String persistLevel() {
		System.out.println(this.level.getLevelid() + "---"
				+ this.level.getLevelname() + "---"
				+ this.level.getDescription());
		this.setJsonString("{success:true}");
		try {
			this.getLevelService().persistLevel(this.getLevel());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	/**
	 * Remove the given persistent instance.
	 * 
	 * @return
	 */
	public String removeLevel() {
		try {
			this.getLevelService().removeLevel(this.getLevel());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	/**
	 * Remove an entity by its id (primary key). *
	 * 
	 * @return
	 */
	public String removeLevelById(Long id) {
		try {
			this.getLevelService().removeLevelById(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return SUCCESS;
	}

	public Level getLevel() {
		return level;
	}

	public void setLevel(Level level) {
		this.level = level;
	}

	public List<Level> getLevels() {
		return levels;
	}

	public void setLevels(List<Level> levels) {
		this.levels = levels;
	}

	public ILevelService getLevelService() {
		return levelService;
	}

	public void setLevelService(ILevelService levelService) {
		this.levelService = levelService;
	}

	public String getDelData() {
		return delData;
	}

	public void setDelData(String delData) {
		this.delData = delData;
	}
}
