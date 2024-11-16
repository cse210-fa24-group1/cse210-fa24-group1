# Technology Stack and Data Storage Decision: Expense Tracker Application

## Status

**Status**: Accepted
**Date**: 2024-11-10
**Decision-makers**: [Chirag Jain, Ketaki Tank, Annie Xu, Chih-Lin (Linda) Wang, Krishi Chawda, Sania Edlabadkar, Devanshi Chadha, June Akpata]  
**Consulted**: [Chirag Jain, Ketaki Tank, Annie Xu, Chih-Lin (Linda) Wang, Krishi Chawda, Sania Edlabadkar, Devanshi Chadha, June Akpata]  
**Informed**: [Chirag Jain, Ketaki Tank, Annie Xu, Chih-Lin (Linda) Wang, Krishi Chawda, Sania Edlabadkar, Devanshi Chadha, June Akpata]

---

## Context and Problem Statement

## Given the need for a simple, easily accessible, and cost-effective data handling solution, the expense tracker app will utilize local storage. This approach must support the app's functionality while addressing potential security and data persistence concerns inherent with client-side storage.

## Decision Drivers

- User Privacy and Data Control: Empower users by storing their data directly on their device.
- Cost Efficiency: Avoid the costs associated with cloud storage services.
- Simplicity: Simplify the architecture without the need for server-side data management.
- Offline Accessibility: Ensure that the app can function without internet connectivity.

---

## Considered Options

1. **Local Storage**: Using the browser's local storage to save user data directly on their device.
2. **IndexedDB**: Utilizing a client-side database for handling more complex data structures.
3. **Service Worker with Caching**: Implementing a service worker to manage data caching and enhance offline capabilities.

---

## Decision Outcome

**Chosen option**: Local Storage
Local storage is chosen for its simplicity and ability to provide offline access to the app without any dependencies on network connectivity. This option suits the app’s requirement for handling small amounts of non-sensitive data.

---

## Consequences

- **Positive**:
  - No dependency on external services, enhancing app portability and accessibility.
  - Reduced development and operational costs.
  - Instant data access and update capabilities without network latency.
- **Negative**:
  - Limited storage capacity and less suitable for storing large amounts of data.
  - Data is not persisted if the browser’s cache is cleared or cookies are deleted.
  - Potential security risks if sensitive information is stored without adequate encryption.

---

## Pros and Cons of the Options

### Local Storage

- **Pros**:
  - Easy to implement and use with no extra dependencies.
  - Data can be accessed quickly and without an internet connection.
- **Cons**:
  - Storage size is limited to about 5-10 MB.
  - Stored data is not encrypted by default and is accessible to any scripts running on the page.

### IndexedDB

- **Pros**:
  - Provides more storage capacity compared to local storage.
  - Supports transactions for reading and writing data, allowing more complex data operations.
- **Cons**:
  - More complex to implement and manage compared to local storage.
  - Still vulnerable to clearing of browser data.

### Service Worker with Caching

- **Pros**:
  - Enables the app to utilize cache storage to manage offline data effectively.
  - Provides fine-grained control over data caching and retrieval strategies.
- **Cons**:
  - Requires more sophisticated programming and understanding of service workers.
  - Compatibility issues with some older browsers.

---

## Confirmation

The decision will be reviewed after the initial release phase, based on user feedback and technical assessments of data handling performance and security. Adjustments will be considered to ensure that data integrity and security are maintained without compromising user experience.

---
