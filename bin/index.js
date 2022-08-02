#! /usr/bin/env node
global.axios = require('axios')
global.fs = require('fs')
global.path = require('path')
global.axios = require('axios')
global.wsEndpoint = "https://adminloja.webstore.net.br/"
global.systemToken = 'DEV12354654698798745646513218'
global.actualPath = process.cwd();
require('colors')

const yargs = require("yargs");
const usage = "FrameWork CLI para desenvolvimento da Webstore Lojas Virtuais.";

const { configToken } = require(__dirname + '/../config.js')
const { downloadTheme } = require(__dirname + '/../pull.js') 
const { compileTheme } = require(__dirname + '/../app.js')
const { pushTheme } = require(__dirname + '/../push.js')

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
    .option("b", {
        alias:"backup", 
        describe: "Faz um backup dos arquivos do projeto no formato " + ".rar" + '.', 
        type: "boolean", 
        demandOption: false
    })
    .demandCommand(1)                                      
    .help(true)  
    .argv;


    texto = parseInt()


let args = yargs.argv,  selectedOption = yargs.argv['_']

;(async () => {
    try {
        if (selectedOption == 'app') await compileTheme()

        if (selectedOption == 'config') await configToken(args['token'])

        if (selectedOption == 'pull') await downloadTheme()


        if (selectedOption == 'push') await pushTheme()

    } catch(err) {
        console.log(err)
    }
})();
// console.log(process.cwd(), options)