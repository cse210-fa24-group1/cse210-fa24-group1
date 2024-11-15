---
status: 'proposed'
date: { 2024-11-05 when the decision was last updated }
decision-makers:
  {
    Ketaki Tank,
    Chirag Jain,
    Devanshi Chadha,
    Sania Edlabadkar,
    Krishi Chawda,
    Annie Xu,
    June Akpata,
    Linda Wang,
  }
consulted: { Sania Edlabadkar, Krishi Chawda, Devanshi Chadha }
informed: { Ketaki Tank, Chirag Jain, Annie Xu, June Akpata, Linda Wang }
---

# Greenfield vs Brownfield Project Decision

## Context and Problem Statement

The team initially considered implementing a Greenfield project to gain full control over the tech stack and design. However, upon further evaluation, it became clear that choosing a Brownfield project with carefully selected repositories written in vanilla web technologies could avoid the technical debt associated with outdated or complex technologies.

## Decision Drivers

- Limited time for project completion (5 weeks remaining).
- Desire to minimize technical debt and ensure maintainability.
- Misconception that Brownfield projects would involve legacy or complex tech stacks.
- Need to use vanilla web technologies for simplicity and efficiency.

## Considered Options

- ~Greenfield project: Start from scratch with the full freedom to select any tech stack and design.~
- Brownfield project: Build on top of an existing codebase with vanilla web technologies (HTML, CSS, JavaScript), avoiding complex or outdated tech stacks.

## Decision Outcome

Chosen option: **Brownfield project** with repositories in vanilla web technologies to ensure a streamlined development process with minimal technical debt.

### Consequences

- Good, because it allows the team to build on a stable foundation, accelerating development.
- Good, because it reduces complexity by focusing on vanilla web technologies, which are easier to manage and maintain.
- Bad, because it may limit the team’s ability to introduce innovative technologies outside the vanilla stack.

### Confirmation

The project architecture now reflects the Brownfield decision, aligned with the team’s timeline, goals, and tech requirements.

## Pros and Cons of the Options

### Greenfield Project

- ~~Good, because it offers complete freedom to choose any tech stack and design without constraints.~~
- ~~Bad, because it requires building everything from scratch, consuming more time and resources.~~

### Brownfield Project

- Good, because it allows the team to build on an existing foundation using vanilla technologies, reducing time spent on foundational work.
- Good, because it helps minimize technical debt by avoiding outdated or complex technologies.
- Bad, because there may be constraints due to using an existing codebase, which may limit some customization.
