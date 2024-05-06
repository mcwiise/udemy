package lectures;


import com.google.common.collect.Lists;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.Before;
import org.junit.Test;

public class Lecture10 {

  private static final List<ArrayList<String>> arrayListOfNames = Lists.newArrayList(
      Lists.newArrayList("Mariam", "Alex", "Ismail"),
      Lists.newArrayList("John", "Alesha", "Andre"),
      Lists.newArrayList("Susy", "Ali")
  );

  @Before
  public void setUp() {
    System.out.println(arrayListOfNames);
  }

  @Test
  public void withoutFlatMap() throws Exception {
    //[Mariam, Alex, Ismail, John, Alesha, Andre, Susy, Ali]
    List<String> combined = arrayListOfNames.stream().reduce(new ArrayList<String>(), (lista, listb) -> {
      lista.addAll(listb);
      return lista;
    });

    System.out.println(combined);

  }

  @Test
  public void withFlatMap() throws Exception {
    //[Mariam, Alex, Ismail, John, Alesha, Andre, Susy, Ali]
    List<String> names = arrayListOfNames.stream()
            .flatMap(list -> list.stream())
            .collect(Collectors.toList());
    System.out.println(names);
  }

}

