# devcon-iv-ethpm
devcon iv. EthPM Workshop - Javascript

### Get Started

```
  npm install
```

### Setup process

```
1. node ./1-write-manifest.js
2. node ./2-create-package.js
3. node ./3-publish-to-registry.js
```

## Find the PackageRegistry contract address

```
npx truffle networks
```

in the `escape-truffle` folder.

Then use `PackageRegistry` address and run that with 

```
node ./3-publish-to-registry.js 0xb0Ba0e96B78382A943E3aA4A581d19CFfFf9b3e9
```
