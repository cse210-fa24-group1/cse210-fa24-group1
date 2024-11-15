# General Flow of Contribution

Follow these steps to contribute to a project using Git:

1. **Fetch the latest changes from the remote repository**:
   ```bash
   git fetch origin
   ```

2. **Merge changes from the main branch into your branch**:
   ```bash
   git merge origin/main
   ```

3. **Make your contributions**:
   - Edit or add files as needed for your feature or bug fix.
   - Ensure your changes are properly tested and meet project requirements.

4. **Stage your changes for commit**:
   ```bash
   git add .
   ```

5. **Commit your changes with a meaningful message**:
   ```bash
   git commit -m "version-of-app: commit message"
   ```

6. **Push your changes to the remote repository**:
   ```bash
   git push origin <branch-name>
   ```

   Replace `<branch-name>` with the name of the branch you're working on (e.g., `feature/xyz` or `bugfix/abc`).

---

### Notes:
- Always make sure to fetch and merge the latest changes from `main` before you start working to avoid conflicts.
- The commit message should follow any project-specific conventions for clarity.