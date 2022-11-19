import * as core from "@actions/core";
import * as tool from "@actions/tool-cache";
import * as os from "os";
import * as path from "path";

enum Distribution {
  JLink = "jlink",
  Native = "native",
}

function parseDistribution(distribution: string): Distribution {
  switch (distribution) {
    case "jlink":
      return Distribution.JLink;
    case "native":
      return Distribution.Native;
    default:
      throw new Error("Unknown distribution: " + distribution);
  }
}

async function run(): Promise<void> {
  try {
    const version = core.getInput("version");
    const distribution = parseDistribution(core.getInput("distribution"));
    const buildFromSource = core.getInput("build-from-source") === "true";

    core.info("Hello! This is Aya Shameimaru. I am going to setup myself with the following options:");
    core.info("version: " + version);
    core.info("distribution: " + distribution);
    core.info("build-from-source: " + buildFromSource);

    if (buildFromSource) core.setFailed("Sorry, I can't build from source yet.");
    if (distribution === Distribution.Native) core.setFailed("Sorry, I can't install native distribution yet.");

    await installAya(version, distribution);
    core.info("Nice to meet you!");
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

async function installAya(version: string, distribution: Distribution) {
  const os = detectOS();
  const arch = detectArch();
  core.info(`Installing Aya ${version} for ${os} ${arch} from ${distribution}`);

  const exe = detectExe();
  let url: string;
  switch (distribution) {
    case Distribution.JLink:
      url = `https://github.com/aya-prover/aya-dev/releases/download/${version}/aya-prover-jlink-${os}_${arch}.zip`;
      break;
    case Distribution.Native:
      url = `https://github.com/aya-prover/aya-dev/releases/download/${version}/aya-native-${os}_${arch}${exe}`;
      break;
  }

  core.info("Downloading from " + url);
  const file = await tool.downloadTool(url);
  core.info("Downloaded to " + file);

  // TODO: native distribution
  const ayaHome = await tool.extractZip(file);
  core.addPath(path.join(ayaHome, "bin"));
}

/** convert current OS to GitHub runner names */
function detectOS(): string {
  var osType: string = os.type().toLowerCase();
  if (osType.includes("linux")) return "ubuntu-latest";
  if (osType.includes("darwin")) return "macos-latest";
  if (osType.includes("windows")) return "windows-latest";
  throw new Error("Unknown OS: " + osType);
}

function detectExe(): string {
  return os.type().toLowerCase().includes("windows") ? ".exe" : "";
}

/** currently GitHub only supports x86-64 runners */
function detectArch(): string {
  return "x86-64";
}

run()
