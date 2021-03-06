package commons.utils.action;

import com.opensymphony.xwork2.ActionSupport;

public class ExtJSONActionSuport extends ActionSupport {
	private int totalCount = 0;// 总数
	private transient int start = 0;// 开始数
	private transient int limit = 0;// 限制数量
	private String jsonString = "";

	public String getJsonString() {
		return jsonString;
	}

	public void setJsonString(String jsonString) {
		this.jsonString = jsonString;
	}
	
	public void setJsonErrorResponse(String cause) {
		this.jsonString = "{success:false, error:{reason:'" + cause + "'}}";
	}
	
	public String jsonExecute() throws Exception {
		return super.execute();
	}

	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}
}
