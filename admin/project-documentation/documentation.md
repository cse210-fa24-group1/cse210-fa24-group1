# Expense Tracker Application Documentation

## Introduction

### Brief Project Overview

The Expense Tracker is a web-based application designed to provide an intuitive and user-friendly platform for managing personal finances. Users can track, analyze, and control their expenses and budgets, promoting better financial habits through detailed insights and reports.

### High-Level Project Purpose and Goals

- Address challenges of ineffective financial management caused by impulse spending and poor budget allocation.

- Provide users with actionable data to help them make informed financial decisions.

- Foster better financial habits through personalized recommendations and alerts.

- Deliver a seamless user experience with robust tracking, visualizations, and notifications.

### Team's Primary Objectives

1.  Expense Tracking: Build a system to seamlessly record and categorize daily transactions.

2.  Visual Insights: Offer dynamic graphs and charts to showcase spending trends.

3.  Reports and Alerts: Provide detailed monthly reports and notify users of budget thresholds.

4.  User-Friendly Interface: Ensure accessibility and ease of use for all users.

5.  Scalable Backend: Implement a lightweight and efficient database for storing user data.

---

## Repository Navigation

### Exact Location of the Repository

The project repository is hosted on GitHub under the organization cse210-fa24-group1. Access it using the following link: GitHub Repository. (https://github.com/cse210-fa24-group1/cse210-fa24-group1)

### Version Control System

- System: Git for version control.

- Platform: GitHub for remote repository hosting.

- Features include efficient branching, tracking changes, and streamlined collaboration.

### Repository Structure Walkthrough

.github/          - GitHub workflows and CI/CD configurations.

**tests**/        - Unit tests for ensuring code quality and functionality.

admin/            - Documentation and administrative resources.

dist/             - Production-ready distribution files.

images/           - Image assets for documentation and the app.

specs/            - Specifications and architectural decisions.

#### Key Configuration Files

- .babelrc: Babel configurations for JavaScript transpilation.

- .eslintrc.js & .prettierrc: Linting and formatting rules for maintaining code consistency.

- package.json: Node.js dependency declarations and project scripts.

- jest.config.js: Configuration for the Jest testing framework.

### Reasoning Behind the Directory Organization

- Ease of Navigation: Clear separation of concerns for quicker onboarding.

- Scalability: Organized to accommodate project growth without clutter.

- Standard Practices: Familiar structure for JavaScript/Node.js projects.

### Cloning and Setup Instructions

# Clone the repository

$ git clone [repository-url]

# Navigate to the project directory

$ cd [project-directory]

# Install dependencies

$ npm ci

---

## Detailed Directory Exploration

### Purpose of Each Major Directory

1.  .github/: Automates workflows like CI/CD using GitHub Actions.

2.  **tests **/: Ensures code reliability through unit tests.

3.  admin/: Stores team resources, meeting notes, and ADRs.

4.  dist/: Contains compiled files for production deployment.

5.  specs/: Documents specifications and architectural decisions.

### Key Files and Their Roles

- app.js: Main application logic and initialization.

- server.js: Sets up the backend server and API routes.

- db.sqlite: SQLite database file for transactional history and user data.

### File Relationships and Dependencies

- Frontend to Backend: API calls from the JavaScript frontend interact with Express.js routes defined in server.js.

- Database: Queries from the backend directly access and manipulate the SQLite database.

- Testing: Tests in **tests**/ validate frontend and backend functionality.

---

## Build Pipeline Breakdown

### Complete Build Process

Our CI/CD pipeline leverages GitHub Actions for automation:

1.  Linting and Formatting: Ensures code consistency using ESLint and Prettier.

2.  Testing: Runs Jest test suites and generates code coverage reports.

3.  Documentation: Auto-generates JSDoc-based documentation and deploys it to GitHub Pages.

### Configuration Files (CI/CD Scripts)

- GitHub Actions Workflow: Located in .github/workflows/ci.yml.

- Key Steps:

- Install dependencies using npm ci.

- Lint and format the code.

- Run unit tests.

- Deploy documentation to GitHub Pages.

### Automated Build and Deployment

- Frontend: Deployed via Netlify for seamless user access.

- Backend: Hosted on Render for reliable server performance.

### Build-Time Dependencies

- Node.js (v18.x)

- npm Packages: Managed via package.json.

- SQLite: Lightweight database for transactional data.

---

## Setup and Installation Guide

### Step-by-Step Local Environment Setup

1.  Install Required Software

- Node.js (v18.x)

- Git for version control

3.  Clone the Repository

$ git clone [repository-url]

$ cd [project-directory]

1.  Install Dependencies

$ npm ci

1.  Run Prettier and Lint Checks

$ npm run format:check

$ npm run lint

### Common Pitfalls and Solutions

- Merge Conflicts: Use git pull --rebase to minimize conflicts.

- Formatting Issues: Run npm run format to auto-fix.

### Additional Setup Enhancements

- Husky Git Hooks: Ensures pre-commit checks.

$ npm run prepare

- Documentation Generation:

$ npm run docs

---

## Deployment of Application

### Frontend Deployment

- Platform: Netlify

- Deployment Process:

- Push changes to the main branch.

- Netlify auto-deploys the latest frontend version.

### Backend Deployment

- Platform: Render

- Deployment Process:

- Render listens for updates in the GitHub repository.

- Automatically builds and deploys the backend.
