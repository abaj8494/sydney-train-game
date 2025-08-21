# static site:

if you want to use it click here: [https://abaj8494.github.io/sydney-train-game/](https://abaj8494.github.io/sydney-train-game/)

# build

if you want to build it I started with
```
npm create vite@latest sydney-train-game -- --template vanilla-ts
npm install
npm run dev
```
then wrote code in `/src/`.

i modified `index.html` and use the `VITE_DEBUG=true` flag in `.env` to show this in the console log

## algorithm

```
Trace for 6311, ops=[+ - * /]
trace.ts:57 [6, 3, 1, 1]
trace.ts:61   merge(0,1) op + -> (6+3) = 9
trace.ts:57     [(6+3), 1, 1]
trace.ts:61       merge(0,1) op + -> ((6+3)+1) = 10
trace.ts:57         [((6+3)+1), 1]
trace.ts:61           merge(0,1) op + -> (((6+3)+1)+1) = 11
trace.ts:57             [(((6+3)+1)+1)]
trace.ts:61           merge(0,1) op - -> (((6+3)+1)-1) = 9
trace.ts:57             [(((6+3)+1)-1)]
trace.ts:61           merge(0,1) op * -> (((6+3)+1)*1) = 10
trace.ts:57             [(((6+3)+1)*1)] -|
trace.ts:61           merge(0,1) op / -> (((6+3)+1)/1) = 10
trace.ts:57             [(((6+3)+1)/1)] -|
trace.ts:61       merge(0,1) op - -> ((6+3)-1) = 8
trace.ts:57         [((6+3)-1), 1]
trace.ts:61           merge(0,1) op + -> (((6+3)-1)+1) = 9
trace.ts:57             [(((6+3)-1)+1)]
trace.ts:61           merge(0,1) op - -> (((6+3)-1)-1) = 7
trace.ts:57             [(((6+3)-1)-1)]
trace.ts:61           merge(0,1) op * -> (((6+3)-1)*1) = 8
trace.ts:57             [(((6+3)-1)*1)]
trace.ts:61           merge(0,1) op / -> (((6+3)-1)/1) = 8
trace.ts:57             [(((6+3)-1)/1)]
trace.ts:61       merge(0,1) op * -> ((6+3)*1) = 9
trace.ts:57         [((6+3)*1), 1]
trace.ts:61           merge(0,1) op + -> (((6+3)*1)+1) = 10
trace.ts:57             [(((6+3)*1)+1)] -|
trace.ts:61           merge(0,1) op - -> (((6+3)*1)-1) = 8
trace.ts:57             [(((6+3)*1)-1)]
trace.ts:61           merge(0,1) op * -> (((6+3)*1)*1) = 9
trace.ts:57             [(((6+3)*1)*1)]
trace.ts:61           merge(0,1) op / -> (((6+3)*1)/1) = 9
trace.ts:57             [(((6+3)*1)/1)]
trace.ts:61       merge(0,1) op / -> ((6+3)/1) = 9
trace.ts:57         [((6+3)/1), 1]
trace.ts:61           merge(0,1) op + -> (((6+3)/1)+1) = 10
trace.ts:57             [(((6+3)/1)+1)] -|
trace.ts:61           merge(0,1) op - -> (((6+3)/1)-1) = 8
trace.ts:57             [(((6+3)/1)-1)]
trace.ts:61           merge(0,1) op * -> (((6+3)/1)*1) = 9
trace.ts:57             [(((6+3)/1)*1)]
trace.ts:61           merge(0,1) op / -> (((6+3)/1)/1) = 9
trace.ts:57             [(((6+3)/1)/1)]
trace.ts:61       merge(1,2) op + -> (1+1) = 2
trace.ts:57         [(6+3), (1+1)]
trace.ts:61           merge(0,1) op + -> ((6+3)+(1+1)) = 11
trace.ts:57             [((6+3)+(1+1))]
trace.ts:61           merge(0,1) op - -> ((6+3)-(1+1)) = 7
trace.ts:57             [((6+3)-(1+1))]
trace.ts:61           merge(0,1) op * -> ((6+3)*(1+1)) = 18
trace.ts:57             [((6+3)*(1+1))]
trace.ts:61           merge(0,1) op / -> ((6+3)/(1+1)) = 4.500000
trace.ts:57             [((6+3)/(1+1))]
trace.ts:61       merge(1,2) op - -> (1-1) = 0
```

in words, this code recursively conducts a depth first search on a list of nodes.

by unpacking and repacking these nodes we are able to slice lists together that check every permutation of operators between the 4 digits. each node data structure carries its own string and value.

# features

- box plot showing the solveable distribution given binary operators `+-*/^`.
  - feel free to pr to help increase the number of operators

- debug flag to see the breakdown


# notes

- [X] https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- [ ] https://www.typescriptlang.org/docs/handbook/2/basic-types.html
