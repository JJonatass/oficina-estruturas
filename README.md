# Oficina de Estruturas de Dados · profjon

Material interativo de Estruturas de Dados com 25 módulos organizados em 7 eras, das variáveis aos grafos. Cada módulo tem quatro abas:

- **Teoria:** slides com conceito, analogia, implementação em C e Python (com botões para cada linguagem ou lado a lado), tabela de custos e modo apresentação.
- **Prática:** o visualizador interativo da estrutura, com um roteiro de tarefas e o que observar em cada uma.
- **Exercícios:** questões com correção na hora e problemas de programação com dica e solução em C e Python.
- **Desafios:** jogos no mundo da Masmorra das Árvores, com vidas, combo, níveis, dicas em camadas e janela que explica cada erro.

É um site estático: não precisa de build nem de instalação. O progresso de cada aluno fica salvo no próprio navegador.

## Trilha

| Era | Módulos |
|---|---|
| 01 · Fundamentos | Ponteiros em C, Struct (registros), Alocação dinâmica, Lista sequencial (vetor), Busca sequencial e binária, Lista encadeada estática, Lista encadeada simples, Lista duplamente encadeada |
| 02 · Estruturas lineares | Pilha, fila e deque, Fila circular |
| 03 · Árvores de busca | Árvore binária de busca, AVL, Rubro-negra, Splay |
| 04 · Árvores multi-via | Árvore B, Árvore B+ |
| 05 · Heaps e ordenação | Heap, Smoothsort |
| 06 · Estruturas especializadas | Trie, Árvore de decisão (Gini), Tabela hash |
| 07 · Conjuntos e grafos | Union-Find, BFS e DFS, Dijkstra, Árvore geradora mínima |

## Jogos (aba Desafios)

| Módulo | Jogo |
|---|---|
| Ponteiros | O Cartógrafo |
| Struct | A Forja das Arcas |
| Alocação dinâmica | O Guarda-Volumes da Masmorra |
| Lista sequencial | O Corredor das Estátuas |
| Busca sequencial e binária | A Câmara dos Baús |
| Lista estática | Os Armários do Alquimista |
| Lista simples | A Corrente de Elos |
| Lista dupla | A Ponte de Cordas |
| Pilha, fila e deque | O Salão das Três Portas |
| Fila circular | A Roda do Moinho |
| ABB e AVL | A Queda das Chaves, A Masmorra (andares), Arena das Árvores |
| Rubro-negra | O Herói da Cripta, A Masmorra, Arena das Árvores |
| Splay | O Mercado da Torre, O Herói da Cripta, A Masmorra, Arena das Árvores |
| Árvore B | Os Cofres do Rei Anão |
| Árvore B+ | As Galerias da Mina |
| Heap | A Forja de Huffman |
| Smoothsort | O Jardim de Leonardo |
| Trie | A Biblioteca dos Ecos |
| Árvore de decisão | O Oráculo das Frutas |
| Tabela hash | A Taverna do Hash |
| Union-Find | As Alianças dos Clãs |
| BFS e DFS | O Batedor e o Explorador |
| Dijkstra | O Mensageiro e o Dragão |
| AGM | A Rede de Pontes |

Os jogos da [Masmorra das Árvores](https://github.com/JJonatass/masmorra-das-arvores) (Queda das Chaves, Herói da Cripta, Arena, Forja de Huffman, Biblioteca dos Ecos, Mercado da Torre e Masmorra) usam o ranking online hospedado em `masmorra-das-arvores.vercel.app`. Os demais guardam o recorde no navegador.

## Estrutura

```
index.html            página da Oficina (trilha, abas, progresso)
data/era1.js … era7.js conteúdo dos módulos: slides, código C/Python, custos, roteiro, questões e exercícios
viz/                  visualizadores interativos (aba Prática)
jogos/                jogos da Masmorra das Árvores
jogos/oficina2/       jogos da Oficina e o kit comum (kit.js, kit.css)
testes/               scripts que extraem e testam os códigos em C e Python
```

## Rodar localmente

Qualquer servidor estático serve, por exemplo:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Links diretos: `#mapa` abre o mapa; `#<módulo>-<aba>` abre um módulo, por exemplo `#avl-teoria`, `#hash-desafios` ou `#dijkstra-exercicios-3`.

## Testar os códigos

```bash
node testes/extrair.js
bash testes/rodar.sh
```

Os programas completos da teoria são compilados com `gcc -std=c11` (com AddressSanitizer e UBSan) e executados; os de Python são verificados com `py_compile`.

## Publicação

O projeto é publicado na Vercel como site estático, sem comando de build.
