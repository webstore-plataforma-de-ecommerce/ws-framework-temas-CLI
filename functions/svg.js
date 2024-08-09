
module.exports = {
  default: () => {
    let arr = [];
    const { optimize } = require('svgo');
    
    fs.readdirSync('.').forEach(fileName => {
      if (fileName.split('.')[1] != 'svg') return;
      let file = fs.readFileSync(fileName, 'utf-8');

      let svg = optimize(file, {
        inlineStyles: false,
        removeViewBox: false
      });
      let svgString = svg.data.replace('<svg', `<svg ico="${fileName.split('.')[0]}"`);
    
      arr.push(svgString);
      return;
    });
    
    fs.writeFileSync('Icones.txt', arr.join(''));
  }
}