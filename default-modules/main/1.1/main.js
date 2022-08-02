/*! lazysizes - v5.2.0 */
!function (a, b) { var c = b(a, a.document, Date); a.lazySizes = c, "object" == typeof module && module.exports && (module.exports = c) }("undefined" != typeof window ? window : {}, function (a, b, c) { "use strict"; var d, e; if (function () { var b, c = { lazyClass: "lazyload", loadedClass: "lazyloaded", loadingClass: "lazyloading", preloadClass: "lazypreload", errorClass: "lazyerror", autosizesClass: "lazyautosizes", srcAttr: "data-src", srcsetAttr: "data-srcset", sizesAttr: "data-sizes", minSize: 40, customMedia: {}, init: !0, expFactor: 1.5, hFac: .8, loadMode: 2, loadHidden: !0, ricTimeout: 0, throttleDelay: 125 }; e = a.lazySizesConfig || a.lazysizesConfig || {}; for (b in c) b in e || (e[b] = c[b]) }(), !b || !b.getElementsByClassName) return { init: function () { }, cfg: e, noSupport: !0 }; var f = b.documentElement, g = a.HTMLPictureElement, h = "addEventListener", i = "getAttribute", j = a[h].bind(a), k = a.setTimeout, l = a.requestAnimationFrame || k, m = a.requestIdleCallback, n = /^picture$/i, o = ["load", "error", "lazyincluded", "_lazyloaded"], p = {}, q = Array.prototype.forEach, r = function (a, b) { return p[b] || (p[b] = new RegExp("(\\s|^)" + b + "(\\s|$)")), p[b].test(a[i]("class") || "") && p[b] }, s = function (a, b) { r(a, b) || a.setAttribute("class", (a[i]("class") || "").trim() + " " + b) }, t = function (a, b) { var c; (c = r(a, b)) && a.setAttribute("class", (a[i]("class") || "").replace(c, " ")) }, u = function (a, b, c) { var d = c ? h : "removeEventListener"; c && u(a, b), o.forEach(function (c) { a[d](c, b) }) }, v = function (a, c, e, f, g) { var h = b.createEvent("Event"); return e || (e = {}), e.instance = d, h.initEvent(c, !f, !g), h.detail = e, a.dispatchEvent(h), h }, w = function (b, c) { var d; !g && (d = a.picturefill || e.pf) ? (c && c.src && !b[i]("srcset") && b.setAttribute("srcset", c.src), d({ reevaluate: !0, elements: [b] })) : c && c.src && (b.src = c.src) }, x = function (a, b) { return (getComputedStyle(a, null) || {})[b] }, y = function (a, b, c) { for (c = c || a.offsetWidth; c < e.minSize && b && !a._lazysizesWidth;)c = b.offsetWidth, b = b.parentNode; return c }, z = function () { var a, c, d = [], e = [], f = d, g = function () { var b = f; for (f = d.length ? e : d, a = !0, c = !1; b.length;)b.shift()(); a = !1 }, h = function (d, e) { a && !e ? d.apply(this, arguments) : (f.push(d), c || (c = !0, (b.hidden ? k : l)(g))) }; return h._lsFlush = g, h }(), A = function (a, b) { return b ? function () { z(a) } : function () { var b = this, c = arguments; z(function () { a.apply(b, c) }) } }, B = function (a) { var b, d = 0, f = e.throttleDelay, g = e.ricTimeout, h = function () { b = !1, d = c.now(), a() }, i = m && g > 49 ? function () { m(h, { timeout: g }), g !== e.ricTimeout && (g = e.ricTimeout) } : A(function () { k(h) }, !0); return function (a) { var e; (a = !0 === a) && (g = 33), b || (b = !0, e = f - (c.now() - d), e < 0 && (e = 0), a || e < 9 ? i() : k(i, e)) } }, C = function (a) { var b, d, e = 99, f = function () { b = null, a() }, g = function () { var a = c.now() - d; a < e ? k(g, e - a) : (m || f)(f) }; return function () { d = c.now(), b || (b = k(g, e)) } }, D = function () { var g, m, o, p, y, D, F, G, H, I, J, K, L = /^img$/i, M = /^iframe$/i, N = "onscroll" in a && !/(gle|ing)bot/.test(navigator.userAgent), O = 0, P = 0, Q = 0, R = -1, S = function (a) { Q-- , (!a || Q < 0 || !a.target) && (Q = 0) }, T = function (a) { return null == K && (K = "hidden" == x(b.body, "visibility")), K || !("hidden" == x(a.parentNode, "visibility") && "hidden" == x(a, "visibility")) }, U = function (a, c) { var d, e = a, g = T(a); for (G -= c, J += c, H -= c, I += c; g && (e = e.offsetParent) && e != b.body && e != f;)(g = (x(e, "opacity") || 1) > 0) && "visible" != x(e, "overflow") && (d = e.getBoundingClientRect(), g = I > d.left && H < d.right && J > d.top - 1 && G < d.bottom + 1); return g }, V = function () { var a, c, h, j, k, l, n, o, q, r, s, t, u = d.elements; if ((p = e.loadMode) && Q < 8 && (a = u.length)) { for (c = 0, R++; c < a; c++)if (u[c] && !u[c]._lazyRace) if (!N || d.prematureUnveil && d.prematureUnveil(u[c])) ba(u[c]); else if ((o = u[c][i]("data-expand")) && (l = 1 * o) || (l = P), r || (r = !e.expand || e.expand < 1 ? f.clientHeight > 500 && f.clientWidth > 500 ? 500 : 370 : e.expand, d._defEx = r, s = r * e.expFactor, t = e.hFac, K = null, P < s && Q < 1 && R > 2 && p > 2 && !b.hidden ? (P = s, R = 0) : P = p > 1 && R > 1 && Q < 6 ? r : O), q !== l && (D = innerWidth + l * t, F = innerHeight + l, n = -1 * l, q = l), h = u[c].getBoundingClientRect(), (J = h.bottom) >= n && (G = h.top) <= F && (I = h.right) >= n * t && (H = h.left) <= D && (J || I || H || G) && (e.loadHidden || T(u[c])) && (m && Q < 3 && !o && (p < 3 || R < 4) || U(u[c], l))) { if (ba(u[c]), k = !0, Q > 9) break } else !k && m && !j && Q < 4 && R < 4 && p > 2 && (g[0] || e.preloadAfterLoad) && (g[0] || !o && (J || I || H || G || "auto" != u[c][i](e.sizesAttr))) && (j = g[0] || u[c]); j && !k && ba(j) } }, W = B(V), X = function (a) { var b = a.target; if (b._lazyCache) return void delete b._lazyCache; S(a), s(b, e.loadedClass), t(b, e.loadingClass), u(b, Z), v(b, "lazyloaded") }, Y = A(X), Z = function (a) { Y({ target: a.target }) }, $ = function (a, b) { try { a.contentWindow.location.replace(b) } catch (c) { a.src = b } }, _ = function (a) { var b, c = a[i](e.srcsetAttr); (b = e.customMedia[a[i]("data-media") || a[i]("media")]) && a.setAttribute("media", b), c && a.setAttribute("srcset", c) }, aa = A(function (a, b, c, d, f) { var g, h, j, l, m, p; (m = v(a, "lazybeforeunveil", b)).defaultPrevented || (d && (c ? s(a, e.autosizesClass) : a.setAttribute("sizes", d)), h = a[i](e.srcsetAttr), g = a[i](e.srcAttr), f && (j = a.parentNode, l = j && n.test(j.nodeName || "")), p = b.firesLoad || "src" in a && (h || g || l), m = { target: a }, s(a, e.loadingClass), p && (clearTimeout(o), o = k(S, 2500), u(a, Z, !0)), l && q.call(j.getElementsByTagName("source"), _), h ? a.setAttribute("srcset", h) : g && !l && (M.test(a.nodeName) ? $(a, g) : a.src = g), f && (h || l) && w(a, { src: g })), a._lazyRace && delete a._lazyRace, t(a, e.lazyClass), z(function () { var b = a.complete && a.naturalWidth > 1; p && !b || (b && s(a, "ls-is-cached"), X(m), a._lazyCache = !0, k(function () { "_lazyCache" in a && delete a._lazyCache }, 9)), "lazy" == a.loading && Q-- }, !0) }), ba = function (a) { if (!a._lazyRace) { var b, c = L.test(a.nodeName), d = c && (a[i](e.sizesAttr) || a[i]("sizes")), f = "auto" == d; (!f && m || !c || !a[i]("src") && !a.srcset || a.complete || r(a, e.errorClass) || !r(a, e.lazyClass)) && (b = v(a, "lazyunveilread").detail, f && E.updateElem(a, !0, a.offsetWidth), a._lazyRace = !0, Q++ , aa(a, b, f, d, c)) } }, ca = C(function () { e.loadMode = 3, W() }), da = function () { 3 == e.loadMode && (e.loadMode = 2), ca() }, ea = function () { if (!m) { if (c.now() - y < 999) return void k(ea, 999); m = !0, e.loadMode = 3, W(), j("scroll", da, !0) } }; return { _: function () { y = c.now(), d.elements = b.getElementsByClassName(e.lazyClass), g = b.getElementsByClassName(e.lazyClass + " " + e.preloadClass), j("scroll", W, !0), j("resize", W, !0), j("pageshow", function (a) { if (a.persisted) { var c = b.querySelectorAll("." + e.loadingClass); c.length && c.forEach && l(function () { c.forEach(function (a) { a.complete && ba(a) }) }) } }), a.MutationObserver ? new MutationObserver(W).observe(f, { childList: !0, subtree: !0, attributes: !0 }) : (f[h]("DOMNodeInserted", W, !0), f[h]("DOMAttrModified", W, !0), setInterval(W, 999)), j("hashchange", W, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend"].forEach(function (a) { b[h](a, W, !0) }), /d$|^c/.test(b.readyState) ? ea() : (j("load", ea), b[h]("DOMContentLoaded", W), k(ea, 2e4)), d.elements.length ? (V(), z._lsFlush()) : W() }, checkElems: W, unveil: ba, _aLSL: da } }(), E = function () { var a, c = A(function (a, b, c, d) { var e, f, g; if (a._lazysizesWidth = d, d += "px", a.setAttribute("sizes", d), n.test(b.nodeName || "")) for (e = b.getElementsByTagName("source"), f = 0, g = e.length; f < g; f++)e[f].setAttribute("sizes", d); c.detail.dataAttr || w(a, c.detail) }), d = function (a, b, d) { var e, f = a.parentNode; f && (d = y(a, f, d), e = v(a, "lazybeforesizes", { width: d, dataAttr: !!b }), e.defaultPrevented || (d = e.detail.width) && d !== a._lazysizesWidth && c(a, f, e, d)) }, f = function () { var b, c = a.length; if (c) for (b = 0; b < c; b++)d(a[b]) }, g = C(f); return { _: function () { a = b.getElementsByClassName(e.autosizesClass), j("resize", g) }, checkElems: g, updateElem: d } }(), F = function () { !F.i && b.getElementsByClassName && (F.i = !0, E._(), D._()) }; return k(function () { e.init && F() }), d = { cfg: e, autoSizer: E, loader: D, init: F, uP: w, aC: s, rC: t, hC: r, fire: v, gW: y, rAF: z } });

var useLazyLoadMain = false;
var LazyLoadOver = true;

var buySamePage = true;
var buySamePageFull = true;

//var NOTbuySamePage = "1";

$(document).ready(function () {


    window.setTimeout("FuncVerifModulosComplete()", 1000);


    if (typeof LazyLoadOver !== 'undefined') {
        useLazyLoadMain = LazyLoadOver;
    }

	//CHAMADAS DA API
	try {
		ApiWS.ApiStart();
		InfosLojas();
	} catch (e) { console.log(e.message); }

	// INICIALIZA CAMPOS DE BUSCA
	try{
		BuscaInicializa('input-busca');
		BuscaInicializa('input-busca-2');
		BuscaInicializa('input-busca-3');
		$("#botao-busca").on('click', function () {
			FuncaoBuscaBotao('input-busca');
		});
		$("#botao-busca-2").on('click', function () {
			FuncaoBuscaBotao('input-busca-2');
		});
		$("#botao-busca-3").on('click', function () {
			FuncaoBuscaBotao('input-busca-3');
		});
	} catch (e) { console.log(e.message); }


	try{
		$('#burguer-menu').on('click',function(){
			$('#float-menu').toggleClass('active');
		});

		$(window).scroll(function () {
			handleScroll();
		});

	} catch (e) { console.log(e.message); }

});

var cfg = [],
	cliente,
	lateralDir = false,
	lateralEsq = false,
	modoLoja = "",
	objetos = {},
	objInstitucional = "",
	PAG = [],
	prodsLinha = "",
    valores = [],
    info_lojas_finish,
    modulos_to_complete = 0,
    modulos_completed = 0;


function InfosLojas() {
	console.log('InfosLojas');
	ApiWS.InfosLojas("InfosLojasRetorno");
}
function InfosLojasRetorno() {

    try {

        var OBJETO = ApiWS.Json;
        var obj = jQuery.parseJSON(OBJETO);
        objetos.InfosLojas = OBJETO;

        //console.log("NOTbuySamePage:"+NOTbuySamePage);
        setTagsWs(obj, "InfosLojas");
        cookieAskMsg(obj);

        if (typeof buySamePage !== 'undefined') {
            if (typeof NOTbuySamePage !== 'undefined') {
                buySamePage = undefined;
                buySamePageFull = undefined;
            } else {
                try { FuncBuySamePage(); } catch (e) { }
            }
        }
        

        var social = obj.redes_sociais,
			links = obj.links,
			contato = obj.dadoscontato,
			estrutura = obj.estrutura,
			institucional = obj.menuinstitucional,
            condicoes = obj.condicoes,
			li = '';

        cliente = obj.cliente;
        objInstitucional = obj.menuinstitucional;
        modoLoja = estrutura.modo;

        cfg['estrutura'] = estrutura;
        cfg['produtos_pagina'] = estrutura.produtos_pagina;
        cfg['produtos_linha'] = estrutura.produtos_linha;
        cfg['menu_lateral_home'] = estrutura.menu_lateral_home;
        cfg['troca_fotos'] = estrutura.troca_fotos;
        cfg['menu_lateral'] = estrutura.menu_lateral;
        cfg['ultimos_vistos'] = estrutura.ultimos_vistos;
        cfg['tipo_zoom'] = estrutura.tipo_zoom;
        cfg['preco_apos_login'] = estrutura.preco_apos_login;

        var Etapa = $("#HdEtapaLoja").val();

        $('.input-busca').attr('placeholder', estrutura.placeholder_busca);

        if (modoLoja == 4 || modoLoja == 5) {
            $('.carrinho-texto').html("Meu or&ccedil;amento");
            $('.cart-total').css('visibility', 'hidden');
        } else {
            $('.carrinho-texto').html(estrutura.carrinho_compras_texto);
        }

        if (modoLoja == 2 || modoLoja == 3) {
            estrutura.carrinho_compras = false;
            $('.input-qtd').hide();
            $('#calcula-frete').hide();
        }

        if (
			estrutura.carrinho_compras == false
		) {
            $('header .div-carrinho').addClass('hidden');
            $('header fieldset').addClass('sem-carrinho');
            $('#barra-flutuante fieldset').addClass('sem-carrinho');
            $('#barra-flutuante .div-carrinho').addClass('hidden');
        }


        if (cfg['preco_apos_login'] == true || modoLoja == 3 || modoLoja == 5) {
            semVariacao = true;
        }

        if (cfg['produtos_linha'] != 0) {
            prodsLinha = cfg['produtos_linha'];
        }

        if (estrutura.bandeiras_pagamento != null && estrutura.bandeiras_pagamento != undefined && estrutura.bandeiras_pagamento.length > 0) {
            var str = estrutura.bandeiras_pagamento;
            var res = str.split("|");
            for (i = 0; i < res.length; i++) {
                if (res[i] != "") {
                    li += '<li class="bandeira' + res[i] + '"></li>';
                }
            }
            $('#footer-pagamento').append(li);
            WsSetObjetos("ul_pagamento", "<ul id='ws-ul-pagamento'>" + li + "</ul>");
            li = '';
        }

        if (links) {
            if (links.cadastro != null && links.cadastro != undefined) {
                $('#link-cadastro').attr('href', links.cadastro);
            }
            if (links.login != null && links.login != undefined) {
                $('#link-login, #link-login-2, #link-entrar, .link-login').attr('href', links.login);
            }
            if (links.carrinho != null && links.carrinho != undefined) {
                $('#link-carrinho, .link-carrinho').attr('href', links.carrinho);
            }
            if (links.meus_pedidos != null && links.meus_pedidos != undefined) {
                $('#link-meus-pedidos').attr('href', links.meus_pedidos);
                $('#link-pedidos').attr('href', links.meus_pedidos);
                $('.link-meus-pedidos').attr('href', links.meus_pedidos);
                $('.link-pedidos').attr('href', links.meus_pedidos);
            }
            if (links.pagina_inicial != null && links.pagina_inicial != undefined) {
                $('#link-pagina-inicial, .link-pagina-inicial').attr('href', links.pagina_inicial);
            }
            if (links.faleconosco != null && links.faleconosco != undefined) {
                $('.fale-conosco').append('<a href="' + links.faleconosco + '" id="link-faleconosco"><i class="fa fa-fw fa-address-book-o"></i>Fale Conosco</a>');
            }
        }

        if (institucional != null && institucional != undefined && institucional.length > 0) {

            for (i = 0; i < institucional.length; i++) {
                PAG[institucional[i].id] = [institucional[i]];
                if (institucional[i].tipo == "EXT") {
                    li += '<li><a href="' + institucional[i].url + '" target="_blank" rel="noopener" title="' + institucional[i].titulo + '">' + institucional[i].titulo + '</a></li>';
                } else {
                    li += '<li><a href="' + institucional[i].url + '" title="' + institucional[i].titulo + '">' + institucional[i].titulo + '</a></li>';
                }
            }

            if (links.cadastro_b2b && li.indexOf("cadastro-b2b") < 0 && li.indexOf("atacado") < 0) {
                li += '<li class="linkB2bFooter" data-link-b2b><a href="' + links.cadastro_b2b + '.aspx" title="Compre no atacado">Compre no atacado</a></li>';
            }

            if (Etapa == "PAGINAS_INST") {
                var ul = '<ul id="institucional-lateral"><h3>Institucional</h3>';
                ul += li;
                ul += '</ul>';

                $('#div-barra-esquerda').prepend(ul);

                ColunasResponsivo('#div-barra-esquerda', 'hidden', 'hidden', 3);
                ColunasResponsivo('#div-conteudo', 12, 12, 9);
            }

            $('#institucional-footer').append(li);
            WsSetObjetos("ul_institucional", "<ul id='ws-ul-institucional'>" + li + "</ul>");
            li = '';
            
        }


        if (condicoes.length) {
            FuncExibeCondicoes(condicoes);
        };

        // window.setTimeout("CategoriasLista()", 1);

        if (social != null && social != undefined) {
            if (social.facebook != null && social.facebook != undefined) {
                li += '<li><a href="https://www.facebook.com/' + social.facebook + '" target="_blank" rel="noopener">';
                li += '<span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-facebook fa-stack-1x fa-inverse"></i></span>';
                li += '</a></li>';
            }
            if (social.twitter != null && social.twitter != undefined) {
                li += '<li><a href="https://www.twitter.com/' + social.twitter + '" target="_blank" rel="noopener">';
                li += '<span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-twitter fa-stack-1x fa-inverse"></i></span>';
                li += '</a></li>';
            }
            if (social.linkedin != null && social.linkedin != undefined) {
                li += '<li><a href="https://www.linkedin.com/' + social.linkedin + '" target="_blank" rel="noopener">';
                li += '<span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-linkedin fa-stack-1x fa-inverse"></i></span>';
                li += '</a></li>';
            }
            if (social.instagram != null && social.instagram != undefined) {
                li += '<li><a href="https://www.instagram.com/' + social.instagram + '" target="_blank" rel="noopener">';
                li += '<span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-instagram fa-stack-1x fa-inverse"></i></span>';
                li += '</a></li>';
            }
            if (social.youtube != null && social.youtube != undefined) {
                li += '<li><a href="https://www.youtube.com/' + social.youtube + '" target="_blank" rel="noopener">';
                li += '<span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-youtube fa-stack-1x fa-inverse"></i></span>';
                li += '</a></li>';
            }
            if (social.pinterest != null && social.pinterest != undefined) {
                li += '<li><a href="https://www.pinterest.com/' + social.pinterest + '" target="_blank" rel="noopener">';
                li += '<span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-pinterest fa-stack-1x fa-inverse"></i></span>';
                li += '</a></li>';
            }
            if (social.google != null && social.google != undefined) {
                li += '<li><a href="https://plus.google.com/' + social.google + '" target="_blank" rel="noopener">';
                li += '<span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-google-plus fa-stack-1x fa-inverse"></i></span>';
                li += '</a></li>';
            }
            $('#social-footer').append(li);
            $('.append-social').append(li);
            $('[data-wbstr-social]').after(li).remove();
            WsSetObjetos("ul_social", "<ul id='ws-ul-social'>" + li + "</ul>");
            li = '';
        }

        if (contato != null && contato != undefined) {

            if (contato.horario != null && contato.horario != undefined && contato.horario.length > 0) {
                li += '<li><i class="fa fa-fw fa-clock-o"></i>' + contato.horario + '</li>';
            }
            if (contato.fone_1 != null && contato.fone_1 != undefined && contato.fone_1.length > 0) {
                var fone1 = clearNum(contato.fone_1);
                $('.telefone-topo').append('<a href="tel:+55' + fone1 + '"><i class="fa fa-phone"></i>' + contato.fone_1 + '</a>');
                li += '<li class="footer-fones"><a href="tel:+55' + fone1 + '"><i class="fa fa-fw fa-phone"></i>' + contato.fone_1 + '</a></li>';
            }
            if (contato.fone_2 != null && contato.fone_2 != undefined && contato.fone_2.length > 0) {
                var fone2 = clearNum(contato.fone_2);
                li += '<li class="footer-fones"><a href="tel:+55' + fone2 + '"><i class="fa fa-fw fa-phone"></i>' + contato.fone_2 + '</a></li>';
            }
            if (contato.fone_3 != null && contato.fone_3 != undefined && contato.fone_3.length > 0) {
                var fone3 = clearNum(contato.fone_3);
                $('.telefone-topo').html('<a href="http://api.whatsapp.com/send?1=pt_BR&phone=55' + fone3 + '" target="_blank" rel="noopener"><i class="fa fa-whatsapp"></i>' + contato.fone_3 + '</a>');
                li += '<li class="footer-fones"><a href="http://api.whatsapp.com/send?1=pt_BR&phone=55' + fone3 + '" target="_blank" rel="noopener"><i class="fa fa-fw fa-whatsapp"></i>' + contato.fone_3 + '</a></li>';
            }
            if (contato.email_1 != null && contato.email_1 != undefined && contato.email_1.length > 0) {
                li += '<li class="footer-mails"><a href="mailto:' + contato.email_1 + '?subject=Contato Loja Virtual"><i class="fa fa-fw fa-envelope-o"></i>' + contato.email_1 + '</a></li>';
            }
            if (contato.email_2 != null && contato.email_2 != undefined && contato.email_2.length > 0) {
                li += '<li class="footer-mails"><a href="mailto:' + contato.email_2 + '?subject=Contato Loja Virtual"><i class="fa fa-fw fa-envelope-o"></i>' + contato.email_2 + '</a></li>';
            }
            if (contato.email_3 != null && contato.email_3 != undefined && contato.email_3.length > 0) {
                li += '<li class="footer-mails"><a href="mailto:' + contato.email_3 + '?subject=Contato Loja Virtual"><i class="fa fa-fw fa-envelope-o"></i>' + contato.email_3 + '</a></li>';
            }
            contato.endereco = null;
            if (contato.endereco != null && contato.endereco != undefined && contato.endereco.length > 0) {
                li += '<li class="footer-address"><p><i class="fa fa-fw fa-map-marker"></i>' + contato.endereco;
                if (contato.numero != null && contato.numero != undefined && contato.numero.length > 0) {
                    li += ', ' + contato.numero;
                }
                if (contato.complemento != null && contato.complemento != undefined && contato.complemento.length > 0) {
                    li += ', ' + contato.complemento;
                }
                if (contato.bairro != null && contato.bairro != undefined && contato.bairro.length > 0) {
                    li += ', ' + contato.bairro;
                }
                if (contato.cidade != null && contato.cidade != undefined && contato.cidade.length > 0) {
                    li += ' - ' + contato.cidade;
                }
                if (contato.uf != null && contato.uf != undefined && contato.uf.length > 0) {
                    li += ' - ' + contato.uf;
                }
                if (contato.cep != null && contato.cep != undefined && contato.cep.length > 0) {
                    li += '<br />CEP: ' + contato.cep;
                }
                li += '</p></li>';
            }
            if (links.faleconosco != null && links.faleconosco != undefined) {
                li += '<li class="footer-contact-link"><a href="' + links.faleconosco + '" id="link-faleconosco"><i class="fa fa-fw fa-address-book-o"></i>Fale Conosco</a></li>';
            }

            $('#contato-footer').append(li);

            WsSetObjetos("ul_contato", "<ul id='ws-ul-contatos'>" + li + "</ul>");

            if (contato.razao != null && contato.razao != undefined && contato.razao.length > 0 && contato.cnpj != null && contato.cnpj != undefined && contato.cnpj.length > 0) {
                $('#cnpj-footer').html('<span>' + contato.razao + ' - ' + contato.cnpj + '</span>');
            }
        }

        info_lojas_finish = "ok";

        if (typeof call_after_info_lojas !== 'undefined') { try { eval(call_after_info_lojas); } catch (e) { console.log("Falha call_after_info_lojas" + e.message); } }
        if (typeof WsJsStart !== 'undefined') { try { eval(WsJsStart); } catch (e) { console.log("Falha WsJsStart" + e.message); } }

    } catch (e) {
        console.log("Falha info lojas:" + e.message);
    }

}

function ColunasResponsivo(ELEMENTO, XS, SM, MD, LG){
	// inserir o elemento a ser adicionado as classes, e a quantidade de colunas

	var CLASS = '';

	if(XS != null && XS != undefined){
		if (XS == 'hidden'){
			CLASS += 'hidden-xs ';
		}else if (XS >= 1 && XS <= 12) {
			CLASS += 'col-xs-'+XS+' ';
		}
	}
	if(SM != null && SM != undefined){
		if (SM == 'hidden'){
			CLASS += 'hidden-sm ';
		}else if (SM >= 1 && SM <= 12) {
			CLASS += 'col-sm-'+SM+' ';
		}
	}
	if(MD != null && MD != undefined){
		if (MD == 'hidden'){
			CLASS += 'hidden-md ';
		}else if (MD >= 1 && MD <= 12) {
			CLASS += 'col-md-'+MD+' ';
		}
	}
	if(LG != null && LG != undefined){
		if (LG == 'hidden'){
			CLASS += 'hidden-lg ';
		}else if (LG >= 1 && LG <= 12) {
			CLASS += 'col-lg-'+LG+' ';
		}
	}

	var remove = "hidden col-xs-12 col-xs-11 col-xs-10 col-xs-9 col-xs-8 col-xs-7 col-xs-6 col-xs-5 col-xs-4 col-xs-3 col-xs-2 col-xs-1 ";
	remove += "col-sm-12 col-sm-11 col-sm-10 col-sm-9 col-sm-8 col-sm-7 col-sm-6 col-sm-5 col-sm-4 col-sm-3 col-sm-2 col-sm-1 ";
	remove += "col-md-12 col-md-11 col-md-10 col-md-9 col-md-8 col-md-7 col-md-6 col-md-5 col-md-4 col-md-3 col-md-2 col-md-1 ";
	remove += "col-lg-12 col-lg-11 col-lg-10 col-lg-9 col-lg-8 col-lg-7 col-lg-6 col-lg-5 col-lg-4 col-lg-3 col-lg-2 col-lg-1 ";
	$(ELEMENTO).removeClass(remove);
	$(ELEMENTO).addClass(CLASS);
}

function LazyLoadApply() {
    try {

        //window.setTimeout("LazyLoadApplyGo()", 500);
        /*if (useLazyLoadMain) {
            window.setInterval("LazyLoadApplyGo()", 500);
        }*/

    } catch (e) { }
}
function LazyLoadApplyGo() {
    try {

        /*console.log("Lazy ok");

        $("[data-obj-img-load]").lazyload();

        $('[data-obj-img-load]').each(
            function () {
                //$(this).removeAttr("data-obj-img-load");
                $(this).attr("lazzy-done", "ok");
            }
        );*/

    } catch (e) { console.log("Error lazyload." + e.message); }
}

function FrameworkResponsivo() {

	var etapa = $("#HdEtapaLoja").val();
	esq = lateralEsq;
	dir = lateralDir;

	if (etapa == "HOME"){

		if(esq == true && dir == true){
			ColunasResponsivo('#div-barra-esquerda', 'hidden', 'hidden', 2);
			ColunasResponsivo('#div-conteudo', 12, 12, 8, 8);
			ColunasResponsivo('#div-barra-direita', 'hidden', 'hidden', 2);
		}else if(esq == true){
			ColunasResponsivo('#div-barra-esquerda', 'hidden', 'hidden', 3);
			ColunasResponsivo('#div-conteudo', 12, 12, 9);
		}else if(dir == true){
			ColunasResponsivo('#div-barra-direita', 'hidden', 'hidden', 3);
			ColunasResponsivo('#div-conteudo', 12, 12, 9);			
		}
	}

	if (etapa == "LISTAGEM"){

		if(esq == true && dir == true){
			ColunasResponsivo('#div-barra-esquerda', 'hidden', 'hidden', 3);
			ColunasResponsivo('#div-conteudo', 12, 12, 9);
		}else if(esq == true){
			ColunasResponsivo('#div-barra-esquerda', 'hidden', 'hidden', 3);
			ColunasResponsivo('#div-conteudo', 12, 12, 9);
		}else if(dir == true){
			ColunasResponsivo('#div-conteudo', 12);			
		}
	}

    ConteudoResponsivo();

    

}

var itensMaxHeight = 0;
function ConteudoResponsivo(){

	if(prodsLinha == 0){
		if(lateralEsq == true || lateralDir == true){
			prodsLinha = 3;
		}
	}

	if(prodsLinha != null && prodsLinha != undefined){
		if(prodsLinha == 4){
			ColunasResponsivo('.list-item', 6, 6, 4, 3);
		}else if(prodsLinha == 3){
			ColunasResponsivo('.list-item', 6, 6, 4);
		}else if(prodsLinha == 2){
			ColunasResponsivo('.list-item', 12, 12, 6);
		}else if(prodsLinha == 0){
			ColunasResponsivo('.list-item', 6, 6, 4, 3);
		}
    }

    window.setTimeout("ajusteHeightItens()", 500);
    
}

var KeepObjHeightList = "";
function ajusteHeightItens() {

    try {

        var addX = 0;
        if (typeof var_minH_addX !== 'undefined') { try { addX = var_minH_addX; } catch (e) { console.log("Falha var_minH_addX" + e.message); } }

        itensMaxHeight = 0;

        $("#div-conteudo .list-item").css("min-height", "initial");

        $("#div-conteudo .list-item").each(function () {
            var thisH = $(this).outerHeight();//.find(".div-item")
            var itemReg = $(this).attr("item-reg");
            var thisClass = $(this).attr("class");
            if (thisH > itensMaxHeight && thisClass.indexOf("slick-slide") < 0) {
                itensMaxHeight = thisH;
            }
            KeepObjHeightList += ("    itemReg:" + itemReg + " ==> " + itensMaxHeight);
        });

        if (itensMaxHeight > 0 && addX > 0) {
            itensMaxHeight = itensMaxHeight + addX;
        }

        KeepObjHeightList += ("    itens min h:" + itensMaxHeight);

        $("#div-conteudo .list-item").each(function () {
            var thisClass = $(this).attr("class");
            if (itensMaxHeight > 0 && thisClass.indexOf("slick-slide") < 0) {
                $(this).css("min-height", itensMaxHeight + "px");
            }
        });

        if (itensMaxHeight <= 0) {
            window.setTimeout("ajusteHeightItens()", 1000);
        }

    } catch (e) { }

}

function replaceStr(str, find, replace) {
	for (var i = 0; i < find.length; i++) {
		str = str.replace(new RegExp(find[i], 'gi'), replace[i]);
	}
	return str;
}

function handleScroll() {
    var T = getScrollTop();

    if (T >= 100) {
    	$('#barra-flutuante').addClass('active');
    	$('#header-mobile').addClass('header-fixed');
    } else {
    	$('#barra-flutuante').removeClass('active');
    	$('#header-mobile').removeClass('header-fixed');
    }
}

function getScrollTop() {
    if (typeof pageYOffset != 'undefined') {
        return pageYOffset;
    } else {
        var B = document.body;
        var D = document.documentElement;
        D = (D.clientHeight) ? D : B;
        return D.scrollTop;
    }
}

function getElementPositionPage(elemID, tipo) {

    // onde elemID � o id do objeto que quero detectar a posicao no meu caso a imagem.
    var offsetTrail = document.getElementById(elemID);
    var i = 0;
    var offsetLeft = 0;
    var offsetTop = 0;
    while (offsetTrail || i > 1) {
        offsetLeft += offsetTrail.offsetLeft;
        offsetTop += offsetTrail.offsetTop;
        offsetTrail = offsetTrail.offsetParent;
    }
    if (navigator.userAgent.indexOf("Mac") != -1 &&
        typeof document.body.leftMargin != "undefined") {
        offsetLeft += document.body.leftMargin;
        offsetTop += document.body.topMargin;
    }

    // return {left:offsetLeft, top:offsetTop};
    //alert(offsetLeft+"----"+offsetTop);
    if (tipo == "L") {
        return offsetLeft;
    }
    else {
        return offsetTop;
    }

}


function AjustaMoney(VALOR) {
	return VALOR.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,").replace(",", "|").replace(".", ",").replace("|", ".");
}

function clearNum(NUM){
	return (NUM.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ''));
}

function AjustaTopoMobile(){
	var headerHeight = $('#header-mobile').outerHeight(true);
	$('#mobile-placeholder').css('height', headerHeight);
}

ConteudoResponsivo();

function nomeProd(obj, linhas) {

    if (!obj) { return; }

    try {

        if (typeof qtdLinhas !== 'undefined') {
            try { linhas = qtdLinhas; } catch (e) { }
        }

        if (linhas) {
            qtdLinhas = linhas;
        }

        if (typeof qtdLinhas !== 'undefined') {

            if (typeof $clamp === "function") {
                $(obj + ' .prod-nome a').each(function (index, el) {
                    $clamp(el, { clamp: Number(qtdLinhas), useNativeClamp: true });
                });
            }

        } else {

            if (typeof $clamp === "function") {
                $(obj + ' .prod-nome a').each(function (index, el) {
                    $clamp(el, { clamp: '3', useNativeClamp: true });
                });
            }
        }

    } catch (e) { }

}

var allModulosOk = null;
function FuncVerifModulosComplete() {
    if (modulos_to_complete > 0) {
        if (modulos_to_complete <= modulos_completed) {
            allModulosOk = true;
            console.log("All modulos ok (" + modulos_to_complete + "/" + modulos_completed + ")");
        } else {
            //console.log("Not all modulos complete");
            window.setTimeout("FuncVerifModulosComplete()", 500);
        }
    } else {
        window.setTimeout("FuncVerifModulosComplete()", 1000);
    }

}

function isReady(check, callback, counter) {

	if (!counter) {counter = 0};
	var teste = eval('typeof ' + check);
	if(teste !== 'undefined' && teste != null){
		eval(callback);
		return true;
	}else{
		counter++;
		//console.log('counter: ' + counter);
		if(counter < 100){
			window.setTimeout(function(){
				isReady(check, callback, counter);
			}, 100);
		}else{
			return false;
		}
    }

}

function ValorJurosComposto(Juros, NumParcela, ParcelaJurosInicia, Valor) {

	var ValorParcela = 0;

	try {
		if (Juros > 0 && NumParcela >= ParcelaJurosInicia && NumParcela > 1) {
			ValorParcela = (Valor * (Juros / 100)) / (1 - (1 / (Math.pow((1 + (Juros / 100)), ((NumParcela))))));
		}
		else {
			ValorParcela = (Valor / NumParcela);
		}
	} catch (e) {}

	return ValorParcela;
}


var TYPES = {
    'undefined': 'undefined',
    'number': 'number',
    'boolean': 'boolean',
    'string': 'string',
    '[object Function]': 'function',
    '[object RegExp]': 'regexp',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object Error]': 'error'
},
TOSTRING = Object.prototype.toString;
function typeObj(o) {
    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
};
var WsGlobalVars = [];
var WsGlobalVarsList;
var WsObjetos;
function setTagsWs(obj, path) {

    try {

        if (path == undefined) { path = ""; }
        else if (path != "") {
            path += "_";
        }

        var passPath = "";

        var indexAtual = "";

        $.each(obj, function (index, value) {

            var tipo = typeObj(value);

            if (indexAtual == "" || indexAtual != index) {
                indexAtual = index;
                passPath = path;
            }

            if (tipo != undefined && tipo != null) {

                if (tipo == "object") {

                    if (passPath != "" && index != "" && passPath != undefined) {
                        passPath += index;
                    }

                    WsSetGlobalCars(passPath + index, value, tipo);

                    setTagsWs(value, passPath);

                }
                else if (tipo == "array") {

                    WsSetGlobalCars(passPath + index, value, tipo);

                }
                else if (tipo == "string" || tipo == "boolean" || tipo == "number") {

                    //console.log("TagName:" + passPath + index + " => " + value + " => " + tipo);

                    WsSetGlobalCars(passPath + index, value, tipo);

                    WsSetObjetos(passPath + index, value)

                } else {

                }

            }

        });

    } catch (e) {

        console.log("Falha setTagsWs:" + e.message);

    }

}

function WsSetObjetos(nome, valor) {
    try {
        $("span[rel='ws_" + nome + "']").each(function () { $(this).after(valor); $(this).remove(); });
        WsObjetos += "<span rel='ws_" + nome + "'></span> => (" + valor + ")\r\n";
    } catch (e) { }
}

function WsSetGlobalCars(nome, valor, tipo) {
    try {
        WsGlobalVars[nome] = valor;
        WsGlobalVarsList += nome + "  [" + tipo + "] => (" + valor + ")\r\n";
    } catch (e) { }
}


function FuncBuySamePageLoad() {
    var FundoLoadin = $("#LoadingBackHolder").html();
    if (FundoLoadin == undefined) {
        $("body").append("<div class='LoadingBackHolder' id='LoadingBackHolder'></div>");
    }
    $("#LoadingBackHolder").show();
}

function FuncBuySamePage() {
    try {

        console.log("BuySamePage");

        var CamposAdd = '<input type="hidden" id="HD_FUNCAO_AFTER_BT_COMPRAR_LISTA" value="FuncBuySamePageAfter()" />' +
            '<input type="hidden" id="HD_DADOS_FUNCAO_AFTER_BT_COMPRAR_LISTA" value="FuncBuySamePageAfter()" />';

        $("body").append(CamposAdd);

    } catch (e) { }
}

function FuncBuySamePageAfter() {
    try {

        var IdProduto = $("#HD_DADOS_FUNCAO_AFTER_BT_COMPRAR_LISTA").val();

        //$("li[item-reg='" + IdProduto + "']").find("[rel='buy-buttom-list']").hide();

        $("li[item-reg='" + IdProduto + "']").find("[rel='buy-buttom-list']").addClass("prod-in-kart");
        $("li[item-reg='" + IdProduto + "']").find("[rel='buy-buttom-list']").find("i").removeClass("fa-shopping-cart").addClass("fa-check");

        FuncRefreshCartInfo();
        
    } catch (e) {
        console.log("Falha BuySamePage:" + e.message);
    }
}

function FuncRefreshCartInfo(ask) {

    try {

        if (ask == true) {

            var varBoxMsgProdAdd = $("#BoxMsgProdAddAsk").html();
            var LV_ID = $("#HD_LV_ID").val();

            if (varBoxMsgProdAdd == undefined) {

                var iconSuccess = "<i class='far fa-check-circle'></i>";
                if (typeof over_iconSuccessProdAdd !== 'undefined') { iconSuccess = over_iconSuccessProdAdd; }

                $("body").append("" +
                    "<div class='BoxMsgProdAddAskBack' id='BoxMsgProdAddAskBack'></div>" +
                    "<div class='BoxMsgProdAddAsk' id='BoxMsgProdAddAsk'>" +
                    "<div class='BoxMsgProdAddAskContent'>" +
                    "   <div>" +
                    "       <strong>" + iconSuccess + "<br>Produto adicionado com sucesso ao carrinho!</strong> " +
                    "       <p>" +
                    "           <a href='javascript:void(FuncFecharAskAddProd())' class='bt-continuar-ask'>Continuar comprando</a>" +
                    "           <a href='/carrinho/" + LV_ID + "/carrinho' class='bt-go-cart-ask'>Ir para o carrinho</a>" +
                    "       </p>" +
                    "   </div>" +
                    "</div>");

            }
            $("#LoadingBackHolder").hide();
            $("#BoxMsgProdAddAskBack").show();
            $("#BoxMsgProdAddAsk").show();

        } else {

            var varBoxMsgProdAdd = $("#BoxMsgProdAdd").html();
            if (varBoxMsgProdAdd == undefined) {
                $("body").append("<div class='BoxMsgProdAdd' id='BoxMsgProdAdd'><a href='javascript:void(FuncCloseCartInfo())'>X</a><p>Produto adicionado com sucesso!</p><span>Acesse o carrinho para finalizar a compra.</span></div>");
            }

            $("#BoxMsgProdAdd").show();

            window.setTimeout("FuncCloseCartInfo()", 4000);

        }

        CarregaCarrinhoOnPage();

    } catch (e) {
        console.log("Falha FuncRefreshCartInfo");
    }

}

function FuncCloseCartInfo() {
    $("#BoxMsgProdAdd").fadeOut("fast");
}

function FuncFecharAskAddProd() {
    $("#BoxMsgProdAddAskBack").fadeOut("fast");
    $("#BoxMsgProdAddAsk").fadeOut("fast");
    $("#LV_BT_COMPRAR").show();
    window.setTimeout("FuncSomeMsgAddProd()", 500);
    window.setTimeout("FuncSomeMsgAddProd()", 1000);
}

function FuncSomeMsgAddProd() {
    $("#retornoBtComprar").remove();
}

function FuncExibeCondicoes(condicoes) {

    try {

        if (typeof over_condicoes !== 'undefined') { try { eval(over_condicoes); return; } catch (e) { console.log(e.message); } }

        var htmlCondicoes = '<div class="condicoes-loja" id="condicoes-loja">' +
            '<div class="row container">';

        for (c = 0; c < condicoes.length; c++) {

            var Link = '<a href="' + condicoes[c].url + '" title="' + condicoes[c].titulo + ' ' + condicoes[c].subtitulo + '">';
            var LinkFim = '</a>';

            if (condicoes[c].url == "") { Link = ""; LinkFim = ""; }

            htmlCondicoes += '<div class="condicao-item condicao-item-' + condicoes.length + '"> ' +
                '<div class="condicao-item-int">' +
                Link +
                '   <div class="condicao-icone">' + condicoes[c].icone + '</div>' +
                '   <div class="condicao-textos">' +
                '       <h3 class="condicao-titulo">' + condicoes[c].titulo + '</h3>' +
                '       <p class="condicao-subtitulo">' + condicoes[c].subtitulo + '</p>' +
                '   </div>' +
                LinkFim +
                '</div>' +
                '</div>';

        }

        htmlCondicoes += '</div></div>';

        var verifObjtoput = $("span[data-condicoes-loja]").length;

        if (!(verifObjtoput > 0)) {
            $(".homepage #div-conteudo").before(htmlCondicoes);
        } else {
            $("span[data-condicoes-loja]").before(htmlCondicoes);
            $("span[data-condicoes-loja]").remove();
        }

        if (typeof $clamp === "function") {
            $('#condicoes-loja .condicao-titulo').each(function (index, el) {
                $clamp(el, { clamp: 1, useNativeClamp: true });
            });
            $('#condicoes-loja .condicao-subtitulo').each(function (index, el) {
                $clamp(el, { clamp: 1, useNativeClamp: true });
            });
        }

        if (typeof after_condicoes !== 'undefined') { try { eval(after_condicoes); } catch (e) { console.log(e.message); } }

    } catch (e) {

        console.log("falha ao exibir condi&ccedil;�es:" + e.message);

    }

}

function cookieAskMsg(obj) {

    try {

        console.log("Starting cookies ask");

        var cookieLink = "";

        if (typeof over_cookieAsk !== 'undefined') { try { eval(over_cookieAsk); return; } catch (e) { console.log(e.message); } }

        var HTML_cookie_msg = "Este site usa cookies para gerar estat&iacute;sticas e para melhorar sua experi&ecirc;ncia de navega&ccedil;&atilde;o.<br/>" +
            "Ao continuar, voc&ecirc; declara que est&aacute; de acordo.";

        if (typeof over_cookieLink !== 'undefined') { try { cookieLink = over_cookieLink; } catch (e) { console.log(e.message); } } else {
            for (i = 0; i < obj.menuinstitucional.length; i++) {
                if (obj.menuinstitucional[i].titulo.toLowerCase().indexOf("privacidade") >= 0) {
                    cookieLink = obj.menuinstitucional[i].url;
                }
            }
        }

        if (cookieLink != "") {
            HTML_cookie_msg = "Este site usa cookies para gerar estat&iacute;sticas e para melhorar sua experi&ecirc;ncia de navega&ccedil;&atilde;o.<br/>" +
                "Ao continuar, voc&ecirc; declara que est&aacute; de acordo com a nossa <a href=\"" + cookieLink + "\" title=\"Pol&iacute;tica de Privacidade\">Pol&iacute;tica de Privacidade</a>.";
        }

        if (typeof over_cookieMsg !== 'undefined') { try { HTML_cookie_msg = over_cookieMsg; } catch (e) { console.log(e.message); } }

        var HTML_cookieAsk = "<div id=\"aceite_privacidade\" style=\"display: block;\">" +
            "<div class=\"row\">" +
            "<div class=\"col-md-9\">" +
            "<p>" + HTML_cookie_msg + "</p> " +
            "</div>" +
            "<div class=\"col-md-3\">" +
            "<button id=\"linkConfirmCookies\" onclick=\"cookieAceitePrivacidade()\" class=\"btn\">Aceitar</button>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "";

        var jaClicou = localStorage["cookieAsk"];;

        if (localStorage["cookieAsk"]) {
            if (localStorage["cookieAsk"] != "1") {
                $("body").append(HTML_cookieAsk);
            }
        } else {
            $("body").append(HTML_cookieAsk);
        }

        $("#linkConfirmCookies").click(function () { cookieAceitePrivacidade(); });

        console.log("jaClicou:" + jaClicou);

    } catch (e) { console.log("Falha cookie ask:" + e.message); }

}

function cookieAceitePrivacidade() {
    try {
        localStorage["cookieAsk"] = "1";
        $("#aceite_privacidade").fadeOut("fast");
    } catch (e) { console.log("Falha ao ocultar msg de cookies."); }
}