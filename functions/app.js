let result;
let objJ;
let etapaAtual = "";
let protocolo = "https://";

let LayInt;
let objConfig;
let configJs;

let LOJA, pageURL = '/';

function compileAll(vrf) {
    //var head = "";//fs.readFileSync('./public/head.html').toString();
    let bottom = "";//fs.readFileSync('./public/bottom.html').toString();
    let logo = "";//fs.readFileSync('./public/logo.html').toString();
    let includes = fs.readFileSync('./public/includes.html').toString();

    let index = htmlModulosTagsHtml(fs.readFileSync('./layout/estrutura_index.html').toString());
    let listagem = htmlModulosTagsHtml(fs.readFileSync('./layout/estrutura_listagem.html').toString());
    let sem_direita = htmlModulosTagsHtml(fs.readFileSync('./layout/estrutura_outras_paginas.html').toString());
    let produto_detalhes = htmlModulosTagsHtml(fs.readFileSync('./layout/estrutura_pagina_produto.html').toString());
    let topo = htmlModulosTagsHtml(fs.readFileSync('./layout/include/topo.html').toString());
    let barra = htmlModulosTagsHtml(fs.readFileSync('./layout/include/barra.html').toString());
    let esquerda = htmlModulosTagsHtml(fs.readFileSync('./layout/include/esquerda.html').toString());
    let direita = htmlModulosTagsHtml(fs.readFileSync('./layout/include/direita.html').toString());
    let rodape = htmlModulosTagsHtml(fs.readFileSync('./layout/include/rodape.html').toString());
    let complemento = htmlModulosTagsHtml(fs.readFileSync('./layout/include/complemento.html').toString());

    let head = htmlModulosTagsHtml(fs.readFileSync('./layout/include/add_tags/head.html').toString());
    let body_end = htmlModulosTagsHtml(fs.readFileSync('./layout/include/add_tags/body.html').toString());

    try {

        LOJA = objJ.loja;

        if (pageURL == "") { pageURL = "/"; }

        if (vrf) {
            console.log("\nCódigo da loja: ".bold + LOJA.green.bold);
        }

        var urlComplete = "";
        if (pageURL != "/") {
            urlComplete = pageURL.replace("/" + objJ.loja_nome, "");
        }

        if (urlComplete != "" || 1 == 1) {

            if (objJ.dominio.indexOf("lojas.webstore") >= 0 || objJ.dominio.indexOf("lojamodelolocal") >= 0) { protocolo = "http://"; }

            axios
                .post(protocolo + objJ.dominio + urlComplete + "?edicao_remota=true&token=" + LOJA, {
                    Html_index: index,
                    Html_listagem: listagem,
                    Html_sem_direita: sem_direita,
                    Html_produto_detalhes: produto_detalhes,
                    Html_head: head,
                    Html_body: body_end,
                    Html_topo: topo,
                    Html_barra: barra,
                    Html_esquerda: esquerda,
                    Html_direita: direita,
                    Html_rodape: rodape,
                    Html_complemento: complemento
                })
                .then(res => {
                    showPage_step2(res.data, vrf);
                })
                .catch(error => {
                    console.error(error);
                });

        } else {

            showPage_step2("", vrf);

        }

    } catch (e) {
        console.log(e.message);
    }

    function showPage_step2(bodyPage) {

        try {
            bodyPage = bodyPage.replace(/_s3cdn_.js/gi, '')

            let etapaAtual = new RegExp('HdEtapaLoja(.*?)value=(\'|")(.*?)(\'|")', 'gm').exec(bodyPage)[3];

            LOJA = objJ.loja;
    
            logo = logo.replace("##CAMINHOLOGO##", "http://images.webstore.net.br/files/" + LOJA + "/" + objJ.logotipo);
    
            LayInt = Number(objJ.layout);
            try {
                if (objConfig.temaBase) {
                    LayInt = Number(objConfig.temaBase);
                    console.log("Usando layout (" + LayInt + ") como base");
                }
            } catch (e) { }
            
            if (vrf) {
                console.log("Etapa: ".bold + etapaAtual.green.bold);
                console.log("Dominio: ".bold + objJ.dominio.green.bold);
                console.log("Nome da loja: ".bold + objJ.loja_nome.green.bold, '\n');
            }

            console.log(`Compilação: ${'SUCESSO ✅'.green} ${new Date().toLocaleTimeString().bold} ${new Date().toLocaleDateString().bold}`.bold);
    
    
            var find = ["<!--##CLEAR_CSS##-->", "<!--##H1_DIV##-->", "<!--##LOGOTIPO##-->", "<!--##VALOR_PRODUTOS_CARRINHO##-->"];
            var replace = ["", "h1", logo, "00"];
            topo = replaceStr(topo, find, replace);
    
    
            rodape = replaceStr(rodape, find, replace);
            complemento = replaceStr(complemento, find, replace);
    
            var find2 = ["<!--###TOPO###-->", "<!--###BARRA###-->", "<!--###BARRA_ESQUERDA###-->", "<!--###RODAPE###-->", "<!--###COMPLEMENTO###-->"];
            var replace = [topo, barra, esquerda, rodape, complemento];
            index = replaceStr(index, find2, replace);
    
            result = index + bottom;
    
            find = ["<!--###IMAGENS_CLIENTE###-->"];
            replace = ["http://images.webstore.net.br/files/" + LOJA + "/" + LayInt + "/"];
            result = replaceStr(result, find, replace);
    
            result += "<input type='hidden' id='LOJA' value='" + LOJA + "'/>";
            result += "<input type='hidden' id='HdTokenLojaTemp' value='" + systemToken + "'/>";
    
    
            if (bodyPage != "") {
                result = bodyPage + includes;
            }
    
            htmlModulos();
        } catch (e) {
            console.log(e.message);
        }
    
    }
}

