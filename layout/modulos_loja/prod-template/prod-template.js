wsMain.createModule({
  name: 'prod-template',
  createProd(prod, template, configs) {
      Object.keys(configs).forEach(k => {
        if (!configs[k]) template.querySelectorAll(`[data-wsjs-prod-template="${k}"]`).forEach(elm => elm.remove());
      });

      function replaceData(elm, query) {
          let div = template.querySelector(`[data-wsjs-prod-template="${query}"]`);
          if (div) {
            try {

              div.getAttributeNames().forEach((attr) => {

                if (
                  attr != "data-wsjs-module" &&
                  attr != "data-wsjs-options" &&
                  attr != 'data-wsjs-infos' && 
                  attr != 'data-wsjs-banner' &&
                  attr != 'data-wsjs-listing' && 
                  attr != 'data-wsjs-prod-list' &&
                  attr != 'data-wsjs-prod-template' &&
                  attr != 'data-wsholder'
                  ) {
                    elm.setAttribute(attr, div.getAttribute(attr));
                  }
                });
                
                div.parentNode.insertBefore(elm, div);
                div.remove();
              } catch(err) {
                console.log(err);
              }
          }
      }

      function getOptionText(elm) {
          let optionText = template.querySelector(`[data-wsjs-prod-template=${elm}]`).innerHTML;

          return optionText;
      }

      replaceData(wsMain.tools.createElm({type: 'p', innerHTML: prod.nome}), 'name');

      /* Tratativa Imagens */
      let imgHiperLink = wsMain.tools.createElm({type: 'a', attrs: { href: prod.links['ver_produto'] }});

      
      let photo = prod.fotos && prod.fotos[0] ? prod.fotos[0] : '';

      let photowrap = '{photowrap}';        
      console.log(photowrap, 'PROPORÇÃO MODULO');

          photowrap = photowrapGlobal;
        let aspectRatio = '1/1';
        if ( photowrap == 'Quadrada') { 
          aspectRatio = '1/1'; 
        }
        if ( photowrap == 'Vertical') { 
          if (photo) photo = photo.replace('/PEQ_', '/MED_');
          console.log(photo);
          aspectRatio = '3/4'; 
        }
        if ( photowrap == 'Super Vertical') { 
          if (photo) photo = photo.replace('/PEQ_', '/MED_');
          console.log(photo);
          aspectRatio = '2/3'; 
        }
        if ( photowrap == 'Horizontal') { 
          aspectRatio = '4/3'; 
        }
        

        let img = wsMain.tools.createElm({
          type: 'img',
          lazyLoad: configs.lazyLoad,
          attrs: { 
            src: photo
          }
        });
        
        imgHiperLink.style.setProperty('aspect-ratio', aspectRatio);

        if (prod.fotos && prod.fotos[0]) imgHiperLink.append(img);
        else {
          imgHiperLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="269" height="380" viewBox="0 0 269 380">
        <g id="Grupo_3819" data-name="Grupo 3819" transform="translate(-18262 -4505.105)">
          <rect id="Retângulo_687" data-name="Retângulo 687" width="269" height="380" transform="translate(18262 4505.105)" fill="#f4f4f4"/>
          <text id="Produto_sem_foto" data-name="Produto sem foto" transform="translate(18328 4769)" fill="#d1cece" font-size="17" font-family="OpenSans, Open Sans"><tspan x="0" y="0">Produto sem foto</tspan></text>
          <g id="Grupo_3818" data-name="Grupo 3818" transform="translate(3.216 -489.685)">
            <path id="Caminho_4706" data-name="Caminho 4706" d="M1477.439,377.325h-12.151a3.038,3.038,0,0,1,0-6.075h12.151a3.038,3.038,0,0,1,0,6.075Z" transform="translate(16903.195 4802.403)" fill="#dbdbdb"/>
            <path id="Caminho_4707" data-name="Caminho 4707" d="M1508.494,433.525h-42.446a3.038,3.038,0,1,1,0-6.075h42.446c8.182,0,12.6-4.172,13.123-12.353l2.106-33.455a11.906,11.906,0,0,0-2.389-8.02,3.038,3.038,0,1,1,4.86-3.645,18.2,18.2,0,0,1,3.6,12.07l-2.106,33.455C1526.964,426.963,1519.956,433.525,1508.494,433.525Z" transform="translate(16905.516 4794.807)" fill="#dbdbdb"/>
            <path id="Caminho_4708" data-name="Caminho 4708" d="M1466.386,444.094a3.1,3.1,0,0,1-2.552-1.377,21.075,21.075,0,0,1-3.2-10.45l-2.106-33.415a17.987,17.987,0,0,1,4.9-13.609,18.3,18.3,0,0,1,13.326-5.792,3.588,3.588,0,0,0,3.16-1.984l2.916-5.792a16.5,16.5,0,0,1,13.609-8.424h9.276a16.483,16.483,0,0,1,13.569,8.384l2.916,5.913a3.618,3.618,0,0,0,3.159,1.9,3.038,3.038,0,1,1,0,6.075,9.744,9.744,0,0,1-8.587-5.225l-2.956-5.913a10.283,10.283,0,0,0-8.141-5.022H1496.4a10.357,10.357,0,0,0-8.182,5.063l-2.875,5.792a9.668,9.668,0,0,1-8.587,5.306,12.194,12.194,0,0,0-8.91,3.848,11.952,11.952,0,0,0-3.241,9.073l2.107,33.455a14.727,14.727,0,0,0,2.227,7.452,3.052,3.052,0,0,1-.85,4.212A3,3,0,0,1,1466.386,444.094Z" transform="translate(16891.727 4778)" fill="#dbdbdb"/>
            <path id="Caminho_4709" data-name="Caminho 4709" d="M1477.381,400.535a16.158,16.158,0,0,1-9.963-3.443,3.03,3.03,0,1,1,3.726-4.779,10.128,10.128,0,0,0,16.364-7.979,9.943,9.943,0,0,0-1.54-5.387,3.051,3.051,0,0,1,5.144-3.281,16.2,16.2,0,0,1-13.731,24.869Z" transform="translate(16915.402 4811.595)" fill="#dbdbdb"/>
            <path id="Caminho_4710" data-name="Caminho 4710" d="M1461.28,450.323a3.005,3.005,0,0,1-2.147-.891,3.056,3.056,0,0,1,0-4.293l81.006-81.006a3.036,3.036,0,0,1,4.294,4.293l-81.006,81.006A3.006,3.006,0,0,1,1461.28,450.323Z" transform="translate(16891.002 4778.008)" fill="#dbdbdb"/>
          </g>
        </g>
      </svg>
      `;

      imgHiperLink.classList.add('whithout-image');
      }
      
      replaceData(imgHiperLink, 'image');

      if (prod.disponivel) {

          if (typeof WsFavoritos != undefined) {
              let icons = '<span data-wsjs-icon="favorite"></span>';

              let div = wsMain.tools.createElm({
                  type: 'div',
                  innerHTML: icons,
                  attrs: {
                      id: 'prod-favorite-link-' + prod.id,
                      data: 'prod-favorite-link-' + prod.id, 
                      onclick: `funcAddFavoriteWs("${prod.id}");`
                  }
              });
              replaceData(div, 'favorite');
          }

          // Tratativa Preços
          let precos = prod.precos;
          if (precos) {
              let defaultPrice = precos.preco, promoPrice = precos.preco_promocao;
              let precoMain;
              
              if (isNaN(promoPrice) || promoPrice >= defaultPrice || promoPrice == 0) {
                  replaceData(wsMain.tools.createElm({type: 'span', innerHTML: wsMain.data.treatPrice(defaultPrice)}), 'price-main');
                  precoMain = defaultPrice;
              } else if (promoPrice < defaultPrice) {
                  replaceData(wsMain.tools.createElm({type: 'span', innerHTML: wsMain.data.treatPrice(promoPrice)}), 'price-main');
                  replaceData(wsMain.tools.createElm({type: 'span', innerHTML: wsMain.data.treatPrice(defaultPrice)}), 'price-second');
                  precoMain = promoPrice;

                  let spanText = getOptionText('desconto');
                  let descountPercentage = Math.round(100 - (((promoPrice)*100)/defaultPrice));
                  if (spanText == null || spanText == undefined) spanText = '% Desconto';
                  let spanTag = wsMain.tools.createElm({type: 'span', innerHTML: descountPercentage + spanText});
                  replaceData(spanTag, 'desconto');
              } else {
                  alert('preco-a-combinar');
              }
              
              let maxInstallments = precos.max_parcelas, minValueToDivide = precos.valor_min_parcelas;
              let installmentsNum, installments = [];
              
              if (maxInstallments && !isNaN(maxInstallments) && precoMain > minValueToDivide) {
                  for (let i = maxInstallments; i > 1; i--) {
                      let newInstallment = precoMain / i;
                      if (newInstallment >= minValueToDivide && typeof installmentsNum == 'undefined') installmentsNum = i;
                  }
                  
              // Padrão com juros
              if (installmentsNum) {
                  let installmentString = installmentsNum + 'x de ' + wsMain.data.treatPrice(precoMain/installmentsNum);
                  if (precos.juros_inicia && !isNaN(precos.juros_inicia) && precos.juros_inicia > installmentsNum) installmentString += ' sem juros';
                  
                  let spanInstallment = wsMain.tools.createElm({type: 'span', innerHTML: installmentString});
                  
                  replaceData(spanInstallment, 'price-installment');
              }
              
              
              // Padrão sem juros
              // if (installmentsNum && installmentsNum >= precos.juros_inicia) {
                  //     let installmentString = installmentsNum + 'x de ' + wsMain.data.treatPrice(precoMain/installmentsNum) + ' sem juros';
                  //     let spanInstallment = wsMain.tools.createElm({type: 'span', innerHTML: installmentString});
                  //     replaceData(spanInstallment, 'price-installment');
                  // }
              }
              
              if (precos.desconto_avista && !isNaN(precos.desconto_avista)) {
                  let spanCache = wsMain.tools.createElm({type: 'span', innerHTML: wsMain.data.treatPrice(precoMain - (precoMain * (precos.desconto_avista/100))) + ' &agrave; vista'});
                  replaceData(spanCache, 'price-cash');
              }

              if (prod.links?.botao_comprar) {
                  replaceData(wsMain.tools.createElm({type: 'a', innerHTML: 'Adicionar ao carrinho', attrs: {
                      href: prod.links.botao_comprar
                  }}), 'button');
              }

          } else {
              let consultPrice = wsMain.tools.createElm({type: 'span', innerHTML: 'Preço sobe consulta', attrs: {
                  class: 'prod-consult-message'
              }});
              replaceData(consultPrice, 'price-main');
              template.children[0].classList.add('consult')
          }

          if (prod.lancamento) {
              let spanText = getOptionText('lancamento');
              if (spanText == null || spanText == undefined) spanText = 'Lançamento';
              let spanTag = wsMain.tools.createElm({type: 'span', innerHTML: getOptionText('lancamento') || 'Lançamento'});
              replaceData(spanTag, 'lancamento');
          }

          if (prod.fretegratis) {
              let spanText = getOptionText('frete-gratis');
              if (spanText == null || spanText == undefined) spanText = 'Frete Grátis';
              let spanTag = wsMain.tools.createElm({type: 'span', innerHTML: spanText});
              replaceData(spanTag, 'frete-gratis');
          }

          

      } else {
          let spanMessage = wsMain.tools.createElm({
            type: 'span', 
            innerHTML: 'Produto indispon&iacute;vel'
          });
          template.children[0].classList.add('unavaliable');
          replaceData(spanMessage, 'price-main');
          spanMessage.classList.add('prod-unavaliable-message');
      }

      template.querySelectorAll('[data-wsjs-prod-template]').forEach(elm => {
          try {elm.remove(); } catch(e) {}
      });

      return template;
  }
});