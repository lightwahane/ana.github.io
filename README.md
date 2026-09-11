# All the Tomorrows — cinematic love story

A mobile-first, static HTML/CSS/JavaScript experience using the three supplied photos.

## Exact folder structure for GitHub

Upload the **contents of this folder** like this:

```text
your-repository/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── photo1.jpg
    ├── photo2.jpg
    ├── photo3.jpg
    └── music.mp3        # optional
```

Do **not** put `index.html` inside another nested `proposal/proposal/` folder.

The three supplied images are used exactly in this order:

- `photo1.jpg` = uploaded `1.jpg`
- `photo2.jpg` = uploaded `2.jpg`
- `photo3.jpg` = uploaded `3.JPG`

## GitHub Pages — easiest method

1. Create a new GitHub repository.
2. Upload:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - the entire `assets` folder
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch (usually `main`) and the **`/ (root)`** folder.
6. Save.
7. Wait for GitHub to publish the site.
8. Open the Pages URL on your phone.

Because this is a static site, there is no npm install, React build, Node server, or build command.

## Music

The site will not force autoplay.

If you want music, put your chosen audio file at:

```text
assets/music.mp3
```

Then she taps the small `♪ Music` control to start it.

## Customization

### Text
Edit the story text in `index.html`.

### Colors
At the top of `style.css`, edit:

```css
--gold
--gold-bright
--rose
--cream
--bg
```

### Animation speed
At the top of `style.css`:

```css
--speed: 1;
```

Try `0.8` for faster or `1.25` for slower.

### Photos
Replace the files while keeping these exact names:

```text
assets/photo1.jpg
assets/photo2.jpg
assets/photo3.jpg
```

## Mobile design

The experience is deliberately designed around phone screens first:

- portrait-friendly photo framing
- touch-friendly button
- safe-area spacing for modern phones
- reduced particle count
- Canvas particles instead of hundreds of DOM elements
- no pointer-tilt work on touch devices
- GPU-friendly transform/opacity animations
- `prefers-reduced-motion` support

## Netlify / Vercel

You can deploy the same folder directly. No build command is needed.

For GitHub Pages, the important part is simply that `index.html` is at the repository root and `assets/` sits beside it.
