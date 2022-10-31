wsMain.createModule({
  name: "footer-badges",
  create(returnJson) {
    let ul = wsMain.tools.createElm('ul');
    if (!Array.isArray(returnJson)) returnJson = [returnJson];
    returnJson.forEach(badge => {
      let li = wsMain.tools.createElm('li'); 

      li.setAttribute('id', badge.name.trim().replace(/ /g, ''));

      let holder = wsMain.tools.createElm({
        type: 'a', 
        attrs: {
          target: '_blank',
          href: badge.url || ''
        }
      });

      let img = wsMain.tools.createElm({
        type: 'img',
        lazyLoad: false,
        attrs: {
          src: badge.image,
          alt: badge.name
        }
      });

      holder.append(img);
      li.append(holder);
      document.querySelector('[data-wsjs-badges]').append(li);
    });
  },
});