function htmlModulos() {

    try {

        var css = "";
        var js = "";

        js += "var SetEndPointRestCalls = 'http://" + objJ.dominio + "';";

        result = ajustaUrlsAssets(result);

        if (configJs.modulos) {
            for (let i = 0; i < configJs.modulos.length; i++) {
                let actualMod = configJs.modulos[i];

                if (configJs.modulos[i].etapa.indexOf(etapaAtual) >= 0 || configJs.modulos[i].etapa == "*") {
                    let tag = createTag(actualMod, "padrao");
                    let moduloHtml = getModuleString(actualMod, 'html');
                    result = result.replace(tag, moduloHtml);

                    let moduloCss = getModuleString(actualMod, 'css')
                    css += moduloCss;

                    let moduloJs = getModuleString(actualMod, 'js');
                    js += moduloJs + '\n';
                }

            }
        }

        if (configJs.modulos_loja) {
            for (let i = 0; i < configJs.modulos_loja.length; i++) {
                let actualMod = configJs.modulos_loja[i];

                if (actualMod.etapa.indexOf(etapaAtual) >= 0 || actualMod.etapa == "*") {

                    let tag = createTag(actualMod);
                    let moduloHtml = getModuleString(actualMod, 'html', 'custom');
                    result = result.replace(tag, moduloHtml);

                    let moduloCss = getModuleString(actualMod, 'css', 'custom')
                    css += moduloCss;

                    let moduloJs = getModuleString(actualMod, 'js', 'custom');
                    js += moduloJs + '\n';

                }

            }
        }

        css += fs.readFileSync('./layout/assets/folha.css').toString();

        js += fs.readFileSync('./layout/assets/functions.js').toString();

        try {
            if (LayInt < 1000) {
                css = fs.readFileSync('./public/css/cssBase.css').toString() + css;
            }
        } catch (e) { }

        var find = [];
        var replace = [];
        for (var i = 1; i <= 50; i++) {
            var tag = 'PREF_' + i;
            var value = configJs[tag];

            find.push("<!--###" + tag + "###-->");
            replace.push("#" + value)
        }

        //Grupo de prefer�ncias 
        var findGroup = [];
        var replaceGroup = [];
        if (configJs.PreferenciasSets) {
            var prefsSets = configJs.PreferenciasSets;
            for (var i = 0; i < prefsSets.length; i++) {

                var tag = prefsSets[i].id;
                var value = prefsSets[i].valor;

                if (prefsSets[i].tipo == "color") { value = "#" + value; }

                findGroup.push("-" + tag + ""); replaceGroup.push(value)
                findGroup.push("<!--##" + tag + "##-->"); replaceGroup.push(value)
                findGroup.push("{" + tag + "}"); replaceGroup.push(value)

            }
            css = replaceStr(css, findGroup, replaceGroup);
            js = replaceStr(js, findGroup, replaceGroup);
            result = replaceStr(result, findGroup, replaceGroup);
        }
        //Fim - Grupo de prefer�ncias


        css = replaceStr(css, find, replace);

        find = ["<!--###IMAGENS_CLIENTE###-->"];
        replace = ["http://images.webstore.net.br/files/" + LOJA + "/" + LayInt + "/"];
        css = replaceStr(css, find, replace);

        result = ajustaUrlsAssets(result.replace("value='4924'", "value='" + LOJA + "'"));

        fs.writeFile('./public/index.html', result, (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
        });

        fs.writeFile('./public/css/css.css', css, (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
        });

        fs.writeFile('./public/js/script.js', js, (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
        });

    } catch (e) {
        console.log("Erro gerando modulos" + e.message);
    }

}

