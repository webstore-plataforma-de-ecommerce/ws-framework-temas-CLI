
module.exports = {
  default: async () => {
        let objConfig = JSON.parse(fs.readFileSync('./sys/sys.json').toString());
        let TOKEN = objConfig.token

        console.log("Processo de download de temas da Webstore.".bold);
        console.log("\nAo prosseguir, o sistema substituirá os arquivos que você possuí localmente pelos do tema " + objConfig.tema.yellow.bold + ".\n");

        let vrf = await confirmOperation("seguir com o download?".yellow.bold);

        if (!vrf.action) return;

        try {
            console.log('\nInciando o Download da Nuvem utilizando o token', TOKEN.bold)

            let response = await axios(wsEndpoint + 'lojas/dados/dadoslayout/?TOKEN=' + TOKEN)
    
            if (response.status != 200) throw 'Não foi possível baixar o layout, ' + response.status
    
            let objJ = response.data
    
            if (!objJ.preferencias) throw 'Não foi possível ler as preferências';
    
            fs.writeFileSync('./layout/include/barra.html', objJ.barra);
            fs.writeFileSync('./layout/include/complemento.html', objJ.complemento);
            fs.writeFileSync('./layout/include/topo.html', objJ.topo);
            fs.writeFileSync('./layout/include/rodape.html', objJ.rodape);
            fs.writeFileSync('./layout/include/direita.html', objJ.direita);
            fs.writeFileSync('./layout/include/esquerda.html', objJ.esquerda);
    
            fs.writeFileSync('./layout/include/add_tags/head.html', objJ.head);
            fs.writeFileSync('./layout/include/add_tags/body.html', objJ.body);
    
            fs.writeFileSync('./layout/assets/folha.css', objJ.folha);
            fs.writeFileSync('./public/css/cssBase.css', objJ.cssBase);
            fs.writeFileSync('./layout/assets/functions.js', objJ.js);
    
            fs.writeFileSync('./layout/estrutura_index.html', objJ.index);
            fs.writeFileSync('./layout/estrutura_listagem.html', objJ.listagem);
            fs.writeFileSync('./layout/estrutura_pagina_produto.html', objJ.produto_detalhe);
            fs.writeFileSync('./layout/estrutura_outras_paginas.html', objJ.sem_direita);

            fs.copyFileSync(__dirname + '/../includes.html', './public/includes.html');
    
            let modulos_loja_min = [];
    
            if (objJ.preferencias.modulos_loja) {
                for (var i = 0; i < objJ.preferencias.modulos_loja.length; i++) {
                    let actualMod   = objJ.preferencias.modulos_loja[i],
                        moduloNome  = actualMod.nome,
                        moduloEtapa = actualMod.etapa,
                        moduloHtml  = actualMod.moduloHtml,
                        moduloCss   = actualMod.moduloCss,
                        moduloJs    = actualMod.moduloJs;
    
                    if (!fs.existsSync("./layout/modulos_loja/" + moduloNome)) fs.mkdirSync("./layout/modulos_loja/" + moduloNome);
    
                    fs.writeFileSync("./layout/modulos_loja/" + moduloNome + "/" + moduloNome + ".js", moduloJs);
                    fs.writeFileSync("./layout/modulos_loja/" + moduloNome + "/" + moduloNome + ".css", moduloCss);
                    fs.writeFileSync("./layout/modulos_loja/" + moduloNome + "/" + moduloNome + ".html", moduloHtml);
    
                    modulos_loja_min.push({ nome: moduloNome, etapa: moduloEtapa });
                }
            }
    
            objJ.preferencias.modulos_loja = modulos_loja_min;

            fs.writeFileSync('./layout/config/config.json', JSON.stringify(objJ.preferencias, null, 2));
    
            let data = new Date();
            objConfig.ultimoPull = data.getDate() + "/" + data.getMonth() + "/" + data.getFullYear() + " " + data.getHours() + "h" + data.getMinutes() + "m" + data.getSeconds();
            fs.writeFileSync('./sys/sys.json', JSON.stringify(objConfig));
    
            console.log("\nDownload feito com sucesso. ".green.bold + "Execute " + '(ws app)'.bold + " para iniciar o projeto agora.\n");
        } catch (e) { console.log(e); }
    }
}