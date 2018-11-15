package etc.cmu.edu.pictureyourself;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

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

    @Override
    protected void doGet(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException {
        JSONObject result = new JSONObject();
        JSONArray users = new JSONArray();
        result.put("postList", users);
        String country = request.getParameter("country");
        //System.out.println("country " + country);
        String query = "select photo, id from users where country = ?;";
        
        try {
            String queryLatest = "select photo, id from users order by id desc limit 1;";
            PreparedStatement pstmtLatest = conn.prepareStatement(queryLatest);
            ResultSet rsLatest = pstmtLatest.executeQuery();
            int idLatest = -1;
            if (rsLatest.next()) {
                idLatest = rsLatest.getInt("id");
                //System.out.println("idLatest= " + idLatest);
            }
            if (country.equals("default")) {
                query = "select photo, id from users where id between 0 and ? order by rand() limit 300;";
            }

            PreparedStatement pstmt = conn.prepareStatement(query);
            if (!country.equals("default"))
                pstmt.setString(1, country);
            else
                pstmt.setInt(1, idLatest - 1);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                String photo = rs.getString("photo");
                int id = rs.getInt("id");
                //System.out.println("photo " + photo);
                //System.out.println("id " + id);
                JSONObject user = new JSONObject();
                user.put("photo", photo);
                user.put("country", country);
                user.put("id", id);
                users.put(user);
            }
            if (idLatest != -1) {
                JSONObject userLatest = new JSONObject();
                userLatest.put("photo", rsLatest.getString("photo"));
                userLatest.put("country", country);
                userLatest.put("id", idLatest);
                users.put(userLatest);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

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