function htmlModulosTagsHtml(conteudo) {
    try {
        if (configJs.modulos) {
            for (let i = 0; i < configJs.modulos.length; i++) {
                let tag = createTag(configJs.modulos[i], "padrao");
                let moduloHtml = getModuleString(configJs.modulos[i], 'html');
                conteudo = conteudo.replace(tag, moduloHtml);
            }
        }

        if (configJs.modulos_loja) {
            for (let i = 0; i < configJs.modulos_loja.length; i++) {
                let tag = createTag(configJs.modulos_loja[i]);
                let moduloHtml = getModuleString(configJs.modulos_loja[i], 'html', 'custom');
                conteudo = conteudo.replace(tag, moduloHtml);
            }
        }


    } catch (e) {
        console.log("Erro gerando modulos " + e.message);
    }

    return conteudo;

}

function getModuleString(mod, format, type = 'padrao') {
  let path = './sys/default-modules/' + mod.nome + '/' + mod.versao + '/' + mod.nome + '.' + format;

  if (type != "padrao") path = './layout/modulos_loja/' + mod.nome + '/' + mod.nome + '.' + format;

  try {
    return fs.readFileSync(path).toString();
  } catch (e) {
    return ""
  }
}

function createTag(modulo, tipo) {
    nome = modulo.nome.toUpperCase();
    if (tipo == "padrao") {
        return "<!--##" + nome + modulo.versao + "##-->";
    } else {
        return "<!--##[LOJA]" + nome + "##-->";
    }
}

function replaceStr(str, find, replace) {
    for (var i = 0; i < find.length; i++) {
        str = str.replace(new RegExp(find[i], 'gi'), replace[i]);
    }
    return str;
}

function ajustaUrlsAssets(conteudo) {

    while (conteudo.indexOf("src=\"/lojas/") >= 0 || conteudo.indexOf("src='/lojas/") >= 0) {

        conteudo = conteudo.replace("src=\"/lojas/", "src=\"" + protocolo + objJ.dominio + "/lojas/");
        conteudo = conteudo.replace("src='/lojas/", "src='" + protocolo + objJ.dominio + "/lojas/");

    }

    while (conteudo.indexOf("src=\"/layouts") >= 0 || conteudo.indexOf("src='/layouts") >= 0) {

        conteudo = conteudo.replace("src=\"/layouts", "src=\"" + protocolo + objJ.dominio + "/layouts/");
        conteudo = conteudo.replace("src='/layouts", "src='" + protocolo + objJ.dominio + "/layouts/");

    }

    while (conteudo.indexOf("href=\"/lojas/") >= 0 || conteudo.indexOf("href='/lojas/") >= 0) {

        conteudo = conteudo.replace("href=\"/lojas/", "href=\"" + protocolo + objJ.dominio + "/lojas/");
        conteudo = conteudo.replace("href='/lojas/", "href='" + protocolo + objJ.dominio + "/lojas/");

    }

    return conteudo;

}

module.exports = {
  default: async () => {
        const liveServer = require("live-server");
        
        configJs = JSON.parse(fs.readFileSync('./layout/config/config.json', 'utf-8'));
        objConfig = JSON.parse(fs.readFileSync('./sys/sys.json', 'utf-8'));
        
        LOJA = objConfig.token;

        if (!fs.existsSync('./layout')) {
            console.log('\nVerifique se você executou o node pull.\n'.red.bold);
            process.exit(0);
        }

        axios(wsEndpoint + '/lojas/dados/dadosloja/?LV_ID=' + LOJA)
            .then(response => {
                objJ = response.data;
                compileAll(true);

                liveServer.start({
                  port: 3000,
                  host: 'localhost',
                  root: "./public",
                  open: true,
                  file: "index.html", 
                  wait: 0, 
                  logLevel: 0,
                  middleware: [
                      (req,res,next) => {
                          let arrUrl = req.url.split('/');
                          if ((arrUrl.length == 0 || arrUrl.length == 1) || (arrUrl[1] != 'css' && arrUrl[1] != 'js' && arrUrl[1] != 'carrinhoAJAX')) {
                              if (pageURL != req.url) {
                                  pageURL = req.url;
                                  compileAll();
                              }
                          }
                          next();
                      }
                  ]
                });
            })
            .catch(err => {
                console.log(err)
                console.log("\nNão foi possível iniciar o processo".red.bold);
                console.log("Verifique se o token informado á válido.\n");
            })

        let fsTimeout;

        fs.watch('./layout', { recursive:true }, (eventType, filename) => {
            if (!fsTimeout) {
                console.log('ARQUIVO ALTERADO'.yellow, filename.blue.bold)
                    compileAll(false);
                fsTimeout = setTimeout(function() { fsTimeout=null }, 100) 
            }
        })
    }
}