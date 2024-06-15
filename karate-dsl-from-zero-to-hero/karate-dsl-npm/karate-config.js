function fn() {
  var env = karate.env; // get java system property 'karate.env'
  karate.log("karate.env system property was:", env);

  var foo = karate.properties["foo"];
  karate.log("karate.properties:", foo);
  if (!env) {
    env = "dev"; // a custom 'intelligent' default
    karate.log("karate.env default to:", env);
  }
  var config = {};

  if (env == "dev") {
    // over-ride only those that need to be
    config.baseApiUrl = "https://conduit-api.bondaracademy.com/api";
    config.userEmail = "mcwiise.cap@gmail.com";
    config.userPassword = "germanchis1234";
  } else if (env == "prod") {
    config.baseApiUrl = "https://conduit.productionready.io/api";
    config.userEmail = "t@mailinator.com";
    config.userPassword = "sadf";
  }
  return config;
}
