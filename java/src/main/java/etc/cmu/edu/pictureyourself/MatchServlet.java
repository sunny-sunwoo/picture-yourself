package etc.cmu.edu.pictureyourself;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

class User {
    public String photo;
    public int id;
    public String country;
    public String interest;
    public int score = 0;
}

public class MatchServlet extends HttpServlet {
    private static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    private static final String DB_NAME = "picture";
    private static final String URL = "jdbc:mysql://localhost/" + DB_NAME + "?useSSL=false";
    private static final String DB_USER = "pictureyourself", 
            DB_PWD = "pictureyourself";
    private static Connection conn;

    public MatchServlet() throws ClassNotFoundException, SQLException {
        Class.forName(JDBC_DRIVER);
        conn = DriverManager.getConnection(URL, DB_USER, DB_PWD);
    }   

    private JSONArray queryDefault() {
        JSONArray users = new JSONArray();
        try {
            String queryLatest = "select photo, id, country from users order by id desc limit 1;";
            PreparedStatement pstmtLatest = conn.prepareStatement(queryLatest);
            ResultSet rsLatest = pstmtLatest.executeQuery();
            int idLatest = -1; 
            if (rsLatest.next()) {
                idLatest = rsLatest.getInt("id");
            }   
            String query = "select photo, id, country from users where id between 0 and ? order by rand() limit 300;";
            PreparedStatement pstmt = conn.prepareStatement(query);
            pstmt.setInt(1, idLatest - 1);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                String photo = rs.getString("photo");
                String country = rs.getString("country");
                int id = rs.getInt("id");
                JSONObject user = new JSONObject();
                user.put("photo", photo);
                user.put("country", country);
                user.put("id", id);
                users.put(user);
            }
            if (idLatest != -1) {
                JSONObject userLatest = new JSONObject();
                userLatest.put("photo", rsLatest.getString("photo"));
                userLatest.put("country", rsLatest.getString("country"));
                userLatest.put("id", idLatest);
                users.put(userLatest);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return users;
    }

    private JSONArray query(String country, String interest) {
        JSONArray users = new JSONArray();
        try {
            List<String> queries = new ArrayList<>();
            if (country != null) queries.add("country = ?");
            if (interest != null) queries.add("interest = ?");
            String query = "select photo, id, country, interest from users where " + String.join(" or ", queries);
            PreparedStatement pstmt = conn.prepareStatement(query);
            int i = 1;
            if (country != null) pstmt.setString(i++, country);
            if (interest != null) pstmt.setString(i++, interest);
            ResultSet rs = pstmt.executeQuery();
            List<User> userList = new ArrayList<>();
            while (rs.next()) {
                User user = new User();
                user.photo = rs.getString("photo");
                user.id = rs.getInt("id");
                user.country = rs.getString("country");
                user.interest = rs.getString("interest");
                if (country != null && country.equals(user.country)) user.score++;
                if (interest != null && interest.equals(user.interest)) user.score++;
                userList.add(user);
            }
            Collections.sort(userList, new Comparator<User>(){
                public int compare(User a, User b) {
                    return b.score - a.score; 
                }   
            });
            for (User user : userList) {
                JSONObject obj = new JSONObject();
                obj.put("photo", user.photo);
                obj.put("country", user.country);
                obj.put("id", user.id);
                obj.put("interest", user.interest);
                users.put(obj);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return users;
    }

    @Override
    protected void doGet(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException {
        JSONObject result = new JSONObject();
        JSONArray users = null;
        String country = request.getParameter("country");
        String interest = request.getParameter("interest");

        if (country.equals("default")) {
            users = queryDefault();
        } else {
            users = query(country, interest);
        }
        result.put("postList", users);

        response.addHeader("Access-Control-Allow-Origin", "*");

        PrintWriter writer = response.getWriter();
        writer.write(result.toString());
        writer.close();
    }

    @Override
    protected void doPost(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
