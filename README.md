# game-of-life

## Zur Aufsetzung

Es muss nichts aufgesetzt werden, alle Funktionalitäten sind über die `index.html` erreichbar. Das Spiel funktioniert unter Chrome, Firefox und Edge.
Im Internet Explorer läuft es nicht. Die Funktionalität in anderen Browsern wurde nicht getestet, die Wahrscheinlichkeit das es ordnunggerecht läuft ist
aber sehr hoch. Dieser Teil gilt natürlich für die jeweils neuste Version (Stand 10.11.2022).

## Definition der Importdateien

Die Dateien folgen folgendem Format:

```
50
12
010000000001000010000100000001110000000001000000000100010000
010001000001000000100000000000010000001001000000000000000001
.usw.
```

1. In der ersten Zeile wird die Größe a_max des Feldes angegeben.
2. In der zweiten Zeile folgen die Regeln, das erste Byte { '0', '1', '2' } sind die allg. Regeln, das zweite Byte { '0', '1', '2' } sind die Randregeln.
3. Es folgen a_max Zeilen, für jede wird a_max mal die Lebendigkeit mit 0 (tot) und 1 (lebendig) angegeben (ohne Leerzeichen)

## Bugs

Sollten Bugs auftreten, so teilt sie mir bitte über "tollpatsch3141@web.de" oder über den `Issues`-Tab mit.
