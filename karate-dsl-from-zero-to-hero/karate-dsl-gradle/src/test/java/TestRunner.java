import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class TestRunner {

    @Test
    public void testParallel() {
        Results results = Runner.path("classpath:features")
                .outputCucumberJson(true)
                .parallel(1);
        assertTrue(results.getFailCount() == 0, results.getErrorMessages());
        System.out.println(results.getErrors());
    }
}