# Code Quality

## Status

**Status**: Proposed  
**Date**: 2024-11-10
**Decision-makers**: [Ketaki Tank, Annie Xu]  
**Consulted**: [Ketaki Tank, Annie Xu]  
**Informed**: [Ketaki Tank, Chirag Jain, Krishi Chawda, Chih-Lin (Linda) Wang, Annie Xu, Sania Edlabadkar, June Akpata, Devanshi Chadha]

---

## Context and Problem Statement

As the team is working through the code, we need to ensure that everyone has a base standard for writing code. This way, code is readable and clear to everyone, ensuring no one is completely lost when working on top of code from another team member.

---

## Decision Drivers

The tools must be easily accessible and understandable. This ensures that the team knows the guidelines and can refer back to them easily. It should also be quick to set up as the project will be done in about 5 weeks

---

## Considered Options

1. **Following the Code Quality Guidelines Document**: the team will write a detailed document about how the code should be structured and styled
2. **Linting**: use a lint tool that automatically checks the code for any errors when pushing or merging
3. **Code Reviews**: team members will carefully review each others commits before merging changes to ensure the code written is understandable

---

## Decision Outcome

**Chosen option**: ~~Currently haven't decided on an option or if we want to combine options together. Will update after getting feedback from the rest of the team~~

Code quality is checked on three aspects: following code guidelines, automatic checking through the CI/CD pipeline, and manual code reviews.

---

## Consequences

- **Positive**: 
    - There are three different checks for code quality, meaning that code is checked thoroughly
    - There is both automated and personal review
- **Negative**:
    - Checking code quality could take a while since commits need to go through all three steps before it gets merged to the main branch

---

## Pros and Cons of the Options

### Following the Code Quality Guidelines Document

- **Pros**: the structure and style of the code is decided and agreed upon beforehand, the document is easily accessible to everyone since it will be located in the repo
- **Cons**: document needs to be very detailed, or else there could be uncertainty in certain areas of the code

### Linting

- **Pros**: enforces code quality automatic, no need for people to look over the code which allows them to do other things
- **Cons**: linting needs to be configured well so that it isn't too loose or too strict, takes time to set up

### Code Reviews

- **Pros**: makes sure that the code is looked through thoroughly, other bugs/errors could also be spotted with another perspective
- **Cons**: takes time to individually review commits, especially if it's a big commit that changes a lot of files

---

## Confirmation

~~This decision is still being validated by the team. Once a CI/CD pipeline gets established and general structure has been implemented, the team will make a final decision on how to ensure code quality.~~

Decision has been finalized now during the Nov 20th meeting.

---
