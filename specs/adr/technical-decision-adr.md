# Technology Stack and Data Storage Decision: Expense Tracker Application

## Status

**Status**: Modified
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
1. **SQLlite**: Leveraging SQLite for lightweight, serverless database storage, allowing applications to manage structured data efficiently.
1. **IndexedDB**: Utilizing a client-side database for handling more complex data structures.
1. **Service Worker with Caching**: Implementing a service worker to manage data caching and enhance offline capabilities.

---

## Decision Outcome

~~**Chosen option**: Local Storage~~
~~Local storage is chosen for its simplicity and ability to provide offline access to the app without any dependencies on network connectivity. This option suits the app’s requirement for handling small amounts of non-sensitive data.~~

**Chosen Option:** sqllite

1. **Structured Data Storage**:  
   Unlike local storage, which stores data as key-value pairs, SQLite allows for structured data storage using SQL tables. This makes it easier to organize and manage relational data efficiently.

2. **Data Integrity and Querying**:  
   SQLite supports SQL queries, providing powerful tools for querying, updating, and managing data with complex relationships. This is particularly useful for handling larger datasets or scenarios where advanced querying is required.

3. **Data Scalability**:  
   While local storage is limited in capacity and not ideal for large datasets, SQLite can handle much larger amounts of data, scaling with the app’s requirements.

4. **Transactions and Concurrency**:  
   SQLite supports transactions, ensuring data integrity by committing changes atomically. It also handles concurrent reads and writes more effectively than local storage, which doesn't support this functionality natively.

5. **Data Security**:  
   Although both local storage and SQLite store data locally, SQLite can be encrypted (using additional tools) for enhanced security, which is beneficial when dealing with sensitive data.

6. **Cross platform compatibility**:
   SQLite databases are widely supported across different platforms, making it easier to migrate or integrate with other systems, while local storage is typically browser-dependent.

---

## Consequences

- **Positive**:
  - No dependency on external services, enhancing app portability and accessibility.
  - Reduced development and operational costs.
  - Instant data access and update capabilities without network latency.
- **Negative**:
  - ~~Limited storage capacity and less suitable for storing large amounts of data.~~ SQLite provides enhanced capacity and handles larger datasets effectively.
  - ~~Data is not persisted if the browser’s cache is cleared or cookies are deleted.~~ SQLite stores data in a local database file, ensuring better persistence.
  - ~~Potential security risks if sensitive information is stored without adequate encryption.~~ SQLite supports encryption, mitigating security concerns for sensitive data.

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

### SQLite

- **Pros**:
  - **Structured Data Storage**: Supports SQL-based storage with relational tables, making it easier to organize and query complex datasets.
  - **High Capacity**: Handles significantly larger datasets than local storage or IndexedDB.
  - **Transactional Integrity**: Supports ACID-compliant transactions, ensuring data consistency and reliability.
  - **Offline Access**: Enables efficient offline data access without relying on network connectivity.
  - **Cross-Platform Compatibility**: SQLite databases can be easily migrated and used across different platforms.
  - **Encryption Support**: Can be encrypted (using additional tools) to secure sensitive data.
- **Cons**:
  - **Complexity**: Slightly more complex to set up compared to local storage but still simpler than IndexedDB.
  - **File-Based Storage**: Requires managing database files, which may add overhead in some scenarios.
  - **Performance**: While suitable for most applications, performance may degrade with very high concurrency compared to server-based databases.

---

## Confirmation

The decision will be reviewed after the initial release phase, based on user feedback and technical assessments of data handling performance and security. Adjustments will be considered to ensure that data integrity and security are maintained without compromising user experience.

## **Final Review: Sqllite as backend**
