# DS_2020-18

DS_2020-18 eshte repository i projektit te grupit 18 per teknikat klasike te enkriptimit.
Ne kete repository gjinden tre lloje te enkriptimit:
1. Caesar Cipher
2. Tap-Code Cipher
3. Beale Cipher

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

Per ta perdorur aplikacionin, thjeshte duhet te hapni terminalin ne cilindo lokacion dhe te shkruani komandat:  
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
Pull requests jane te mirepritura. Per permiresime, ju lutemi qe fillimisht te hapni nje diskutim per ato ndryshime.
Nese ka ndonje verzion te ri, ju lutemi te qendroni te perditesuar.

## Shembuj

```
$ ds caesar encrypt 8 "Miresevini ne Fiek"
Uqzmamdqvq vm Nqms
```
```
$ ds caesar decrypt 8 "Uqzmamdqvq vm Nqms"
Miresevini ne Fiek
```
```
$ ds caesar brute-force "miresevini ne fiek"
key 1: lhqdrduhmh md ehdj

key 2: kgpcqctglg lc dgci

key 3: jfobpbsfkf kb cfbh

key 4: ienaoareje ja beag

key 5: hdmznzqdid iz adzf

key 6: gclymypchc hy zcye

key 7: fbkxlxobgb gx ybxd

key 8: eajwkwnafa fw xawc

key 9: dzivjvmzez ev wzvb

key 10: cyhuiulydy du vyua

key 11: bxgthtkxcx ct uxtz

key 12: awfsgsjwbw bs twsy

key 13: zverfrivav ar svrx

key 14: yudqeqhuzu zq ruqw

key 15: xtcpdpgtyt yp qtpv

key 16: wsbocofsxs xo psou

key 17: vranbnerwr wn ornt

key 18: uqzmamdqvq vm nqms

key 19: tpylzlcpup ul mplr

key 20: soxkykboto tk lokq

key 21: rnwjxjansn sj knjp

key 22: qmviwizmrm ri jmio

key 23: pluhvhylql qh ilhn

key 24: oktgugxkpk pg hkgm

key 25: njsftfwjoj of gjfl
```
```
$ ds tap-code encode "Miresevini ne Fiek"
... .. .. .... .... .. . ..... .... ... . ..... ..... . .. .... ... ... .. ....  ... ... . .....  .. . .. .... . ..... . ...
```
```
$ ds tap-code decode "... .. .. .... .... .. . ..... .... ... . ..... ..... . .. .... ... ... .. ....  ... ... . .....  .. . .. .... . ..... . ..."
miresevini ne fiec
```
```
$ ds beale encrypt libri.txt "miresevini ne fiek"
23 7 12 3 25 3 28 7 15 7 15 3 17 7 3 9
```
```
$ ds beale decrypt libri.txt "23 7 12 3 25 3 28 7 15 7 15 3 17 7 3 9"
miresevininefiek
```


## Licenca
[ISC](https://opensource.org/licenses/ISC)
