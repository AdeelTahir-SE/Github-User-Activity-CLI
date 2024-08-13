#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  readUsername,
  writeUsername,
  createRepo,
  deleteRepo,
  createIssue,
  getdetails,
} from "./index2.js";

const username = readUsername();
const Yargs = yargs(hideBin(process.argv));

Yargs.command(
  "$0 <username>",
  "Specify the username to perform actions",
  (yargs) => {
    return yargs.positional("username", {
      describe: "The username of the user",
      type: "string",
    });
  },
  (args) => {
    try {
      writeUsername(args.username);
      console.log(chalk.green.bold("Username specified successfully!"));
    } catch (err) {
      console.error(chalk.red.bold("Error specifying username:", err.message));
    }
  }
)
  .command(
    "create <repositoryname> <repositorydesc> <repositoryaccesstype>",
    "Creates a new repository",
    (yargs) => {
      return yargs
        .positional("repositoryname", {
          describe: "The name of the repository",
          type: "string",
        })
        .positional("repositorydesc", {
          describe: "The description of the repository",
          type: "string",
        })
        .positional("repositoryaccesstype", {
          describe: "The access type of the repository (public/private)",
          type: "string",
          choices: ["public", "private"],
          default: "private",
        });
    },
    async (args) => {
      try {
        await createRepo(
          args.repositoryname,
          args.repositorydesc,
          args.repositoryaccesstype
        );
        console.log(chalk.green.bold("Repository created successfully!"));
      } catch (err) {
        console.error(chalk.red.bold("Error creating repository:", err.message));
      }
    }
  )
  .command(
    "delete <repositoryowner> <repositoryname>",
    "Deletes a repository",
    (yargs) => {
      return yargs
        .positional("repositoryowner", {
          describe: "The owner of the repository",
          type: "string",
        })
        .positional("repositoryname", {
          describe: "The name of the repository",
          type: "string",
        });
    },
    async (args) => {
      try {
        await deleteRepo(
          args.repositoryowner || username,
          args.repositoryname
        );
        console.log(chalk.green.bold("Repository deleted successfully!"));
      } catch (err) {
        console.error(chalk.red.bold("Error deleting repository:", err.message));
      }
    }
  )
  .command(
    "createissue <owner> <repositoryname> <issuetitle> <issuebodies> [issuelabel...] [issueassignees...]",
    "Creates a new issue in a repository",
    (yargs) => {
      return yargs
        .positional("owner", {
          describe: "The owner of the repository",
          type: "string",
          default: username,
        })
        .positional("repositoryname", {
          describe: "The name of the repository",
          type: "string",
        })
        .positional("issuetitle", {
          describe: "The title of the issue",
          type: "string",
        })
        .positional("issuebodies", {
          describe: "The description of the issue",
          type: "string",
        })
        .positional("issuelabel", {
          describe: "Labels for the issue",
          type: "array",
          default: [],
        })
        .positional("issueassignees", {
          describe: "People assigned to the issue",
          type: "array",
          default: [],
        });
    },
    async (args) => {
      try {
        const issue = {
          title: args.issuetitle,
          body: args.issuebodies,
          labels: args.issuelabel,
          assignees: args.issueassignees,
        };
        await createIssue(args.owner, args.repositoryname, issue);
        console.log(chalk.green.bold("Issue created successfully!"));
      } catch (err) {
        console.error(chalk.red.bold("Error creating issue:", err.message));
      }
    }
  )
  .command(
    "get <username> <requirement>",
    "Get details of a user like repositories, commits, etc.",
    (yargs) => {
      return yargs
        .positional("requirement", {
          describe: "The details you want to retrieve",
          type: "string",
          choices: ["commits", "repositories", "lastproject"],
        })
        .positional("username", {
          describe: "The username of the user",
          type: "string",
          default: username,
        });
    },
    async (args) => {
      try {
        await getdetails(args.requirement, args.username);
        console.log(chalk.green.bold("Details retrieved successfully!"));
      } catch (err) {
        console.error(chalk.red.bold("Error retrieving details:", err.message));
      }
    }
  )
  .options("number", {
    alias: "N",
    type: "number",
    describe: "Number of items you want to see",
  })
  .demandCommand(1, chalk.red.bold("You need to specify a command."))
  .parse();
