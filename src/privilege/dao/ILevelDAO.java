package privilege.dao;

import java.util.List;

import privilege.database.Level;

public interface ILevelDAO {
	public Level findLevelById(Long id);

	public List<Level> findAllLevels();

	public void persistLevel(Level level);

	public void removeLevel(Level level);

	public void removeById(Long id);
}