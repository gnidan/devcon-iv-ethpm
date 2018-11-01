const fs = require("fs");
const Web3 = require("web3");
const { URL } = require("url");

const { EthPM } = require("ethpm");

/*
 * Create a package by uploading contract source file and manifest to IPFS
 */
async function main(registryAddress) {
  /*
   * initialize Web3
   */
  const web3 = new Web3("http://127.0.0.1:8547");

  /*
   * initialize EthPM
   */
  const ethpm = await EthPM.configure({
    manifests: "ethpm/manifests/v2",
    storage: "ethpm/storage/ipfs",
    registries: "ethpm/registries/web3"
  }).connect({
    ipfs: {
      host: "ipfs.infura.io",
      port: "5001",
      protocol: "https"
    },
    provider: web3.eth.currentProvider,
    registryAddress

  });
  console.log("EthPM configured.");
  console.log();

  /*
   * read Owned.sol
   */
  const contractPath = "./contracts/Owned.sol";
  const contract = fs.readFileSync(contractPath).toString();  // fromBuffer
  console.log("Contract source read from disk.");
  console.log();

  /*
   * write to IPFS
   */
  const contractUri = await ethpm.storage.write(contract);
  console.log("Contract source uploaded to IPFS.");
  console.log();

  /*
   * build package object
   */
  const owned = {
    packageName: "owned",
    version: "1.0.0",
    meta: {
      authors: [ "Piper Merriam <pipermerriam@gmail.com>" ],
      license: "MIT",
      description: "Reusable contracts which implement a privileged 'owner' model for authorization.",
      keywords: [ "authorization" ],
      links: [{
        resource: "documentation",
        uri: "ipfs://QmUYcVzTfSwJoigggMxeo2g5STWAgJdisQsqcXHws7b1FW"
      }]
    },
    sources: {
      /* use the IPFS URI for the contract file */
      [contractPath]: contractUri
    },
    contractTypes: {},
    deployments: new Map(),
    buildDependencies: {}
  };
  console.log("Package object created.");
  console.log();

  /*
   * generate manifest
   */
  const manifest = await ethpm.manifests.write(owned);
  console.log("Manifest generated.");
  console.log();

  /*
   * submit manifest to IPFS
   */
  const manifestUri = await ethpm.storage.write(manifest);
  console.log("Manifest uploaded to IPFS.");
  console.log();

  /*
   * publish to registry
   */
  const pkg = await ethpm.registries.publish(
    "owned", "1.0.0", manifestUri
  );
  console.log("Published package to registry.");
  console.log();

  console.debug("pkg %o", pkg);
}

if (process.argv.length < 3) {
  console.error("Usage: node ./3-publish-to-registry.js <registry_address>");
  process.exit(1);
}

const address = process.argv[2];
main(address);
