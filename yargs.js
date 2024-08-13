import yargs from "yargs"
import chalk from "chalk"
import {hideBin} from "yargs/helpers"
const Yargs = yargs(hideBin(process.argv));
Yargs.command("add <task>","Write the task you want to add",yargs=>{
    return yargs.positional("task",{
        describe:"the content of note you want to add",
        type:"string"
    })
},(argv)=>{
console.log(chalk.bold.underline.red(argv),argv)
}).options("tags",{
    alias:"t",
    describe:"tags of the note",

})

.command("remove <id>","Tell the id of task which is to be removed",yargs=>{
    return yargs.positional("id",{
        describe:"The id of task which is to be removed",
        type:"number"
    })

},(argv)=>{
    console.log(argv)
}).demandCommand(1).parse()