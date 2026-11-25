/* Era 05: Heaps e ordenação */
MODS.push({
id:'heap', n:17, era:4, titulo:'Heap', sub:'Um vetor que se comporta como árvore',
viz:'viz/heap.html',
slides:[
{t:'Uma árvore sem ponteiros', h:`
<p class="lead">O heap binário é uma árvore <b>completa</b> guardada num vetor. Num <b>min-heap</b>, todo pai é menor ou igual aos filhos, então o menor elemento está sempre em <code>v[0]</code>.</p>
<pre>pai(i)  = (i - 1) / 2
esq(i)  = 2i + 1
dir(i)  = 2i + 2</pre>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>inserir com <b>subida</b> (sift-up) e extrair com <b>descida</b> (sift-down);</li><li>construir um heap em O(n) com heapify;</li><li>usar o heap como fila de prioridade.</li></ul></div>
<div class="analogia"><b>Analogia</b>O pronto-socorro: não importa quem chegou primeiro, o caso mais grave é atendido antes. A fila de prioridade é exatamente isso.</div>`},
{t:'Subir e descer', h:`
<div class="cards">
<div class="card"><b>Inserir</b>Coloca no fim do vetor e troca com o pai enquanto for menor que ele. O(log n).</div>
<div class="card"><b>Extrair o topo</b>Guarda <code>v[0]</code>, move o último para a raiz e troca com o <b>menor</b> filho enquanto for maior que ele. O(log n).</div>
<div class="card"><b>Heapify</b>Aplica a descida a partir do último pai até a raiz. Parece O(n log n), mas é <b>O(n)</b>: a maioria dos nós está perto das folhas e desce pouco.</div>
</div>
<div class="alerta"><b>Heap não é ordenado.</b> Só se garante a relação pai-filho. Buscar um valor qualquer custa O(n).</div>`},
{t:'Onde se usa', h:`
<table class="cmp"><tr><th>Uso</th><th>Por quê</th></tr>
<tr><td>Dijkstra e Prim</td><td>Pegar o vértice de menor distância a cada passo</td></tr>
<tr><td>Escalonadores</td><td>Executar primeiro a tarefa de maior prioridade</td></tr>
<tr><td>Heapsort</td><td>Ordenação O(n log n) no lugar, sem memória extra</td></tr>
<tr><td>Top-k</td><td>Os k maiores de um fluxo com um min-heap de tamanho k</td></tr></table>
<div class="free">Em Python, o módulo <code>heapq</code> implementa um min-heap sobre uma <code>list</code> comum: <code>heappush</code>, <code>heappop</code> e <code>heapify</code>.</div>`}
],
codigo:{nota:'Min-heap em vetor com inserção, extração e heapify.',
c:`#include <stdio.h>
#define CAP 64

typedef struct { int v[CAP]; int n; } Heap;

static void troca(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void subir(Heap *h, int i) {
    while (i > 0 && h->v[(i - 1) / 2] > h->v[i]) {
        troca(&h->v[i], &h->v[(i - 1) / 2]);
        i = (i - 1) / 2;
    }
}

void descer(Heap *h, int i) {
    for (;;) {
        int menor = i, e = 2 * i + 1, d = 2 * i + 2;
        if (e < h->n && h->v[e] < h->v[menor]) menor = e;
        if (d < h->n && h->v[d] < h->v[menor]) menor = d;
        if (menor == i) return;
        troca(&h->v[i], &h->v[menor]);
        i = menor;
    }
}

int inserir(Heap *h, int x) {
    if (h->n == CAP) return 0;
    h->v[h->n++] = x;
    subir(h, h->n - 1);
    return 1;
}

int extrair(Heap *h, int *x) {
    if (h->n == 0) return 0;
    *x = h->v[0];
    h->v[0] = h->v[--h->n];
    descer(h, 0);
    return 1;
}

void heapify(Heap *h) {
    for (int i = h->n / 2 - 1; i >= 0; i--) descer(h, i);
}

int main(void) {
    Heap h = { {9, 4, 7, 1, 8, 2, 6}, 7 };
    heapify(&h);
    printf("topo após heapify: %d\\n", h.v[0]);  /* 1 */
    inserir(&h, 0);
    int x;
    printf("extraindo: ");
    while (extrair(&h, &x)) printf("%d ", x);    /* 0 1 2 4 6 7 8 9 */
    printf("\\n");
    return 0;
}`,
py:`class MinHeap:
    def __init__(self, dados=None):
        self.v = list(dados or [])
        for i in range(len(self.v) // 2 - 1, -1, -1):   # heapify O(n)
            self._descer(i)

    def _subir(self, i):
        v = self.v
        while i > 0 and v[(i - 1) // 2] > v[i]:
            p = (i - 1) // 2
            v[i], v[p] = v[p], v[i]
            i = p

    def _descer(self, i):
        v, n = self.v, len(self.v)
        while True:
            menor, e, d = i, 2 * i + 1, 2 * i + 2
            if e < n and v[e] < v[menor]:
                menor = e
            if d < n and v[d] < v[menor]:
                menor = d
            if menor == i:
                return
            v[i], v[menor] = v[menor], v[i]
            i = menor

    def inserir(self, x):
        self.v.append(x)
        self._subir(len(self.v) - 1)

    def extrair(self):
        v = self.v
        topo = v[0]
        ultimo = v.pop()
        if v:
            v[0] = ultimo
            self._descer(0)
        return topo

    def __len__(self):
        return len(self.v)


h = MinHeap([9, 4, 7, 1, 8, 2, 6])
print("topo após heapify:", h.v[0])
h.inserir(0)
print("extraindo:", [h.extrair() for _ in range(len(h))])

# O mesmo com a biblioteca padrão:
import heapq
v = [9, 4, 7, 1, 8, 2, 6]
heapq.heapify(v)
print("heapq:", [heapq.heappop(v) for _ in range(len(v))])`},
custo:[['Ver o topo','O(1)','v[0]'],['Inserir','O(log n)','Sobe um caminho'],['Extrair o topo','O(log n)','Desce um caminho'],['Construir (heapify)','O(n)','Não é O(n log n)!'],['Buscar valor qualquer','O(n)','Heap não é ordenado']],
pratica:[
{t:'Veja árvore e vetor juntos', d:'Gere um heap aleatório e clique em alguns nós.', obs:'Escolha um nó no índice i e confira: os filhos estão mesmo em 2i+1 e 2i+2?'},
{t:'Insira um valor pequeno', d:'No modo <b>Min-Heap</b>, insira um valor menor que todos.', obs:'Quantas trocas ele fez até chegar à raiz? Compare com a altura.'},
{t:'Extraia o topo três vezes', d:'Use <b>⏏ Extrair topo</b> repetidamente.', obs:'Quem foi para a raiz no início de cada extração? Por que ele desce para o lado do menor filho?'},
{t:'Troque para Max-Heap', d:'Selecione <b>Max-Heap</b> e use <b>↺ Novo heap aleatório (heapify)</b>.', obs:'Em que ordem os pais foram processados no heapify?'}
],
quiz:[
{q:'Num heap em vetor (índice a partir de 0), quais são os filhos do índice 3?', ops:['6 e 7','7 e 8','4 e 5','1 e 2'], ok:1, exp:'2·3+1 = 7 e 2·3+2 = 8.'},
{q:'Qual é o pai do índice 10?', ops:['5','4','3','9'], ok:1, exp:'(10 − 1) / 2 = 4 (divisão inteira).'},
{q:'O vetor [1, 3, 2, 7, 4] é um min-heap válido?', ops:['Sim','Não'], ok:0, exp:'1 ≤ 3 e 1 ≤ 2; 3 ≤ 7 e 3 ≤ 4.'},
{q:'O custo de construir um heap com heapify é:', ops:['O(n log n)','O(n)','O(log n)','O(n²)'], ok:1, exp:'A soma das alturas dos nós é O(n).'},
{q:'Para achar os 10 maiores de um fluxo de 1 milhão de números, use:', ops:['Max-heap com tudo','Min-heap de tamanho 10','Ordenar tudo','Pilha'], ok:1, exp:'O topo do min-heap é o menor dos 10 maiores: se o novo número for maior, troca.'}
],
prog:[
{t:'Heapsort', enun:'Ordene um vetor em ordem crescente, no lugar, usando um max-heap.', dica:'Faça heapify de max-heap. Depois, repetidamente, troque <code>v[0]</code> com o último da parte não ordenada e desça a nova raiz numa heap menor.',
c:`static void desce_max(int *v, int n, int i) {
    for (;;) {
        int m = i, e = 2 * i + 1, d = 2 * i + 2;
        if (e < n && v[e] > v[m]) m = e;
        if (d < n && v[d] > v[m]) m = d;
        if (m == i) return;
        int t = v[i]; v[i] = v[m]; v[m] = t;
        i = m;
    }
}

void heapsort(int *v, int n) {
    for (int i = n / 2 - 1; i >= 0; i--) desce_max(v, n, i);
    for (int fim = n - 1; fim > 0; fim--) {
        int t = v[0]; v[0] = v[fim]; v[fim] = t;
        desce_max(v, fim, 0);
    }
}`,
py:`def heapsort(v):
    def desce(n, i):
        while True:
            m, e, d = i, 2 * i + 1, 2 * i + 2
            if e < n and v[e] > v[m]:
                m = e
            if d < n and v[d] > v[m]:
                m = d
            if m == i:
                return
            v[i], v[m] = v[m], v[i]
            i = m

    n = len(v)
    for i in range(n // 2 - 1, -1, -1):
        desce(n, i)
    for fim in range(n - 1, 0, -1):
        v[0], v[fim] = v[fim], v[0]
        desce(fim, 0)
    return v`},
{t:'k-ésimo maior', enun:'Devolva o k-ésimo maior elemento de uma lista usando um min-heap de tamanho k.', dica:'Mantenha no heap os k maiores vistos até agora. No fim, o topo é a resposta.',
c:`/* Usa o Heap (min) e as funções inserir/extrair do módulo */
#define CAP 64
typedef struct { int v[CAP]; int n; } Heap;
int inserir(Heap *h, int x);
int extrair(Heap *h, int *x);

int k_esimo_maior(const int *v, int n, int k) {
    Heap h = { {0}, 0 };
    int lixo;
    for (int i = 0; i < n; i++) {
        inserir(&h, v[i]);
        if (h.n > k) extrair(&h, &lixo);   /* remove o menor */
    }
    return h.v[0];
}`,
py:`import heapq


def k_esimo_maior(v, k):
    h = []
    for x in v:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return h[0]


print(k_esimo_maior([3, 2, 1, 5, 6, 4], 2))   # 5`}
]
});

