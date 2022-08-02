function getModuloHtml(modulo, tipo) {

    var caminho = "";
    if (tipo == "padrao") {
        caminho = './modulos_padroes/' + modulo.nome + '/' + modulo.versao + '/' + modulo.nome + '.html';
    } else {
        caminho = './layout/modulos_loja/' + modulo.nome + '/' + modulo.nome + '.html';
    }
    try {
        var retorno = fs.readFileSync(caminho).toString();
        return retorno
    } catch (e) {
        //console.log("Trying to get " + modulo.nome + " - " + tipo);
        //console.log(e.message);
        return ""
    }
}

function getModuloCss(modulo, tipo) {
    var caminho = "";
    if (tipo == "padrao") {
        caminho = './modulos_padroes/' + modulo.nome + '/' + modulo.versao + '/' + modulo.nome + '.css';
    } else {
        caminho = './layout/modulos_loja/' + modulo.nome + '/' + modulo.nome + '.css';
    }

    try {
        var retorno = fs.readFileSync(caminho).toString();
        return retorno
    } catch (e) {
        return ""
    }
}

function getModuloJs(modulo, tipo) {
    var caminho = "";
    if (tipo == "padrao") {
        caminho = './modulos_padroes/' + modulo.nome + '/' + modulo.versao + '/' + modulo.nome + '.js';
    } else {
        caminho = './layout/modulos_loja/' + modulo.nome + '/' + modulo.nome + '.js';
    }

    try {
        var retorno = fs.readFileSync(caminho).toString();
        return retorno
    } catch (e) {
        return ""
    }
}

module.exports = {
    pushTheme: async () => {
        const readline = require("readline");

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        var objConfig = JSON.parse(fs.readFileSync('./sys/sys.json').toString());
        var TOKEN = objConfig.token;

        console.log("\nProcesso de upload de temas da Webstore.".yellow.bold);

        console.log("Ao prosseguir, o sistema substituira os arquivos do tema " + objConfig.tema.yellow.bold + " da loja pelos que voce possui aqui no modulo");

        console.log("Deseja seguir com o upload?")


        var KeepResposta = "";
        rl.question("[yes/sim]:", function (Resposta) {


            KeepResposta = Resposta.toLowerCase().trim();

            rl.close();

        });


        rl.on("close", function () {

            if (KeepResposta != "s" && KeepResposta != 'y' && KeepResposta != 'yes' && KeepResposta != sim ) {
                console.log("Operacao cancelada");
                process.exit();
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

                var modulosLoja = [];

                if (objConfig.tipo == "Personalizado") {

                    if (configJs.modulos_loja) {

                        if (configJs.modulos_loja.length > 20) {
                            console.log("Voce nao deve usar mais do que 20 modulos personalizados para um tema".yellow);
                            return;
                        }

                        for (var i = 0; i < configJs.modulos_loja.length; i++) {

                            var moduloHtml = getModuloHtml(configJs.modulos_loja[i], "loja");
                            var moduloCss = getModuloCss(configJs.modulos_loja[i], "loja");
                            var moduloJs = getModuloJs(configJs.modulos_loja[i], "loja");

                            var modulo = {
                                nome: configJs.modulos_loja[i].nome,
                                etapa: configJs.modulos_loja[i].etapa,
                                moduloHtml: moduloHtml,
                                moduloCss: moduloCss,
                                moduloJs: moduloJs,
                            }

                            modulosLoja.push(modulo);

                        }

                    }

                } else {

                    if (configJs.modulos_loja) {

                        if (configJs.modulos_loja.length > 0) {
                            console.log("ATENCAO".yellow.bold);
                            console.log("****************************");
                            console.log("Voce esta usando modulos personalizados em um tema padrao.");
                            console.log("Para criar modulos, utilize um tema personalizado.");
                            console.log("Acesse nosso manual e verifique como seguir.");
                            console.log(" ");
                            return;
                        }

                    }

                }

                var postData = {

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

            console.log(" ");

        });
    }
}