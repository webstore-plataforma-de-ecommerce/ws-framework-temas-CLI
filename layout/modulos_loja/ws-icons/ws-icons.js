wsMain.createModule({
  name: 'ws-icons',
  function: 'get',
  async get() {
    let data, cookieName = 'icons';

    if (ApiWS.LVdashview != 1) {
      let Cookie = ApiWS.Cookie.get(cookieName, 'D');
      
      if (Cookie && Cookie != '') data = Cookie;
    }

    let obj;

    if (!data) {
      let response = await fetch("https://arquivostemporarios.plataformawebstore.com.br/ftptempwebstore/IconesOficial.txt?versao=A-26-10");
      data = await response.text();

      let svgs = data.replace(/<svg/g, '|DIVIDER|<svg').split('|DIVIDER|');
      obj = {};

      svgs.forEach(text => {
        let tempDiv = wsMain.tools.createElm('div');
        tempDiv.innerHTML = text;

        try {
          obj[tempDiv.querySelector(':scope > svg').getAttribute('ico').toLowerCase().replace('.svg', '')] = text;
        } catch(_) {

        }
      });

    } else {
      obj = data;
    }
    
    wsMain.setGlobalData('icons', obj);
    ApiWS.Cookie.set(cookieName, 'D', obj);
      
    wsMain.data.replaceAllIcons();

      return true;
  }
});