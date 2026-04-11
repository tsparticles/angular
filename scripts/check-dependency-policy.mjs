import { readFileSync } from "node:fs";

const TSPARTICLES_VERSION = "4.0.0-beta.11";
const ANGULAR_PEER_RANGE = "^20 || ^21";
const RXJS_PEER_RANGE = "^7.8.0";

const runtimeManifestPaths = [
  "apps/angular-demo/package.json",
  "apps/ionic-demo/package.json",
  "components/particles/package.json",
  "components/confetti/package.json",
  "components/fireworks/package.json",
];

const publishableManifestPaths = [
  "components/particles/projects/ng-particles/package.json",
  "components/confetti/projects/ng-confetti/package.json",
  "components/fireworks/projects/ng-fireworks/package.json",
];

const workspaceTsParticlesAllowlist = new Set([
  "@tsparticles/angular",
  "angular-confetti",
  "angular-fireworks",
]);

const violations = [];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function record(path, rule, actual) {
  violations.push(`${path}: ${rule}: ${actual}`);
}

function isTsParticlesKey(name) {
  return name === "tsparticles" || name.startsWith("@tsparticles/");
}

function checkRuntimePolicy(path) {
  const manifest = readJson(path);

  for (const section of ["dependencies", "peerDependencies"]) {
    const deps = manifest[section] ?? {};

    for (const [name, value] of Object.entries(deps)) {
      if (!isTsParticlesKey(name)) {
        continue;
      }

      if (workspaceTsParticlesAllowlist.has(name) && value === "workspace:^") {
        continue;
      }

      if (value !== TSPARTICLES_VERSION) {
        record(
          path,
          `${section}.${name} must equal ${TSPARTICLES_VERSION}`,
          value,
        );
      }
    }
  }
}

function checkPublishablePolicy(path, expectedVersion) {
  const manifest = readJson(path);
  const peers = manifest.peerDependencies ?? {};

  if (manifest.version !== expectedVersion) {
    record(
      path,
      `version must equal ${expectedVersion}`,
      String(manifest.version),
    );
  }

  if (peers["@angular/common"] !== ANGULAR_PEER_RANGE) {
    record(
      path,
      `peerDependencies.@angular/common must equal ${ANGULAR_PEER_RANGE}`,
      String(peers["@angular/common"]),
    );
  }

  if (peers["@angular/core"] !== ANGULAR_PEER_RANGE) {
    record(
      path,
      `peerDependencies.@angular/core must equal ${ANGULAR_PEER_RANGE}`,
      String(peers["@angular/core"]),
    );
  }

  if (peers.rxjs !== RXJS_PEER_RANGE) {
    record(
      path,
      `peerDependencies.rxjs must equal ${RXJS_PEER_RANGE}`,
      String(peers.rxjs),
    );
  }

  for (const [name, value] of Object.entries(peers)) {
    if (isTsParticlesKey(name) && value !== TSPARTICLES_VERSION) {
      record(
        path,
        `peerDependencies.${name} must equal ${TSPARTICLES_VERSION}`,
        value,
      );
    }
  }
}

for (const path of runtimeManifestPaths) {
  checkRuntimePolicy(path);
}

const publishables = publishableManifestPaths.map((path) => ({
  path,
  manifest: readJson(path),
}));
const expectedPublishableVersion = publishables[0]?.manifest.version;

for (const { path } of publishables) {
  checkPublishablePolicy(path, expectedPublishableVersion);
}

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Dependency policy check passed.");
