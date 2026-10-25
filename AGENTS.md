<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The creative studio is a public template-discovery route; editing stays at /boceto and saved designs reuse the existing designs table and owner policies to preserve existing URLs and data.
- Original studio template factories live separately from the legacy templates and share the existing design document schema so both collections remain editable and exportable.
- Design colors and coordinates are user document data, not interface theme values; dynamic canvas styles may use those stored values while the surrounding UI uses semantic CSS tokens.