MODS.push({
id:'huffman', n:18, era:4, titulo:'Código de Huffman', sub:'Compressão com uma árvore montada por um min-heap',
viz:'viz/huffman.html',
slides:[
{t:'Comprimir é dar códigos curtos ao que é comum', h:`
<p class="lead">Em ASCII, toda letra ocupa 8 bits, seja ela muito usada ou rara. O código de Huffman dá códigos <b>curtos</b> às letras frequentes e <b>longos</b> às raras, e assim o texto inteiro ocupa menos bits.</p>
<div class="cards">
<div class="card"><b>ABRACADABRA em ASCII</b>11 letras × 8 bits = <b>88 bits</b>.</div>
<div class="card"><b>ABRACADABRA em Huffman</b>A aparece 5 vezes e ganha 1 bit. B, R, C e D ganham 3. Total: <b>23 bits</b>.</div>
</div>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul>
<li>montar a árvore de Huffman com um min-heap;</li>
<li>gerar a tabela de códigos e codificar e decodificar um texto;</li>
<li>explicar por que um código de prefixo dispensa separadores.</li></ul></div>
<div class="analogia"><b>Analogia</b>O código Morse já fazia isso: a letra E, a mais comum do inglês, é um único ponto. Mas o Morse precisa de pausas entre as letras. O código de Huffman não precisa, porque é um <b>código de prefixo</b>.</div>`},
{t:'Código de prefixo', h:`
<p>Num código de prefixo, <b>nenhum código é o começo de outro</b>. Lendo os bits da esquerda para a direita, assim que um código completo aparece, só existe uma letra possível.</p>
<div class="cards">
<div class="card"><b>Ambíguo</b>A = <code>0</code>, B = <code>01</code>, C = <code>1</code>. A sequência <code>01</code> pode ser B ou AC.</div>
<div class="card"><b>De prefixo</b>A = <code>0</code>, B = <code>10</code>, C = <code>11</code>. <code>0 10 11</code> só pode ser ABC.</div>
</div>
<p>Toda árvore binária gera um código de prefixo: as letras ficam nas <b>folhas</b>, ir à esquerda vale <code>0</code> e ir à direita vale <code>1</code>. Como nenhuma folha está no caminho de outra, nenhum código é prefixo de outro.</p>`},
{t:'Montando a árvore com um min-heap', h:`
<ol><li>Conte a frequência de cada símbolo.</li>
<li>Coloque uma folha para cada símbolo num <b>min-heap</b>, ordenado pela frequência.</li>
<li>Enquanto houver mais de um nó: tire os <b>dois menores</b>, crie um pai com a soma das frequências e coloque o pai de volta.</li>
<li>O nó que sobra é a raiz.</li></ol>
<pre>heap: C1 D1 B2 R2 A5
tira C1 e D1 → entra CD2        heap: B2 R2 CD2 A5
tira B2 e R2 → entra BR4        heap: CD2 A5 BR4
tira CD2 e BR4 → entra 6        heap: A5 6
tira A5 e 6  → entra 11         heap: 11  (raiz)</pre>
<p>As letras raras são fundidas primeiro e por isso ficam no fundo da árvore, com códigos longos. As frequentes entram por último e ficam perto da raiz.</p>
<div class="free">Com frequências empatadas, a ordem das fusões pode mudar e os códigos também. O <b>total de bits</b> continua o mesmo: todas essas árvores são ótimas.</div>`},
{t:'Codificar e decodificar', h:`
<div class="duo"><pre data-l="c">/* tabela: percorre a árvore acumulando 0 (esq) e 1 (dir) */
void gerar(No *n, char *pref, int prof) {
    if (!n-&gt;esq) { pref[prof] = '\\0'; strcpy(codigo[n-&gt;simbolo], pref); return; }
    pref[prof] = '0'; gerar(n-&gt;esq, pref, prof + 1);
    pref[prof] = '1'; gerar(n-&gt;dir, pref, prof + 1);
}

/* decodificar: anda na árvore bit a bit */
No *at = raiz;
for (const char *b = bits; *b; b++) {
    at = (*b == '0') ? at-&gt;esq : at-&gt;dir;
    if (!at-&gt;esq) { putchar(at-&gt;simbolo); at = raiz; }
}</pre><pre data-l="py"># tabela: percorre a árvore acumulando 0 (esq) e 1 (dir)
def gerar(no, pref, tabela):
    if no.esq is None:
        tabela[no.simbolo] = pref
    else:
        gerar(no.esq, pref + "0", tabela)
        gerar(no.dir, pref + "1", tabela)

# decodificar: anda na árvore bit a bit
at = raiz
for b in bits:
    at = at.esq if b == "0" else at.dir
    if at.esq is None:
        saida.append(at.simbolo)
        at = raiz</pre></div>
<p>Para codificar, basta trocar cada símbolo pelo seu código da tabela. Para decodificar, desce-se da raiz seguindo os bits; ao chegar numa folha, sai uma letra e volta-se à raiz.</p>`},
{t:'Custo, limites e onde aparece', h:`
<div class="cards">
<div class="card"><b>Construção</b>Contar é O(n) no tamanho do texto. Com k símbolos distintos, são k − 1 fusões, cada uma O(log k) no heap: <b>O(n + k log k)</b>.</div>
<div class="card"><b>Ótimo</b>Nenhum código de prefixo que troque cada símbolo por um código fixo gasta menos bits que o de Huffman.</div>
<div class="card"><b>O preço</b>Quem decodifica precisa da árvore (ou da tabela), que vai junto com o arquivo. Em textos curtos, isso pode custar mais do que economiza.</div>
<div class="card"><b>Quando não ajuda</b>Se todos os símbolos têm a mesma frequência, os códigos ficam do mesmo tamanho, como num código fixo.</div>
</div>
<div class="free">O Huffman está dentro do formato ZIP e do gzip (no algoritmo DEFLATE), do PNG, do JPEG e do MP3. Na aba Desafios, <b>A Forja de Huffman</b> põe o heap e a árvore para trabalhar.</div>`}
],
codigo:{nota:'Huffman completo: frequências, min-heap de nós, tabela de códigos, codificação e decodificação de ABRACADABRA. Empates são desfeitos pela ordem de criação dos nós, para C e Python darem o mesmo resultado.',
c:`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct No {
    int freq, ordem;                 /* ordem desempata nós de mesma frequência */
    char simbolo;                    /* só nas folhas */
    struct No *esq, *dir;
} No;

/* ---------- min-heap de ponteiros para No ---------- */
static No *heap[256];
static int tam = 0;

static int menor(const No *a, const No *b) {
    return a->freq != b->freq ? a->freq < b->freq : a->ordem < b->ordem;
}
static void trocar(int i, int j) { No *t = heap[i]; heap[i] = heap[j]; heap[j] = t; }
static void inserir(No *n) {
    int i = tam++;
    heap[i] = n;
    while (i > 0 && menor(heap[i], heap[(i - 1) / 2])) { trocar(i, (i - 1) / 2); i = (i - 1) / 2; }
}
static No *extrair(void) {
    No *topo = heap[0];
    heap[0] = heap[--tam];
    for (int i = 0;;) {
        int e = 2 * i + 1, d = e + 1, m = i;
        if (e < tam && menor(heap[e], heap[m])) m = e;
        if (d < tam && menor(heap[d], heap[m])) m = d;
        if (m == i) break;
        trocar(i, m); i = m;
    }
    return topo;
}

static int criados = 0;
static No *novo(int freq, char s, No *e, No *d) {
    No *n = malloc(sizeof *n);
    if (!n) exit(1);
    n->freq = freq; n->ordem = criados++; n->simbolo = s; n->esq = e; n->dir = d;
    return n;
}

No *construir(const char *texto) {
    int freq[256] = {0};
    for (const char *p = texto; *p; p++) freq[(unsigned char)*p]++;
    for (int c = 0; c < 256; c++)
        if (freq[c]) inserir(novo(freq[c], (char)c, NULL, NULL));
    while (tam > 1) {
        No *a = extrair(), *b = extrair();          /* os dois menores */
        inserir(novo(a->freq + b->freq, 0, a, b));
    }
    return extrair();
}

static char codigo[256][32];
void gerar(No *n, char *pref, int prof) {
    if (!n->esq) {                                  /* folha */
        pref[prof] = '\\0';
        strcpy(codigo[(unsigned char)n->simbolo], prof ? pref : "0");
        return;
    }
    pref[prof] = '0'; gerar(n->esq, pref, prof + 1);
    pref[prof] = '1'; gerar(n->dir, pref, prof + 1);
}

void liberar(No *n) { if (n) { liberar(n->esq); liberar(n->dir); free(n); } }

int main(void) {
    const char *texto = "ABRACADABRA";
    No *raiz = construir(texto);
    char pref[32];
    gerar(raiz, pref, 0);

    for (int c = 0; c < 256; c++)
        if (codigo[c][0]) printf("%c: %s\\n", c, codigo[c]);

    char bits[1024] = "";
    for (const char *p = texto; *p; p++) strcat(bits, codigo[(unsigned char)*p]);
    printf("%s\\n%zu bits (em ASCII: %zu)\\n", bits, strlen(bits), 8 * strlen(texto));

    printf("decodificado: ");                       /* anda na árvore bit a bit */
    No *at = raiz;
    for (const char *b = bits; *b; b++) {
        at = (*b == '0') ? at->esq : at->dir;
        if (!at->esq) { putchar(at->simbolo); at = raiz; }
    }
    putchar('\\n');
    liberar(raiz);
    return 0;
}`,
py:`import heapq
from itertools import count


class No:
    def __init__(self, freq, simbolo=None, esq=None, dir=None):
        self.freq, self.simbolo, self.esq, self.dir = freq, simbolo, esq, dir


def construir(texto):
    freq = {}
    for c in texto:
        freq[c] = freq.get(c, 0) + 1
    ordem = count()                          # desempata nós de mesma frequência
    heap = [(f, next(ordem), No(f, c)) for c, f in sorted(freq.items())]
    heapq.heapify(heap)
    while len(heap) > 1:
        fa, _, a = heapq.heappop(heap)       # os dois menores
        fb, _, b = heapq.heappop(heap)
        heapq.heappush(heap, (fa + fb, next(ordem), No(fa + fb, None, a, b)))
    return heap[0][2]


def gerar(no, pref="", tabela=None):
    if tabela is None:
        tabela = {}
    if no.esq is None:                       # folha
        tabela[no.simbolo] = pref or "0"
    else:
        gerar(no.esq, pref + "0", tabela)
        gerar(no.dir, pref + "1", tabela)
    return tabela


texto = "ABRACADABRA"
raiz = construir(texto)
codigo = gerar(raiz)
for c in sorted(codigo):
    print(f"{c}: {codigo[c]}")

bits = "".join(codigo[c] for c in texto)
print(bits)
print(f"{len(bits)} bits (em ASCII: {8 * len(texto)})")

saida, at = [], raiz                         # anda na árvore bit a bit
for b in bits:
    at = at.esq if b == "0" else at.dir
    if at.esq is None:
        saida.append(at.simbolo)
        at = raiz
print("decodificado:", "".join(saida))`},
custo:[['Contar frequências','O(n)','n = tamanho do texto'],['Montar a árvore','O(k log k)','k − 1 fusões, cada uma com operações no heap'],['Gerar a tabela','O(k)','Uma visita por nó da árvore'],['Codificar','O(n + bits)','Troca cada símbolo pelo seu código'],['Decodificar','O(bits)','Um passo na árvore por bit']],
pratica:[
{t:'Frequências e floresta inicial', d:'Deixe o texto <b>ABRACADABRA</b> e observe a tabela de frequências e as folhas do heap.', obs:'Quais letras você espera que fiquem com os códigos mais curtos?'},
{t:'Fusões passo a passo', d:'Avance com <b>Passo</b> até sobrar uma única árvore.', obs:'Quais dois nós saem do heap a cada passo? Por que sempre os de menor frequência?'},
{t:'Leia os códigos', d:'No fim, clique em cada letra da tabela de códigos.', obs:'Algum código é prefixo de outro? Quantos bits o texto ocupa, comparado com os 8 bits por letra do ASCII?'},
{t:'Quando o Huffman não ajuda', d:'Troque o texto para <b>ABCDEFGH</b> e depois para <b>AAAAAAAB</b>.', obs:'Com frequências iguais, quanto mede cada código? Com uma letra dominante, o Huffman consegue gastar menos de 1 bit por letra?'}
],
quiz:[
{q:'Por que o código de Huffman é um código de prefixo?', ops:['Para a árvore ocupar menos memória','Para decodificar sem ambiguidade e sem separadores entre as letras','Porque o heap exige','Para os códigos ficarem em ordem alfabética'], ok:1, exp:'Como nenhum código começa outro, ao completar um código não há dúvida sobre a letra.'},
{q:'Em cada passo da construção, quais nós são unidos?', ops:['Os dois de maior frequência','Os dois de menor frequência','O primeiro e o último inseridos','Dois quaisquer'], ok:1, exp:'Os menos frequentes descem para o fundo da árvore e ficam com os códigos mais longos.'},
{q:'Com A = 5, B = 2, R = 2, C = 1 e D = 1, quantos bits tem ABRACADABRA codificado?', ops:['11','23','33','88'], ok:1, exp:'Soma das fusões: 2 + 4 + 6 + 11 = 23. Ou: A com 1 bit (5 × 1) e as outras com 3 (6 × 3).'},
{q:'Qual estrutura deixa a construção em O(k log k)?', ops:['Pilha','Fila de prioridade (min-heap)','Tabela hash','Lista encadeada'], ok:1, exp:'Tirar os dois menores e inserir a soma custa O(log k) com um heap.'},
{q:'A tabela A = 0, B = 01, C = 11 serve como código de Huffman?', ops:['Sim','Não: 0 é prefixo de 01, então a decodificação fica ambígua','Sim, se o texto for curto','Não, porque C tem 2 bits'], ok:1, exp:'Ao ler 0, não dá para saber se é A ou o começo de B.'}
],
prog:[
{t:'Total de bits sem montar a árvore', enun:'Dadas as frequências dos símbolos, calcule quantos bits o texto codificado terá, <b>sem</b> criar nós nem códigos.', dica:'Cada fusão de dois nós com pesos a e b acrescenta um bit a todos os símbolos embaixo deles, ou seja, a + b bits. Some (a + b) de todas as fusões. Em C, com poucos símbolos, dá para achar os dois menores varrendo o vetor.',
c:`/* freq[] é alterado; k >= 1 */
long total_bits(int freq[], int k) {
    long total = 0;
    if (k == 1) return freq[0];              /* um símbolo só: 1 bit cada */
    while (k > 1) {
        int a = 0, b = 1;                    /* índices dos dois menores */
        if (freq[b] < freq[a]) { a = 1; b = 0; }
        for (int i = 2; i < k; i++) {
            if (freq[i] < freq[a]) { b = a; a = i; }
            else if (freq[i] < freq[b]) b = i;
        }
        int soma = freq[a] + freq[b];
        total += soma;
        freq[a] = soma;                      /* o pai ocupa o lugar de a... */
        freq[b] = freq[--k];                 /* ...e b sai do vetor */
    }
    return total;
}`,
py:`import heapq


def total_bits(freqs):
    if len(freqs) == 1:
        return freqs[0]                      # um símbolo só: 1 bit cada
    heap = list(freqs)
    heapq.heapify(heap)
    total = 0
    while len(heap) > 1:
        soma = heapq.heappop(heap) + heapq.heappop(heap)
        total += soma
        heapq.heappush(heap, soma)
    return total`},
{t:'Decodificar só com a tabela', enun:'Receba a tabela de códigos (um código de prefixo) e uma sequência de bits, e devolva o texto original <b>sem usar a árvore</b>.', dica:'Acumule os bits lidos num pedaço. Sempre que o pedaço for igual a algum código, escreva a letra e comece um pedaço novo. Em Python, inverta a tabela num dicionário código → letra.',
c:`#include <string.h>

/* simb[i] tem o código cod[i]; saida precisa ter espaço suficiente */
void decodificar(const char *bits, const char simb[], const char *cod[], int k, char *saida) {
    char pedaco[32];
    int t = 0, o = 0;
    for (const char *b = bits; *b; b++) {
        pedaco[t++] = *b;
        pedaco[t] = '\\0';
        for (int i = 0; i < k; i++)
            if (strcmp(pedaco, cod[i]) == 0) { saida[o++] = simb[i]; t = 0; break; }
    }
    saida[o] = '\\0';
}`,
py:`def decodificar(bits, tabela):
    inverso = {c: s for s, c in tabela.items()}   # código -> símbolo
    saida, pedaco = [], ""
    for b in bits:
        pedaco += b
        if pedaco in inverso:
            saida.append(inverso[pedaco])
            pedaco = ""
    return "".join(saida)`},
{t:'É um código de prefixo?', enun:'Dada uma lista de códigos, diga se ela é um código de prefixo, isto é, se nenhum código é o começo de outro.', dica:'Compare cada par: o código mais curto é prefixo do mais longo? Em C, <code>strncmp(a, b, strlen(a)) == 0</code> testa se a é prefixo de b. Ordenar os códigos deixa o teste em O(k log k), mas o par a par já resolve.',
c:`#include <string.h>

int eh_prefixo(const char *cod[], int k) {
    for (int i = 0; i < k; i++)
        for (int j = 0; j < k; j++)
            if (i != j && strncmp(cod[i], cod[j], strlen(cod[i])) == 0)
                return 0;                    /* cod[i] começa cod[j] */
    return 1;
}`,
py:`def eh_prefixo(codigos):
    for i, a in enumerate(codigos):
        for j, b in enumerate(codigos):
            if i != j and b.startswith(a):
                return False                 # a começa b
    return True`}
]
});

