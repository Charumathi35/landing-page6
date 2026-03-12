/**
 * PRICOL GROUP – THE ARK JOURNEY
 * The LINE + NODES pan horizontally.
 * The TRAVELER stays fixed at center.
 * Active company = whichever node is at center.
 */

const COMPANIES = [
  { name: "Pricol Limited", sector: "AUTOMOTIVE", desc: "Leading player in Automotive Components & Solutions, specializing in Driver Information Systems and Connected Vehicle Solutions.", link: "https://www.pricol.com/", icon: "🚗" },
  { name: "Pricol Precision", sector: "MANUFACTURING", desc: "Excellence in precision manufacturing, offering high-quality sintered components and specialized tooling solutions.", link: "https://pricolprecision.com/", icon: "⚙️" },
  { name: "Pricol Engineering", sector: "ENGINEERING", desc: "Top-tier engineering solutions, focusing on industrial automation and heavy machinery components.", link: "https://www.pricolengineering.com/", icon: "🏗️" },
  { name: "Pricol Travel", sector: "HOSPITALITY", desc: "Corporate & Leisure Travel services providing personalized, memorable experiences tailored to your needs.", link: "https://www.pricoltravel.com/", icon: "✈️" },
  { name: "Bluorb", sector: "TECHNOLOGY", desc: "Innovative digital solutions for the modern world, empowering businesses with custom software strategies.", link: "https://bluorb.in/", icon: "🌐" },
  { name: "Pricol Gourmet", sector: "FOOD & BEVERAGE", desc: "Exceptional culinary experiences through premium catering and hospitality services with a passion for flavor.", link: "https://www.pricolgourmet.com/", icon: "🍽️" },
  { name: "Pricol Retreats", sector: "HOSPITALITY", desc: "Luxury retreats where holistic wellness meets unparalleled hospitality in serene locations.", link: "https://dvara.in/", icon: "🏔️" },
  { name: "Pricol Durapack", sector: "PACKAGING", desc: "Sustainable packaging solutions providing high-quality, eco-friendly materials to protect products.", link: "https://pricolpack.com/", icon: "📦" },
  { name: "Pricol Logistics", sector: "LOGISTICS", desc: "Efficient end-to-end cargo and logistics solutions designed to keep the world moving safely.", link: "http://pricollogistics.com/", icon: "🚛" },
  { name: "Pricol Asia", sector: "INTERNATIONAL", desc: "Diverse business interests across the Asian market with focus on strategic partnerships and regional growth.", link: "https://www.pricol.com/", icon: "🌏" },
  { name: "Pricol Surya", sector: "ENERGY", desc: "Advanced energy solutions focused on renewable energy projects and efficient power systems.", link: "#", icon: "☀️" },
  { name: "Pricol Holdings", sector: "CORPORATE", desc: "The parent entity driving vision and strategy, ensuring quality and integrity in every sector.", link: "#", icon: "🏢" }
];

let activeIndex = 0;
let nodePositions = []; // SVG coordinate positions of each node
let pathLength = 0;
let autoPlayTimer = null;
const AUTO_PLAY_DELAY = 4500;



// DOM references
const introScreen = document.getElementById('intro-screen');
const journeyPath = document.getElementById('journey-path');
const journeyPathGlow = document.getElementById('journey-path-glow');
const nodesGroup = document.getElementById('nodes-group');
const companyPanel = document.getElementById('company-panel');

window.addEventListener('load', () => {
  initBackground();
  initJourney();
  setTimeout(() => introScreen.classList.add('hide'), 2500);
});

// The SVG viewbox is fixed to 1920x600 for precise relative positioning
const SVG_W = 1920;
const SVG_H = 600;

function getSlotX(offset) {
    const isMobile = window.innerWidth <= 1000;
    if (offset === 0) return isMobile ? 180 : 350; // Active node
    if (offset < 0) return (isMobile ? 180 : 350) + offset * 300; // Past nodes
    
    // Spread upcoming nodes
    const rightStart = isMobile ? 380 : 850;
    const spacing = isMobile ? 160 : 250; 
    
    return rightStart + (offset - 1) * spacing;
}

function initJourney() {
  const N = COMPANIES.length;
  // Adjusted path to have a more pronounced dip and rise on the right side to fill space
  const pathD = "M -150,350 Q 100,120 350,120 C 650,120 850,350 1200,350 C 1550,350 1750,160 2200,160";
  
  // Apply path to all SVG components
  [journeyPath, journeyPathGlow].forEach(el => {
     if(el) el.setAttribute('d', pathD);
  });


  pathLength = journeyPath.getTotalLength();

  // Build the DOM once
  COMPANIES.forEach((company, i) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'node-group');
    g.addEventListener('click', () => setActive(i));

    const outer = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outer.setAttribute('class', 'node-outer');
    outer.setAttribute('cx', 0); outer.setAttribute('cy', 0); outer.setAttribute('r', 16);

    const inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    inner.setAttribute('class', 'node-inner');
    inner.setAttribute('cx', 0); inner.setAttribute('cy', 0); inner.setAttribute('r', 5);

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    icon.setAttribute('class', 'node-icon');
    icon.setAttribute('x', 0); icon.setAttribute('y', 10);
    icon.setAttribute('text-anchor', 'middle');
    icon.textContent = company.icon;

    // Left aligned text
    const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    textGroup.setAttribute('class', 'node-text-group');

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'node-label');
    label.setAttribute('x', -20);
    label.setAttribute('y', 80);
    label.setAttribute('text-anchor', 'start');
    label.textContent = company.name;

    const coordLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    coordLabel.setAttribute('class', 'node-num');
    coordLabel.setAttribute('x', -20);
    coordLabel.setAttribute('y', 60);
    coordLabel.setAttribute('text-anchor', 'start');
    coordLabel.textContent = `20167, ${1720 + i * 4}`;

    textGroup.appendChild(coordLabel); 
    textGroup.appendChild(label);
    
    g.appendChild(outer); 
    g.appendChild(inner); 
    g.appendChild(icon); 
    g.appendChild(textGroup);
    
    g.style.transition = 'none';
    
    nodesGroup.appendChild(g);
  });

  // Init at index 0
  setActive(0, true);
}

