const fs = require("fs");

const { EthPM } = require("ethpm");


async function main() {
  /*
   * initialize EthPM
   */
  const ethpm = await EthPM.configure({
    manifests: "ethpm/manifests/v2",
  }).connect();
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
      /* Embed source code inside manifest for now */
      [contractPath]: contract
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

  console.log("Full manifest:");
  console.log("==============");
  console.log();
  console.log(manifest);
}

main();
