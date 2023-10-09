import { convertFromDirectory } from "joi-to-typescript";

async function types(): Promise<void> {
  console.log("Running joi-to-typescript...");

  const myArgs = process.argv.slice(2);
  const featureName: string | undefined = myArgs[0];

  if (!featureName) {
    console.log("Please provide a feature name as the first argument.");
    return;
  }

  const result = await convertFromDirectory({
    schemaDirectory: `./src/features/${featureName}/entities`,
    typeOutputDirectory: `./src/features/${featureName}/schema-types`,
    debug: true,
  });

  if (result) {
    console.log("Completed joi-to-typescript");
  } else {
    console.log("Failed to run joi-to-typescrip");
  }
}

types();
