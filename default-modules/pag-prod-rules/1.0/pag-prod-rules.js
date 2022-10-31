wsMain.createModule({
  name: 'pag-produto',
  function: 'get',
  onlyAfter: 'info-lojas',
  options: {
    slide: {
      dots: {
        breakpoints: {
          '(min-width: 1280px)': {
            slides: {
              perView: 5,
              spacing: 10
            }
          },
          '(min-width: 1024px) and (max-width: 1279px)': {
            slides: {
              perView: 4,
              spacing: 7
            }
          },
          '(max-width: 1023px)': {
            slides: {
              perView: 3,
              spacing: 5
            }
          }
        }
      }
    }
  },
  subFunctions: {
      dots(prod, options, text) {
        let dotsDiv =  wsMain.modules['pag-produto'].subFunctions.createSlide(prod, options, 'thumb', false); 
            dotsDiv.setAttribute('data-wsjs-product', 'dots');
          return dotsDiv;
      },
      photos(prod, options, text) {
        let photosDiv =  wsMain.modules['pag-produto'].subFunctions.createSlide(prod, options, 'normal', false); 
            photosDiv.setAttribute('data-wsjs-product', 'photos');
          return photosDiv;
      },
      name(prod, options, text) {
        if (!prod.nome) return;
        return wsMain.tools.createElm({type: 'h1', innerHTML: prod.nome});
      },
      breadcrumb(prod, options, text) {
          let arr = prod.migalha;
          let div = wsMain.tools.createElm('div');
          if (text) arr[0].nome = text;

          arr.forEach((crumb, i) => {
                  let crumbSpam = wsMain.tools.createElm('span');

                  let hiperLink = wsMain.tools.createElm({
                      type: 'a', 
                      innerHTML: crumb.nome,
                      attrs: {
                          href: crumb.url
                  }});

                  div.append(hiperLink);
                  if (i != arr.length-1) div.append(crumbSpam);
              });
          return div;
      },
      manufacturer(prod, options, text) {
          let obj = prod.fabricante;

          if (!obj.nome) return false;

          let span = wsMain.tools.createElm('span'),
              hiperLink = wsMain.tools.createElm({
                type: 'a', 
                innerHTML: `${text ? text : ''}${obj.nome}`, 
                attrs: {
                  href: obj.url
                }
              });
  
          span.append(hiperLink);
          return span;
      },
      code(prod, options, text) {
          return wsMain.tools.createElm({type: 'span', innerHTML: prod.codigo});
      },
      priceOf(prod, options, text) {
          let priceToPut = prod.precos['preco_promocao'] || prod.precos['preco'];
          return wsMain.tools.createElm({type: 'span', innerHTML: wsMain.data.treatPrice(priceToPut)});
      },
      priceFor(prod, options, text) {
          if (!prod.precos['preco_promocao']) return false;
          return wsMain.tools.createElm({type: 'span', innerHTML: wsMain.data.treatPrice(prod.precos['preco'])});
      },
      priceCash(prod, options, text) {
          let price = prod.precos['preco_promocao'] || prod.precos['preco'];
          let d = prod.precos['desconto_avista'];

          if (d && d > 0) price = price - (price * (d/100));

          return d && parseInt(d) > 0 ? wsMain.tools.createElm({type: 'span', innerHTML: `${wsMain.data.treatPrice(price)} ${text}`}) : false; 
      },
      tagDescount(prod, options, text) {
          let promoPrice = prod.precos['preco_promocao'];
          if (!promoPrice) return false;

          let defaultPrice = prod.precos['preco'];

          let tagText = Math.round(100 - (((promoPrice)*100)/defaultPrice)) +'%'; 
          let tag = wsMain.tools.createElm({
              type: 'span',
              innerHTML: text.replace('{{value}}', tagText)
          });

          return tag
      },
      tagShippingFree(prod, options, text) {
          return prod.fretegratis ? wsMain.tools.createElm({type: 'span', innerHTML: text}) : false;
      },
      tagNew(prod, options, text) {
          return prod.lancamento ? wsMain.tools.createElm({type: 'span', innerHTML: text}) : false;
      },
      shortDesc(prod, options, text) {
        console.log(prod.breve, 'BREVEEE');
          if (!prod.breve || prod.breve == '') return false;

          let div = wsMain.tools.createElm('div'),
              textParagraph = wsMain.tools.createElm({type: 'p', innerHTML: prod.breve}),
              hiperLink = wsMain.tools.createElm({type: 'a', innerHTML: text, attrs: {
                class: 'tag-link',
                  href: options.link || '#'
              }});

          div.append(textParagraph);
          div.append(hiperLink);

          return div;
      },
      createSlide(prod, options, photoType, lazy = true) {
        let div = wsMain.tools.createElm('div');
        let photos = prod.fotos;
        let children = false;

        if (Array.isArray(photos) && photos.length > 0) {
          photos.forEach(p => {
              let img = wsMain.tools.createElm({
                  type: 'img', 
                  lazyLoad: lazy,
                  attrs: {
                      src: p[photoType]
                  }}
              );
              let imgHolder = wsMain.tools.createElm('div');
              imgHolder.append(img);
              div.append(imgHolder);
          });
          children = true;
        }

        let v = prod.video;
        if (v && options.video != false) {

          let url, code;
          try { url = new URL(v); } catch(_) {}

          if (url) {
            code = url.searchParams.get('v') || url.split('/')[2] || false;
          } else {
            code = v;
          }

          if (code) {
            div.innerHTML +=
            `<div class="iframe-slide"><div class="iframe-container"><iframe
            src="https://www.youtube.com/embed/${code}" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; 
            autoplay; 
            clipboard-write; 
            encrypted-media; 
            gyroscope; 
            picture-in-picture" 
            allowfullscreen>
            </iframe></div><div class="iframe-overlay">${options.icon || ''}</div></div>`;
            children = true;
          }
        }

        if (!children) {

          let imgHolder = wsMain.tools.createElm('div');
          imgHolder.classList.add('whithout-image');
          imgHolder.innerHTML = `<span data-wsjs-icon="noimage"></span>`;
          div.append(imgHolder);
        }

        return div;
      },
      avaliableDays(prod, options, text) {
          return wsMain.tools.createElm({type: 'span', innerHTML: `${text}${prod.disponibilidade && prod.disponibilidade > 0 ? prod.disponibilidade : 'Imediata'}`});
      },
      buttonBuy(prod, options, text) {
          let button = wsMain.tools.createElm({type: 'button', innerHTML: text, attrs: {
              onclick: 'FuncaoBtComprarClick();' 
          } });
          return button;
      },
      buttonCart(prod, options, text) {
          let button = wsMain.tools.createElm({
              type: 'button', 
              innerHTML: text,
              attrs: {
                  onclick: 'FuncaoBtComprarClick(false);'
              } 
          });
          
          return button;
      },
      buttonFavorite(prod, options, text) {
          if (typeof WsFavoritos == undefined) return false;
          let id = document.querySelector('#LV_HD_PROD_ID').value;

          let icons = `<span data-wsjs-icon="favorite"></span>`

          let button = wsMain.tools.createElm({
              type: 'button',
              innerHTML: icons + text,
              attrs: {
                  id: 'prod-favorite-link-' + id,
                  data: 'prod-favorite-link-' + id, 
                  onclick: `funcAddFavoriteWs("${id}");`
              }
          });

          return button;
      },
      buttonShare(prod, options, text) {
          let button = wsMain.tools.createElm({
              type: 'button',
              innerHTML: text,
              attrs: {
                  onclick: "this.nextElementSibling.setAttribute('style', 'transform:none;')"
              }
          })

          return button;
      },
      installments(prod, options, text) {
          let div = wsMain.tools.createElm('div'), numOfInstallments = 0;

          let price = prod.precos['preco_promocao'] || prod.precos['preco'];

          if (!prod.precos['max_parcelas'] || prod.precos['max_parcelas'] == 0) return false;

          function getInstallment(price, min, i) {
              let installments = price / i;

              if (installments < min) {
                  return getInstallment(price, min, i-1);
              } else {
                  return i;
              }
          }

          div.innerHTML = text;

          let containerList = wsMain.tools.createElm('ul');

          let installmentsNum = getInstallment(price, prod.precos['valor_min_parcelas'], prod.precos['max_parcelas']);

          console.log(installmentsNum);

          try {
              for (let i = 1; i <= installmentsNum; i++) {
                let installmentPrice = wsMain.data.compostFeeValue(prod.precos['juros'], i, prod.precos['juros_inicia'], price);
                  let innerInstallment = 
                  i < prod.precos['juros_inicia'] 
                  ? 
                  `${i}x de ${wsMain.data.treatPrice(installmentPrice)} <span>sem juros<span>` 
                  : 
                  `${i}x de ${wsMain.data.treatPrice(installmentPrice)}`;
                  
                  let newInstallment = wsMain.tools.createElm({
                      type: 'li', 
                      innerHTML: innerInstallment
                  });

                  containerList.append(newInstallment);
              }
          } catch(err) {
              console.log(err)
          }

          div.append(containerList);

          return div;
      },
      priceInstallment(prod, options, text) {
        let price = prod.precos['preco_promocao'] || prod.precos['preco'];

        if (!prod.precos['max_parcelas'] || prod.precos['max_parcelas'] == 0) return false;

        let initialFeeNum = prod.precos['juros_inicia'];

        let maxInstallmentsNum = prod.precos['max_parcelas'];

        let minInstallmentsValue = prod.precos['valor_min_parcelas'];

        let minInstallmentsFee = prod.precos['juros_inicia'];

        if (price <= minInstallmentsValue) return false;
        
        function getInstallment(price, min, i) {
          if ((price / i) < min) {
              return getInstallment(price, min, i-1);
          } else {
              return i;
          }
        }

        let installmentIndex = getInstallment(price, minInstallmentsValue, maxInstallmentsNum);
        let installmentsWhioutFee = false;

        for (let i = installmentIndex; i >= 1; i--) {
          if (i < minInstallmentsFee && (price/i) >= minInstallmentsValue && !installmentsWhioutFee) installmentsWhioutFee = i;
        }

        let innerSpan;
        if (installmentsWhioutFee) {
          innerSpan = `${installmentsWhioutFee}x de ${wsMain.data.treatPrice((price/installmentsWhioutFee))} <span>sem juros<span>`;
        } else {
          innerSpan = `${installmentIndex}x de ${wsMain.data.treatPrice((price/installmentIndex))}`;
        }

        let span = wsMain.tools.createElm({
          type: 'span',
          innerHTML: innerSpan
        });

        return span;
      },
      warranty(prod, options, text) {
          let div = wsMain.tools.createElm('div');

          if (!prod['garantia_meses']) return false;

          div.innerHTML = text;

          let span = wsMain.tools.createElm({
              type: 'span',
              innerHTML: `Este produto possui garantia de ${prod['garantia_meses']} ${prod['garantia_meses'] == 1 ? 'm&ecirc;s' : 'meses'}.`
          })

          div.append(span);

          return div;
      },
      descriptions(prod, options, text) {
          let div = wsMain.tools.createElm('div');
          if (!prod.descricoes) return false;

          prod.descricoes.forEach((d, i) => {
              let descDiv = wsMain.tools.createElm('div');
              let title = wsMain.tools.createElm({type: 'h2', innerHTML: d.titulo});
              if (options.accordion) {
                let input = wsMain.tools.createElm({
                  type: 'input',
                  attrs: {
                    type: 'checkbox',
                    id: 'main-desc-' + i
                  }
                });
                let label = wsMain.tools.createElm({
                  type: 'label',
                  attrs: {
                    for: 'main-desc-' + i
                  }
                });
                let spanArrow = wsMain.tools.createElm({
                  type: 'span',
                  attrs: {
                    'data-wsjs-icon': 'arrow'
                  }
                });

                descDiv.append(input);
                label.append(title);
                label.append(spanArrow);  
                descDiv.append(label);

              } else {
                descDiv.append(title);
              }
              descDiv.innerHTML += d.conteudo;

              div.append(descDiv);
          });

          return div;
      },
      video(prod, options, text) {
          let v = prod.video;
          if (!v) return false;

          let url = new URL(v);
          let code = url.searchParams.get('v') || url.split('/')[2] || null;

          if (!code) return false;

          let div = wsMain.tools.createElm('div');
          div.innerHTML = text;

          div.innerHTML +=
          `<div><iframe
              src="https://www.youtube.com/embed/${code}" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; 
              autoplay; 
              clipboard-write; 
              encrypted-media; 
              gyroscope; 
              picture-in-picture" 
              allowfullscreen>
          </iframe></div>`;

          return div;
      },
      quantitySelector(prod, options, text) {
          let input = wsMain.tools.createElm({
              type: 'input'
          });
              input.value = 0;
          return input;
      },  
      shipping(prod, options, text) {
          let div = wsMain.tools.createElm('div');
          return div
      },
      shareCopy(prod, options, text) {
          return wsMain.tools.createElm({
              type: 'a',
              innerHTML: text,
              attrs: {
                  onclick: "wsMain.tools.copyLink(this)"
              }
          });  
      },
      shareWhatsApp(prod, options, text) {
          let msgToSend = `Olha esse ${prod.nome} da ${window.location.href}`
          let uri = 'https://api.whatsapp.com/send?text=' + encodeURI(msgToSend);
          return wsMain.tools.createElm({
              type: 'a',
              innerHTML: text,
              attrs: {
                  target: '__blank',
                  href: uri
              }
          });
      },
      shareEmail(prod, options, text) {
          let msgToSend = `Olha esse ${prod.nome} da ${window.location.href}`
          let uri = 'mailto:?body=' + encodeURI(msgToSend);
          return wsMain.tools.createElm({
              type: 'a',
              innerHTML: text,
              attrs: {
                  target: '__blank',
                  href: uri
              }
          });
      },
      shareFacebook(prod, options, text) {
          let uri = "http://www.facebook.com/sharer.php?u=" + window.location.href + "&t=" + prod.nome;
          return wsMain.tools.createElm({
              type: 'a',
              innerHTML: text,
              attrs: {
                  target: '__blank',
                  href: uri
              }
          });
      },
      features(prod, options, text) {
        let features = prod.caracteristicas;
        if (!Array.isArray(features) || features.length == 0) return false;

        let div = wsMain.tools.createElm({
          type: 'div',
          innerHTML: text
        });

        let table = wsMain.tools.createElm('table'),
            tbody = wsMain.tools.createElm('tbody'); 

        features.forEach((feature) => {
            let line = wsMain.tools.createElm('tr');

            let key = wsMain.tools.createElm({
              type: 'td',
              innerHTML: feature.nome,
            });

            let value = wsMain.tools.createElm({
              type: 'td',
              innerHTML: feature.valor
            });

            line.append(key);
            line.append(value);
            tbody.append(line);
        });

        table.append(tbody);
        div.append(table);

        return div;
      },
      modal(prod, options, text) {
        let photosDiv =  wsMain.modules['pag-produto'].subFunctions.createSlide(prod, options, 'zoom'); 
        photosDiv.setAttribute('data-wsjs-product', 'modal');
        
        return photosDiv;
      }
  },
  closeModal(e) {
    if (e && e.type == 'keyup' && e.key != 'Escape') return;
    let modalDiv = document.querySelector('[data-wsjs-product="modal"]');
    modalDiv.setAttribute('style', 'display: flex; opacity: 0;');
    setTimeout(() => {
      modalDiv.setAttribute('style', 'display: none; opacity: 0;');
    }, 400);

      try {
        document.removeEventListener('keyup', wsMain.modules['pag-produto'].closeModal, false);
      } catch(_) {

      }
  },
  update(json) {
    try {
      
      try {
        delete json['nome'];          
      } catch(_) {}

      let newPrices = JSON.parse(JSON.stringify(json['precos']));

      json = {...wsMain.globalData.infoProduto, ...json};

      json['precos'] = wsMain.globalData.infoProduto['precos'];

      if (newPrices['preco']) json.precos['preco'] = newPrices['preco'];

      if (newPrices['preco_promocao']) json.precos['preco_promocao'] = newPrices['preco_promocao'];
      else if (newPrices['preco']) delete json.precos['preco_promocao'];

      console.log(json);

      document.querySelectorAll('[data-wsjs-force]').forEach(span => {
        let spanTag = span.getAttribute('data-wsjs-product');

        let template = wsMain.tools.createElm('div')                                                                                                          
        template.innerHTML = wsMain.globalData.productHTML;
        
        let spanTemplate = template.querySelector(`[data-wsjs-product=${spanTag}]`);
        let spanOptions = wsMain.tools.getWsData(spanTemplate, 'options');
        
        let elm = wsMain.modules['pag-produto'].subFunctions[spanTag](json, spanOptions, spanTemplate.innerHTML);

        if (elm) {
          span.setAttribute('data-wsjs-force', 'load');
          wsMain.tools.replaceSpanTag(elm, span);
        } else {
          span.setAttribute('data-wsjs-force', 'none');
        }
        wsMain.data.replaceAllIcons();
      });

      wsMain.modules['pag-produto'].slideTreat();

    } catch(err) {
      console.log(err);
    }
  },
  async get() {
      let data = await ApiWS.Calls.produto();

      wsMain.modules[this.funcName].create(data);
  },
  create(returnJson) {
      let prodState = this.getProdState(returnJson);


      let qtdInpt = document.querySelector('[data-wsjs-product="quantity"]');

      qtdInpt.setAttribute('data-min', wsMain.globalData.infoProduto.quantidade_minima);
      qtdInpt.value = wsMain.globalData.infoProduto.quantidade_minima;

      qtdInpt.addEventListener('keypress', e => wsMain.data.quantityFilter(e));
      
      document.querySelectorAll('*[data-wsjs-product-state]').forEach(elm => elm.getAttribute('data-wsjs-product-state') != prodState ? elm.remove() : null);

      wsMain.globalData.productHTML = document.querySelector('[data-wsjs-product="container"]').innerHTML;

      wsMain.tools.replaceSubFunctions(returnJson, this.subFunctions, 'product');

      if (prodState == 'consult') {
        try {
          let form = document.querySelector('[data-wsjs-contact=modal] form');
          document.addEventListener('click', (e) => {
            if (!form.contains(e.target) && !document.querySelector('[data-wsjs-contact=modalButton]').contains(e.target)) {
              wsMain.modules['pag-produto'].modalConsult(true);
            }
          });
        } catch(_) {}

        try {
          document.querySelector('[data-wsjs-contact=prodId]').value = document.querySelector("#LV_HD_PROD_ID").value;
        } catch(_) {}

      }
      
      document.querySelectorAll('.prod-side-container').forEach(elm => elm.removeAttribute('style'));
      document.querySelectorAll('.prod-block-container').forEach(elm => { if (elm.innerText == '') elm.remove() });
      
      document.querySelectorAll('[data-wsjs-infoHolder]').forEach(elm => {
        if (elm.innerHTML.trim() == '') {
          elm.remove();
        } else {
          elm.removeAttribute('data-wsjs-infoHolder');
        }
      });
      
      try {
        wsMain.modules['pag-produto'].slideTreat();
      } catch(e) {
      }

      try {
        document.addEventListener("scroll", wsMain.modules['pag-produto'].floatPrice, 100);
      } catch(e) {
      }

      document.querySelector('.loader-container').setAttribute('style', 'opacity:0');
      setTimeout(() => {
          document.querySelector('.prod-to-load').classList.remove('prod-to-load');
          document.querySelector('.loader-container').remove();
      }, 200);
  },
  slideTreat() {
      // Tratando Slides (Modal, Photos e Dots)
      try {
        var photosDiv = document.querySelector('[data-wsjs-product="photos"]'),
        photosSlideOption = wsMain.tools.getWsData(photosDiv, 'slide');

        if (photosSlideOption) {
          try {
            photosSlideOption = {...wsMain.options['pag-produto'].slide['photos'], ...photosSlideOption};
          } catch(_) {}
        }

        var dotsDiv = document.querySelector('[data-wsjs-product="dots"]'),
        dotsSlideOption = wsMain.tools.getWsData(dotsDiv, 'slide');

        if (dotsSlideOption) {
          try {
            dotsSlideOption = {...wsMain.options['pag-produto'].slide['dots'], ...dotsSlideOption};
          } catch(err) {};
        }

        var modalDiv = document.querySelector('[data-wsjs-product="modal"]'),
        modalSlideOption = wsMain.tools.getWsData(modalDiv, 'slide');

        if (modalSlideOption) {
          try {
            modalSlideOption = {...wsMain.options['pag-produto'].slide['modal'], ...modalSlideOption};
          } catch(_) {}
        }
            
        function ThumbnailPlugin(main) {
          return (slider) => {
            function removeActive() {
              slider.slides.forEach((slide) => {
                slide.classList.remove("active");
              });
            }

            function addActive(idx) {
              slider.slides[idx].classList.add("active");
            }
  
            function addClickEvents() {
              slider.slides.forEach((slide, idx) => {
                slide.addEventListener("click", () => {
                  main.moveToIdx(main.track.absToRel(idx));
                });
              });
            }
  
            slider.on("created", () => {
              addActive(slider.track.details.rel);
              addClickEvents();
              main.on("animationStarted", (main) => {
                removeActive();
                const next = main.animator.targetIdx || 0;
                addActive(main.track.absToRel(next));
                if (slider.track.details.slides.length > slider.options.slides.perView) {
                  slider.moveToIdx(main.track.absToRel(next));
                }
              });
            });
          };
        }

        function ModalPlugin(main) {  
          return (slider) => {                    
            main.on("slideChanged", () => {
              const next = main.animator.targetIdx || 0;
              if (slider.track.details.abs != next) slider.moveToIdx(next);
            });
          }
        }

        let [photoSuccess, photoSlider] = photosSlideOption ? 
        wsMain.tools.createSlide(photosDiv, photosSlideOption, wsMain.globalData.infoProduto['tipo_zoom_fotos'] == '1' ? [] : [])
        :
        [false, null];

        let [dotSuccess, dotSlider] = dotsSlideOption ? wsMain.tools.createSlide(dotsDiv, dotsSlideOption, [ThumbnailPlugin(photoSlider)])
        :
        [false, null];

        let [modalSuccess, modalSlider] = modalSlideOption ? wsMain.tools.createSlide(modalDiv, modalSlideOption, [ModalPlugin(photoSlider)])
        :
        [false, null];
        
        function openModal(modal) {
            photoSlider.slides.forEach(slide => {
              slide.addEventListener('click', () => {
                document.addEventListener('keyup', wsMain.modules['pag-produto'].closeModal, false);
                modal.setAttribute('style', 'display: flex;');
                setTimeout(() => {
                  modal.setAttribute('style', 'display: flex; opacity: 1;');
                  modalSlider.update();
                }, 1);
              });
            });
        }

        openModal(modalDiv);
          
        let closeButton = wsMain.tools.createElm({
          type: 'span',
          attrs: {
            'data-wsjs-icon': 'close',
            class: 'close-button',
            onclick: 'wsMain.modules["pag-produto"].closeModal()'
          }
        });

        wsMain.data.treatIcon(closeButton);

        modalDiv.append(closeButton);
        
        setTimeout(() => {
          if (modalSuccess) modalSlider.update();
          if (photoSuccess) photoSlider.update();
          if (dotSuccess) dotSlider.update();
          setTimeout(() => {
            if (modalSuccess) modalSlider.update();
            if (photoSuccess) photoSlider.update();
            if (dotSuccess) dotSlider.update();
          }, 50);

          wsMain.data.replaceAllIcons();

          document.querySelectorAll("*[data-wsjs-lazyload=scroll]").forEach((elm) => {
            if (elm.getBoundingClientRect().top < window.innerHeight) {
              wsMain.tools.lazyLoad(elm);
            }
          });

          modalDiv.setAttribute('style', 'display: none;');
        }, 100);
    } catch (err) {
        console.log(err);
    }
  },
  getProdState(prod) {
      if (wsMain.globalData['infoLoja'].estrutura['preco_apos_login']) return 'login';

      return prod.modo == 3 ? 'consult' : prod.disponivel ? 'available' : 'unavailable'; 
  },
  shippingHolder(e) {
      if (e.key == 'Enter') try {document.querySelector('[data-wsjs-shipping]').click()} catch(_) {};
      let v = e.target.value.replace(/\D/g,"");
          e.target.value = v.replace(/^(\d{5})(\d)/,"$1-$2");
  },
  modalConsult(force) {
    let elm = document.querySelector('[data-wsjs-contact=modal]');
    let style = elm.getAttribute('style');
    if (style == 'display:flex;opacity:1;' || force) {
      elm.setAttribute('style', 'display:flex;opacity:0;');
      setTimeout(() => {
        elm.setAttribute('style', 'display:none;opacity:0;');
      }, 400);
    } else {
      elm.setAttribute('style', 'display:flex;opacity:0;');
      setTimeout(() => {
        elm.setAttribute('style', 'display:flex;opacity:1;');
      }, 1);
    }
  },
  async calculateShipping(elm) {
      let CEP = elm.value.replace('-', '');
      if (CEP.length != 8) return alert('Preencha o CEP Corretamente');

      let container = document.querySelector('[data-wsjs-shipping="container"]');
      
      container.innerHTML = `
      <section class="loader-container">
        <div class="loader"></div>
      </section>`;

      let 
          PROD_PRECO = wsMain.globalData['infoProduto'].precos.preco_promocao || wsMain.globalData.InfosProduto.precos.preco,
          PROD_PESO = 0,
          PROD_PRAZO = wsMain.globalData.prazo,
          LV_ID = document.querySelector("#HD_LV_ID").value,
          PROD_ID = document.querySelector("#LV_HD_PROD_ID").value,
          QTD = '1'
  
      let VarFaltaXFreteGratis = typeof ws_fretegratis_faltaX !== 'undefined' ? "1" : "0";
  
      let params = {
          "LV_ID": LV_ID,
          "PED_ID": "0",
          "TOTAL": PROD_PRECO,
          "PROD_PRAZO": PROD_PRAZO,
          "QTD": QTD,
          "cep_orig": "VAZIO",
          "cep_dest": CEP,
          "peso": PROD_PESO,
          "ESEDEX_LOG": "VAZIO",
          "ESEDEX_PASS": "VAZIO",
          "LV_FRETE_ACEITAR": "VAZIO",
          "PROD_ID": PROD_ID,
          "FALTA_X": VarFaltaXFreteGratis
      }
  
      let uri = endPointRestCalls + "/CheckoutSmart/CalculaFrete.aspx";
  
      uri += '?'
      Object.keys(params).forEach(p => {
        uri += p + '=' + params[p] + "&"
      });
      uri = uri.substring(0, uri.length - 1);

      let response = await fetch(uri);
      let data = await response.text();

      let coments = data.split('<ul')[0];

      wsMain.globalData['shippingInfo'] = coments;

      let tempDiv = wsMain.tools.createElm('div');
          tempDiv.innerHTML = data;

      let newDiv = wsMain.tools.createElm('ul');
      tempDiv.querySelectorAll('li div').forEach(item => {
        let spanPrice = wsMain.tools.createElm('span');
        spanPrice.innerHTML = item.querySelector('strong').innerText;
        let spanDays = wsMain.tools.createElm('span')
        spanDays.innerHTML = item.querySelector('small').innerText.replace('(em até ', '').replace(')', '');
    
        item.querySelector('strong').remove();
        item.querySelector('small').remove();
    
        let spanName = wsMain.tools.createElm('span')
        spanName.innerHTML = item.innerText.replace(' -', '').trim();
        let listItem = wsMain.tools.createElm('li');
        listItem.append(spanName);
        listItem.append(spanPrice);
        listItem.append(spanDays);
        newDiv.append(listItem);
      });

      tempDiv.innerHTML = '';

      let p = wsMain.tools.createElm({
        type: 'p',
        innerHTML: 'Rua Sei Lá Das Quantas'
      });

      let icon = wsMain.tools.createElm({
        type: 'span',
        attrs: {
          "data-wsjs-icon": 'localization'
        }
      });

      p.append(icon);

      wsMain.data.treatIcon(icon);

      // tempDiv.append(p);
      tempDiv.append(newDiv);

      container.querySelector('.loader-container').style.opacity = '0';
      setTimeout(() => {
        container.innerHTML = tempDiv.innerHTML;
      }, 200);

    return;
  },
  floatPrice() {
    let floatingContainer = document.querySelector('[data-wsjs-product="floatPrice"]');
    
    let h = floatingContainer.offsetHeight;
    let hVrf = (document.querySelector('body').offsetHeight - window.innerHeight)*.85;

    console.log(h, hVrf);
    if (scrollY >= hVrf) floatingContainer.style.transform = 'translateY(100%)';
    else floatingContainer.style.transform = 'translateY(0)';
  }
});