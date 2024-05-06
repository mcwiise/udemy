package lectures;

import com.google.common.collect.ImmutableList;
import java.util.List;
import java.util.stream.Collectors;
import mockdata.MockData;
import org.junit.Test;

public class Lecture11 {

  @Test
  public void joiningStrings() throws Exception {
    List<String> names = ImmutableList.of("anna", "john", "marcos", "helena", "yasmin");
    String cnames = names.stream()
            .reduce("", (namea, nameb) -> namea + ", " + nameb)
            .substring(1);

    System.out.println(cnames);

  }

  @Test
  public void joiningStringsWithStream() throws Exception {
    List<String> names = ImmutableList.of("anna", "john", "marcos", "helena", "yasmin");
    String cnames = names.stream()
            .collect(Collectors.joining(","));

    System.out.println(cnames);
  }
}
