function getModuleString(mod, format, type = 'padrao') {
  let path = './sys/default-modules/' + mod.nome + '/' + mod.versao + '/' + mod.nome + '.' + format;

  if (type != "padrao") path = './layout/modulos_loja/' + mod.nome + '/' + mod.nome + '.' + format;

  try {
    return fs.readFileSync(path).toString();
  } catch (e) {
    return ""
  }
}

module.exports = {
  default: async () => {
    let gitFunctions = require('./../bin/git');
      let objConfig = JSON.parse(fs.readFileSync('./sys/sys.json').toString());
      let TOKEN = objConfig.token

      console.log("Processo de upload de temas da Webstore.".bold);
      console.log("\nAo prosseguir, o sistema substituirá os arquivos do tema " + objConfig.tema.yellow.bold + " da loja pelos que você possuí localmente.\n");

      let vrf = await confirmOperation("seguir com o upload?".yellow.bold);
      
      if (!vrf.action) return;

      if (objConfig['git_repo']) {
        let consoleQuest = {
          type: 'string',
          message: 'Digite uma mensagem para o seu commit',
          name: "commitMessage"
        }
      
        let response = await new Inquirer.prompt(consoleQuest)
        await gitFunctions.gitPush(response.commitMessage.toString());
      }

      

      try {
          var configJs = JSON.parse(fs.readFileSync('./layout/config/config.json'));

          var index = (fs.readFileSync('./layout/estrutura_index.html').toString());
          var listagem = (fs.readFileSync('./layout/estrutura_listagem.html').toString());
          var sem_direita = (fs.readFileSync('./layout/estrutura_outras_paginas.html').toString());
          var produto_detalhes = (fs.readFileSync('./layout/estrutura_pagina_produto.html').toString());

          var topo = (fs.readFileSync('./layout/include/topo.html').toString());
          var barra = (fs.readFileSync('./layout/include/barra.html').toString());
          var esquerda = (fs.readFileSync('./layout/include/esquerda.html').toString());
          var direita = (fs.readFileSync('./layout/include/direita.html').toString());
          var rodape = (fs.readFileSync('./layout/include/rodape.html').toString());
          var complemento = (fs.readFileSync('./layout/include/complemento.html').toString());

          var head = (fs.readFileSync('./layout/include/add_tags/head.html').toString());
          var body = (fs.readFileSync('./layout/include/add_tags/body.html').toString());

          var css = (fs.readFileSync('./layout/assets/folha.css').toString());
          var js = (fs.readFileSync('./layout/assets/functions.js').toString());

          if (js.indexOf("//") >= 0) {
              console.log("\nATENCÃO".yellow.bold);
              console.log("Não utilize // para comentar linhas no javascript.");
              console.log("Isso pode gerar problemas após o script ser minificado.");
              console.log("Comente códigos com /* comentarios */.\n");
          }

            let modulosLoja = [];

            if (configJs.modulos_loja) {

                if (configJs.modulos_loja.length > 30) return console.log("Voce nao deve usar mais do que 30 modulos personalizados para um tema".yellow);

                for (let i = 0; i < configJs.modulos_loja.length; i++) {
                    let actualMod = configJs.modulos_loja[i];
                    modulosLoja.push({
                      nome: actualMod.nome,
                      etapa: actualMod.etapa,
                      moduloHtml: getModuleString(actualMod, 'html', 'custom'),
                      moduloCss: getModuleString(actualMod, 'css', 'custom'),
                      moduloJs: getModuleString(actualMod, 'js', 'custom'),
                    })
                }

            }
            
            let postData = {

              estrutura_index: index,
              estrutura_listagem: listagem,
              estrutura_outras_paginas: sem_direita,
              estrutura_pagina_produto: produto_detalhes,

              include_head: head,
              include_body_end: body,

              include_topo: topo,
              include_barra: barra,
              include_esquerda: esquerda,
              include_direita: direita,
              include_rodape: rodape,
              include_complemento: complemento,

              assets_css: css,
              assets_js: js,

              modulos_loja: modulosLoja,
              
              config: JSON.stringify(configJs)
          }

          axios
              .post(wsEndpoint + 'lojas/dados/deploy/?TOKEN=' + TOKEN, postData)
              .then(res => {

                  if (res.data == "Sucesso") {

                      console.log("\nSucesso".green.bold);
                      console.log("Upload realizado com sucesso.");
                      console.log("No painel de controle da loja, acesse o tema e clique em SALVAR para forcar a atualizacao dos arquivos temporarios.\n");

                      var data = new Date();
                      objConfig.ultimoPush = data.getDate() + "/" + data.getMonth() + "/" + data.getFullYear() + " " + data.getHours() + "h" + data.getMinutes() + "m" + data.getSeconds();
                      fs.writeFileSync('./sys/sys.json', JSON.stringify(objConfig), (err) => {
                          if (err) throw err;
                      });

                      process.exit(0);


                  } else {
                      console.log("**************************");
                      console.log("Atencão".red);
                      console.log(res.data);
                  }

              })
              .catch(error => {
                  console.error(error);
              });

      } catch (e) { console.log(e.message); }
  }
}