package etc.cmu.edu.pictureyourself;

public class Model {
    private static Model _instance;

    public static Model instance() {
        if (_instance == null)
            _instance = new Model();
        return _instance;
    }

    public boolean isUpdate;
    public String country;
}
