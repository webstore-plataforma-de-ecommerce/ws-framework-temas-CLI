const saveUpdate = (obj) => fs.writeFileSync('./layout/config/config.json', JSON.stringify(obj, null, 2))
const readConfigs = () => JSON.parse(fs.readFileSync('./layout/config/config.json', 'utf-8'))

const treatName = (str) => {

  str = str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/([^\w]+|\s+)/g, '-')
      .replace(/\-\-+/g, '-')
      .replace(/(^-+|-+$)/, '');

      str.replace(/ |-/g, '_');

      str = str.toLowerCase();

  return str;
}

const createFiles = async (modName) => {

  try {
    fs.mkdirSync(`./layout/modulos_loja/${modName}`)
  } catch(_) {

  }
    
  fs.writeFileSync(`./layout/modulos_loja/${modName}/${modName}.css`, '')
  fs.writeFileSync(`./layout/modulos_loja/${modName}/${modName}.html`, '')
  fs.writeFileSync(`./layout/modulos_loja/${modName}/${modName}.js`, '')

  
    let helpInitial = 
    `O JS e o CSS deste módulo serão importados automáticamente dentro da página das etapas selecionadas.
    
Caso deseje usar alguma estrutura HTML dentro deste módulo utilize o arquivo HTML.

Onde desejar usar o HTML deste módulo use a tag abaixo:

<!--##[LOJA]${modName.toUpperCase()}##-->

O conteúdo dentro do arquivo HTML do módulo será inserido neste exato lugar do código. 
    `

    fs.writeFileSync('./layout/modulos_loja/' + modName + '/ajuda.txt', helpInitial)
}

const getModStep = async () => {
  let consoleQuest = {
    type: 'checkbox',
    message: 'Selecione as etapas para este modulo\n',
    name: "modStep",
    pageSize: 11,
    validate: (data) => data.length > 0 ? true : 'Selecione ao menos uma etapa.',
    choices: [
      {
        name: 'Home',
        value: 'HOME'
      },
      {
        name: 'Listagem',
        value: 'LISTAGEM'
      },
      {
        name: 'Produto',
        value: 'PRODUTO'
      },
      {
        name: 'Carrinho',
        value: 'CARRINHO'
      },
      {
        name: 'Contato',
        value: 'CONTATO'
      },
      {
        name: 'Formas de Pagamento',
        value: 'FORMAS_PAGAMENTO'
      },
      {
        name: 'Final do Pagamento',
        value: 'FinalPagamento'
      },
      {
        name: 'Página de Login',
        value: 'login'
      },
      {
        name: 'Menu do Cliente',
        value: 'menu-cliente'
      },
      {
        name: 'Paginas Institucionais',
        value: 'PAGINAS_INST'
      },
    ]
  }

  let response = await new Inquirer.prompt(consoleQuest)
  let stepArr = response.modStep
  
  if (stepArr.length == 10) stepArr = ['*']

  return stepArr.join(',')
}

const getModName = async () => {
  let consoleQuest = {
    type: 'string',
    message: 'Digite um nome para o módulo',
    name: "modName"
  }

  let response = await new Inquirer.prompt(consoleQuest)
  let modName = response.modName;

  modName = treatName(modName);

  if (modName.trim() == '') {
    console.log('Informe um nome válido'.red.bold)
    return await createMod();
  }

  return modName;
}

const createMod = async () => {
  let modName = await getModName();
  let steps = await getModStep();

  let newMod = {
    nome: modName,
    etapa: steps
  }

  let actualConfigs = readConfigs();
      actualConfigs.modulos_loja.push(newMod);

      createFiles(modName)
      saveUpdate(actualConfigs);

  console.log('Módulo criado com sucesso'.green.bold)
}



const listMods = async (arr) => {
  let consoleQuest = {
    type: 'list',
    message: 'Selecione um modulo para editar',
    name: "modOption",
    choices: arr.map((mod, i) => { return {name: mod.nome, value: i }}),
    loop: false
  }

  let response = await new Inquirer.prompt(consoleQuest)
  let modOption = response.modOption;

  console.log('Essa função ainda não foi criada!')
  return;
}

const intiateMods = async () => {
  let actualConfigs = readConfigs();

  if (typeof actualConfigs.modulos == undefined) {
    actualConfigs.modulos = []
    saveUpdate(actualConfigs);
  }
  if (typeof actualConfigs.modulos_loja == undefined) {
    actualConfigs.modulos_loja = []
    saveUpdate(actualConfigs);
  }

  let arrChoices = [      
    {
      name: 'Criar Módulo Personalizado',
      value: 0
    }
  ]

  if (actualConfigs.modulos_loja.length > 0) {
    arrChoices.push({
      name: 'Exibir Módulos Personalizados',
      value: 1
    })
  }

  if (actualConfigs.modulos.length > 0) {
    arrChoices.push({
      name: 'Exibir Módulos Padrões',
      value: 2
    })
  }

  let consoleQuest = {
    type: 'list',
    message: 'Oque você deseja fazer?',
    name: "modOption",
    choices: arrChoices
  }

  let response = await new Inquirer.prompt(consoleQuest)
  let modOption = response.modOption;

  if (modOption == 0) return await createMod();
  if (modOption == 1) return await listMods(actualConfigs.modulos_loja);
  if (modOption == 2) return await listMods(actualConfigs.modulos);

  return await listGroups(groupsArr);
}

module.exports = { default: intiateMods }