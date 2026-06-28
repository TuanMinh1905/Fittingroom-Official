"""
Vẽ sơ đồ kiến trúc hệ thống TMF Virtual Fitting Room 3D bằng Matplotlib.
Chạy: python draw_architecture.py
Output: system_architecture.png (300 DPI)
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

fig, ax = plt.subplots(figsize=(18, 12))
ax.set_xlim(0, 18)
ax.set_ylim(0, 12)
ax.axis('off')
fig.patch.set_facecolor('#FAFAFA')

# ── Color palette ─────────────────────────────────────────────────────────────
C = {
    'client'  : ('#E8F4FD', '#2196F3'),   # light blue
    'frontend': ('#E8F5E9', '#388E3C'),   # light green
    'backend' : ('#FFF3E0', '#E65100'),   # light orange
    'fastapi' : ('#F3E5F5', '#7B1FA2'),   # light purple
    'db'      : ('#FCE4EC', '#C62828'),   # light red
    'openai'  : ('#F5F5F5', '#212121'),   # light gray / dark
    'threejs' : ('#E0F7FA', '#00838F'),   # light cyan
}

# ── Helper: draw a rounded box ─────────────────────────────────────────────────
def box(ax, x, y, w, h, label, sublabel='', color=('#fff','#333'),
        fontsize=11, subfontsize=8.5, radius=0.35):
    fc, ec = color
    rect = FancyBboxPatch((x, y), w, h,
                          boxstyle=f'round,pad=0,rounding_size={radius}',
                          linewidth=2, edgecolor=ec, facecolor=fc, zorder=3)
    ax.add_patch(rect)
    cy = y + h/2 + (0.18 if sublabel else 0)
    ax.text(x + w/2, cy, label,
            ha='center', va='center', fontsize=fontsize,
            fontweight='bold', color=ec, zorder=4)
    if sublabel:
        ax.text(x + w/2, y + h/2 - 0.22, sublabel,
                ha='center', va='center', fontsize=subfontsize,
                color='#555', zorder=4, style='italic')

# ── Helper: arrow with label ───────────────────────────────────────────────────
def arrow(ax, x1, y1, x2, y2, label='', color='#555', lw=1.6,
          connectionstyle='arc3,rad=0.0', label_offset=(0, 0.18),
          fontsize=7.5, arrowstyle='->', bidirectional=False):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle=arrowstyle, color=color,
                                lw=lw, connectionstyle=connectionstyle),
                zorder=2)
    if bidirectional:
        ax.annotate('', xy=(x1, y1), xytext=(x2, y2),
                    arrowprops=dict(arrowstyle=arrowstyle, color=color,
                                    lw=lw, connectionstyle=connectionstyle),
                    zorder=2)
    if label:
        mx = (x1+x2)/2 + label_offset[0]
        my = (y1+y2)/2 + label_offset[1]
        ax.text(mx, my, label, ha='center', va='bottom',
                fontsize=fontsize, color=color, zorder=5,
                bbox=dict(fc='#FAFAFA', ec='none', pad=1))

# ══════════════════════════════════════════════════════════════════════════════
# TITLE
# ══════════════════════════════════════════════════════════════════════════════
ax.text(9, 11.55, 'SYSTEM ARCHITECTURE — TMF Virtual Fitting Room 3D',
        ha='center', va='center', fontsize=15, fontweight='bold', color='#1A1A2E')
ax.axhline(11.35, xmin=0.03, xmax=0.97, color='#CCCCCC', lw=1)

# ══════════════════════════════════════════════════════════════════════════════
# BOXES
# ══════════════════════════════════════════════════════════════════════════════

# 1. CLIENT (Browser)
box(ax, 0.3, 8.8, 2.4, 1.6,
    'Client\n(Browser)',
    sublabel='User Interface',
    color=C['client'], fontsize=10)

# 2. NEXT.JS FRONTEND
box(ax, 0.3, 5.6, 2.4, 2.8,
    '[Next.js]',
    sublabel='TailwindCSS\nZustand • TypeScript\nApp Router / SSR',
    color=C['frontend'], fontsize=10, subfontsize=8)

# 3. THREE.JS + R3F (inside frontend area, bottom)
box(ax, 0.3, 3.4, 2.4, 1.8,
    'Three.js +\nReact Three Fiber',
    sublabel='WebGL • OrbitControls\nMesh Renderer',
    color=C['threejs'], fontsize=9, subfontsize=7.5)

# 4. HONOJS API SERVER (center hub)
box(ax, 6.8, 7.0, 3.6, 2.6,
    'HonoJS\nAPI Server',
    sublabel='Node.js • RESTful API\nJWT Auth • Middleware',
    color=C['backend'], fontsize=11, subfontsize=8.5)

# 5. MONGODB
box(ax, 6.8, 4.2, 3.6, 2.2,
    'MongoDB',
    sublabel='(via Mongoose)\nProducts • Users\nOrders • SizeChart',
    color=C['db'], fontsize=10, subfontsize=8)

# 6. OPENAI API
box(ax, 6.8, 9.8, 3.6, 1.5,
    '[OpenAI API]',
    sublabel='GPT-4o-mini • AI Advisor\nSize Recommendation (VI)',
    color=C['openai'], fontsize=10, subfontsize=8)

# 7. FASTAPI (Python)
box(ax, 12.2, 5.8, 4.8, 3.4,
    'FastAPI\nPython Backend',
    sublabel='Docker • Uvicorn • PyTorch\nAsync inference endpoint',
    color=C['fastapi'], fontsize=10, subfontsize=8)

# 8. SMPL (inside FastAPI region, visual sub-box)
box(ax, 12.4, 3.8, 2.0, 1.7,
    'SMPL',
    sublabel='Body Mesh\n6890 vertices\nShape β • Pose θ',
    color=('#EDE7F6', '#4527A0'), fontsize=9, subfontsize=7.5)

# 9. TAILORNET (inside FastAPI region)
box(ax, 14.7, 3.8, 2.1, 1.7,
    'TailorNet',
    sublabel='Garment Deform\nDeep Learning\nCVPR 2020',
    color=('#EDE7F6', '#4527A0'), fontsize=9, subfontsize=7.5)

# ══════════════════════════════════════════════════════════════════════════════
# ARROWS
# ══════════════════════════════════════════════════════════════════════════════

# Client ↔ Next.js
arrow(ax, 1.5, 8.8, 1.5, 8.4,
      'interaction', color='#388E3C', bidirectional=True,
      label_offset=(0.5, 0.05), fontsize=7)

# Next.js → HonoJS
arrow(ax, 2.7, 7.2, 6.8, 8.1,
      'REST API calls', color='#E65100',
      label_offset=(0, 0.2), fontsize=7.5)

# HonoJS → Next.js (response)
arrow(ax, 6.8, 7.8, 2.7, 6.9,
      'JSON response', color='#E65100',
      connectionstyle='arc3,rad=0.15',
      label_offset=(0, -0.3), fontsize=7.5)

# HonoJS ↔ MongoDB
arrow(ax, 8.6, 7.0, 8.6, 6.4,
      'CRUD', color='#C62828', bidirectional=True,
      label_offset=(0.5, 0.05), fontsize=7.5)

# HonoJS → OpenAI
arrow(ax, 8.6, 9.6, 8.6, 9.8 ,
      'prompt + measurements', color='#212121',
      label_offset=(1.2, 0.05), fontsize=7)
arrow(ax, 9.8, 10.55, 10.9, 10.55, '', color='#212121')

# OpenAI → HonoJS
arrow(ax, 7.5, 9.8, 7.0, 9.5,
      'size advice (VI)', color='#212121',
      connectionstyle='arc3,rad=-0.2',
      label_offset=(-0.8, 0.1), fontsize=7)

# HonoJS → FastAPI
arrow(ax, 10.4, 8.5, 12.2, 7.8,
      'height, weight, gender, garment_type', color='#7B1FA2',
      label_offset=(0, 0.22), fontsize=7.5)

# FastAPI → HonoJS
arrow(ax, 12.2, 7.2, 10.4, 7.8,
      'OBJ mesh data', color='#7B1FA2',
      connectionstyle='arc3,rad=0.2',
      label_offset=(0.2, -0.35), fontsize=7.5)

# Next.js → Three.js
arrow(ax, 1.5, 5.6, 1.5, 5.2,
      'mesh data', color='#00838F', bidirectional=False,
      label_offset=(0.5, 0.05), fontsize=7)

# SMPL → TailorNet
arrow(ax, 14.4, 4.65, 14.7, 4.65,
      'shape β', color='#4527A0',
      label_offset=(0, 0.15), fontsize=7)

# FastAPI internal: SMPL+TailorNet connected upward to FastAPI box
arrow(ax, 13.4, 5.5, 13.4, 5.8,
      'body mesh', color='#7B1FA2',
      label_offset=(0.6, 0.05), fontsize=7)
arrow(ax, 15.75, 5.5, 15.75, 5.8,
      'garment mesh', color='#7B1FA2',
      label_offset=(0.7, 0.05), fontsize=7)

# ══════════════════════════════════════════════════════════════════════════════
# DASHED GROUP BORDER: Python AI Engine
# ══════════════════════════════════════════════════════════════════════════════
group_rect = FancyBboxPatch((12.05, 3.6), 5.1, 5.8,
    boxstyle='round,pad=0,rounding_size=0.4',
    linewidth=1.5, edgecolor='#9C27B0', facecolor='none',
    linestyle='--', zorder=1)
ax.add_patch(group_rect)
ax.text(14.6, 9.55, 'Python AI Engine (Docker)',
        ha='center', fontsize=8, color='#7B1FA2', style='italic')

# ══════════════════════════════════════════════════════════════════════════════
# DASHED GROUP BORDER: Frontend Layer
# ══════════════════════════════════════════════════════════════════════════════
fe_rect = FancyBboxPatch((0.1, 3.2), 2.8, 7.4,
    boxstyle='round,pad=0,rounding_size=0.4',
    linewidth=1.5, edgecolor='#388E3C', facecolor='none',
    linestyle='--', zorder=1)
ax.add_patch(fe_rect)
ax.text(1.5, 10.75, 'Frontend Layer',
        ha='center', fontsize=8, color='#388E3C', style='italic')

# ══════════════════════════════════════════════════════════════════════════════
# LEGEND
# ══════════════════════════════════════════════════════════════════════════════
legend_items = [
    mpatches.Patch(facecolor=C['frontend'][0], edgecolor=C['frontend'][1], label='Frontend (Next.js)'),
    mpatches.Patch(facecolor=C['backend'][0],  edgecolor=C['backend'][1],  label='Backend (HonoJS/Node.js)'),
    mpatches.Patch(facecolor=C['fastapi'][0],  edgecolor=C['fastapi'][1],  label='AI Engine (FastAPI/Python)'),
    mpatches.Patch(facecolor=C['db'][0],       edgecolor=C['db'][1],       label='Database (MongoDB)'),
    mpatches.Patch(facecolor=C['openai'][0],   edgecolor=C['openai'][1],   label='External API (OpenAI)'),
    mpatches.Patch(facecolor=C['threejs'][0],  edgecolor=C['threejs'][1],  label='3D Renderer (Three.js/R3F)'),
]
ax.legend(handles=legend_items, loc='lower left',
          bbox_to_anchor=(0.0, 0.0), fontsize=8,
          framealpha=0.9, edgecolor='#CCCCCC', ncol=2)

# ── Caption ────────────────────────────────────────────────────────────────────
ax.text(9, 0.25,
        'Hình. Mô hình kiến trúc hệ thống TMF Virtual Fitting Room 3D',
        ha='center', fontsize=9, style='italic', color='#444')

# ── Save ───────────────────────────────────────────────────────────────────────
plt.tight_layout()
plt.savefig('system_architecture.png', dpi=300, bbox_inches='tight',
            facecolor='#FAFAFA')
print('Saved: system_architecture.png')
plt.show()
