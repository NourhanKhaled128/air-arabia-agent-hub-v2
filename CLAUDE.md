@AGENTS.md

# Deployment gotcha: vercel.json overrides package.json

`vercel.json`'s `buildCommand` takes priority over `package.json`'s `build` script
**entirely** — if you change one, check the other too. This already cost real debugging
time once: `package.json`'s `build` was changed to run `prisma migrate deploy && next
build`, but `vercel.json` had an explicit `"buildCommand": "next build"`, so the
migration silently never ran on deploy even though the build succeeded. Both files must
agree on the build command.

# QuizAttempt retention

`QuizAttempt`/`QuizAnswer` only grow — there's no automated cleanup. If the table gets
large, export the attempts you want to keep via the existing Excel export
(`exportAttemptsWorkbook` in `lib/quiz-service.ts`, wired to the "Export" button on
`/admin/quizzes/[id]/results`) before manually deleting old ones via
`deleteAttemptAction` (per-row, in `app/admin/actions/quiz-actions.ts`). No automated deletion is implemented
by design — deciding what's safe to remove needs a human, not a schedule.
