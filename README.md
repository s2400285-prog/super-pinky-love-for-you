# For My Baby Julie — by James Traigo

A complete, build-free website in HTML, CSS, and vanilla JavaScript. Open `index.html` with VS Code Live Server. No account, backend, database, or installation of JavaScript packages is required.

## Files

- `index.html` — the main page and full love letter
- `css/style.css` — shared design, themes, animations, dialog, and player
- `js/script.js` — shared music player, secrets, envelope, charms, heart counter, and theme
- `memories.html` — exactly five photo cards and their captions
- `css/memories.css` — gallery and lightbox styles
- `js/memories.js` — favorites, photo fallbacks, lightbox, arrows, and swipe handling
- `assets/images/roses-and-ribbon.png` — included floral artwork
- `assets/images/ADD_PHOTOS.txt` — your five photo filenames
- `assets/music/ADD_MUSIC.txt` — where your chosen MP3 goes
- `FULL_CODE.md` — all six complete files, in the requested order, each in its own code block

## Start in VS Code

1. Extract the ZIP. Open the `love-for-julie` folder in VS Code using File → Open Folder.
2. The folders are already created. To recreate them manually, make `css`, `js`, and `assets` inside `love-for-julie`. Inside `assets`, make `images` and `music`. Put each code file in the matching location listed above.
3. In VS Code Extensions, install Live Server by Ritwick Dey if it is not installed.
4. Right-click `index.html` and choose **Open with Live Server**. Keep the server running while using the site.
5. Use the navigation to open the separate `memories.html` page. Both pages use the same CSS theme and music-player settings.

## Add exactly five photographs

Export your pictures as JPEGs and copy them to:

- `assets/images/julie-1.jpg`
- `assets/images/julie-2.jpg`
- `assets/images/julie-3.jpg`
- `assets/images/julie-4.jpg`
- `assets/images/julie-5.jpg`

The five personal photographs are intentionally not included. Missing photos show the pink “Our beautiful memory goes here.” design. No stock photos are used in their place. You do not need to create empty JPG files.

Edit the five `<span class="caption-text">` elements in `memories.html` to change the captions. Edit each photo's `alt` attribute to describe your actual picture. Keep the five `data-memory` values and filenames as they are. Gallery previews crop neatly; the lightbox shows the complete photograph.

## Add your music

Copy an MP3 you have permission to use to `assets/music/music.mp3`. No song is included. Do not create an empty MP3. Until the real file exists, the player explains how to add it.

Near the bottom of `js/script.js`, edit:

```javascript
const SONG = { title: 'Our little love song', artist: 'Chosen with love by James' };
```

Change `title` and `artist` to match your song. The labels do not change the audio file path.

Click **Play Our Song** or the floating play button. Sound never starts automatically. Expand the player with **+** to see progress, volume, and mute. Music continues while scrolling or using section links on the same page. A separate HTML page necessarily creates a new audio element: click Play again on the other page to resume from the saved position. This deliberate choice avoids unexpected autoplay. Audio progress and settings are saved locally when browser storage is available.

## Personalize the letters and surprises

Edit the paragraphs inside `<div class="letter-words">` in `index.html`. Keep their `<p>...</p>` tags. The ending and signature are directly below them.

The `secrets`, `reasons`, `littleLove`, and `wishes` objects/arrays in `js/script.js` contain the other messages. In strings, `\n\n` creates a paragraph break. The two long secret letters use backtick strings. Preserve quotation marks and commas when editing JavaScript.

The three discoverable charms are the heart and star beside the hero bouquet and the ribbon below the garden. Find all three to reveal **One Last Secret**. Repeated clicks on the same charm do not count twice. The moon in the header switches to night mode. Favorites, heart count, charms, theme, and player settings are stored in this browser only, not shared between devices. Clear this site's browser storage to start fresh; the animation replay buttons do not erase saved favorites.

## Internet and offline behavior

All artwork, page code, and personal media paths are local. Google Fonts supplies Great Vibes and Nunito through the CSS `@import`; that optional font request needs internet. If it fails, the site uses the CSS cursive, Georgia, and system-font fallbacks. You can remove the `@import` to use only local system fonts. The layout and interactions continue to work.

The rose illustration was made using the built-in image generation tool, then copied to `assets/images/roses-and-ribbon.png`. It is a decoration, not one of the five personal pictures. Production prompt:

> Use case: product-mockup. Asset type: photorealistic transparent floral decoration for an elegant romantic website. Primary request: a luxurious loose bouquet of seven realistic blush pink garden roses, a few ivory tiny flowers, delicate muted sage leaves, bound with a large flowing dusty pink silk satin ribbon bow, long curling ribbon tails. Composition: portrait, entire bouquet and ribbon in frame, flowers mostly upper two thirds, graceful asymmetrical silhouette, subtle pearls nestled near bow. Materials: intricate natural rose petals, realistic satin folds with soft highlights, refined bridal editorial photography. Lighting: soft luminous morning light, warm cream reflections. Colors: blush, pale rose, soft pink, dusty sage, subtle champagne. Genuine transparent background, isolated cutout, no floor or background. No text, no frame, no watermark, no human hands. This is an image asset, not a website mockup.

## Troubleshooting

- **Photos still show placeholders:** Check the exact folder, spelling, lowercase `.jpg` extension, and filenames. Windows may hide extensions, producing names such as `julie-1.jpg.jpg`. Refresh after adding files. Export HEIC photographs to JPEG first.
- **Music will not play:** Check `assets/music/music.mp3`, use a real MP3, click Play, unmute both the player and your device, and raise the volume. Stop/restart Live Server after replacing a file if the old version is cached.
- **No floral art:** Keep the included `roses-and-ribbon.png` inside `assets/images`. Preserve the `assets` folder when copying the project.
- **No custom fonts:** The Google Fonts request needs internet. The fallback text remains readable.
- **Animations seem disabled:** Check your device's Reduce Motion setting. The website respects it. JavaScript must also be enabled. Essential letter text stays readable without JavaScript.
- **A button stopped working after editing:** Open the browser console and check for a missing quote, comma, or closing tag. Compare with `FULL_CODE.md`. Restore the original file if needed.
- **Favorites do not persist:** Private browsing or browser policy can block storage. The buttons still work during the current visit.
- **Page transitions look different:** Supporting browsers use native cross-document View Transitions. Other browsers receive a short fade overlay. Back and forward navigation remain native.
- **Changes do not appear:** Save the file, then refresh. Try a hard refresh to clear cached CSS or images.

## Verification

Verified in the preview browser: envelope opening/replay, all nine initial surprise actions, reason progression, final-secret charm unlock, heart count, theme switch, five gallery cards, persistent favorites, next/previous lightbox navigation, Escape and close control, missing-photo placeholder, and successful photo loading using a temporary labeled test image. Audio play/pause, seeking, volume, mute, and same-page continuity were checked using a temporary 30-second test tone. The test media were removed from the delivered project.

Checked the home page at phone and tablet widths and the gallery at phone width; the phone gallery overflow was repaired and rechecked. JavaScript syntax checks passed. Real-device touch swipes and every browser engine were not separately tested. Your actual photographs and song still need to be added.
