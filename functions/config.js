function copyFileSync( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

module.exports = {
  default: async (token) => {
        try {
          if (!token || token.trim() == '') {
            let consoleQuest = {
              type: 'string',
              message: 'Informe seu token:'.bold,
              name: 'token',
            }

            let response = await new Inquirer.prompt(consoleQuest);
            token = response.token;
          }

            let response = await axios(wsEndpoint + '/lojas/dados/dadosloja/?LV_ID=' + token);
            
            let jsonRetorno = response.data;
            if (!jsonRetorno.layout) throw 'Falha na configuração Verifique se seu token é válido ' + response.data 
            
            let objConfig = {
                tipo: jsonRetorno.tipo,
                tema: jsonRetorno.layout_nome,
                loja: jsonRetorno.loja_nome,
                token: token
            }

            let pathToCreate = actualPath + '/' + objConfig.tema.replace(/\.| /g, '') + '-' + objConfig.loja.replace(/\.| /g, '');

            if (fs.existsSync(pathToCreate)) throw 'Já existe uma pasta com o nome deste tema no diretório atual'

            fs.mkdirSync(pathToCreate)
            fs.mkdirSync(pathToCreate + '/sys')
            fs.writeFileSync(pathToCreate + '/sys/sys.json', JSON.stringify(objConfig));

            copyFolderRecursiveSync(__dirname + '/../default-modules', pathToCreate + '/sys/');
            copyFolderRecursiveSync(__dirname + '/../default-structures', pathToCreate + '/sys/')

            console.log("\n**************************".yellow);
            console.log("!Atenção!".yellow.bold);
            if (jsonRetorno.tipo == "Padrao") {
                console.log("!Atenção!".yellow.bold);
                console.log("Você está personalizando um tema " + "padrão".bold +". Modificacões em módulos não são replicáveis.");
                console.log("Caso deseje criar módulos personalizados solicite a criação de um tema personalizado seguindo as orientações de nosso manual.");
            } else {
                console.log("Você está editando um tema " + "personalizado".bold +".");
                console.log("Esse tema não utiliza o CSS default de nenhum tema inicialmente. ");
                console.log("Você pode copiar o CSS de alguma das estruturas padrões dentro da pasta " + "/sys/estruturas".bold + ".");
            }
            console.log("**************************\n".yellow);

            console.log("Tipo de tema: " + jsonRetorno.tipo);
            console.log("Loja: " + jsonRetorno.loja_nome);
            console.log("Domínio: " + jsonRetorno.dominio);
            console.log("Código do tema: " + jsonRetorno.layout);
            console.log("Nome do tema: " + jsonRetorno.layout_nome);
            console.log("_____________________________________\n");
            console.log("Processo concluído com sucesso".green.bold + " Execute " + '(ws pull)'.bold + " para baixar os dados para edicão.\n\n");
            
            return;
        } catch (err) {
            console.log(err);
            // process.exit(0);
        }
    }
}