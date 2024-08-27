function folderVerify(subdir, pathToUse) {
  subdir.forEach(element => {
      try { fs.rmSync(pathToUse + '/' + element, {recursive: true, force: true}); } catch(err) {}
      fs.mkdirSync(pathToUse + '/' + element)
  });
}

module.exports = {
  default: async (dir = actualPath, force = false) => {
        let objConfig = JSON.parse(fs.readFileSync(dir + '/sys/sys.json').toString());
        let TOKEN = objConfig.token

        console.log("Processo de download de temas da Webstore.".bold);
        console.log("\nAo prosseguir, o sistema substituirá os arquivos que você possuí localmente pelos do tema " + objConfig.tema.yellow.bold + ".\n");

        if (!force) {
          let vrf = await confirmOperation("seguir com o download?".yellow.bold);
          
          if (!vrf.action) return;
        }

        try { fs.mkdirSync(dir + '/layout') } catch(_) {}
        folderVerify(['assets', 'config', 'include', 'include/add_tags', 'modulos_loja'], dir + '/layout')

        copyFolderRecursiveSync(__dirname + '/../public', dir);

        try {
            console.log('\nInciando o Download da Nuvem utilizando o token', TOKEN.bold)

            let response = await axios(wsEndpoint + 'lojas/dados/dadoslayout/?TOKEN=' + TOKEN)
    
            if (response.status != 200) throw 'Não foi possível baixar o layout, ' + response.status
    
            let objJ = response.data
    
            if (!objJ.preferencias) throw 'Não foi possível ler as preferências';
    
            fs.writeFileSync(dir + '/layout/include/barra.html', objJ.barra);
            fs.writeFileSync(dir + '/layout/include/complemento.html', objJ.complemento);
            fs.writeFileSync(dir + '/layout/include/topo.html', objJ.topo);
            fs.writeFileSync(dir + '/layout/include/rodape.html', objJ.rodape);
            fs.writeFileSync(dir + '/layout/include/direita.html', objJ.direita);
            fs.writeFileSync(dir + '/layout/include/esquerda.html', objJ.esquerda);
    
            fs.writeFileSync(dir + '/layout/include/add_tags/head.html', objJ.head);
            fs.writeFileSync(dir + '/layout/include/add_tags/body.html', objJ.body);
    
            fs.writeFileSync(dir + '/layout/assets/folha.css', objJ.folha);
            fs.writeFileSync(dir + '/public/css/cssBase.css', objJ.cssBase);
            fs.writeFileSync(dir + '/layout/assets/functions.js', objJ.js);
    
            fs.writeFileSync(dir + '/layout/estrutura_index.html', objJ.index);
            fs.writeFileSync(dir + '/layout/estrutura_listagem.html', objJ.listagem);
            fs.writeFileSync(dir + '/layout/estrutura_pagina_produto.html', objJ.produto_detalhe);
            fs.writeFileSync(dir + '/layout/estrutura_outras_paginas.html', objJ.sem_direita);
            fs.writeFileSync(dir + '/layout/estrutura_carrinho.html', objJ.carrinho);
            fs.writeFileSync(dir + '/layout/estrutura_checkout.html', objJ.checkout);
    
            let modulos_loja_min = [];
    
            if (objJ.preferencias.modulos_loja) {
                for (var i = 0; i < objJ.preferencias.modulos_loja.length; i++) {
                    let actualMod   = objJ.preferencias.modulos_loja[i],
                        moduloNome  = actualMod.nome,
                        moduloEtapa = actualMod.etapa,
                        moduloHtml  = actualMod.moduloHtml,
                        moduloCss   = actualMod.moduloCss,
                        moduloJs    = actualMod.moduloJs;
    
                    if (!fs.existsSync(dir + "/layout/modulos_loja/" + moduloNome)) fs.mkdirSync(dir + "/layout/modulos_loja/" + moduloNome);
    
                    fs.writeFileSync(dir + "/layout/modulos_loja/" + moduloNome + "/" + moduloNome + ".js", moduloJs);
                    fs.writeFileSync(dir + "/layout/modulos_loja/" + moduloNome + "/" + moduloNome + ".css", moduloCss);
                    fs.writeFileSync(dir + "/layout/modulos_loja/" + moduloNome + "/" + moduloNome + ".html", moduloHtml);
    
                    modulos_loja_min.push({ nome: moduloNome, etapa: moduloEtapa });
                }
            }
    
            objJ.preferencias.modulos_loja = modulos_loja_min;

            fs.writeFileSync(dir + '/layout/config/config.json', JSON.stringify(objJ.preferencias, null, 2));
    
            let data = new Date();
            objConfig.ultimoPull = data.getDate() + "/" + data.getMonth() + "/" + data.getFullYear() + " " + data.getHours() + "h" + data.getMinutes() + "m" + data.getSeconds();
            fs.writeFileSync(dir + '/sys/sys.json', JSON.stringify(objConfig));
    
            console.log("\nDownload feito com sucesso. ".green.bold + "Execute " + '(ws app)'.bold + " para iniciar o projeto agora.\n");
        } catch (e) { console.log(e); }
    }
}