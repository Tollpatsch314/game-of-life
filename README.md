# game-of-life

## Definition der Importdateien

Die Dateien folgen folgendem Format:

```
50
13
010000000001000010000100000001110000000001000000000100010000
010001000001000000100000000000010000001001000000000000000001
.usw.
```

1. In der ersten Zeile wird die Größe a_max des Feldes angegeben.
2. In der zweiten Zeile folgen die Regeln, das erste Byte { '0', '1' } sind die allg. Regeln, das zweite Byte { '0', '1', '2', '3' } sind die Randregeln.
3. Es folgen a_max Zeilen, für jede wird a_max mal die Lebendigkeit mit 0 (tot) und 1 (lebendig) angegeben (ohne Leerzeichen)
