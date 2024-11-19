# Unit Testing - Jest

## Status
**Status**: Proposed

**Date**: 2024-11-15

**Decision-makers**: June Akpata, Devanshi Chadha, Krishi Chawda, Sania Edlabadkar, Chirag Jain, Ketaki Tank, Annie Xu, Linda Wang

**Consulted**: Devanshi Chadha, Krishi Chawda, Sania Edlabadkar, Annie Xu, Linda Wang

**Informed**: June Akpata, Devanshi Chadha, Krishi Chawda, Sania Edlabadkar, Chirag Jain, Ketaki Tank, Annie Xu, Linda Wang


## Reasoning
Jest was chosen for the project unit testing because of what the framework offers. Jest is straightforward and simple to use because of the familiar API that provides quick results. In addition, Jest requires little configuration and is well-documented. The Jest framework is also flexible and can be extended to meet specific requirements. Jest also offers a built-in mocking library, assertion library, and tools for executing and debugging unit tests.

## Comparison
Comparing Jest to other unit testing tools sheds light on why this was the best choice for our design. Comparing Jest to Mocha, it can be deduced that Jest has the following advantages:
- **Simplicity:** easy to learn becuase it's a standalone testing framework
- **Speed/efficiency:** automatically executes tests when the code changes
- **Integration:** integrates well with BrowserStack which allows for testing on browsers and various devices
- **Parallel execution:** runs in parallel so tests don't interfere with each other
- **Asynchronous testing:** has tools for testing asynchronous code 
- **Code coverage:** can generate code coverage reports to show which parts of the code are covered by tests