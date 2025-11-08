# ProjectArabia - Cursor Rules Documentation

This directory contains comprehensive rules and context for AI assistants working on ProjectArabia. Each file covers a specific aspect of the project to help provide better, more contextually aware assistance.

## 📁 Rule Files Overview

### 1. `tech-stack.md`
**What it covers**: Technologies, dependencies, and tools used in the project
- Framework (TanStack Start)
- Runtime (Bun)
- Database (Cloudflare D1, Drizzle ORM)
- Cloudflare services (Workers, KV, Queues, Turnstile)
- Key dependencies

**When to reference**: Adding dependencies, understanding tech choices, setting up environment

---

### 2. `architecture.md`
**What it covers**: Overall system architecture and patterns
- Three-layer architecture (Actions → Services → Queries)
- Edge-first design principles
- Serverless patterns
- Data flow and state management

**When to reference**: Designing new features, understanding data flow, making architectural decisions

---

### 3. `folder-structure.md`
**What it covers**: Project organization and file placement
- Directory structure and responsibilities
- Where to put different types of code
- Naming conventions
- File organization patterns

**When to reference**: Creating new files, organizing code, understanding codebase layout

---

### 4. `code-style.md`
**What it covers**: Coding standards and formatting rules
- Biome configuration
- TypeScript patterns
- React component style
- Naming conventions
- Import organization

**When to reference**: Writing code, formatting, reviewing PRs, maintaining consistency

---

### 5. `email-system.md`
**What it covers**: Email queue system architecture
- Cloudflare Queues configuration
- Batching and cooldown logic
- Queue producers and consumers
- Email flow from action to delivery

**When to reference**: Working with notifications, understanding email system, debugging queue issues

---

### 6. `development.md`
**What it covers**: Development workflow and commands
- Common commands (dev, build, deploy)
- Development setup
- Testing procedures
- Build process
- Troubleshooting

**When to reference**: Setting up environment, running commands, deploying, debugging issues

---

### 7. `security.md`
**What it covers**: Security best practices and guidelines
- Input validation
- Authentication and authorization
- Bot protection (Turnstile)
- Rate limiting
- Session management
- Secrets handling

**When to reference**: Implementing auth features, securing endpoints, handling user data

---

### 8. `mission.md`
**What it covers**: Project vision, values, and philosophy
- What ProjectArabia is about
- Target audience and values
- Content guidelines
- Design philosophy
- Long-term vision

**When to reference**: Making product decisions, understanding priorities, feature planning

---

## 🎯 Quick Reference

### Adding a New Feature?
1. Read: `architecture.md` → understand the pattern
2. Read: `folder-structure.md` → know where to put files
3. Read: `code-style.md` → follow conventions
4. Reference: `security.md` → secure it properly

### Setting Up Development?
1. Read: `tech-stack.md` → understand dependencies
2. Read: `development.md` → setup and commands

### Working with Email/Queues?
1. Read: `email-system.md` → complete queue documentation
2. Reference: `architecture.md` → understand async patterns

### Making Product Decisions?
1. Read: `mission.md` → understand values and vision
2. Consider: Does this align with simplicity and user respect?

---

## 🚀 For AI Assistants

When helping with ProjectArabia:

1. **Always** validate against these rules
2. **Prefer** established patterns over new approaches
3. **Question** features that add complexity
4. **Optimize** for simplicity and maintainability
5. **Stay true** to the mission and values

---

## 📝 Maintenance

These rules should be updated when:
- Major architectural changes occur
- New patterns are established
- Tech stack changes
- Team conventions evolve

Keep rules:
- ✅ Clear and actionable
- ✅ Up-to-date with codebase
- ✅ Comprehensive but focused
- ✅ Organized by concern

---

## 🔗 Related Documentation

- **Codebase**: `/src/` for implementation
- **Config**: `wrangler.jsonc`, `biome.json`, `package.json`
- **Project Info**: Root `README.md`
- **Contributing**: `CONTRIBUTING.md`

---

Built with ❤️ by [#V0ID](https://v0id.me) for the Arabic tech community.

