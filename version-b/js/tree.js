/* Static document composition: the original portrait, crown, trunk, section
   branches and roots keep their size and document coordinates while scrolling.
   Only visible raster artwork is painted on a viewport-sized canvas. */
(() => {
  'use strict';
  const canvas=document.getElementById('treeCanvas'), face=document.getElementById('treeFace');
  if(!canvas || !face) return;
  const ctx=canvas.getContext('2d');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const tree=new Image(), trunk=new Image(), branch=new Image(), crow=new Image(), skull=new Image();
  tree.src='assets/art/dead-tree.webp'; trunk.src='assets/art/tree-trunk.webp';
  branch.src='assets/art/tree-branch-long.webp';
  crow.src='assets/art/crow-black.webp';
  skull.src='assets/art/branch-skull.webp';
  const ground=document.getElementById('treeGround');
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  let layout,frame=0,pointer=null,crownLayer,rootLayer,trunkStart;
  // Cards paint their own dark background above the art; do not cut branches
  // off at their borders. Only unbacked copy needs a separate readability mask.
  const protectedContent=[...document.querySelectorAll('.hero__text,.sec__head,.about__text,.projects__toggle,.projects__all,.note,.footer')];
  function prepareBranch(){
    if(!trunk.naturalWidth)return;
    trunkStart=document.createElement('canvas');trunkStart.width=trunk.width;trunkStart.height=trunk.height;
    const t=trunkStart.getContext('2d');t.drawImage(trunk,0,0);t.globalCompositeOperation='destination-in';
    const fade=t.createLinearGradient(0,0,0,trunk.height*.12);fade.addColorStop(0,'transparent');fade.addColorStop(1,'#000');t.fillStyle=fade;t.fillRect(0,0,trunk.width,trunk.height);
  }
  function prepareArt(){
    if(!tree.naturalWidth)return;
    function layer(start,end,fadeTop,fadeBottom){
      const c=document.createElement('canvas');c.width=tree.width;c.height=Math.round(tree.height*(end-start));
      const g=c.getContext('2d');g.drawImage(tree,0,tree.height*start,tree.width,c.height,0,0,c.width,c.height);
      g.globalCompositeOperation='destination-in';
      const mask=g.createLinearGradient(0,0,0,c.height);
      mask.addColorStop(0,fadeTop?'transparent':'#000');
      if(fadeTop)mask.addColorStop(fadeTop,'#000');
      if(fadeBottom)mask.addColorStop(1-fadeBottom,'#000');
      mask.addColorStop(1,fadeBottom?'transparent':'#000');
      g.fillStyle=mask;g.fillRect(0,0,c.width,c.height);return c;
    }
    crownLayer=layer(0,.62,0,.18);
    const base=layer(.64,1,.07,0);
    rootLayer=document.createElement('canvas');rootLayer.width=base.width;rootLayer.height=base.height;
    const rootContext=rootLayer.getContext('2d');
    // Gently flare the upper root collar from the narrow page trunk to the wide
    // illustrated ground spread, without stretching the skulls or lower roots.
    for(let y=0;y<base.height;y+=2){
      const t=clamp(y/(base.height*.34)),smooth=t*t*(3-2*t),scale=.42+.58*smooth;
      const width=base.width*scale;
      rootContext.drawImage(base,0,y,base.width,Math.min(2,base.height-y),(base.width-width)*.55,y,width,Math.min(2,base.height-y));
    }
    request();
  }
  function request(){if(!frame)frame=requestAnimationFrame(draw);}
  function measure(){
    const vw=document.documentElement.clientWidth,vh=innerHeight,mobile=vw<1000;
    const grid=document.querySelector('#experience .grid');
    const columns=getComputedStyle(grid).gridTemplateColumns.split(' ').map(parseFloat);
    const rect=grid.getBoundingClientRect();
    const cx=mobile?vw/2:rect.left+columns[0]+columns[1]/2;
    const gap=mobile?150:columns[1]-58;
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(vw*dpr);canvas.height=Math.round(vh*dpr);
    const size=mobile?Math.min(270,vw*.7):Math.min(410,vw*.31,vh*.46);
    const top=mobile?90:110;
    const crownW=mobile?Math.min(vw*.65,250):Math.min(460,vw*.36);
    const crownTop=top+size*(mobile?.91:.89);
    const tileW=mobile?180:Math.min(330,gap+100);
    const sections=[...document.querySelectorAll('main>.sec')].map((section,index)=>{
      const r=section.getBoundingClientRect();
      const heading=section.querySelector('.sec__head,.about__text');
      const hr=heading?.getBoundingClientRect();
      const cards=[...section.querySelectorAll('.card')].filter(e=>e.getBoundingClientRect().width);
      const ends=[];const lastY={left:-Infinity,right:-Infinity};
      cards.forEach((card,i)=>{
        const p=card.getBoundingClientRect();
        const side=mobile?(i%2?'right':'left'):(p.left+p.width/2<cx?'left':'right');
        const y=p.top+scrollY+65+(side==='right'?45:0);
        if(y-lastY[side]<(mobile?640:480))return;
        lastY[side]=y;ends.push({side:side==='left'?-1:1,y,variation:(index+i)%3});
      });
      // Balance the opening's existing right bough with a left perch.
      if(index===0)ends.unshift({side:-1,y:r.top+scrollY+(mobile?45:135),variation:1,crow:true});
      // Only two additional skulls, spaced far apart and held in branch forks.
      if(index===1||index===5){
        const perch=ends.find(end=>end.side===(index===1?-1:1))||ends[0];
        if(perch){perch.skull=true;if(mobile)perch.y-=perch.side>0?65:45;}
      }
      return {id:section.id,y:r.top+scrollY+(mobile?40:105),index,
        ends,
        headingBottom:hr?hr.bottom+scrollY:r.top+scrollY+130};
    });
    layout={vw,vh,mobile,cx,gap,dpr,size,top,crownW,crownTop,tileW,sections,
      rootY:ground.getBoundingClientRect().top+scrollY,groundH:ground.offsetHeight};
    face.style.width=size+'px';face.style.left=cx+'px';face.style.top=top+'px';
    request();
  }
  function draw(){
    frame=0;if(!layout)return;
    const {vw,vh,mobile,cx,dpr,rootY,groundH,size,top,crownW,crownTop,tileW,sections}=layout;
    const sy=scrollY;
    if(pointer&&!motion.matches&&fine.matches){
      // the whole pupil travels about ±11 artwork px sideways and ±5 up/down inside its eye
      face.style.setProperty('--eye-x',(clamp((pointer.x-cx)/vw*1.6,-.5,.5)*size*.022)+'px');
      face.style.setProperty('--eye-y',(clamp((pointer.y-(top-sy)-size*.6)/vh*1.6,-.5,.5)*size*.01)+'px');
    }else{face.style.setProperty('--eye-x','0px');face.style.setProperty('--eye-y','0px');}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,vw,vh);
    if(!crownLayer||!trunk.complete||!trunk.naturalWidth)return;
    const originalRootW=Math.min(vw*.94,mobile?360:620);
    const rootW=Math.min(vw-12,originalRootW*1.32);
    // Width is independent of height; keep the exact previous vertical footprint.
    const rootH=originalRootW*(rootLayer.height/rootLayer.width);
    const rootTop=rootY+groundH-rootH-sy;
    // The page-length trunk stays narrow enough for the original desktop gutter.
    const tileH=tileW*trunk.height/trunk.width;
    const crownH=crownW*tree.height*.62/tree.width;
    const joinDoc=crownTop+crownH*.72;
    const joinY=joinDoc-sy;
    ctx.save();
    // Mobile content retains its single column. Artwork is masked around text/cards.
    ctx.beginPath();ctx.rect(0,Math.max(0,joinY-30),vw,Math.max(0,Math.min(vh,rootTop+rootH*.35)-Math.max(0,joinY-30)));ctx.clip();
    // Branches are anchored to each section's content, never to the viewport.
    if(branch.complete&&branch.naturalWidth){
      for(const section of sections){
        const anchors=section.ends.length?section.ends:[{side:-1,y:section.y+120,variation:section.index%3},{side:1,y:section.y+220,variation:(section.index+1)%3}];
        for(const end of anchors){
          const side=end.side;
          const space=side<0?cx-24:vw-cx-24;
          const reach=mobile?Math.min(space+35,240):Math.min(space,620)*(1-end.variation*.07);
          const h=reach*(mobile?.72:.61);
          const y=end.y-sy-h*.85;
          if(y>vh||y+h<0)continue;
          ctx.save();ctx.globalAlpha=mobile?.55:.78;ctx.translate(cx-side*8,y);ctx.scale(side,1);
          ctx.drawImage(branch,0,0,reach,h);ctx.restore();
          if(end.crow&&crow.complete&&crow.naturalWidth){
            const birdSize=mobile?58:94;
            // Use the flatter main limb; the anchor is between the two claws,
            // not the sprite's bounding-box bottom. Tilt matches its surface.
            const perchX=cx-side*8+side*reach*.57;
            const perchY=y+h*.526;
            ctx.save();ctx.translate(perchX,perchY);ctx.rotate(.14);
            ctx.drawImage(crow,-birdSize*.64,-birdSize*.88,birdSize,birdSize);
            ctx.restore();
          }
          if(end.skull&&skull.complete&&skull.naturalWidth){
            const skullSize=mobile?(side>0?26:32):48;
            const perchX=cx-side*8+side*reach*(mobile?.48:.18);
            const perchY=y+h*(mobile?.51:.628);
            ctx.save();ctx.translate(perchX,perchY);ctx.rotate(side*.08);
            ctx.drawImage(skull,-skullSize*.5,-skullSize*.86,skullSize,skullSize);
            ctx.restore();
          }
        }
      }
    }
    const firstTile=Math.max(0,Math.floor((sy-joinDoc)/tileH));
    for(let i=firstTile,y=joinDoc+firstTile*tileH-sy;y<vh;i++,y+=tileH){ctx.drawImage(i===0&&trunkStart?trunkStart:trunk,cx-tileW/2,y,tileW,tileH+1);}
    ctx.restore();
    // Crown and base are independent crops from the same illustrated tree.
    if(crownTop-sy<vh&&crownTop+crownH-sy>0)ctx.drawImage(crownLayer,cx-crownW*.55,crownTop-sy,crownW,crownH);
    if(rootTop<vh&&rootTop+rootH>0){
      // Widen the woody intervals, retaining the skulls and trunk collar's
      // proportions. Every strip keeps precisely the same height.
      const stops=[0,255,400,470,650,710,850,rootLayer.width];
      const fixed=new Set([1,3,5]);
      const unit=originalRootW/rootLayer.width;
      const flexible=stops.slice(0,-1).reduce((sum,x,i)=>sum+(fixed.has(i)?0:stops[i+1]-x),0);
      const extra=(rootW-originalRootW)/flexible;
      const spans=stops.slice(0,-1).map((x,i)=>({x,w:stops[i+1]-x,dw:(stops[i+1]-x)*(unit+(fixed.has(i)?0:extra))}));
      const anchor=rootLayer.width*.55;
      let anchorOffset=0;
      for(const s of spans)anchorOffset+=clamp((anchor-s.x)/s.w)*s.dw;
      let dx=cx-anchorOffset;
      for(const s of spans){ctx.drawImage(rootLayer,s.x,0,s.w,rootLayer.height,dx,rootTop,s.dw+.4,rootH);dx+=s.dw;}
    }
    // Leave text and interactive content unobscured, including transparent headings.
    {
      ctx.save();ctx.globalCompositeOperation='destination-out';
      protectedContent.forEach(el=>{
        const r=el.getBoundingClientRect();
        if(r.bottom>0&&r.top<vh&&r.width){
          ctx.filter='blur(18px)';
          ctx.globalAlpha=el.matches('.sec__head,.about__text')?.76:1;
          ctx.fillRect(r.left-8,r.top-8,r.width+16,r.height+16);
        }
      });ctx.restore();
    }
  }
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',measure);
  addEventListener('pointermove',e=>{pointer={x:e.clientX,y:e.clientY};if(fine.matches&&!motion.matches&&scrollY<layout.top+layout.size)request();},{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{pointer=null;request();});
  motion.addEventListener('change',request);
  tree.onload=prepareArt;trunk.onload=prepareBranch;branch.onload=crow.onload=skull.onload=request;
  if(tree.complete&&tree.naturalWidth)prepareArt();
  if(trunk.complete&&trunk.naturalWidth)prepareBranch();
  document.fonts?.ready.then(measure);
  new ResizeObserver(measure).observe(document.querySelector('main'));
  // reveal the movable eyes only once all their layers are decoded
  Promise.all([...face.querySelectorAll('.tree-eye img')].map(img=>img.decode().catch(()=>{})))
    .then(()=>face.classList.add('eyes-ready'));
  window.PortfolioTree={measure};
  measure();
})();
