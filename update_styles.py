import re

with open('d:\\websites\\landing page6\\style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace .stage styling
stage_pattern = r'/\* ── MAIN STAGE ── \*/\s*\.stage \{.*?\n\}'
stage_repl = """/* ── MAIN STAGE ── */
#journey {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1;
}

#top-section {
  flex: 1; /* top 50% */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 80px; /* for nav */
}

#bottom-section {
  flex: 1; /* bottom 50% */
  position: relative;
  width: 100%;
}

#journey-svg {
  width: 100%;
  height: 100%;
  display: block;
}"""
css = re.sub(stage_pattern, stage_repl, css, flags=re.DOTALL)

# Remove wrappers and svg styles
css = re.sub(r'/\* ── JOURNEY STAGE WRAPPER \(PANNING\) ── \*/.*?#journey-svg \{.*?\n\}', '', css, flags=re.DOTALL)

# Update HUD positions
css = re.sub(r'\.hud-left,.*?\n\}', '.hud-right {\n  position: absolute;\n  bottom: 80px;\n  right: 40px;\n  font-size: 0.65rem;\n  letter-spacing: 0.12em;\n  color: var(--muted);\n  z-index: 5;\n  writing-mode: vertical-lr;\n}', css, flags=re.DOTALL)
css = re.sub(r'\.hud-left \{.*?\}', '', css, flags=re.DOTALL)
css = re.sub(r'\.hud-right \{.*?\}', '', css, count=1, flags=re.DOTALL) # remove old hud-right

# Update company-panel
panel_pattern = r'\.company-panel \{\s*position: absolute;\s*left: 50%;\s*top: 32%;.*?transform-style: preserve-3d;.*?\}'
panel_repl = """.company-panel {
  text-align: center;
  transition: all 0.8s var(--ease-smooth);
  perspective: 1200px;
  transform-style: preserve-3d;
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
}"""
css = re.sub(panel_pattern, panel_repl, css, flags=re.DOTALL)

panel_fadein = r'\.company-panel\.fade-in \{.*?\}'
panel_fadein_repl = ".company-panel.fade-in {\n  opacity: 1;\n  transform: scale(1) rotateX(0);\n}"
css = re.sub(panel_fadein, panel_fadein_repl, css, flags=re.DOTALL)

panel_fadeout = r'\.company-panel\.fade-out \{.*?\}'
panel_fadeout_repl = ".company-panel.fade-out {\n  opacity: 0;\n  transform: scale(0.9) rotateX(-20deg);\n}"
css = re.sub(panel_fadeout, panel_fadeout_repl, css, flags=re.DOTALL)

with open('d:\\websites\\landing page6\\style.css', 'w', encoding='utf-8') as f:
    f.write(css)
