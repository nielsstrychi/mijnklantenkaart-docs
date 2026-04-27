---
id: agentos-ticket-system-guidelines
title: AgentOS Ticket System Guidelines
sidebar_label: AgentOS Guidelines
---

# AgentOS Ticket System Guidelines

## Purpose

This document defines how AI agents and humans collaborate using a Git-based ticket system powered by Markdown files, YAML frontmatter, folders, and dashboards.

The system goals:

* Single source of truth in files
* Clear task ownership
* Safe multi-agent collaboration
* Full audit history through Git
* Human-readable + machine-readable state
* Automatic boards via Docusaurus

---

# Core Principles

1. **One Ticket = One Markdown File**
2. **Folders represent workflow state**
3. **YAML frontmatter stores structured metadata**
4. **Markdown body stores details and logs**
5. **Append logs, do not erase history**
6. **Claim before work**
7. **Release stale claims**
8. **Move tickets through states deliberately**

---

# Repository Structure

```text
/tickets
  /inbox
  /ready
  /in_progress
  /review
  /blocked
  /done

/projects
/agents
/docs
/templates
/reports
```

---

# Ticket File Standard

Example:

```markdown
---
id: TASK-104
title: Improve Email System
status: ready
priority: high
project: MijnKlantenKaart
owner:
role: backend
estimate: 5
created: 2026-04-27
updated: 2026-04-27
depends_on: []
blocked_by: []
lease_until:
tags: [email, merchant]
---

# Goal
Build merchant email campaign flow.

# Acceptance Criteria
- [ ] Email preview
- [ ] CSV recipient selection
- [ ] Send logs

# Context
Use existing mail service.

# Activity Log

## 2026-04-27 planner-agent
Created task.
```

---

# Workflow States

## inbox

Untriaged ideas or requests.

## ready

Fully defined and available to claim.

## in_progress

Actively being worked on by owner.

## review

Completed and waiting validation / QA / merge.

## blocked

Cannot proceed due to dependency or issue.

## done

Completed and accepted.

---

# State Transition Rules

```text
inbox -> ready
ready -> in_progress
in_progress -> review
review -> done
in_progress -> blocked
blocked -> ready
review -> in_progress
```

Never skip states unless emergency.

---

# Claiming a Ticket

Before starting work:

1. Choose highest priority ticket in `/ready`
2. Verify dependencies complete
3. Update YAML:

```yaml
owner: coder-agent
status: in_progress
lease_until: 2026-04-27T11:30:00Z
updated: 2026-04-27
```

4. Move file to `/tickets/in_progress/`
5. Append log entry.

Example:

```markdown
## 2026-04-27 coder-agent
Claimed task and started implementation.
```

---

# Lease Rules

Lease prevents duplicate work.

* Standard lease: 45 minutes
* Large task: 2 hours
* Renew lease while active
* If expired and no updates, another agent may reclaim

When reclaiming:

```markdown
## timestamp dispatcher-agent
Lease expired. Returned task to ready queue.
```

---

# Working on a Ticket

While active:

* Update progress notes
  n- Keep acceptance checklist current
* Record decisions
* Link commits / PRs
* Renew lease if still active

Example:

```markdown
## 10:45 coder-agent
Backend endpoint complete.

## 11:05 coder-agent
UI preview started.
```

---

# Moving to Review

When acceptance criteria are complete:

1. Update YAML:

```yaml
status: review
lease_until:
updated: 2026-04-27
```

2. Move file to `/tickets/review/`
3. Add handoff note.

```markdown
# Handoff
Ready for QA. Please test CSV upload and preview flow.
```

---

# Review Rules

Reviewer checks:

* Acceptance criteria met
* No regressions
* Tests pass
* Quality acceptable
* Documentation updated if needed

If approved:

* Move to `/done`
* Set `status: done`

If changes required:

* Move back to `/in_progress`
* Set owner back to builder
* Append feedback log

---

# Blocked Rules

Move to blocked only if progress truly cannot continue.

Update YAML:

```yaml
status: blocked
blocked_by: [TASK-099]
```

Add explanation:

```markdown
## timestamp coder-agent
Blocked waiting for auth API from TASK-099.
```

Once unblocked:

* Move to `/ready`
* Clear blockers

---

# Done Rules

A ticket is done only when:

* Acceptance criteria complete
* Reviewed or accepted
* No open blockers
* Deliverable merged/deployed if required

Move to `/tickets/done/`

---

# Priority Rules

## critical

Do immediately.

## high

Take next.

## medium

Normal queue.

## low

When capacity allows.

Selection order inside `/ready`:

1. Criticality
2. Unblocked
3. Oldest waiting
4. Skill match
5. Small quick wins

---

# Activity Log Standard

Always append. Never rewrite prior entries.

Format:

```markdown
## YYYY-MM-DD HH:MM actor-name
Message
```

Examples:

```markdown
## 2026-04-27 09:15 planner-agent
Created task.

## 2026-04-27 10:10 qa-agent
Found validation bug on empty CSV.
```

---

# Agent Roles

## planner-agent

Creates/refines tickets.

## coder-agent

Builds implementation.

## qa-agent

Tests outputs.

## reviewer-agent

Checks quality and approves.

## dispatcher-agent

Maintains queue priorities and stale claims.

## memory-agent

Updates docs and learnings.

---

# Docusaurus Dashboard Expectations

Boards are generated from YAML metadata.

Views:

* Kanban board by status
* By project
* By owner
* Blocked tickets
* Aging tickets
* Velocity reports

Agents must keep YAML accurate because dashboards depend on it.

---

# Naming Conventions

```text
TASK-001-short-title.md
BUG-014-login-loop.md
OPS-021-backup-check.md
```

Use lowercase kebab-case titles.

---

# Safety Rules

Never:

* Claim multiple large tasks unnecessarily
* Delete history logs
* Hide blockers
* Mark done without validation
* Leave expired leases active
* Rewrite another agent's work without log note

---

# Daily Operating Loop for Agents

1. Read assigned active tickets
2. Renew leases if active
3. Check review requests
4. Pull next ready task if free
5. Update logs continuously
6. Close or handoff work
7. Leave clean state before stopping

---

# Human Override Rules

Humans may reprioritize, reassign, or close tickets at any time.
Agents should treat human changes as authoritative.

---

# Golden Rule

If the filesystem and YAML are accurate, the organization is accurate.

Keep tickets clean, current, and truthful.
