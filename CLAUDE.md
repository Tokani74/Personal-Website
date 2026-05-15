# Tanish Kothapalle — Personal Portfolio

## Project
Single-page engineering portfolio website deployed via GitHub Pages.

- **Repo:** Tokani74/Personal-Website
- **Working branch:** `site` → merges into `main` via PR
- **Pages URL:** tokani74.github.io/Personal-Website/
- **Use relative paths** for all links (project site, not user site)

## File Map
| File | Purpose |
|------|---------|
| `index.html` | Single-page portfolio: hero, about, projects, skills, contact |
| `styles.css` | Full dark-theme stylesheet — CSS variables at top of file |
| `script.js` | Canvas animation, typing effect, scroll reveal, nav, card expand |
| `contact.html` | Standalone contact page, links back to `index.html` |
| `Engineering Portfolio.pdf` | Source of all project content — do not delete |

## Design System
```
Background:  #080808    --bg
Surface:     #111111    --surface
Border:      #222222    --border
Text:        #f0f0f0    --text
Muted:       #666 / #999

Accent (primary):  #a3ff4e  --green   (AR Glasses, hero, nav)
Project accents:   #7ec8e3  --blue    (Nanoparticle)
                   #3ecfb0  --teal    (Hand-Tracking Plane)
                   #b8a4f5  --purple  (Battlebot)

Fonts: Inter (body), JetBrains Mono (code/labels) — loaded from Google Fonts
```

## Owner
- **Name:** Tanish Kothapalle
- **Email:** tanisk74@gmail.com
- **LinkedIn:** linkedin.com/in/tanish-kothapalle
- **Role:** Engineering student, Electronics Lead @ UT Austin Makerspace

## Projects (from PDF)
1. **AR Speech-to-Text Glasses** — Personal, Ongoing. Custom PCBs (KiCad), Onshape CAD frame, Bluetooth STT pipeline.
2. **Nanoparticle Indentation** — Research Assistant, Completed. LAMMPS simulations, OVITO visualization. Published paper: *Simulation of High Strain Rate Contact of Single Crystal Al Spheres*.
3. **Hand-Tracking RC Plane** — Personal, Completed. Python/OpenCV hand tracking → Arduino radio → servo control. Foam board + 3D-printed propellers.
4. **Battlebot** — Team Competition, Completed. SolidWorks CAD, 3D-printed PETG/TPU chassis, LiPo + ESC + radio electronics.

## Key JS Behaviors
- `toggleExpand(id, btn)` — expands `.card-expandable` panels on project cards
- Canvas `#canvas` — PCB particle animation with signal packets; only runs if element exists
- `.reveal` class — elements animate in via IntersectionObserver on scroll
- Typing animation — cycles phrases in `#typed` element
