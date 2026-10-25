import { describe, expect, it } from "vitest";
import { blank, duplicateElement, textLines } from "./editor";
import { CATEGORIES, filterTemplates, STUDIO_TEMPLATES } from "./studio";

describe("Creative studio", () => {
  it("provides editable original samples in all nine requested categories", () => {
    expect(CATEGORIES.slice(1)).toHaveLength(9);
    for (const category of CATEGORIES.slice(1)) {
      const templates = filterTemplates("", category);
      expect(templates.length).toBeGreaterThan(0);
      expect(templates[0]?.make().els.length).toBeGreaterThan(0);
    }
    expect(STUDIO_TEMPLATES).toHaveLength(18);
  });
  it("searches templates regardless of accents and filters by category", () => {
    expect(filterTemplates("vision", "Presentaciones").map((t) => t.name)).toEqual(["Visión de proyecto"]);
    expect(filterTemplates("vision", "Documentos")).toEqual([]);
  });
  it("duplicates an element with a unique identity without mutating the original", () => {
    const design = { ...blank(1080, 1080), els: [{ id: "original", type: "text" as const, x: 10, y: 20, w: 500, h: 100, color: "#0067b8", text: "Hola", size: 50 }] };
    const copy = duplicateElement(design, "original");
    expect(copy.els).toHaveLength(2);
    expect(copy.els[1]?.id).not.toBe("original");
    expect(copy.els[1]?.text).toBe("Hola");
    expect(copy.els[1]?.x).toBe(34);
    expect(design.els).toHaveLength(1);
  });
  it("wraps export text without dropping explicit line breaks", () => {
    expect(textLines("uno dos tres\ncuatro", 7, (s) => s.length)).toEqual(["uno dos", "tres", "cuatro"]);
  });
});