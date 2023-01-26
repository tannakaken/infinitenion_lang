import { floatParser, integerParser, numberParser, stringParser, tokenizer } from "./parser";

test("parse int", () => {
  const [result, rest] = integerParser("123abc");
  expect(result.type).toBe("Integer");
  expect(result.value).toBe(123);
  expect(rest).toBe("abc");

  const [result2, rest2] = integerParser("123.4abc");
  expect(result2.type).toBe("Integer");
  expect(result2.value).toBe(123);
  expect(rest2).toBe(".4abc");

  const [result3, rest3] = integerParser("abc123");
  expect(result3.type).toBe("Null");
  expect(result3.value).toBeNull();
  expect(rest3).toBe("abc123");
});

test("parse float", () => {
  const [result, rest] = floatParser("123abc");
  expect(result.type).toBe("Null");
  expect(result.value).toBeNull();
  expect(rest).toBe("123abc");

  const [result2, rest2] = floatParser("123.456def");
  expect(result2.type).toBe("Float");
  expect(result2.value).toBe(123.456);
  expect(rest2).toBe("def");

  const [result3, rest3] = floatParser("5.274e-4ghi");
  expect(result3.type).toBe("Float");
  expect(result3.value).toBe(5.274e-4);
  expect(rest3).toBe("ghi");

  const [result4, rest4] = floatParser("abc123.4");
  expect(result4.type).toBe("Null");
  expect(result4.value).toBeNull();
  expect(rest4).toBe("abc123.4");
});

test("parse number", () => {
  const [result, rest] = numberParser("123abc");
  expect(result.type).toBe("Integer");
  expect(result.value).toBe(123);
  expect(rest).toBe("abc");

  const [result2, rest2] = numberParser("123.456def");
  expect(result2.type).toBe("Float");
  expect(result2.value).toBe(123.456);
  expect(rest2).toBe("def");

  const [result3, rest3] = numberParser("5.274e-4ghi");
  expect(result3.type).toBe("Float");
  expect(result3.value).toBe(5.274e-4);
  expect(rest3).toBe("ghi");

  const [result4, rest4] = numberParser("abc123.4");
  expect(result4.type).toBe("Null");
  expect(result4.value).toBeNull();
  expect(rest4).toBe("abc123.4");

  const [result5, rest5] = numberParser("123.0jkl");
  expect(result5.type).toBe("Float");
  expect(result5.value).toBe(123.0);
  expect(rest5).toBe("jkl");
});

test("parse string", () => {
    const [result, rest] = stringParser("\"abc\"+123");
    expect(result.type).toBe("String");
    expect(result.value).toBe("abc");
    expect(rest).toBe("+123");
    const [result2, rest2] = stringParser("\"ab\\nc\"+123");
    expect(result2.type).toBe("String");
    expect(result2.value).toBe("ab\nc");
    expect(rest2).toBe("+123");
})

test("tokens parser", () => {
  const result = tokenizer("+123.456 12+ 123-");
  if (result === null) {
    fail();
  } else {
    expect(result.length).toBe(5);
    expect(result[0].value).toBe(123.456);
    expect(result[1].value).toBe(12);
    expect(result[2].value).toBe("+");
    expect(result[3].value).toBe(123);
    expect(result[4].value).toBe("-");
  }
  const result2 = tokenizer("123.456_789");
  expect(result2).toBeNull();
});
