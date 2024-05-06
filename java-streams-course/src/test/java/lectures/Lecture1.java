package lectures;

import static org.assertj.core.api.Assertions.assertThat;

import beans.Person;

import com.google.common.collect.ImmutableList;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import mockdata.MockData;
import org.assertj.core.util.Lists;
import org.junit.Test;


public class Lecture1 {

  @Test
  public void imperativeApproach() throws IOException {
    List<Person> people = MockData.getPeople();
    List<Person> peopleUnder18 = new ArrayList<>();

    // 1. Find people aged less or equal 18
    // 2. Then change implementation to find first 10 people
    int limit = 0;
    for(int i=0; i<people.size(); i++){
      Person currentPerson = people.get(i);
      if(currentPerson.getAge().intValue()<=18){
        if(limit <=10 ){
          peopleUnder18.add(currentPerson);
          limit= limit+1;
        }
      }
    }

    for(Person under18 : peopleUnder18){
      System.out.println(under18);
    }
  }

  @Test
  public void declarativeApproachUsingStreams() throws Exception {
    ImmutableList<Person> people = MockData.getPeople();
    people.stream()
            .filter(person -> person.getAge()<=18)
            .limit(10)
            .collect(Collectors.toList())
            .forEach(person -> System.out.println(person));
  }
}
