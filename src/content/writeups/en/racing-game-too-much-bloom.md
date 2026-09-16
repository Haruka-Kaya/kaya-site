---
title: I wanted a better-looking racing game. I got a washed-out screen.
summary: Adding bloom made the sky steal the show. A detour through lighting effects, gray roads, and unexpectedly black screenshots.
date: '2026-09-17'
category: notes
tags:
  - Build outtakes
  - Three.js
  - Game development
draft: false
---

I added bloom to my racing game. Light would glow softly around bright objects. It was supposed to look good.

The screen washed out.

The game uses Three.js for rendering and Rapier for vehicle physics. I wanted the car to look good as well as move, so I brought in `EffectComposer` and `UnrealBloom`. My procedural sky was extremely bright, and bloom enthusiastically included it in the effect.

The car was meant to be the main attraction. The sky had other plans.

## A little more light on the road

I also tried image-based lighting, or IBL, which uses an environment image to light the scene. The idea was to make light from the surroundings contribute to the overall look.

The road turned grayish.

The lighting was doing something. Whether I wanted that something in the finished game was another question.

I ended up removing both the post-processing effects, including bloom, and IBL from this game. Two new additions, both shown the door.

I kept anti-aliasing, clearcoat on the car, shadows, and texture filtering for the road at an angle. Making the car and road readable won over having a longer list of effects.

## Then the screenshots turned black

I was also checking the game through automated browser tests. Those tests used SwiftShader, which renders in software rather than relying on a physical GPU.

In that test setup, capturing the rendered image required `preserveDrawingBuffer: true`. Without it, screenshots could come out black.

First too white. Now black.

Different causes, of course. Tweaking the lights would not fix image capture. Treating every visual failure as “the rendering broke” would have sent me looking in the wrong place.

Looking back through the development notes, I also built a ghost car and drift scoring. Actual racing-game features were happening. They just have to share the story with an overenthusiastic sky and a screenshot of nothing.

I wanted to make a car go around a track. That was the original idea.
