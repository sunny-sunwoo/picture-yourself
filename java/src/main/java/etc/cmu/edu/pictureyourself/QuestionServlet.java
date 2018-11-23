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

import org.json.JSONObject;

public class QuestionServlet extends HttpServlet {
    private static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    private static final String DB_NAME = "picture";
    private static final String URL = "jdbc:mysql://localhost/" + DB_NAME + "?useSSL=false";
    private static final String DB_USER = "pictureyourself", 
            DB_PWD = "pictureyourself";
    private static Connection conn;

    public QuestionServlet() throws ClassNotFoundException, SQLException {
        Class.forName(JDBC_DRIVER);
        conn = DriverManager.getConnection(URL, DB_USER, DB_PWD);
    } 

    @Override
    protected void doGet(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException {
        JSONObject result = new JSONObject();
        String country = request.getParameter("country");
        String interest = request.getParameter("interest");
        int id = Integer.valueOf(request.getParameter("id"));
        //System.out.println("country " + country);
        //System.out.println("id " + id);
        //String query = "update users set country = ? where id = ?";
        List<String> queries = new ArrayList<>();
        if (country != null) queries.add("country = ?");
        if (interest != null) queries.add("interest = ?");
        if (queries.size() == 0) {
            result.put("ok", 0);
        } else {
            try {
                String query = "update users set " + String.join(", ", queries) + " where id = ?";
                //System.out.println(country);
                //System.out.println(interest);
                //System.out.println(query);
                PreparedStatement pstmt = conn.prepareStatement(query);
                int i = 1;
                if (country != null) pstmt.setString(i++, country);
                if (interest != null) pstmt.setString(i++, interest);
                pstmt.setInt(i, id);
                int row = pstmt.executeUpdate();
                //System.out.println("row " + row);
                if (row != 0)
                    result.put("ok", 1);
                else
                    result.put("ok", 0);

                if (row != 0) {
                    Model.instance().isUpdate = true;
                    if (country != null) Model.instance().country = country;
                    if (interest != null) Model.instance().interest = interest;
                }
            } catch (SQLException e) {
                e.printStackTrace();
                result.put("ok", 0);
            }
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
