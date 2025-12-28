import { expect, test } from "vitest";
import { isValidNumber } from "../_utils/validators.tsx";

test("二", () => {
  expect(isValidNumber("二")).toBe(true);
});

test("千兆百億十万九", () => {
  expect(isValidNumber("千兆百億十万九")).toBe(true);
});

test("九万千二百四十一", () => {
  expect(isValidNumber("九万千二百四十一")).toBe(true);
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
