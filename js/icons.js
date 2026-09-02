// SVG arrows keep the same appearance on iOS, Android and desktop.
(() => {
  const angles = {'→':0,'↗':-45,'↑':-90,'↖':-135,'←':180,'↙':135,'↓':90,'↘':45};
  const pattern = /[→↗↑↖←↙↓↘]\uFE0F?/g;
  function replace(root) {
    if(root.nodeType===1 && root.closest('script,style,svg,textarea,option'))return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=root.nodeType===3?[root]:[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){
      if(node.parentElement?.closest('script,style,svg,textarea,option'))continue;
      const value=node.nodeValue;
      const matches=[...value.matchAll(pattern)];
      if(!matches.length)continue;
      const fragment=document.createDocumentFragment();let cursor=0;
      for(const match of matches){
        fragment.append(value.slice(cursor,match.index));
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('class','ui-arrow');
        svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
        const path=document.createElementNS(svg.namespaceURI,'path');
        path.setAttribute('d','M5 12h14m-6-6 6 6-6 6');
        path.setAttribute('transform',`rotate(${angles[match[0][0]]} 12 12)`);
        svg.append(path);fragment.append(svg);cursor=match.index+match[0].length;
      }
      fragment.append(value.slice(cursor));node.replaceWith(fragment);
    }
  }
  replace(document.body);
  new MutationObserver(records=>{
    for(const record of records){
      if(record.type==='characterData')replace(record.target);
      else record.addedNodes.forEach(replace);
    }
  }).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
