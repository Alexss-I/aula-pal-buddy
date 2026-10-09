import { describe, expect, it } from "vitest";
import { evaluate, makeGroups } from "@/lib/aulaplus";
describe("Notebook evaluation", () => {
  it("Perfecto adds exactly 2 points", () => expect(evaluate(10, "Perfecto")).toBe(12));
  it("Bien adds exactly 1 point", () => expect(evaluate(10, "Bien")).toBe(11));
  it("Necesita Repaso adds no points", () => expect(evaluate(10, "Necesita Repaso")).toBe(10));
});
describe("Class groups", () => {
  for (const size of [2, 3, 4, 5, 6])
    it(`keeps every student once in groups of up to ${size}`, () => {
      const students = Array.from({ length: 12 }, (_, i) => i);
      const groups = makeGroups(students, size);
      expect(groups.flat()).toEqual(students);
      expect(groups.every((g) => g.length <= size)).toBe(true);
      expect(groups[0]?.length).toBe(size);
    });
});
