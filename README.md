# DS_2020-18

DS_2020-18 eshte repository i projektit te gruput 18 per teknikat klasike te enkriptimit.
Ne kete repository gjenden tre lloje te enkriptimit:
1.Caesar Cipher
2.Tap-Code Cipher
3.Beale Cipher

## Instalimi

Per te perdorur programin duhet te instalohet [NodeJS](https://nodejs.org/en/) per perdorim te paketes [NPM](https://www.npmjs.com/).

Per te vertetuar se eshte instaluar npm paketa perdorni komanden ne njerin prej terminaleve (cmd,bash,shell,terminal) ne kompjuterin tuaj:

```bash
npm --version
```
Pasi te keni instaluar NodeJS dhe te keni shkarkuar folderin e projektit, ne folderin e projektit te shkarkuar, hapeni terminalin dhe shkruani komanden:

```bash
npm i commander
```

Pastaj perdoreni komanden:

```bash
npm link
```

Per te vertetuar instalimin e plote te aplikacionit perdorni komanden:
```bash
ds --version
```

dhe me kete perfundon instalimi i programit.

## Perdorimi

Per ta perdorur aplikacionin, thjeshte duhet te hapni terminalin ne secilindo lokacion dhe te shkruani komandat:
1.Komanda caesar per enkriptim/dekriptim apo edhe brute-force te nje teksti
1.1 Komanda per enkriptim me metoden e Cezarit:
```bash
ds caesar encrypt <key> <plaintext>
```

1.2 Komanda per dekriptim me metoden e Cezarit:
```bash
ds caesar decrypt <key> <ciphertext>
```

1.3 Komanda per dekriptim me metoden brute-force:
```bash
ds caesar brute-force <ciphertext>
```

2.Komanda Tap-Code per enkriptim/dekriptim te nje teksti
2.1 Komanda per enkriptim me metoden Tap Code:
```bash
ds tap-code encode <plaintext>
```

2.2 Komanda per dekriptim me metoden Tap Code:
```bash
ds tap-code decode <ciphertext>
```

3.Komanda Beale per enkriptim/dekriptim te nje teksti
3.1 Komanda per enkriptim me metoden Beale:
```bash
ds beale encrypt <book> <plaintext>
```

3.2 Komanda per dekriptim me metoden Beale:
```bash
ds beale decrypt <book> <ciphertext>
```
Komanda ```<book>``` paraqet nje tekst file ne folderin CriptoAlgorithms/bealeBook. Mund te perdoren key te ndryshem nese keni file te ndryshem.

Per me shume informacione per perdorim te aplikacionit perdorni komanden:
```bash
ds --help
```

## Kontribuesit

Krijues te ketij aplikacioni jane: Arianit Halimi,Artan Vrajolli dhe Arber Hyseni.
Pull requests jane te mirepritura. Per permirsime te medha, ju lutemi qe fillimisht te hapni nje diskutim per ndryshimin.
Nese ka ndonje verzion te ri, ju lutemi te qendroni te perditesuar.

## Licenca
[ISC](https://opensource.org/licenses/ISC)
