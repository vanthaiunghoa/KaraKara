# Player2

A self-contained KaraKara frontend for big screens (showing the
playlist and preview of next track) + singer podiums (showing
lyrics and a "start" button)

## TL;DR:

```
npm install      # install build toolchain
npm run build    # compile src/* to dist/*
```

Visit the player at
`http://localhost/player2/index.html#queue_id=my_queue`

Add `&podium` to the end of the URL to get the singer view.

## New Features Since Player1:

- Nicer code (half the lines, double the features)
- New theme which is both nice and legal
- Theme can be changed on the fly
- Podium mode
  - A button for singers to push to start for themselves
  - Lyrics on screen without distracting video
  - Performer's name to hopefully avoid the wrong singer
  - Auto-play after X seconds between each song
- Video mode
  - Soft subs - if the singer is using the podium view, subs
    can be disabled for the big screen
  - MTV-style credits overlay at the start of each song
- Demo mode
  - Removed - Opening `index.html` from the local drive with
    the `file://` protocol will do a tiny bit of stubbing to
    force `hostname=karakara.org.uk` and `queue_id=demo`,
    and it will talk to the real live server from then on.

## Dev Setup:

If you want to develop new features:

```
npm install      # install build toolchain
npm run watch    # auto-compile on changes
```

Also you can add `&hostname=...` to the URL to specify a
particular karakara server (defaults to `karakara.org.uk` if
you open index.html from the local hard drive)

## Developer Notes:

- When in auto-play mode, the podium is the source of truth
  for hitting "play" (what do we do if we only have admin +
  big screen, no podium? Should both interfaces have a timer
  and both send the "play" signal, and we rely on deduping?
  The big screen should be delayed a couple of seconds to
  give a laggy podium a chance to go first)
- The big screen is the source of truth for "track ended",
  who will send that message to the server. The podium will
  automatically move to the next track in the list and
  begin the auto-play countdown, but it will not send the
  "track ended" signal itself.

## High-level TODO List:

- Lyrics embedded in the queue.json would be wonderful, so
  that we don't need to go and fetch and parse the .srt for
  ourselves for every song for every queue update...
- Chrome blocks auto-playing videos with sound by default,
  we need to have some form of user interaction first (the
  "Click to Activate" screen). But if the user repeatedly
  interacts with a site, chrome will eventually remember
  and stop blocking. It would be nice to try auto-playing
  a video with sound, and then only show the CTA screen if
  autoplay fails, so that regular users can get straight
  into the action.
