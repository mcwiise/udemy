# First Java Web Application

### Create a basic java project

```bash
# install gradle 7 with brew
$ brew install gradle@7

# create an empty folder
$ mkdir first-java-web-application
$ cd first-java-web-application

# init a gradle project, pick options: 2 3 1 1 1
$ gradle init

```

### The war plugin

This is a gradle plugin that add tasks to create .war files ready to be deployed in application servers like: Tomcat Jetty JBoss

```bash
# list an check tasks indluded by the war plugin
$ gradle tasks --all

# generate a .war file under /build/libs folder
$ gradle war
```

### The Grety plugin

This is a gradle plugin that embeds a Tomcat server and adds tasks to start up the application by HTTP pr HTTPS

```bash
# list an check tasks indluded by the gratty plugin
$ gradle tasks --all

# generate a .war file under /build/libs folder
$ gradle appRun

```

### The sonarqube plugin

This is a gradle plugin that allows to send code quality results for a sonar qube instance to analize


```bash
# start sonar qube container
$ docker-compose up -d --build

# execute the sonarqube gradle task to send report to sonar
$ gradle sonarqube

```

Finally go to localhost:90000 and see the results.