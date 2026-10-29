# Face and illustrated tree

Implemented 26 October 2026.

The original assets/art/character.webp is unchanged. The new composition loads js/tree.js and css/tree.css; js/split-head.js and js/neural.js remain on disk for recovery but are not loaded. main.js now requests PortfolioTree.measure() after project changes. All existing content sections, cards, original styles, fonts, links and other assets are preserved.

## Artwork

Generated with the built-in image_gen tool, using the supplied reference image for the tree style. WebP encoding preserves alpha. The first two assets total 663,128 bytes; the long-branch addition below brings the total to 815,456 bytes:
- assets/art/dead-tree.webp: crown and root artwork, exactly two decorative skulls.
- assets/art/tree-trunk.webp: continuous bark extension with sparse branches.

The viewport-sized canvas composes crown, repeating trunk and broad roots. Edge masks and a tapered upper root collar blend the layers; the skulls and lower roots retain their original proportions. It draws only on scroll, resize, art loading, or pointer interaction, with no idle animation loop. The roots follow actual page height, including expanded project cards.

The character and crown retain their initial document sizes and positions. Long illustrated branches now extend behind cards at staggered heights throughout each section. The root spread is up to 620px on desktop and 360px on mobile. Card backgrounds and softly feathered masks keep text readable. See the long-branch revision below for details.

## Prompt: complete tree

Use case: illustration-story. Create a production transparent PNG illustration asset for an existing creepy-cute hand-drawn cartoon portfolio. The supplied screenshot is a STYLE AND TREE SHAPE reference only, not a page to reproduce. Draw ONLY ONE complete leafless dead tree, isolated on genuine alpha transparency, full silhouette within frame. Portrait composition about 2:3. Strong elegant asymmetrically twisted trunk, warm very dark brown and charcoal bark, hand-inked irregular contours and painterly bark grain, restrained deep oxblood-red rim highlights. Sparse expressive branches, no crowded twigs, no leaves. Top crown must have a central open space above fork for a separately layered character head. Lower half a strong continuous trunk flaring into broad intricate roots spreading horizontally along the bottom. EXACTLY TWO small cute stylized warm bone-brown cartoon skulls tucked among roots, subtle decorative, rounded black eye sockets. Match screenshot tree's carved bark and red edges, illustrated old Flash cartoon aesthetic, not realistic, not generic fantasy. No character/head/face on the tree, no room, no UI, no text, no cards, no ground rectangle, no atmospheric glow. Transparent negative space between all branches and roots. Tree full silhouette takes 90% height, root spread about 85% width; upper branches only 65% width. Tree trunk should be centered and fairly upright overall with a gentle S twist. Keep skulls confined to lowest 15% of artwork.

## Prompt: trunk extension

Use case: illustration-story. Production transparent PNG game art. Supporting reference is the tree whose bark/style to match. Generate ONLY a long midsection of the SAME dark hand-inked cartoon tree trunk, a seamless vertically tileable trunk extension for a very long webpage. Tall narrow portrait 1:3 composition. Continuous trunk enters straight through the TOP edge and exits through BOTTOM edge at exactly the same centered x position and same width (around 28% of image width), so vertically repeating it is seamless. No taper between top and bottom, the matching top and bottom ends must be fully opaque wood with identical contours. In between, graceful slight S curve of thick twisted wood, interesting bark folds and inked woodgrain, charcoal and dark brown, restrained dark burgundy-red edge accents (less bright than reference). Three sparse short elegant dead branch offshoots at different heights, never reaching canvas edges. Genuine alpha transparency surrounding the trunk and between branches. No roots, no skulls, no head, no foliage, no background gradient, no glow, no landscape, no text. Match reference's illustrated creepy-cute storybook bark texture. Keep overall trunk vertical; do not create separate pieces.


## Perch refinement and two branch skulls — 26 October 2026

The black crow now rests on the flatter limb at normalized branch position (0.57, 0.526). Its between-claw anchor and 0.14 radian tilt align the feet to the wood. Two small skulls were added, one near Experience and one near Certifications, resting in branch forks. The original two root skulls and all root dimensions remain unchanged. Mobile uses separate perch offsets to stay above the cards. Desktop and mobile close-up screenshots were reviewed.

New asset: `assets/art/branch-skull.webp`, 256 × 256 transparent WebP, 24,858 bytes. Created with built-in image_gen using the existing dead-tree artwork as a style reference. Generated source: `C:/Users/afs12/.codex/generated_images/01a1767b-b0f8-7a42-8c6e-65e95ae17cc9/exec-598a1232-5af2-4fb9-95a2-bde1d7bf4cda.png`.

Exact prompt: Use case: illustration-story. Generate one isolated small decorative cartoon skull sprite for the illustrated portfolio. Reference image is ONLY a style reference: match exactly the cute rounded little skulls among its tree roots. Warm muted tan old bone, charcoal ink contours, two large rounded black empty eye sockets, tiny triangular nose hole, simple short teeth with no lower jaw, a few subtle cracks, soft dark brown shading and tiny muted burnt-red edge accent. Three-quarter view facing slightly left. Compact round silhouette, level bottom row of teeth so it can rest naturally on a branch. No tree, no branch, no ground, no shadow on backdrop, no text, no blood, no realistic gore. Skull fills 85 percent of a square frame with all edges fully visible. Genuine transparent alpha background around the single skull. Restrained hand-drawn creepy-cute storybook illustration matching reference, not photorealistic or 3D.

