---
title: The engraving preview looked right, but the toolpath was flipped
summary: Notes from a Python V-carving tool, covering coordinate mismatches, slider updates, and why displaying the input does not validate the output.
date: '2026-09-17'
category: build
tags:
  - Python
  - CNC
  - Tkinter
draft: false
---

I built a V-carving GUI in Python and Tkinter for engraving things such as nameplates. It calculates a toolpath from a drawing and exports G-code. During a July 2026 rework, I repeatedly found differences between what the screen showed and what the tool actually generated.

## Varying depth with the width of the shape

A V-shaped cutter makes a wider cut as it goes deeper. Engraving both thin and thick parts of a letter therefore needs more than tracing an outline at a fixed depth.

The tool finds a centerline from the DXF geometry and uses distance to the outline to calculate depth. Moving from displaying a shape to generating a path for a physical cutter introduced more things to verify.

## Displaying the input hid a flipped output

At one point, the preview had the correct orientation while the generated toolpath was vertically flipped. The image and machine coordinate systems treated the direction of the Y axis differently, and the conversion was inconsistent.

Drawing the original shape on screen could still look correct even when the output path was wrong. I changed the preview to overlay the generated toolpath on the outline. That let me inspect whether the path I was about to export followed the intended geometry.

The 3D view needed attention too. A heightfield-based representation produced needle-like artifacts, so I revised it to construct the groove geometry from the toolpath.

## Different ways of changing a slider produced different updates

Another mismatch came from settings. Moving a Tkinter `ttk.Scale` with the mouse ran its update callback, but changing the underlying variable with `set` did not invoke the same `command`.

The wheel and reset paths could change the displayed value without going through the recalculation. A changed number on screen was not proof that the value used for output had been updated.

I used `trace_add` to observe variable changes and removed the discrepancy between those interaction paths. For this tool, watching the value used by the calculation was a better fit than relying on one particular widget action.

## Output checks do not replace a machining test

Toolpath overlays and self-tests help find mistakes before machining. Passing them does not establish physical accuracy or safe operation on a real machine.

The lesson I want to keep is that a preview and an export can disagree when they are produced through separate paths. The next time I build a tool that generates something, I want a way to inspect the generated result itself.

Related: [Linux & Electronics](/en/hobbies/electronics/)
