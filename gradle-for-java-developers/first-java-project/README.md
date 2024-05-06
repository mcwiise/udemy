# First Java Project

### Create a basic java project

```bash
# install gradle 7 with brew
$ brew install gradle@7

# create an empty folder
$ mkdir first-project
$ cd first-project

# init a gradle project, pick option 3. application
$ gradle init

```

### Check and execute the basic gradle commands for java apps

```bash
# list all available tasks
$ gradle tasks --all

# delete and create the build folder where .class files are located
# after compilation happens
$ gradle clean build

```