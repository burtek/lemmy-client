# Simple lemmy web client

<https://lemmy.dtrw.ovh>

This project aims at creating simple browser lemmy client for personal use and learning lemmy API.

## TODO

- login form enhancements (login after enter, 2fa support)
- report spam/ad/hate button/select
- block user button
- support for sorting
- support for other views (all, local, etc)
- making post dedups optional
- dark theme
- nav sidebar
- saved sidebar
- post preview?
- embed video support
- ux/layout changes
- search/filtering
- debug/fix pages being fetched twice

## Contributions

While being opensource, the aim is to work on this personally, so while I accept [bug fixes/security fixes](https://github.com/burtek/lemmy-client/labels/bug) (as I can learn from them), feature enhancement PRs will generally be rejected, unless they fix an issue with [`help wanted`](https://github.com/burtek/lemmy-client/labels/help%20wanted) label.

## Local development

Use `yarn install` to install dependencies.
Use `yarn dev` to start local dev instance.
There is no tests setup yet.

This project uses `typescript`, `vite` and `react`.
