package first.java.web.application;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/coupon")
public class CouponServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        	response.getWriter().print("SUPERSALE");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
       String coupon = request.getParameter("coupon");
       request.setAttribute("discount","Discount for coupon "+coupon+" is 50%" );
       request.getRequestDispatcher("response.jsp").forward(request,response);
    }
}