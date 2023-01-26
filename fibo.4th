: fibo
    dup 0 <= if
        drop 0
    else
        dup 1 = if
            drop 1
        else
            dup 1 - fibo swap 2 - fibo +
        then
    then
;
10 fibo . cr
