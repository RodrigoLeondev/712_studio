Hero Layout Redesign Specification
Objective

Redesign the Hero section to match the layout and visual hierarchy of the attached reference.

Important:
Do not modify the site's color palette, theme, branding, or overall design system. The objective is only to reproduce the structure, spacing, proportions, and positioning of the elements shown in the reference.

Overall Structure

The Hero should be organized into two major sections stacked vertically:

Hero

├── Badge
├── Main Heading
├── Subtitle
├── Primary CTA
└── Large Media Preview

All elements must be horizontally centered.

The Hero should occupy approximately one viewport height, allowing the media preview to extend slightly below the fold, just like the reference.

Content Hierarchy

The Hero should clearly prioritize the following order:

Small badge
Large headline
Supporting paragraph
Primary CTA
Large media container

Each element should have generous spacing to create a clean SaaS landing page.

Badge

Place a small pill-shaped badge centered at the top of the Hero.

Requirements:

Positioned above the heading.
Small width.
Height determined by its content.
Center aligned.

Spacing:

Approximately 32–48px above the heading.
Heading

The heading is the dominant visual element.

Requirements:

Center aligned.
Maximum width around 700–850px.
Allow the text to wrap naturally into two lines.
Large typography.
Balanced line height.

The heading should be the first element the user notices.

Subtitle

Place the subtitle directly below the heading.

Requirements:

Center aligned.
Maximum width around 600–700px.
Two or three lines at most.
Clearly separated from the heading.

Spacing:

Around 20–30px below the title.
Primary CTA

Place a single primary button below the subtitle.

Requirements:

Center aligned.
Only one main CTA.
Positioned with enough whitespace so it stands out.

Spacing:

Around 32–40px below the subtitle.
Media Section

Below the CTA, add a large media container.

This replaces the current hero image.

Instead of an image, this component will contain a YouTube video.

Structure:

<section class="hero-media">
    <div class="video-container">
        <!-- YouTube iframe will be inserted here -->
    </div>
</section>
Video Container

The media container should visually resemble a large product preview.

Requirements:

Center aligned.
Much wider than the text content.
Maximum width between 1000px and 1200px.
Responsive.
Preserve a 16:9 aspect ratio.
Rounded corners.
Overflow hidden.

Example:

------------------------------------
|                                  |
|                                  |
|        YouTube Video             |
|                                  |
|                                  |
------------------------------------
Positioning

The video container should sit immediately below the CTA.

Leave enough spacing so the Hero feels open, but keep the video visually connected to the content.

Approximate spacing:

Badge

↓↓

Heading

↓

Subtitle

↓

CTA

↓↓↓↓

Video Container
Responsive Behavior
Desktop
Text block centered.
Video spans most of the available width.
Plenty of whitespace around all elements.
Tablet
Reduce heading width.
Reduce media width.
Maintain the same visual hierarchy.
Mobile

Everything remains stacked vertically.

Order:

Badge

Heading

Subtitle

CTA

Video

Video should occupy nearly the full screen width.

The text should remain centered.

Component Structure

The Hero should be divided into reusable sections:

Hero
│
├── HeroBadge
├── HeroHeading
├── HeroSubtitle
├── HeroCTA
└── HeroVideo

The HeroVideo component should only be responsible for rendering a responsive container.

The actual YouTube iframe will be added later.

Constraints
Do not change the site's design system.
Do not introduce new colors or typography.
Do not redesign other sections.
Preserve existing animations unless they conflict with the new layout.
Only modify spacing, sizing, alignment, and component arrangement.
Expected Result

The final Hero should closely match the reference in terms of layout, with:

A centered badge at the top.
A large, dominant headline.
A supporting subtitle below it.
A single centered CTA.
A large media container beneath the CTA that serves as a placeholder for a YouTube video.
A clean vertical flow with generous spacing and a strong visual hierarchy, similar to a modern SaaS landing page.