#! /usr/bin/env node
global.axios = require('axios')
global.fs = require('fs')
global.path = require('path')
global.axios = require('axios')
global.wsEndpoint = "https://adminloja.webstore.net.br/"
global.systemToken = 'DEV12354654698798745646513218'
global.actualPath = process.cwd()
global.Inquirer = require('inquirer')
global.confirmOperation = async (action = 'continuar') => {
  let consoleQuest = {
    type: 'confirm',
    message: 'Você tem certeza que deseja ' + action,
    name: 'action',
    default: false
  }

  return await new Inquirer.prompt(consoleQuest);
}
require('colors')

const yargs = require("yargs");

let objFunctions = {}

fs.readdirSync(__dirname + '/../functions/').forEach(name => objFunctions[name.split(".")[0]] = require(__dirname + '/../functions/' + name).default);

let insideATheme = false;
try {
  fs.statSync('./sys/sys.json')
  insideATheme = true
} catch(_) {}

const options = yargs
    .scriptName('ws')
    .usage("FrameWork CLI para desenvolvimento da Webstore Lojas Virtuais.")
    .command(`config`, 'Configura um novo projeto na pasta atual.'.yellow, {
        token: {
            describe: 'O Token fornecido no painel da Webstore.',
            alias: 't',
            type: 'string',
            demandOption: false
        }
    })
    .command('pull', 'Faz o download dos arquivos do projeto.'.yellow)
    .command('push', 'Faz o upload dos arquivos do projeto.'.yellow)
    .command('app', 'Faz a compilação e abre um servidor local na porta 3000.'.yellow)
    .command('pref', 'Criador de preferências do sistema'.yellow)
    .help(true)  
    .argv;


;(async () => {
    let selectedOption = yargs.argv['_'][0], token = yargs.argv['token'];

    if (!insideATheme && objFunctions[selectedOption] && selectedOption != 'config' && selectedOption != 'svg') return console.log('Você não pode executar este comando fora de uma pasta de um tema'.red.bold);

    if (objFunctions[selectedOption]) {

      if (token && selectedOption == 'config') await objFunctions[selectedOption](token);
      else await objFunctions[selectedOption]();
      
    } else {

      let arrChoices = Object.keys(objFunctions).map(key => { return { name: key, value: objFunctions[key] }});
      arrChoices = arrChoices.filter(choice => !insideATheme && choice.name != 'config' && choice.name != 'svg' ? false : true );

      let consoleQuest = {
        type: 'list',
        message: 'Execute um comando'.bold,
        name: "command",
        choices: arrChoices
      }
    
      let response = await new Inquirer.prompt(consoleQuest)
      await response.command();
    }
})();