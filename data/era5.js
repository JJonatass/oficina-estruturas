/* Era 05: Heaps e ordenação */
MODS.push({
id:'heap', n:16, era:4, titulo:'Heap', sub:'Um vetor que se comporta como árvore',
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
id:'smoothsort', n:17, era:4, titulo:'Smoothsort', sub:'Uma floresta de heaps de Leonardo',
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
