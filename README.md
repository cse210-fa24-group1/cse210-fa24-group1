# cse210-fa24-group1

# How to Contribute to the Expense Tracker Repository

We appreciate your interest in contributing to the Expense Tracker project! By following these steps, you can help improve and enhance the repository.

## Steps to Contribute

### 1. **Fork the Repository**
   - Navigate to the Expense Tracker repository on GitHub.
   - Click on the **Fork** button at the top-right of the repository page to create a copy of the repository under your own GitHub account.

### 2. **Clone the Repository**
   - After forking, clone the repository to your local machine:
     ```bash
     git clone https://github.com/your-username/expense-tracker.git
     ```
   - Replace `your-username` with your GitHub username.

### 3. **Create a New Branch**
   - It's best practice to create a new branch for your changes. You can do this by running:
     ```bash
     git checkout -b add/feature-name
     ```
   - Replace `feature-name` with a descriptive name for the feature or bug fix you are working on.

### 4. **Make Your Changes**
   - Navigate to the appropriate file(s) and make your changes.
   - Be sure to write clear and concise commit messages that explain the purpose of the changes you’ve made. 
   - **Commit message format**: Your commit message should include the tag to the current version of the project, e.g., `v1.2.0`, at the beginning of the message. For example:
     ```bash
     git commit -m "v1.2.0 - Add user authentication feature"
     ```

### 5. **Commit Your Changes**
   - After making changes, commit them:
     ```bash
     git add .
     git commit -m "v1.2.0 - Add feature for expense categories"
     ```

### 6. **Push Your Changes**
   - Push your changes to your forked repository:
     ```bash
     git push origin feature-name
     ```

### 7. **Create a Pull Request (PR)**
   - Go to the original repository on GitHub and click on the **New Pull Request** button.
   - Select your branch with the changes and the base branch (usually `main` or `master`) of the original repository.
   - **Edit the Pull Request Template**: Once the pull request template appears, make sure to fill it out with relevant details about your changes, including:
     - A brief description of the changes you made.
     - Any relevant issue numbers or links (if applicable).
     - Testing details, if you added new functionality or fixed a bug.
   - Provide a detailed description of your changes and why they are beneficial to the project.

### 8. **Address Feedback**
   - If the maintainers request changes or provide feedback, make the necessary updates to your branch.
   - After addressing the feedback, commit and push the changes again. Your pull request will automatically update.

### 9. **Celebrate!**
   - Once your pull request is reviewed and merged, your contribution is officially part of the repository. Thank you for helping improve the Expense Tracker project!

## Contribution Guidelines

- **Code Style**: Follow the existing code style in the repository. Pay attention to indentation, naming conventions, and spacing.
- **Testing**: Please ensure that your changes do not break the existing code. If you add new features, include tests to validate your changes.
- **Issue Reporting**: If you encounter any bugs or have suggestions for new features, feel free to open an issue in the repository.

## Code of Conduct

We expect all contributors to adhere to our Code of Conduct and to be respectful and professional when engaging with others in the community.

