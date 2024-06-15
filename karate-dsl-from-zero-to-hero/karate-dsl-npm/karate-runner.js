#! /usr/bin/env node
const karate = require("@karatelabs/karate");
const { Command } = require("commander");
const program = new Command();

program
  .name("karate-runner")
  .description("CLI to run a test suite written with karate library")
  .version("0.1.0");

program
  .command("karate")
  .description("runs features located in the /src folder")
  .option(
    "--env <type>",
    "the environment where the test suite will run",
    "dev"
  )
  .option(
    "--threads <type>",
    "thread pool size for the test suite to run in parallel",
    "2"
  )
  .option("--khelp", "Documentation of the karate library CLI")
  .action((options) => {
    process.argv = [];
    let karateOpts = `src -e=${options.env} -T=${options.threads}`;
    let jvmArgs = "";
    karate.version = "1.4.1";
    if (options.khelp) {
      karate.exec("src --help");
    } else {
      karate.exec(karateOpts);
    }
  });

program.parse();
