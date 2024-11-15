# Technology Stack and Data Storage Decision: Expense Tracker Application

## Status

**Status**: Proposed  
**Date**: 2024-11-09
**Decision-makers**: [Chirag Jain, Ketaki Tank, Annie Xu, Chih-Lin (Linda) Wang, Krishi Chawda, Sania Edlabadkar, Devanshi Chadha, June Akpata]  
**Consulted**: [Chirag Jain, Ketaki Tank, Annie Xu, Chih-Lin (Linda) Wang, Krishi Chawda, Sania Edlabadkar, Devanshi Chadha, June Akpata]  
**Informed**: [Chirag Jain, Ketaki Tank, Annie Xu, Chih-Lin (Linda) Wang, Krishi Chawda, Sania Edlabadkar, Devanshi Chadha, June Akpata]

---

## Context and Problem Statement

The Budget Tracker application is a web-based tool for tracking personal expenses. To meet project requirements, a decision was needed on a technology stack that balances simplicity, development efficiency, and secure data storage, as well as data privacy.

The application requires:

- A lightweight front-end stack for straightforward development and easy maintenance.
- Data storage that prioritizes user privacy by keeping sensitive financial data off the cloud.

---

## Decision Drivers

- **Simplicity and maintainability**: A minimal tech stack streamlines development and lowers complexity.
- **Data privacy and security**: Sensitive data should not be stored on external servers to protect user privacy.
- **User experience**: The app should be reliable and responsive, even on lower-spec devices.
- **Scalability**: The stack should allow for potential feature expansions in the future.

---

## Considered Options

**Front-End Technology**

1. **React or Angular with Modern JavaScript Frameworks**

   **Pros**: Frameworks like React and Angular support component-based architecture and can facilitate dynamic UI and state management, making development faster for large, interactive applications.
   **Cons**: These frameworks add dependency on larger libraries, increase complexity, and may slow down load times. Since the app is simple, this complexity would not add significant value.

2. **HTML, CSS, and Vanilla JavaScript**

   **Pros**: Lightweight, minimal dependencies, quick to load, and maintainable for a small, straightforward application. Using vanilla JavaScript reduces reliance on third-party packages and speeds up the development cycle, aligning with Agile principles.
   **Cons**: Implementing certain interactive or data-driven features (e.g., state management, component reusability) may require custom code, which can be time-consuming. For instance, creating a UI for managing dynamic expense entries and real-time data display would take more development time without a framework.

**Data Storage Options**

1. **Firebase (NoSQL Cloud Storage)**

   **Pros**: Easy to configure and manage, built-in synchronization, and cross-device compatibility.
   **Cons**: Cloud storage risks exposing sensitive financial data to unauthorized access, which would compromise user privacy.

2. **MongoDB (NoSQL Database with Local or Cloud Storage)**

   **Pros**: Flexible data structure, and familiarity among developers.
   **Cons**: Not ideal for local-only secure storage, and hosting on an external server could expose sensitive data to security risks.

3. **Local Device Storage (File-based Storage)**

   **Pros**: Keeps data on the user’s device, offering the highest level of privacy by eliminating network exposure.
   **Cons**: Limits data to a single device and makes multi-device access difficult without a manual migration process.

---

## Decision Outcome

**Chosen option**: HTML, CSS, Vanilla JavaScript with Local Device Storage

The combination of HTML, CSS, and JavaScript offers a simple and efficient approach for a small, web-based application. This stack reduces dependencies, lowers complexity, and aligns with Agile principles, enabling rapid, iterative development and ease of maintenance.

Local device storage was chosen for data privacy, as it allows sensitive financial data to remain on the user’s device, eliminating exposure to external servers. Although this limits access to a single device, it is the safest solution for the current privacy requirements.

---

## Consequences

**Positive**:

**Front-End**: The stack’s simplicity speeds up development, reduces dependencies, and makes the application lightweight.
**Data Storage**: High data privacy as personal data remains solely on the user’s device, enhancing user trust and security.

**Negative**:

**Front-End**: Additional time may be needed for custom implementations of certain interactive features (e.g., dynamic UI elements).
**Data Storage**: Users are limited to accessing data on a single device, and manual intervention is required if they switch devices or wish to use the app on multiple devices.

---

## Confirmation

The technological decisions are being validated by the team through ongoing discussions and prototyping, ensuring alignment with project goals and timelines. The initial implementation of core features using decided tech stack is in progress and we will soon to integrating the app with local storage to validate our decisions.
