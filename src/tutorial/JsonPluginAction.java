package tutorial;

import java.util.ArrayList;
import java.util.List;

import com.opensymphony.xwork2.ActionSupport;
import com.googlecode.jsonplugin.annotations.JSON;

public class JsonPluginAction extends ActionSupport 
{
	  private static final long serialVersionUID = -6784977600668791997L;
	    
	    private int bookId;
	    private String title;
	    private double price;
	    private List<String> comments;    
	    private transient String secret1;
	    private String secret2;

	    @JSON(name="ISBN")
	    public int getBookId() {
	        return bookId;
	    }

	    public void setBookId(int bookId) {
	        this.bookId = bookId;
	    }

	    public List<String> getComments() {
	        return comments;
	    }

	    public void setComments(List<String> comments) {
	        this.comments = comments;
	    }

	    public double getPrice() {
	        return price;
	    }

	    public void setPrice(double price) {
	        this.price = price;
	    }

	    public String getTitle() {
	        return title;
	    }
	    
	    public void setTitle(String title) {
	        this.title = title;
	    }

	    @Override
	    public String execute() {
	        bookId = 15645912;
	        title = "Max On Java";
	        price = 0.9999d;
	        comments = new ArrayList<String>(3);
	        comments.add("It's no bad!");
	        comments.add("WOW!");
	        comments.add("No comment!");
	        secret1 = "You can't see me!";
	        secret2 = "I am invisible!";
	        return SUCCESS;
	    }

}
