# SQLite vs Local Storage as Backend Options for the Project

## Status

**Status**: Accepted  
**Date**: 2024-12-07  
**Decision-makers**: June Akpata, Devanshi Chadha, Krishi Chawda, Sania Edlabadkar, Chirag Jain, Ketaki Tank, Annie Xu, Linda Wang
**Consulted**: Devanshi Chadha, Krishi Chawda, Sania Edlabadkar, Annie Xu, Linda Wang
**Informed**: June Akpata, Devanshi Chadha, Krishi Chawda, Sania Edlabadkar, Chirag Jain, Ketaki Tank, Annie Xu, Linda Wang

---

## Context and Problem Statement

At the beginning of the project, we chose not to commit to a specific backend storage solution, allowing for flexibility and ease of integration when changes were necessary. To facilitate early testing and development, we used dummy data stored in local storage to simulate offline access and basic data management. However, as the project progressed and data requirements became more complex, it became clear that local storage was not suitable for the growing dataset and the need for more structured data management. This decision now pivots to committing to SQLite as the backend storage solution to better support the needs of the application.

---

## Decision Drivers

- **Scalability**: As the application grows, the data management solution must handle larger datasets without performance degradation.
- **Data Structure**: The need to manage structured, relational data that can be queried efficiently.
- **Security**: The solution must ensure data security, especially for sensitive information.
- **Ease of Implementation**: The option should be relatively easy to implement and maintain.
- **Cross-Platform Support**: The solution must work across multiple platforms without requiring major modifications.

---

## Considered Options

1. **Local Storage**: A simple key-value store that provides access to small amounts of data.
2. **SQLite**: A lightweight relational database that offers access, data structure management, and scalability for larger datasets.

---

## Decision Outcome

**Chosen option**: SQLite  
Initially, we did not commit to one storage option to allow flexibility and easy integration as our project evolved. We worked with dummy data stored in local storage for testing and development purposes. After evaluating the increasing complexity of our data and the need for structured queries and scalability, we have now committed to SQLite. SQLite's ability to handle larger, more structured datasets, support complex queries, and provide enhanced security made it the best choice for our needs.

---

## Consequences

- **Positive**:

  - Enhanced data integrity through support for ACID transactions.
  - Ability to store and query larger datasets efficiently.
  - Cross-platform compatibility ensures the solution works seamlessly across different devices.
  - Improved data security with encryption support.
  - Better suited for complex data relationships and querying needs.

- **Negative**:
  - Slightly more complex to implement than local storage.
  - Requires management of database files and potentially higher overhead in some cases.
  - Performance may degrade with very high concurrency, although this is unlikely to be an issue for the current project.

---

## Pros and Cons of the Options

### Local Storage

- **Pros**:

  - Simple to implement with no external dependencies.
  - Provides offline access with minimal setup.
  - Lightweight, requiring very little overhead.
  - Fast access for small amounts of data.

- **Cons**:
  - Limited storage capacity (5-10 MB).
  - Data is not encrypted by default and can be accessed by any scripts running in the browser.
  - No support for complex querying or relationships between data.
  - Data may be cleared if the user clears the browser cache or cookies.
  - Not suitable for larger or more structured datasets.

### SQLite

- **Pros**:

  - **Structured Data Storage**: Supports relational data with SQL-based queries, making it ideal for managing complex datasets.
  - **Larger Storage Capacity**: Can handle larger datasets compared to local storage.
  - **ACID Transactions**: Ensures data integrity through atomic operations.
  - **Cross-Platform Support**: Compatible with a variety of platforms, making it easy to port the app across different devices.
  - **Security**: Supports database encryption for storing sensitive data securely.
  - **Efficient Querying**: Allows advanced queries with indexing, improving performance for larger datasets.

- **Cons**:
  - **Implementation Complexity**: Requires a bit more setup and management compared to local storage.
  - **File-Based Storage**: Relies on database files, which may introduce overhead in some use cases.
  - **Performance Limitations**: While generally fast, performance may degrade with high levels of concurrency, though this is unlikely for the project’s scope.
  - **Overhead**: Slightly more memory and processing overhead compared to the simplicity of local storage.

---

## Confirmation

The decision to use SQLite has been validated based on its performance during the initial release phase. Further adjustments will be considered if needed, but SQLite is expected to be a sustainable solution for the project's needs moving forward.
