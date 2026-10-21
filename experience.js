(() => {
  const canvas = document.getElementById('asciiEye');
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width=0, height=0, start=null, frame=0, last=0, pointer={x:0,y:0}, running=true;
  let entryGaze={x:0,y:0};
  const smooth = x => { x=Math.max(0,Math.min(1,x)); return x*x*(3-2*x); };
  function resize(){
    const box=canvas.getBoundingClientRect();width=box.width;height=box.height;
    const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  new ResizeObserver(resize).observe(canvas);
  window.addEventListener('pointermove', e => {pointer.x=(e.clientX/innerWidth-.5)*.18;pointer.y=(e.clientY/innerHeight-.5)*.13;},{passive:true});
  function draw(now){
    if(!running)return;
    frame=requestAnimationFrame(draw);
    if(document.hidden || now-last<45)return;last=now;
    const elapsed=start===null?0:(now-start)/1000;
    const center=smooth(elapsed/2.4);
    // The heart starts as a small ember in the pupil and swells outward.
    const grow=smooth((elapsed-3.0)/4.4);
    const heartFade=smooth(grow*2.8);
    const eyeFade=1-smooth((elapsed-3.35)/1.75)*.94;
    const beat=1+grow*(.02*Math.sin(now*.0062)+.008*Math.sin(now*.0124));
    ctx.clearRect(0,0,width,height);
    const mobile=width<560, cell=mobile?6:8, row=cell*1.45;
    ctx.font=`${cell+2}px Inconsolata, monospace`;ctx.textAlign='center';ctx.textBaseline='middle';
    const baseScale=Math.min(width*(mobile?.49:.35),height*.76);
    // A continuous camera push, not a zoom that ends before the reveal.
    const scale=baseScale*(start===null?1:Math.exp(elapsed*.36));
    const gaze=start===null?pointer:entryGaze;
    const initialX=width*(mobile?.5:.63), initialY=height*(mobile?.57:.48);
    const focusX=initialX+gaze.x*baseScale, focusY=initialY+gaze.y*baseScale;
    const pupilX=focusX+(width*.5-focusX)*center;
    const pupilY=focusY+(height*.5-focusY)*center;
    const cx=pupilX-gaze.x*scale, cy=pupilY-gaze.y*scale;
    const blink=reduced.matches||start!==null?1:1-.96*Math.pow(Math.max(0,Math.cos(now/1700)),40);
    const heartScale=Math.min(width*(mobile?.28:.20),height*.26)*(.24+.76*Math.pow(grow,1.55));
    if(grow>.015){
      // A warm halo behind the heart, drawn once rather than per cell.
      const radius=heartScale*2.4;
      const halo=ctx.createRadialGradient(pupilX,pupilY,0,pupilX,pupilY,radius);
      halo.addColorStop(0,`rgba(255,141,183,${.16*heartFade})`);
      halo.addColorStop(.34,`rgba(226,104,150,${.085*heartFade})`);
      halo.addColorStop(1,'rgba(226,104,150,0)');
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=halo;
      ctx.beginPath();ctx.arc(pupilX,pupilY,radius,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    const chars=' .,:;i!+*%&@';
    for(let py=row/2;py<height;py+=row){
      for(let px=cell/2;px<width;px+=cell){
        const x=(px-cx)/scale,y=(py-cy)/scale;
        const eyeY=y/Math.max(.05,blink);
        const upper=.395*Math.pow(Math.max(0,1-x*x),.68);
        const lower=.295*Math.pow(Math.max(0,1-x*x*1.04),.86);
        const inside=Math.abs(x)<1&&eyeY<lower&&eyeY>-upper;
        const ix=x-gaze.x, iy=eyeY-gaze.y;
        const r=Math.hypot(ix,iy), angle=Math.atan2(iy,ix);
        let ink=0,hue=32,sat=50,light=70,alpha=0;
        if(inside){
          const lidGap=Math.min(upper+eyeY,lower-eyeY);
          const edge=1-smooth(lidGap/.17);
          const corner=smooth((Math.abs(x)-.5)/.48);
          // Warm ivory sclera, gently shaded toward the lids and corners.
          hue=34;sat=12+6*corner;light=88-26*edge-10*corner;
          alpha=.30+.18*(1-edge)-.03*corner;ink=.24+.14*(1-edge);
          if(r>.22){
            const vein=Math.pow(Math.max(0,Math.sin(ix*15+iy*9+Math.sin(iy*7)*1.6)),22);
            if(vein>.5){hue=346;sat=34;light=58-5*corner;alpha+=.08;ink+=.05;}
          }
          if(r<.36){
            // Hazel iris: olive near the collarette, amber through the body,
            // copper at the edge, closed by a near-black limbal ring.
            const t=Math.min(1,r/.36);
            const fib=.5+.5*Math.sin(angle*58+t*14+Math.sin(angle*7)*2.2+Math.sin(angle*23)*.9);
            const fibB=.5+.5*Math.sin(angle*19-t*37+1.2);
            const speck=.5+.5*Math.sin(ix*57+iy*41)*Math.sin(ix*23-iy*67);
            const collarette=Math.exp(-Math.pow((t-.47)/.13,2));
            const limbal=smooth((t-.78)/.22);
            const hazel=Math.exp(-Math.pow((t-.42)/.2,2));
            hue=32+15*hazel-8*limbal+3*Math.sin(angle*7+t*3);
            sat=62+16*hazel+10*fib-12*limbal;
            light=39+13*fib+8*fibB+18*collarette-20*limbal*limbal-9*edge+4*speck;
            ink=.36+.28*fib+.12*collarette+.08*limbal+.05*speck;
            alpha=.74+.18*fib;
            if(t>.98){hue=24;sat=32;light=15;ink=.72;alpha=.94;}
            if(r<.132){ink=0;alpha=0;}
            else if(r<.15){hue=26;sat=40;light=24;ink=.66;alpha=.92;}
            else if(r<.176){hue=38;sat=58;light=Math.min(94,light+22);ink=Math.max(ink,.68);alpha=.92;}
            const hi=Math.hypot(ix+.135,iy+.135);
            if(hi<.026){hue=40;sat=20;light=99;ink=.94;alpha=.97;}
            const hi2=Math.hypot(ix-.15,iy-.09);
            if(hi2<.016){hue=38;sat=18;light=96;ink=.56;alpha=.52;}
          }
        }
        // Lash line, lid shadow, lower waterline, and the crease above.
        if(Math.abs(x)<1.0){
          const dUp=eyeY+upper,dLo=lower-eyeY;
          if(dUp>-0.008&&dUp<.022){hue=26;sat=26;light=88;ink=.52;alpha=.78;}
          else if(dUp>.022&&dUp<.052){hue=22;sat=18;light=46;ink=.14;alpha=.24;}
          else if(dLo>-0.014&&dLo<.012){hue=346;sat=42;light=78;ink=.38;alpha=.52;}
          else if(dUp>.06&&dUp<.082){hue=25;sat=22;light=50;ink=.17;alpha=.28;}
        }
        ink*=eyeFade;alpha*=eyeFade;
        // Heart. Its scale is driven by grow, so it swells very slowly.
        const hx=(px-pupilX)/heartScale/beat,hy=-(py-pupilY)/heartScale/beat+.13;
        const heart=Math.pow(hx*hx+hy*hy-1,3)-hx*hx*hy*hy*hy;
        if(heart<=0){
          const glow=Math.max(0,1-Math.hypot(hx+.30,hy-.24)/1.55);
          const shine=Math.exp(-Math.pow(Math.hypot(hx+.33,hy-.05)/.46,2));
          const deep=smooth((hy+.15)/1.15);
          const sheen=.5+.5*Math.sin(hx*8-hy*6+now*.0013);
          const hHue=340-7*deep+4*Math.sin(hy*4);
          const hSat=70+16*glow;
          const hLight=42+24*glow+20*shine-8*deep+5*sheen;
          const hInk=(.46+.22*glow+.30*shine+.06*sheen)*heartFade;
          const hAlpha=(.78+.20*glow)*heartFade;
          if(hInk>.001){
            hue=hHue;sat=hSat;light=hLight;
            ink=Math.max(hInk,ink*(1-heartFade));
            alpha=Math.max(hAlpha,alpha*(1-heartFade));
          }
        }
        if(ink<.045||alpha<.03)continue;
        const char=chars[Math.min(chars.length-1,Math.floor(ink*(chars.length-1)))];
        ctx.fillStyle=`hsla(${hue|0},${Math.max(0,Math.min(100,sat))|0}%,${Math.max(0,Math.min(100,light))|0}%,${Math.round(Math.max(0,Math.min(1,alpha))*100)/100})`;
        ctx.fillText(char,px,py);
      }
    }
    if(start!==null){
      if(elapsed>8.8){running=false;cancelAnimationFrame(frame);showLetter();}
    }
  }
  function open(){
    if(start!==null)return;
    playAudio();
    if(reduced.matches){running=false;cancelAnimationFrame(frame);showLetter();return;}
    entryGaze={...pointer};
    start=performance.now();intro.classList.add('is-diving');yesButton.disabled=true;noButton.hidden=true;
    question.style.visibility='hidden';
  }
  yesButton.addEventListener('click',open);
  document.getElementById('skipIntro').addEventListener('click',()=>{running=false;cancelAnimationFrame(frame);playAudio();showLetter();});
  resize();frame=requestAnimationFrame(draw);
  // A single scroll-bound thread accompanies the note without hiding its text.
  let scrollPending=false;
  function updateThread(){
    scrollPending=false;
    if(document.body.dataset.view!=='letter')return;
    const note=document.querySelector('.letter');
    const bounds=note.getBoundingClientRect();
    const progress=Math.max(0,Math.min(1,(innerHeight*.65-bounds.top)/bounds.height));
    note.style.setProperty('--read-progress',String(progress));
  }
  function scheduleThread(){if(!scrollPending){scrollPending=true;requestAnimationFrame(updateThread);}}
  window.addEventListener('scroll',scheduleThread,{passive:true});
  window.addEventListener('resize',scheduleThread,{passive:true});
  new MutationObserver(scheduleThread).observe(document.body,{attributes:true,attributeFilter:['data-view']});
})();
