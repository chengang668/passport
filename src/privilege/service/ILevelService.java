package privilege.service;

import java.util.List;
import privilege.database.Level;

public interface ILevelService {
	public Level findLevelById(Long id) throws Exception;

	public List<Level> findAllLevels() throws Exception;

	public List<Level> findLevelsByExample(Level level) throws Exception;

	public void persistLevel(Level level) throws Exception;

	public void removeLevel(Level level) throws Exception;

	public void removeLevelById(Long id) throws Exception;
}