/**
 * Binary-search the SVG path for the parametric point
 * whose x coordinate is closest to targetX.
 */
function getPathPointAtX(path, targetX, totalLen) {
  let lo = 0, hi = totalLen, mid, pt;
  for (let iter = 0; iter < 60; iter++) {
    mid = (lo + hi) / 2;
    pt = path.getPointAtLength(mid);
    if (Math.abs(pt.x - targetX) < 0.5) break;
    if (pt.x < targetX) lo = mid;
    else hi = mid;
  }
  return { x: pt.x, y: pt.y, len: mid };
}

function setActive(index, immediate = false) {
  // Wrap around
  if (index >= COMPANIES.length) index = 0;
  if (index < 0) index = COMPANIES.length - 1;

  activeIndex = index;

  if (autoPlayTimer) clearInterval(autoPlayTimer);
  autoPlayTimer = setInterval(() => setActive(activeIndex + 1), AUTO_PLAY_DELAY);

  const company = COMPANIES[activeIndex];
  const N = COMPANIES.length;

  document.querySelectorAll('.node-group').forEach((g, i) => {
    let offset = i - activeIndex;
    if (offset < -N/2) offset += N;
    if (offset > N/2) offset -= N;

    const prevOffsetStr = g.getAttribute('data-offset');
    let wrapAround = false;
    if (prevOffsetStr !== null) {
      if (Math.abs(offset - parseInt(prevOffsetStr, 10)) > 1) wrapAround = true;
    }
    g.setAttribute('data-offset', offset);

    const isActive = (offset === 0);
    g.classList.toggle('active', isActive);

    const targetX = getSlotX(offset);
    const pt = getPathPointAtX(journeyPath, targetX, pathLength);

    const isMobile = window.innerWidth <= 1000;
    let targetOpacity = 0;
    if (offset === 0) {
      targetOpacity = 1;
    } else if (offset > 0) {
      targetOpacity = offset <= (isMobile ? 2 : 5) ? 1 : 0;
    }

    if (immediate) {
      g.style.transition = 'none';
      g.style.opacity = targetOpacity.toString();
    } else if (wrapAround) {
      g.style.transition = 'none';
      g.style.opacity = '0';
    } else {
      g.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s';
      g.style.opacity = targetOpacity.toString();
    }
    
    g.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
  });

  // ── PANEL UPDATE ──
  if (!immediate) {
    companyPanel.classList.add('fade-out');
    setTimeout(() => {
      updatePanel(company);
      companyPanel.classList.remove('fade-out');
      companyPanel.classList.add('fade-in');
    }, 400);
  } else {
    updatePanel(company);
  }
}

function updatePanel(company) {
  document.getElementById('panel-title').textContent = company.name;
  document.getElementById('panel-desc').textContent = company.desc;
  document.getElementById('panel-link').href = company.link;
}

window.addEventListener('resize', () => setActive(activeIndex, true));

let isScrolling = false;
window.addEventListener('wheel', (e) => {
  if (isScrolling) return;
  isScrolling = true;
  setTimeout(() => { isScrolling = false; }, 800);
  if (e.deltaY > 0) setActive(activeIndex + 1);
  else setActive(activeIndex - 1);
});

let touchStartX = 0;
let touchEndX = 0;

window.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

window.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchStartX - touchEndX > 50) {
    setActive(activeIndex + 1);
  } else if (touchEndX - touchStartX > 50) {
    setActive(activeIndex - 1);
  }
}, {passive: true});

function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width, height, particles = [];
  const resize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
  window.addEventListener('resize', resize); resize();
  
  const colors = ['rgba(0, 212, 255,', 'rgba(124, 58, 237,', 'rgba(167, 139, 250,'];
  
  class Particle {
    constructor() { this.reset(); this.y = Math.random() * height; }
    reset() { 
      this.x = Math.random() * width; 
      this.y = height + 10; 
      this.size = Math.random() * 2 + 0.5; 
      this.speed = (Math.random() * 0.2) + 0.05; 
      this.opacity = Math.random() * 0.6 + 0.1;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }
    update() { 
      this.y -= this.speed; 
      this.x += Math.sin(this.y * 0.01) * 0.2; // Gentle drifting
      if (this.y < -10) this.reset(); 
    }
    draw() { 
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
      grad.addColorStop(0, `${this.colorBase}${this.opacity})`);
      grad.addColorStop(1, `${this.colorBase}0)`);
      ctx.fillStyle = grad; 
      ctx.beginPath(); 
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2); 
      ctx.fill(); 
    }
  }
  for (let i = 0; i < 150; i++) particles.push(new Particle());
  const animate = () => {
    // Add subtle ambient spotlight to the background
    const bgGrad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height, width);
    bgGrad.addColorStop(0, '#11172a'); // slightly lighter deep blue
    bgGrad.addColorStop(1, '#09090b'); // ultra dark
    ctx.fillStyle = bgGrad; 
    ctx.fillRect(0, 0, width, height);
    
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  };
  animate();
}
