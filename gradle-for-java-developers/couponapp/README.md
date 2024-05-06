# CouponApp

This is the most simple multi module java web appplication split into:

* web layer
* services layer
* data layer
* integration layer

### Check tasks added by plugins for every single module

```bash
$ cd web
$ gradle tasks --all

$ cd ..
$ cd services
$ gradle tasks --all

$ cd ..
$ cd data
$ gradle tasks --all

$ cd ..
$ cd integration
$ gradle tasks --all
$ cd ..

```

### Execute a task inherited from the root project

```bash
$ gradle printProjectName
$ gradle :web:printProjectName
$ gradle :services:printProjectName
$ gradle :data:printProjectName
$ gradle :integration:printProjectName
```

### Check dependencies tree of a module

```bash
# lists a tree representation of this module dependencies
$ gralde web:dependencies
$ gralde services:dependencies
$ gralde data:dependencies
$ gralde integration:dependencies
```