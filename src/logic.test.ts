/**
 * QUOTA — pure game logic tests (TypeScript port of Main.gd rules).
 * No Godot engine required.
 */
import { describe, expect, it } from "vitest";

// ── Logic (TypeScript port of GDScript) ────────────────────────────────────────

const maxf = (a: number, b: number) => Math.max(a, b);

function extractAsset(extracted: number, noise: number) {
  return { extracted: extracted + 1, noise: noise + 0.25 };
}

function crouch(noise: number) {
  return { noise: maxf(0, noise - 0.2) };
}

function sprint(noise: number) {
  return { noise: noise + 0.15 };
}

function isQuotaMet(extracted: number, quota: number) {
  return extracted >= quota;
}

function isCaught(noise: number) {
  return noise >= 1.0;
}

function tickTime(timeLeft: number, noise: number, delta: number) {
  return {
    timeLeft: timeLeft - delta,
    noise: maxf(0, noise - delta * 0.05),
  };
}

function isTimeUp(timeLeft: number) {
  return timeLeft <= 0;
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("QUOTA — extract action", () => {
  it("increments extracted count by 1", () => {
    const { extracted } = extractAsset(0, 0);
    expect(extracted).toBe(1);
  });

  it("increases noise by 0.25", () => {
    const { noise } = extractAsset(0, 0);
    expect(noise).toBeCloseTo(0.25);
  });

  it("accumulates across multiple extracts", () => {
    let state = { extracted: 0, noise: 0 };
    state = extractAsset(state.extracted, state.noise);
    state = extractAsset(state.extracted, state.noise);
    expect(state.extracted).toBe(2);
    expect(state.noise).toBeCloseTo(0.5);
  });
});

describe("QUOTA — crouch action", () => {
  it("reduces noise by 0.2", () => {
    const { noise } = crouch(0.6);
    expect(noise).toBeCloseTo(0.4);
  });

  it("does not reduce noise below 0", () => {
    const { noise } = crouch(0.1);
    expect(noise).toBeGreaterThanOrEqual(0);
  });

  it("clamps noise at 0 when already 0", () => {
    const { noise } = crouch(0);
    expect(noise).toBe(0);
  });
});

describe("QUOTA — sprint action", () => {
  it("increases noise by 0.15", () => {
    const { noise } = sprint(0);
    expect(noise).toBeCloseTo(0.15);
  });
});

describe("QUOTA — quota met detection", () => {
  it("returns true when extracted equals quota", () => {
    expect(isQuotaMet(3, 3)).toBe(true);
  });

  it("returns true when extracted exceeds quota", () => {
    expect(isQuotaMet(4, 3)).toBe(true);
  });

  it("returns false when extracted is below quota", () => {
    expect(isQuotaMet(2, 3)).toBe(false);
  });
});

describe("QUOTA — caught detection", () => {
  it("returns true when noise reaches 1.0", () => {
    expect(isCaught(1.0)).toBe(true);
  });

  it("returns true when noise exceeds 1.0", () => {
    expect(isCaught(1.5)).toBe(true);
  });

  it("returns false when noise is below 1.0", () => {
    expect(isCaught(0.9)).toBe(false);
  });
});

describe("QUOTA — time tick", () => {
  it("reduces timeLeft by delta", () => {
    const { timeLeft } = tickTime(90, 0, 1);
    expect(timeLeft).toBeCloseTo(89);
  });

  it("passively decays noise over time", () => {
    const { noise } = tickTime(90, 0.5, 1);
    // noise - 1 * 0.05 = 0.45
    expect(noise).toBeCloseTo(0.45);
  });

  it("does not let noise go below 0", () => {
    const { noise } = tickTime(90, 0.01, 1);
    expect(noise).toBeGreaterThanOrEqual(0);
  });
});

describe("QUOTA — time up detection", () => {
  it("returns true when timeLeft is 0", () => {
    expect(isTimeUp(0)).toBe(true);
  });

  it("returns true when timeLeft is negative", () => {
    expect(isTimeUp(-1)).toBe(true);
  });

  it("returns false when time remains", () => {
    expect(isTimeUp(10)).toBe(false);
  });
});
