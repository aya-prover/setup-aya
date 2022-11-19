# Setup Aya in your GitHub Actions

## Use this Action

The following code snippet installs the nightly version of Aya and adds it to the PATH:

```yaml
- name: Setup Aya
  uses: aya-prover/setup-aya@latest
```

## Develop this Action

- Install a modern version of Node.js
- Install `pnpm`: `npm install -g pnpm`
- Install dependencies: `pnpm install`

Due to GitHub restrictions, you have to commit all generated files under `dists/`
folder to version control. So don't forget to run `pnpm package` before commit.
- `pnpm package`
