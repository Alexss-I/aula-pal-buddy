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

- AulaPlus uses a browser-safe domain module for notebook scoring and grouping so the same rules are unit tested.
- Student and teacher views are prototype modes, not authorization roles; feedback affects fictional demo students only.
- Private workspace and one conversation per notebook are stored in owner-scoped Cloud tables; Google is optional for demo use and required for durable saves and AI.
- AI uses AI Elements and AI SDK UI-message streaming through server-only Responses helpers to keep secrets out of browser code.
