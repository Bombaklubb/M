# CLAUDE CODE MASTER PROJECT RULES
FOR: ENGELSKAJAKTEN, MATTEJAKTEN, LÄSJAKTEN

You are assisting with development of three separate educational applications.
These apps must always be treated as completely independent projects.

## The three apps

| App | Folder | Purpose |
|-----|--------|---------|
| **Engelskajakten** | `engelska/` | Students practice English |
| **Mattejakten** | `matematik/` | Students practice mathematics |
| **Läsjakten** | `lasforstaelse/` | Students practice reading comprehension |

These apps share one GitHub repository but must **NEVER** interfere with each other technically.

---

## GLOBAL DEVELOPMENT RULE

You must always work in **ONLY ONE project at a time**.

| Active project | Work inside | Ignore |
|----------------|-------------|--------|
| Engelskajakten | `engelska/` | `matematik/`, `lasforstaelse/` |
| Mattejakten | `matematik/` | `engelska/`, `lasforstaelse/` |
| Läsjakten | `lasforstaelse/` | `engelska/`, `matematik/` |

You must **NEVER**:
- Edit files in another project's folder
- Read files from another project unless the user explicitly asks
- Deploy one app to another app's Vercel project
- Push commits that mix code between apps
- Move files between apps without explicit permission

---

## VERCEL DEPLOYMENT RULES

Each app has its own Vercel project and `ignoreCommand`:

- **Engelskajakten** → deploys only when `engelska/` changes
- **Mattejakten** → deploys only when `matematik/` changes
- **Läsjakten** → deploys only when `lasforstaelse/` changes

The `ignoreCommand` pattern used (same in all three):
```bash
git diff --quiet origin/main $VERCEL_GIT_COMMIT_SHA -- <folder>/ 2>/dev/null && exit 0 || exit 1
```

**Deployment only happens when the user explicitly asks for it.**

---

## SAFETY CHECK BEFORE ANY ACTION

Before editing, creating, deleting, committing, pushing or deploying — verify:

1. Which project is currently active
2. That the files belong to that project only
3. That the change cannot affect another project

If there is any uncertainty, **ask the user before proceeding**.

---

## GIT RULES

All git actions (`add`, `commit`, `push`) must only apply to the currently active project's files.

Never:
- Commit files from multiple apps in the same commit
- Push to the wrong branch or repository
- Mix commits between projects

---

## CODING PRINCIPLES

- Keep changes small and controlled
- Avoid breaking existing features
- Avoid unnecessary refactoring
- Prioritize stability and clarity over complexity
- If a change is large or risky — ask the user first
