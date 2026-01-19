# Contributing to Money Manager

Thank you for considering contributing to the Money Manager application! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow security best practices

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Follow the setup instructions in [SETUP.md](SETUP.md)
4. Create a new branch for your feature/fix

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## Development Process

### Branch Naming

- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test additions/modifications

### Before Starting Development

1. Check existing issues and PRs to avoid duplicates
2. Create or comment on an issue describing your intended changes
3. Wait for approval/feedback before starting major work

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Avoid `any` types - use proper typing
- Write self-documenting code with clear variable names

### React Components

- Use functional components with hooks
- Follow single responsibility principle
- Keep components small and focused
- Use TypeScript interfaces for props

### Backend Code

- Follow RESTful API conventions
- Implement proper error handling
- Use middleware for cross-cutting concerns
- Validate all inputs
- Add audit logging for sensitive operations

### Security Practices

- Never commit secrets or API keys
- Validate and sanitize all user inputs
- Use parameterized queries (Prisma handles this)
- Implement rate limiting on sensitive endpoints
- Follow OWASP security guidelines

## Testing Guidelines

### Unit Tests

- Write tests for all new functionality
- Maintain minimum 80% code coverage
- Test edge cases and error conditions

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Integration Tests

- Test API endpoints with various scenarios
- Test database interactions
- Verify authentication and authorization

### Test Naming Convention

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something when condition is met', () => {
      // Test implementation
    })
  })
})
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Formatting changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

### Examples

```bash
feat(auth): add multi-factor authentication support

fix(dashboard): correct date range filtering logic

docs(readme): update setup instructions

test(transactions): add tests for soft delete functionality
```

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Lint your code**
   ```bash
   npm run lint
   ```

4. **Build successfully**
   ```bash
   npm run build
   ```

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if applicable)
- [ ] Tests added/updated and passing
- [ ] No console.log or debugging code
- [ ] Environment variables documented
- [ ] Database migrations included (if needed)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #[issue number]

## Testing
- Describe testing performed
- List any manual testing steps

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code builds without errors
- [ ] All tests pass
- [ ] Documentation updated
```

### Review Process

1. At least one approval required
2. All CI/CD checks must pass
3. No merge conflicts
4. Code reviewed for:
   - Correctness
   - Security
   - Performance
   - Maintainability
   - Test coverage

## Development Setup

See [SETUP.md](SETUP.md) for detailed setup instructions.

## Questions?

- Check existing documentation
- Review closed issues
- Ask in issue comments
- Contact maintainers

## Recognition

Contributors will be recognized in the project README. Thank you for your contributions! 🎉
