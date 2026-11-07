# Wedding invitation

Open `index.html` in a browser to see it. Nothing needs installing.

## Change the words

Every name, date, event, phone number and piece of text is in `invite.config.js`.
Each one has a Bengali (`bn`) and an English (`en`) version.

## Change the pictures

Put your photos in the `photos` folder using these names:

| Where it appears | File names |
| --- | --- |
| Photo album | `album-1.jpg` to `album-6.jpg` |
| Our story | `story-1.jpg` to `story-4.jpg` |

Your photo replaces the demo picture automatically, so there's no code to change.
`.jpg`, `.jpeg`, `.png` and `.webp` all work. Square photos fit the round frames best.

Keep each photo about 1200 pixels wide and under 400 KB, so the page loads quickly on phones.

To change an album caption, or to add or remove photos, edit the `album` list in
`invite.config.js`.

## Add your song

Save it as `music/song.mp3`. Until then, the music button plays a soft built-in tune.

## RSVP replies

Replies open WhatsApp with the guest's answers already typed, addressed to the number
in `rsvp.whatsapp` in `invite.config.js`. Guests who are coming also choose veg or non-veg for each person, and the counts appear in the message. The guest taps send to finish. No server is needed.

## Put it online

Upload the whole `Project` folder to any static host, such as Netlify, Vercel or GitHub Pages.
