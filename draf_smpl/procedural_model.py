# ===== Procedural Body Mesh — Fallback khi không có SMPL .pkl =====
#
# Sinh human body mesh parametric từ primitives (cylinder + sphere).
# Cùng interface với SMPLModel: forward(betas) → (N, 3), get_mesh(betas) → dict.
#
# 10 β parameters:
#   β0: height       — chiều cao tổng thể
#   β1: weight       — độ dày/rộng tổng thể
#   β2: torso length — dài thân
#   β3: leg length   — dài chân
#   β4: arm length   — dài tay
#   β5: shoulder w   — rộng vai
#   β6: hip width    — rộng hông
#   β7: head size    — kích thước đầu
#   β8: arm thick    — bề dày tay
#   β9: leg thick    — bề dày chân
#
# Mesh ~1500-2000 vertices, đủ nhận dạng hình người trên Three.js.

import numpy as np


def _sphere(radius: float, center: np.ndarray, stacks: int = 10, slices: int = 12):
    """Sinh sphere mesh."""
    verts = []
    faces = []

    for i in range(stacks + 1):
        phi = np.pi * i / stacks
        for j in range(slices):
            theta = 2 * np.pi * j / slices
            x = center[0] + radius * np.sin(phi) * np.cos(theta)
            y = center[1] + radius * np.cos(phi)
            z = center[2] + radius * np.sin(phi) * np.sin(theta)
            verts.append([x, y, z])

    for i in range(stacks):
        for j in range(slices):
            a = i * slices + j
            b = i * slices + (j + 1) % slices
            c = (i + 1) * slices + j
            d = (i + 1) * slices + (j + 1) % slices
            faces.append([a, c, b])
            faces.append([b, c, d])

    return np.array(verts, dtype=np.float32), np.array(faces, dtype=np.int32)


def _cylinder(radius_top: float, radius_bot: float, height: float,
              center: np.ndarray, rings: int = 6, slices: int = 12):
    """Sinh tapered cylinder mesh (radius thay đổi theo chiều cao)."""
    verts = []
    faces = []

    for i in range(rings + 1):
        t = i / rings
        y = center[1] - height / 2 + t * height
        r = radius_bot + (radius_top - radius_bot) * t
        for j in range(slices):
            theta = 2 * np.pi * j / slices
            x = center[0] + r * np.cos(theta)
            z = center[2] + r * np.sin(theta)
            verts.append([x, y, z])

    for i in range(rings):
        for j in range(slices):
            a = i * slices + j
            b = i * slices + (j + 1) % slices
            c = (i + 1) * slices + j
            d = (i + 1) * slices + (j + 1) % slices
            faces.append([a, c, b])
            faces.append([b, c, d])

    return np.array(verts, dtype=np.float32), np.array(faces, dtype=np.int32)


def _merge_parts(parts: list[tuple[np.ndarray, np.ndarray]]):
    """Ghép nhiều (verts, faces) thành 1 mesh duy nhất."""
    all_verts = []
    all_faces = []
    offset = 0
    for verts, faces in parts:
        all_verts.append(verts)
        all_faces.append(faces + offset)
        offset += len(verts)
    return np.vstack(all_verts), np.vstack(all_faces)


