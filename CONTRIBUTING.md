# Contributing

This document provides guidelines for contributing to this project.

## Development

### Prerequisites

- Node.js 22+
- npm
- For iOS: Xcode + CocoaPods (`gem install cocoapods`)
- For Android: Android Studio + JDK 17+

### Example app

An example React Native application lives in the `example` directory. It demonstrates the component in action and serves as a testing ground during development.

Run the Metro bundler from the repo root:

```sh
npm run example
```

Then launch the app on your target platform from the `example` directory:

```sh
# iOS
cd example && npx react-native run-ios

# Android
cd example && npx react-native run-android
```

For iOS, install CocoaPods first:

```sh
cd example/ios && bundle exec pod install
```

### Local development

1. **Clone and install dependencies**
   - Clone the repo and navigate to the project directory
   - Run `npm install` to install all dependencies

   ```sh
   git clone https://github.com/RonasIT/react-native-controlled-input.git
   cd react-native-controlled-input
   npm install
   ```

2. **Make changes**
   - Edit source files under `src/`
   - For native changes, edit files under `ios/` or `android/`

3. **Test your changes**
   - Run `npm run lint` to type-check (`tsc`) and lint the codebase (`eslint`)
   - Verify your changes work end-to-end in the example app

4. **Submit changes**
   - Create a pull request with your modifications
   - Include clear descriptions of changes
   - Reference any related issues or discussions

## Build

Build the JS output (outputs to `lib/`):

```sh
npm run build
```

This runs `react-native-builder-bob` and produces ESM + TypeScript declaration files.

To clean build artifacts:

```sh
npm run clean
```

## Repository guidelines

### Branch naming

Use descriptive branch names and follow [Conventional Branch](https://conventional-branch.github.io/) guidelines.

### Commit messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format

### Code checks

Repository has pre-commit code style and correctness checks. You can run them manually using `lint` and `format` scripts.

### Pull request process

1. **Create a feature branch** from `main`
2. **Make your changes** following the coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

## Releases

To create a new release:

1. **Bump the version**: In the `plugin` directory run `npm version {patch|minor|major}` to update the version number in `package.json` and create a git commit and tag
   - `patch`: Bug fixes (0.2.0 → 0.2.1)
   - `minor`: New features (0.2.0 → 0.3.0)
   - `major`: Breaking changes (0.2.0 → 1.0.0)

2. **Push changes**: Create commit, tag and push them to the repository:

   ```bash
   git commit -m "chore: release v0.18.0"
   git push && git push --tags
   ```

3. **Create GitHub release**: Go to the [GitHub Releases](../../releases) page and:
   - Click "Create a new release"
   - Select the tag created in step 1
   - Add release notes describing the changes
   - Click "Publish release"

4. **Automatic NPM publication**: Once the GitHub release is published, the package will be automatically published to NPM via GitHub Actions workflow.

> **Note**: Make sure you have the `NPM_TOKEN` secret configured in your repository settings for the NPM publication to work.
