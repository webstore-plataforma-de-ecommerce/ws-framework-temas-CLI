const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

let pullFunc = require('./pull').default;

let donwloadMods = async (token) => {
  let response = await axios(wsEndpoint + 'lojas/dados/modules/?TOKEN=' + token)
  return response.data;
}

module.exports = {
  default: async (token) => {
    try {
      let gitFunctions = require('./../bin/git');

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
          apelido: jsonRetorno.layout_apelido,
          loja: jsonRetorno.loja_nome,
          token: token,
          git_repo: jsonRetorno['git_repo']
      }

      let pathToCreate = actualPath + '/' + objConfig.apelido.replace(/\.| /g, '') + '-' + objConfig.loja.replace(/\.| /g, '');

      if (fs.existsSync(pathToCreate)) throw 'Já existe uma pasta com o nome deste tema no diretório atual'

      if (jsonRetorno['git_repo'] && jsonRetorno['git_repo'] != '') {
        if (
          !(await gitFunctions.verifyGit())
          ||
          !(await gitFunctions.verifyPermission(jsonRetorno['git_repo'], token))
        ) return;
      }

      fs.mkdirSync(pathToCreate)
      fs.mkdirSync(pathToCreate + '/sys')
      fs.writeFileSync(pathToCreate + '/sys/sys.json', JSON.stringify(objConfig, false, 2))

      let defaultMods = await donwloadMods(token);
      let defaultModsPath = pathToCreate + '/sys/default-modules/';

      fs.mkdirSync(defaultModsPath);

      defaultMods.forEach(mod => {
        if (!fs.existsSync(defaultModsPath + mod.name)) {
          fs.mkdirSync(defaultModsPath + mod.name);
        }
        fs.mkdirSync(defaultModsPath + mod.name + '/' + mod.version + '/');
        if (mod.js) fs.writeFileSync(defaultModsPath + mod.name + '/' + mod.version + '/' + mod.name + '.js', mod.js);
        if (mod.css) fs.writeFileSync(defaultModsPath + mod.name + '/' + mod.version + '/' + mod.name + '.css', mod.css);
        if (mod.html) fs.writeFileSync(defaultModsPath + mod.name + '/' + mod.version + '/' + mod.name + '.html', mod.html);
      });
      
      console.log("\n**************************".yellow);
      console.log("!Atenção!".yellow.bold);
      if (jsonRetorno.tipo == "Padrao") {
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
      console.log("Apelido do tema: " + jsonRetorno.layout_apelido);
      console.log("_____________________________________\n");
      console.log("Processo concluído com sucesso".green.bold + " Execute " + '(ws pull)'.bold + " para baixar os dados para edicão.\n\n");
      
    
      if (jsonRetorno['git_repo'] && jsonRetorno['git_repo'] != '') {
        await gitFunctions.cloneRepo(jsonRetorno['git_repo'], pathToCreate + '/');
        fs.renameSync(gitFunctions.gitPath(jsonRetorno['git_repo'], pathToCreate + '/') + '/', pathToCreate + '/layout/');        
      }

      pullFunc(pathToCreate, true);

      return;
    } catch (err) {
      console.log(err);
    }
  }
}