package lectures;


import static org.assertj.core.api.Assertions.assertThat;

import beans.Car;
import beans.Person;
import com.google.common.collect.ImmutableList;
import java.math.BigDecimal;
import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.stream.Collectors;
import mockdata.MockData;
import org.junit.Test;

public class Lecture7 {

  @Test
  public void count() throws Exception {
    List<Person> people = MockData.getPeople();
    long ageCount = people.stream().filter(person -> person.getAge()>18).count();
    System.out.println(ageCount);
  }

  @Test
  public void min() throws Exception {
    double cheapestYellowCar = MockData.getCars().stream()
            .filter(car -> car.getColor().equalsIgnoreCase("yellow"))
            .mapToDouble(car -> car.getPrice())
            .min().getAsDouble();
    System.out.println(cheapestYellowCar);
  }

  @Test
  public void max() throws Exception {
    double theMostExpensiveYellowCar = MockData.getCars().stream()
            .filter(car -> car.getColor().equalsIgnoreCase("yellow"))
            .mapToDouble(car -> car.getPrice())
            .max()
            .getAsDouble();
    System.out.println(theMostExpensiveYellowCar);
  }


  @Test
  public void average() throws Exception {
    List<Car> cars = MockData.getCars();
    double averagePrice = cars.stream()
            .mapToDouble(car -> car.getPrice())
            .average()
            .orElse(0);
    System.out.println(averagePrice);
  }

  @Test
  public void sum() throws Exception {
    List<Car> cars = MockData.getCars();
    double sum = cars.stream()
        .mapToDouble(Car::getPrice)
        .sum();
    BigDecimal bigDecimalSum = BigDecimal.valueOf(sum);
    System.out.println(sum);
    System.out.println(bigDecimalSum);

  }

  @Test
  public void statistics() throws Exception {
    List<Car> cars = MockData.getCars();
    DoubleSummaryStatistics statistics = cars.stream()
        .mapToDouble(Car::getPrice)
        .summaryStatistics();
    System.out.println(statistics);
    System.out.println(statistics.getAverage());
    System.out.println(statistics.getCount());
    System.out.println(statistics.getMax());
    System.out.println(statistics.getMin());
    System.out.println(statistics.getSum());
  }

}