MODS.push({
id:'smoothsort', n:19, era:4, titulo:'Smoothsort', sub:'Uma floresta de heaps de Leonardo',
viz:'viz/smoothsort.html',
slides:[
{t:'Heapsort que percebe a ordem', h:`
<p class="lead">O heapsort custa O(n log n) mesmo se o vetor já estiver ordenado. O <b>smoothsort</b> (Dijkstra, 1981) também ordena no lugar em O(n log n) no pior caso, mas cai para <b>O(n)</b> quando a entrada está quase ordenada.</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>gerar os números de Leonardo;</li><li>entender a floresta de heaps e suas duas fases;</li><li>comparar smoothsort e heapsort.</li></ul></div>
<h3>Números de Leonardo</h3>
<pre>L(0) = 1, L(1) = 1, L(k) = L(k-1) + L(k-2) + 1
1, 1, 3, 5, 9, 15, 25, 41, 67, 109, ...</pre>
<p>Uma <b>árvore de Leonardo</b> de ordem k tem L(k) nós: uma raiz, uma subárvore de ordem k−1 e outra de ordem k−2.</p>`},
{t:'As duas fases', h:`
<div class="cards">
<div class="card"><b>1. Construção</b>Da esquerda para a direita, cada elemento novo vira raiz de uma árvore: se as duas últimas árvores têm ordens consecutivas, elas se fundem sob o novo elemento; senão, ele forma uma árvore de ordem 1 ou 0.</div>
<div class="card"><b>2. Extração</b>Da direita para a esquerda, a raiz da última árvore é o maior elemento restante e já está no lugar certo. Ela é removida e suas duas subárvores voltam à floresta.</div>
</div>
<p>Depois de cada mudança, a floresta é "consertada" para que as raízes fiquem em ordem crescente da esquerda para a direita (o maior sempre na última raiz).</p>
<div class="analogia"><b>Analogia</b>Organizar uma pilha de provas corrigidas já quase em ordem alfabética: você só mexe nas poucas que estão fora do lugar, em vez de reorganizar tudo do zero.</div>`},
{t:'Na prática', h:`
<table class="cmp"><tr><th></th><th>Heapsort</th><th>Smoothsort</th></tr>
<tr><td>Pior caso</td><td>O(n log n)</td><td>O(n log n)</td></tr>
<tr><td>Já ordenado</td><td>O(n log n)</td><td>O(n)</td></tr>
<tr><td>Memória extra</td><td>O(1)</td><td>O(1) (com bits) ou O(log n)</td></tr>
<tr><td>Estável</td><td>Não</td><td>Não</td></tr>
<tr><td>Complexidade do código</td><td>Baixa</td><td>Alta</td></tr></table>
<div class="free">Ele é usado, por exemplo, na função <code>qsort</code> da biblioteca C musl. Na maioria das linguagens, a ordenação padrão é um híbrido (Timsort, introsort), que também se adapta a dados quase ordenados.</div>`}
],
codigo:{nota:'Versão didática: a lista de ordens das árvores fica numa pilha explícita (O(log n) de memória).',
c:`#include <stdio.h>

static int L[43];                        /* números de Leonardo */

static void troca(int *a, int *b) { int t = *a; *a = *b; *b = t; }

/* desce v[r] na árvore de ordem k */
static void peneirar(int *v, int r, int k) {
    while (k >= 2) {
        int dir = r - 1, esq = r - 1 - L[k - 2];
        int filho = v[esq] > v[dir] ? esq : dir;
        int kf = filho == esq ? k - 1 : k - 2;
        if (v[r] >= v[filho]) return;
        troca(&v[r], &v[filho]);
        r = filho; k = kf;
    }
}

/* leva v[r] (raiz da árvore idx) para a raiz certa e peneira */
static void consertar(int *v, int r, int *ordem, int idx) {
    while (idx > 0) {
        int ant = r - L[ordem[idx]];
        int k = ordem[idx];
        if (v[ant] <= v[r]) break;
        if (k >= 2 && (v[ant] <= v[r - 1] || v[ant] <= v[r - 1 - L[k - 2]])) break;
        troca(&v[ant], &v[r]);
        r = ant; idx--;
    }
    peneirar(v, r, ordem[idx]);
}

void smoothsort(int *v, int n) {
    L[0] = L[1] = 1;
    for (int i = 2; i < 43; i++) L[i] = L[i - 1] + L[i - 2] + 1;
    int ordem[64], m = 0;                /* pilha de ordens */

    for (int i = 0; i < n; i++) {        /* fase 1: construção */
        if (m >= 2 && ordem[m - 2] == ordem[m - 1] + 1) { m--; ordem[m - 1]++; }
        else if (m >= 1 && ordem[m - 1] == 1) ordem[m++] = 0;
        else ordem[m++] = 1;
        consertar(v, i, ordem, m - 1);
    }
    for (int i = n - 1; i > 0; i--) {    /* fase 2: extração */
        int k = ordem[--m];
        if (k >= 2) {
            ordem[m++] = k - 1;
            consertar(v, i - 1 - L[k - 2], ordem, m - 1);
            ordem[m++] = k - 2;
            consertar(v, i - 1, ordem, m - 1);
        }
    }
}

int main(void) {
    int v[] = {38, 5, 91, 12, 67, 3, 44, 20, 71, 9, 56};
    int n = sizeof v / sizeof v[0];
    smoothsort(v, n);
    for (int i = 0; i < n; i++) printf("%d ", v[i]);
    printf("\\n");
    return 0;
}`,
py:`def leonardo(limite=43):
    L = [1, 1]
    while len(L) < limite:
        L.append(L[-1] + L[-2] + 1)
    return L


L = leonardo()


def _peneirar(v, r, k):
    while k >= 2:
        dir_, esq = r - 1, r - 1 - L[k - 2]
        filho, kf = (esq, k - 1) if v[esq] > v[dir_] else (dir_, k - 2)
        if v[r] >= v[filho]:
            return
        v[r], v[filho] = v[filho], v[r]
        r, k = filho, kf


def _consertar(v, r, ordem, idx):
    while idx > 0:
        ant, k = r - L[ordem[idx]], ordem[idx]
        if v[ant] <= v[r]:
            break
        if k >= 2 and (v[ant] <= v[r - 1] or v[ant] <= v[r - 1 - L[k - 2]]):
            break
        v[ant], v[r] = v[r], v[ant]
        r, idx = ant, idx - 1
    _peneirar(v, r, ordem[idx])


def smoothsort(v):
    ordem = []                                    # ordens das árvores
    for i in range(len(v)):                       # fase 1: construção
        if len(ordem) >= 2 and ordem[-2] == ordem[-1] + 1:
            ordem.pop()
            ordem[-1] += 1
        elif ordem and ordem[-1] == 1:
            ordem.append(0)
        else:
            ordem.append(1)
        _consertar(v, i, ordem, len(ordem) - 1)
    for i in range(len(v) - 1, 0, -1):            # fase 2: extração
        k = ordem.pop()
        if k >= 2:
            ordem.append(k - 1)
            _consertar(v, i - 1 - L[k - 2], ordem, len(ordem) - 1)
            ordem.append(k - 2)
            _consertar(v, i - 1, ordem, len(ordem) - 1)
    return v


print(smoothsort([38, 5, 91, 12, 67, 3, 44, 20, 71, 9, 56]))`},
custo:[['Pior caso','O(n log n)',''],['Entrada já ordenada','O(n)','Quase nenhum conserto'],['Memória extra','O(log n)','Nesta versão; O(1) com vetor de bits'],['Estável?','Não','Elementos iguais podem trocar de ordem']],
pratica:[
{t:'Construa a floresta', d:'Use <b>🎲 Novo vetor aleatório</b> e avance só a fase de construção.', obs:'Anote as ordens das árvores após cada elemento. Elas seguem a regra de fusão?'},
{t:'Acompanhe uma extração', d:'Continue até a fase de extração e pare na primeira remoção.', obs:'O maior elemento já estava na última posição? Quais duas árvores apareceram?'},
{t:'Teste com vetor ordenado', d:'Digite um vetor já em ordem crescente e use <b>Usar estes valores</b>.', obs:'Quantas trocas aconteceram? Compare com o vetor aleatório.'},
{t:'Teste com vetor invertido', d:'Agora digite o mesmo vetor em ordem decrescente.', obs:'O número de trocas cresceu muito? Isso combina com o pior caso O(n log n)?'}
],
quiz:[
{q:'Qual é o próximo número de Leonardo depois de 1, 1, 3, 5, 9, 15?', ops:['21','24','25','30'], ok:2, exp:'15 + 9 + 1 = 25.'},
{q:'Uma árvore de Leonardo de ordem 4 tem quantos nós?', ops:['5','9','15','4'], ok:1, exp:'L(4) = 9.'},
{q:'Qual é o custo do smoothsort num vetor já ordenado?', ops:['O(n log n)','O(n)','O(1)','O(n²)'], ok:1, exp:'É a propriedade adaptativa que o diferencia do heapsort.'},
{q:'O smoothsort é estável?', ops:['Sim','Não'], ok:1, exp:'As trocas entre raízes e filhos podem inverter elementos iguais.'},
{q:'Na fase de construção, quando duas árvores se fundem?', ops:['Sempre','Quando as duas últimas têm ordens consecutivas','Quando têm a mesma ordem','Nunca'], ok:1, exp:'Ordens k+1 e k mais a nova raiz formam uma árvore de ordem k+2.'}
],
prog:[
{t:'Gerar números de Leonardo', enun:'Imprima os números de Leonardo menores que um limite.', dica:'Comece com 1, 1 e aplique L(k) = L(k−1) + L(k−2) + 1.',
c:`#include <stdio.h>

void leonardo_ate(int limite) {
    int a = 1, b = 1;
    if (limite > 1) printf("1 ");
    while (b < limite) {
        printf("%d ", b);
        int c = a + b + 1;
        a = b; b = c;
    }
    printf("\\n");
}`,
py:`def leonardo_ate(limite):
    saida, a, b = [], 1, 1
    if limite > 1:
        saida.append(1)
    while b < limite:
        saida.append(b)
        a, b = b, a + b + 1
    return saida


print(leonardo_ate(100))   # [1, 1, 3, 5, 9, 15, 25, 41, 67]`},
{t:'Medir a adaptatividade', enun:'Conte quantas trocas o smoothsort faz num vetor ordenado, num aleatório e num invertido, cada um com 1000 elementos.', dica:'Acrescente um contador global incrementado dentro de cada troca (em <code>_peneirar</code> e <code>_consertar</code>).',
c:`/* No código do módulo:
   1. declare  static long trocas = 0;
   2. em troca():  trocas++;
   3. no main, rode smoothsort em três vetores de 1000 elementos
      (crescente, aleatório e decrescente) e imprima trocas
      zerando o contador entre eles.
   Esperado: crescente = 0 trocas; aleatório e decrescente na casa
   de milhares. */`,
py:`import random

# No código do módulo, troque as linhas de troca por uma chamada
# que incremente um contador global. Depois:
for nome, v in (("crescente", list(range(1000))),
                ("aleatório", random.sample(range(1000), 1000)),
                ("decrescente", list(range(1000, 0, -1)))):
    trocas = 0
    smoothsort(v)
    print(nome, trocas)
# Esperado: crescente = 0; os outros na casa de milhares.`}
]
});
