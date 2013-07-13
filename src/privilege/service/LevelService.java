package privilege.service;

import java.util.List;
import privilege.dao.*;
import privilege.database.Level;
import org.springframework.context.ApplicationContext;

public class LevelService implements ILevelService {
	private ILevelDAO dao;
	private static final String SERVICE_BEAN_ID = "LevelService";

	public LevelService() {
		super();
	}

	public static ILevelService getInstance(ApplicationContext context) {
		return (ILevelService) context.getBean(SERVICE_BEAN_ID);
	}

	public Level findLevelById(Long id) throws Exception {
		try {
			return getDao().findLevelById(id);
		} catch (RuntimeException e) {
			throw new Exception("findLevelById failed with the id " + id + ": "
					+ e.getMessage());
		}
	}

	public void persistLevel(Level level) throws Exception {
		try {
			getDao().persistLevel(level);
		} catch (RuntimeException e) {
			throw new Exception("persistLevel failed: " + e.getMessage());
		}
	}

	public void removeLevel(Level level) throws Exception {
		try {
			getDao().removeLevel(level);
		} catch (RuntimeException e) {
			throw new Exception("removeLevel failed: " + e.getMessage());
		}
	}

	public void removeLevelById(Long id) throws Exception {
		try {
			getDao().removeById(id);
		} catch (RuntimeException e) {
			throw new Exception("removeLevel failed: " + e.getMessage());
		}
	}

	public void setDao(ILevelDAO dao) {
		this.dao = dao;
	}

	public ILevelDAO getDao() {
		return this.dao;
	}

	public List<Level> findAllLevels() throws Exception {
		try{
			return getDao().findAllLevels();
		}catch (RuntimeException e) {
			throw new Exception("findAllLevels failed: " + e.getMessage());
		}
	}

	public List<Level> findLevelsByExample(Level level) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}
}