def _generate_body(betas: np.ndarray):
    """
    Sinh human body mesh từ 10 β parameters.
    Tọa độ: Y-up, đơn vị mét, trung tâm ở gốc tọa độ.
    """
    # Base dimensions (mét, tương đương SMPL scale)
    base_height = 1.70
    torso_len = 0.50
    leg_len = 0.42
    arm_len = 0.30
    shoulder_w = 0.18
    hip_w = 0.14
    head_r = 0.10
    arm_r = 0.035
    leg_r = 0.05
    torso_r_top = 0.14
    torso_r_bot = 0.12

    # Apply betas (mỗi β scale ±30% cho param tương ứng)
    s = 0.10  # sensitivity per unit beta
    height_scale = 1.0 + betas[0] * s
    width_scale = 1.0 + betas[1] * s
    torso_len *= 1.0 + betas[2] * s
    leg_len *= 1.0 + betas[3] * s
    arm_len *= 1.0 + betas[4] * s
    shoulder_w *= 1.0 + betas[5] * s
    hip_w *= 1.0 + betas[6] * s
    head_r *= 1.0 + betas[7] * s
    arm_r *= 1.0 + betas[8] * s
    leg_r *= 1.0 + betas[9] * s

    # Width scaling
    torso_r_top *= width_scale
    torso_r_bot *= width_scale
    shoulder_w *= width_scale
    hip_w *= width_scale

    # Vertical layout (bottom-up): feet → legs → torso → neck → head
    total_h = leg_len * 2 + torso_len + head_r * 2 + 0.05
    total_h *= height_scale
    y_feet = -total_h / 2
    y_knee = y_feet + leg_len
    y_hip = y_knee + leg_len
    y_shoulder = y_hip + torso_len
    y_neck = y_shoulder + 0.03
    y_head = y_neck + head_r + 0.02

    parts = []

    # === Head ===
    parts.append(_sphere(head_r, np.array([0, y_head, 0])))

    # === Neck ===
    neck_r = head_r * 0.5
    parts.append(_cylinder(
        neck_r, neck_r, 0.05,
        np.array([0, y_neck, 0]), rings=3, slices=10
    ))

    # === Torso ===
    parts.append(_cylinder(
        torso_r_top, torso_r_bot, torso_len,
        np.array([0, (y_hip + y_shoulder) / 2, 0]), rings=8, slices=12
    ))

    # === Upper legs (2) ===
    for side in [-1, 1]:
        cx = side * hip_w
        parts.append(_cylinder(
            leg_r * 1.1, leg_r * 0.9, leg_len,
            np.array([cx, (y_knee + y_hip) / 2, 0]), rings=6, slices=10
        ))

    # === Lower legs (2) ===
    for side in [-1, 1]:
        cx = side * hip_w
        parts.append(_cylinder(
            leg_r * 0.9, leg_r * 0.7, leg_len,
            np.array([cx, (y_feet + y_knee) / 2, 0]), rings=6, slices=10
        ))

    # === Upper arms (2) ===
    for side in [-1, 1]:
        cx = side * (shoulder_w + arm_r)
        cy = y_shoulder - arm_len / 2
        parts.append(_cylinder(
            arm_r, arm_r * 0.9, arm_len,
            np.array([cx, cy, 0]), rings=5, slices=10
        ))

    # === Lower arms (2) ===
    for side in [-1, 1]:
        cx = side * (shoulder_w + arm_r)
        cy = y_shoulder - arm_len - arm_len / 2
        parts.append(_cylinder(
            arm_r * 0.9, arm_r * 0.7, arm_len,
            np.array([cx, cy, 0]), rings=5, slices=10
        ))

    verts, faces = _merge_parts(parts)
    return verts, faces


class ProceduralModel:
    """
    Fallback body mesh generator — cùng interface với SMPLModel.
    Dùng khi chưa có file SMPL .pkl.
    """

    def __init__(self):
        self.n_betas = 10
        # Generate once with zeros to get counts
        v, f = _generate_body(np.zeros(self.n_betas))
        self.n_vertices = len(v)
        self.n_faces = len(f)

    def forward(self, betas: np.ndarray) -> np.ndarray:
        betas = np.clip(np.asarray(betas, dtype=np.float64), -3.0, 3.0)
        if len(betas) < self.n_betas:
            betas = np.pad(betas, (0, self.n_betas - len(betas)))
        elif len(betas) > self.n_betas:
            betas = betas[: self.n_betas]

        verts, _ = _generate_body(betas)
        return verts

    def get_mesh(self, betas: np.ndarray) -> dict:
        betas = np.clip(np.asarray(betas, dtype=np.float64), -3.0, 3.0)
        if len(betas) < self.n_betas:
            betas = np.pad(betas, (0, self.n_betas - len(betas)))
        elif len(betas) > self.n_betas:
            betas = betas[: self.n_betas]

        verts, faces = _generate_body(betas)
        return {
            "vertices": verts.flatten().tolist(),
            "faces": faces.flatten().tolist(),
            "n_vertices": len(verts),
            "n_faces": len(faces),
        }
