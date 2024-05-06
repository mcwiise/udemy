package lectures;


import static org.assertj.core.api.Assertions.assertThat;

import beans.Car;
import beans.Person;
import beans.PersonDTO;
import com.google.common.collect.ImmutableList;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import mockdata.MockData;
import org.junit.Test;

public class Lecture5 {

  @Test
  public void understandingFilter() throws Exception {
    ImmutableList<Car> cars = MockData.getCars();
    Predicate<Car> filterPredicate = car -> car.getPrice() < 1000;
    List<Car> carsUnder1000 = cars.stream()
            .filter(filterPredicate)
            .collect(Collectors.toList());
    carsUnder1000.stream().forEach(car -> System.out.println(car));
  }

  @Test
  public void ourFirstMapping() throws Exception {
    // transform from one data type to another
    List<Person> people = MockData.getPeople();
    List<PersonDTO> dtos = people.stream().map(person -> {
      PersonDTO dto = new PersonDTO(person.getId(), person.getFirstName(), person.getAge());
      return dto;
    }).collect(Collectors.toList());
    dtos.stream().forEach(personDTO -> System.out.println(personDTO));
    assertThat(dtos.size()).isEqualTo(1000);
  }

  @Test
  public void averageCarPrice() throws Exception {
    // calculate average of car prices

  }

  @Test
  public void test() throws Exception {

  }
}



