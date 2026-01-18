import { expect, test, describe } from "vitest";
import { isValidNumber } from "../_utils/validators.tsx";
import getTranslation from "../_utils/getTranslation.tsx";

describe("isValidNumber() tests", () => {
  test("二", () => {
    expect(isValidNumber("二")).toBe(true);
  });

  test("千兆百億十万九", () => {
    expect(isValidNumber("千兆百億十万九")).toBe(true);
  });

  test("一千", () => {
    expect(isValidNumber("一千")).toBe(true);
  });

  test("九万千二百四十一", () => {
    expect(isValidNumber("九万千二百四十一")).toBe(true);
  });

  test("一百", () => {
    expect(isValidNumber("一百")).toBe(false);
  });

  test("一十", () => {
    expect(isValidNumber("一十")).toBe(false);
  });

  test("二三", () => {
    expect(isValidNumber("二三")).toBe(false);
  });

  test("兆百億十万九", () => {
    expect(isValidNumber("兆百億十万九")).toBe(false);
  });

  test("兆百億十万一十", () => {
    expect(isValidNumber("兆百億十万一十")).toBe(false);
  });

  test("二一", () => {
    expect(isValidNumber("二一")).toBe(false);
  });
});

describe("getTranslation() tests", () => {
  test("二", () => {
    expect(getTranslation("二")).toBe("2");
  });

  test("九千九百九十九兆九千九百九十九億九千九百九十九万九千九百九十九", () => {
    expect(
      getTranslation(
        "九千九百九十九兆九千九百九十九億九千九百九十九万九千九百九十九",
      ),
    ).toBe("9,999,999,999,999,999");
  });

  test("九千九百九十九兆九千九百九十九", () => {
    expect(getTranslation("九千九百九十九兆九千九百九十九")).toBe(
      "9,999,000,000,009,999",
    );
  });

  test("九千九百九十九兆九千九百九十五", () => {
    expect(getTranslation("九千九百九十九兆九千九百九十五")).toBe(
      "9,999,000,000,009,995",
    );
  });
});