## Black crow and horizontal roots — 26 October 2026

The opening now has a balancing left branch with a small black crow. The crow has neutral charcoal feather definition, a black eye and white catchlight, and no red accents. Its transparent WebP is 384 × 384, 29,808 bytes. The roots now spread to 818.4px at the 1440px desktop viewport while retaining their previous 334.824px height. At 390px mobile width they spread to 378px with their previous 194.414px height. Horizontal wood intervals stretch while the two skull regions and central collar retain their proportions. No content, navigation or layout was changed in this revision.

Crow generated with the built-in image generator, followed by this exact color-correction prompt:

Edit this crow sprite ONLY to change its coloration. The user explicitly wants a BLACK crow. Preserve its exact shape, pose, illustration details, feet, beak and transparent background. Change ALL brown and red feathers, ALL red rim lighting and ALL reddish eye coloration into neutral BLACK and dark charcoal-gray, with subtle neutral gray feather definition so the bird is readable. Black beak, black legs and feet, black eye with a tiny white catchlight. Absolutely NO red, orange, brown, blue or other colored accents anywhere. Rich inky black crow in the same hand-drawn style. No new objects. Genuine alpha transparency outside the bird.

Final generated source: `C:/Users/afs12/.codex/generated_images/01a1767b-b0f8-7a42-8c6e-65e95ae17cc9/exec-244951bc-f191-4d30-98a7-8f8965297013.png`.

## Long-branch revision — 26 October 2026

Desktop and mobile: the original character and crown remain at their original document positions and sizes. Scrolling reveals the tree without shrinking or header docking. Long illustrated boughs extend behind cards on both sides, at staggered heights throughout all nine sections. Card backgrounds naturally keep their text readable; soft masks lower branch contrast behind unbacked headings. Desktop boughs extend roughly 400–620px per side. The root spread is now up to 620px on desktop and 360px on mobile, between the earlier large and small versions. Eye glints still track a fine pointer; reduced motion disables this.

The user also requested that the experience card formerly named UQU Computer Club match the existing volunteering entry. Its heading, role and location now match UQU Robotics & AI Club / Advisor — Competitions & Sports Activities Committee / Umm Al-Qura University · Makkah. The two inaccurate bullet points were removed.

New asset: C:/Users/afs12/Desktop/Projects/neural-portfolio/assets/art/tree-branch-long.webp (1536 × 1024, transparent WebP, 152,328 bytes). Generated with the built-in image_gen tool using the existing trunk illustration as a style reference. Total new tree artwork: 815,456 bytes.

Exact long-branch prompt:

Use case: illustration-story. Production transparent PNG website illustration layer, landscape 3:2. Use supplied tree bark illustration ONLY as a style reference. Draw ONE very long elegant sweeping leafless branch, not a whole tree. Branch grows from a stout attachment at the extreme lower LEFT edge (at x=0,y=85% image height), curves naturally upward and horizontally across the full image toward upper RIGHT. Long graceful dark brown and charcoal limbs with hand-inked irregular outlines and painterly wood grain, matching the reference. Taper from thick left base to delicate tips. Three or four widely spaced smaller forked offshoots spread along it; leave generous transparent negative space. Overall branch horizontal span much greater than its thickness. Muted deep burgundy-red rim accents, less bright than the reference. No glow, no foliage, no roots, no skulls, no face, no trunk continuing vertically, no black or colored backdrop. Genuine alpha transparency around and between branches. All tips fully inside frame; leftmost attachment deliberately touches left edge for joining behind an existing trunk. This will be layered BEHIND portfolio cards, so sophisticated sparse silhouette with long flowing branches is essential.

# Selected portrait replacement

The user-selected screenshot portrait replaces the main face and the About avatar. The existing layout, artwork, crow, skulls and content remain unchanged. The previous character asset is retained.

Project asset: `C:/Users/afs12/Desktop/Projects/neural-portfolio/assets/art/character-reference.webp` (1000 × 1000, alpha transparency, 352,038 bytes).

The built-in image_gen tool extracted the head from the supplied screenshot. Source: `C:/Users/afs12/.codex/generated_images/01a1767b-b0f8-7a42-8c6e-65e95ae17cc9/exec-51bfeea3-a16e-4b1f-bf41-58ac72d8dc4b.png`.

Exact prompt:

Precise background extraction / identity preservation edit. Extract ONLY the boy's complete floating cartoon head from the provided screenshot, including ALL wispy hair strands, both ears and full chin. This exact head replaces an existing website portrait. Preserve the head's precise face, expression, eye shape, nose, freckles, hair structure, linework, orange-brown skin, deep black hair, red rim-light and two tiny red eye glints. DO NOT redesign, repaint, beautify, brighten, simplify or change the character. Remove EVERYTHING else: navigation bar, Ideas sign, branches, wall texture, background. Genuine alpha transparency all around and in gaps between hair strands. Clean smoothly antialiased edges with no dark rectangular background and no halo. Place the intact extracted head centered on a square transparent canvas, fitting about 92 percent of canvas height with equal small transparent margins; do not crop any strand. Only the one exact original head, no additional objects.

Validation: desktop 1440px and mobile 390px / 320px; complete visible portrait, transparent edges, unchanged size and document position on scroll, eye-glint pointer response and reduced-motion behavior, no horizontal overflow or JavaScript errors.

