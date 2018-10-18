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

import org.json.JSONObject;

public class PictureServlet extends HttpServlet {
    private static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    private static final String DB_NAME = "picture";
    private static final String URL = "jdbc:mysql://localhost/" + DB_NAME + "?useSSL=false";
    private static final String DB_USER = "pictureyourself", 
            DB_PWD = "pictureyourself";
    private static Connection conn;

    public PictureServlet() throws ClassNotFoundException, SQLException {
        Class.forName(JDBC_DRIVER);
        conn = DriverManager.getConnection(URL, DB_USER, DB_PWD);
    }

    @Override
    protected void doGet(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException {
        JSONObject result = new JSONObject();
        String photo = request.getParameter("photo");
        System.out.println("photo " + photo);
        String query = "insert into users (photo) values (?);";
        try {
            PreparedStatement pstmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, photo);
            int row = pstmt.executeUpdate();
            System.out.println("row " + row);
            ResultSet rs = pstmt.getGeneratedKeys();
            if (rs.next()) {
                System.out.println(rs.getInt(1));
                result.put("id", rs.getInt(1));
            }
            else {
                System.out.println("insert err");
                result.put("id", -1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

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
