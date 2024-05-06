package lectures;


import beans.Car;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import mockdata.MockData;
import org.assertj.core.util.Lists;
import org.junit.Test;

public class Lecture8 {

  @Test
  public void simpleGrouping() throws Exception {
    Map<String, List<Car>> grouping = MockData.getCars().stream().collect(Collectors.groupingBy(car -> car.getMake()));
    grouping.forEach((make, cars) -> {
      System.out.println(make);
      cars.forEach(car -> System.out.println(car));
    });
  }

  @Test
  public void groupingAndCounting() throws Exception {
    ArrayList<String> names = Lists
        .newArrayList(
            "John",
            "John",
            "Mariam",
            "Alex",
            "Mohammado",
            "Mohammado",
            "Vincent",
            "Alex",
            "Alex"
        );
    Map<String, Long> counts = names.stream().collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
    counts.forEach((key, value) -> {
      System.out.println(key + ": " + value);
    });

  }

}