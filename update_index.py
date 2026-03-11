import re

with open('d:\\websites\\landing page6\\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_main = """  <main id="journey">
    <div id="top-section">
      <div id="company-panel" class="company-panel">
        <div class="panel-eyebrow" id="panel-eyebrow">SECTOR: AUTOMOTIVE</div>
        <h2 class="panel-title" id="panel-title">Pricol Limited</h2>
        <a class="panel-link" id="panel-link" href="#" target="_blank" rel="noopener">
          <span>Explore Related Products</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </div>
    <div id="bottom-section">
      <svg id="journey-svg" viewBox="0 0 1920 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="path-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.2" />
            <stop offset="30%" stop-color="#7c3aed" stop-opacity="1" />
            <stop offset="70%" stop-color="#a78bfa" stop-opacity="1" />
            <stop offset="100%" stop-color="#c4b5fd" stop-opacity="0.2" />
          </linearGradient>
          <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#7c3aed" stop-opacity="0" />
            <stop offset="50%" stop-color="#a78bfa" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#7c3aed" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path id="journey-path-glow" class="path-glow" fill="none" stroke="url(#glow-gradient)" stroke-width="12" filter="url(#path-glow)" />
        <path id="journey-path" class="path-main" fill="none" stroke="url(#path-gradient)" stroke-width="6" />
        <path id="journey-pointer" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="6 6" />
        <g id="nodes-group"></g>
      </svg>
    </div>
    <div id="journey-controls" class="journey-controls">
      <button id="btn-prev" class="ctrl-btn"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 3L5 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
      <div class="ctrl-dots" id="ctrl-dots"></div>
      <button id="btn-next" class="ctrl-btn"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 3l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
    </div>
    <div class="hud-right">
      <div class="hud-label">ACTIVE SECTOR</div>
      <div class="hud-value" id="hud-sector">AUTOMOTIVE</div>
    </div>
  </main>"""

html = re.sub(r'<main id="journey".*?</main>', new_main, html, flags=re.DOTALL)

with open('d:\\websites\\landing page6\\index.html', 'w', encoding='utf-8') as f:
    f.write(html)
