package first.java.web.application;
 
import  org.junit.Before;
import  org.junit.Test;
import  org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.io.StringWriter;
 
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

 
public class CouponServletTest {
 
    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;
    @Mock private RequestDispatcher requestDispatcher;

 
    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void doGet() throws Exception {
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(printWriter);
        
        new CouponServlet().doGet(request, response);

        assertEquals("SUPERSALE", stringWriter.toString());
    }
 
}