import * as core from "@actions/core";

async function run(): Promise<void> {
  try {
    core.info("Hello, World!");
    core.setOutput("Aya", "Nice to meet you!");
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run()
