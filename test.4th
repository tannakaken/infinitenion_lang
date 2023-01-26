: fizzbuzz
  100 0 do
    i 15 % 0 = if
      "FizzBuzz\n" .
    else
      i 3 % 0 = if
        "Fizz\n" .
      else
        i 5 % 0 = if
          "Buzz\n" .
        else
          i . cr
        then
      then
    then
  loop
;
fizzbuzz