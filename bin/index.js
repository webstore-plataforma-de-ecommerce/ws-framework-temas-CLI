#! /usr/bin/env node
global.axios = require('axios')
global.fs = require('fs')
global.path = require('path')
global.axios = require('axios')
global.wsEndpoint = "https://adminloja.webstore.net.br/"
global.systemToken = 'DEV12354654698798745646513218'
global.actualPath = process.cwd();
global.Inquirer = require('inquirer')
global.confirmOperation = async (action = 'continuar') => {
  let consoleQuest = {
    type: 'confirm',
    message: 'Você tem certeza que deseja ' + action + '?',
    name: 'action',
    default: false
  }

  let response = await new Inquirer.prompt(consoleQuest)
  return response.action;
}

require('colors')

const yargs = require("yargs");

const usage = "FrameWork CLI para desenvolvimento da Webstore Lojas Virtuais.";

const { configToken } = require(__dirname + '/../config.js')
const { downloadTheme } = require(__dirname + '/../pull.js') 
const { compileTheme } = require(__dirname + '/../app.js')
const { pushTheme } = require(__dirname + '/../push.js')
const { intiatePrefs } = require(__dirname + '/../pref')

const options = yargs
    .scriptName('ws')
    .usage(usage)
    .command(`config`, 'Configura um novo projeto na pasta atual.'.yellow, {
        token: {
            describe: 'O Token fornecido no painel da Webstore.',
            alias: 't',
            type: 'string',
            demandOption: true
        }
    })
    .command('pull', 'Faz o download dos arquivos do projeto.'.yellow)
    .command('push', 'Faz o upload dos arquivos do projeto.'.yellow)
    .command('app', 'Faz a compilação e abre um servidor local na porta 3000.'.yellow)
    .command('pref', 'Criador de preferências do sistema'.yellow)
    .option("b", {
        alias:"backup", 
        describe: "Faz um backup dos arquivos do projeto no formato " + ".rar" + '.', 
        type: "boolean", 
        demandOption: false
    })
    .help(true)  
    .argv;


    texto = parseInt()


let args = yargs.argv,  selectedOption = yargs.argv['_']

;(async () => {
    try {
      switch (selectedOption[0]) {
        case 'app':
          await compileTheme()
          break;
        case 'config':
          await configToken(args['token'])
          break;
        case 'pull':
          await downloadTheme()
          break;
        case 'push':
          await pushTheme()
          break;
        case 'pref':
          await intiatePrefs()
          break;
        case 'mod':
          console.log('mod')
          break;
      
        default:
          let consoleQuest = {
            type: 'list',
            message: 'Pick a Command'.bold,
            name: "command",
            choices: [
              { 
                name: 'app',
                value: compileTheme
              },
              { 
                name: 'config',
                value: configToken
              }, 
              {
                name: 'pull',
                value: downloadTheme
              },
              {
                name: 'push',
                value: pushTheme
              }, 
              {
                name: 'pref',
                value: intiatePrefs
              }, 
              {
                name: 'mod',
                value: 'mod'
              }
            ]
          }
        
          let response = await new Inquirer.prompt(consoleQuest)
          await response.command();

          break;
      }
    } catch(err) {
        console.log(err)
    }
})();