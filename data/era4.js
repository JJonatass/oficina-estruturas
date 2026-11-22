/* Era 04: Árvores multi-via */
MODS.push({
id:'arvore-b', n:12, era:3, titulo:'Árvore B', sub:'Nós largos e poucos níveis, feita para disco',
viz:'viz/arvore-b.html',
slides:[
{t:'Por que nós com muitas chaves', h:`
<p class="lead">Ler um bloco do disco custa milhares de vezes mais que comparar números na memória. Se cada nó da árvore ocupar um bloco inteiro e guardar <b>centenas de chaves</b>, a altura cai drasticamente e cada busca lê só 3 ou 4 blocos.</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>aplicar as regras de ocupação da árvore B de grau mínimo t;</li><li>inserir com divisão de nós cheios;</li><li>explicar empréstimo e fusão na remoção.</li></ul></div>
<div class="analogia"><b>Analogia</b>O índice de uma enciclopédia em vários volumes: a lombada de cada volume diz "ABA–BRU", "BRU–CAS"... Com poucas olhadas você sabe qual volume abrir, e dentro dele qual página.</div>`},
{t:'As regras (grau mínimo t)', h:`
<div class="cards">
<div class="card"><b>Chaves por nó</b>Entre t−1 e 2t−1 (a raiz pode ter menos).</div>
<div class="card"><b>Filhos</b>Um nó interno com k chaves tem k+1 filhos.</div>
<div class="card"><b>Ordem</b>As chaves de cada nó ficam ordenadas e separam as faixas dos filhos.</div>
<div class="card"><b>Folhas no mesmo nível</b>A árvore cresce <b>pela raiz</b>, nunca pelas folhas.</div>
</div>
<h3>Inserção com divisão</h3>
<p>Descendo da raiz até a folha, todo nó <b>cheio</b> (2t−1 chaves) encontrado no caminho é dividido: a chave do meio sobe para o pai e o resto vira dois nós com t−1 chaves cada. Se a raiz estiver cheia, ela é dividida e surge uma nova raiz: é assim que a altura aumenta.</p>`},
{t:'Remoção e altura', h:`
<p>Na remoção, nenhum nó pode ficar com menos de t−1 chaves. Antes de descer para um filho "magro", a árvore:</p>
<div class="cards">
<div class="card"><b>Pede emprestado</b>Se um irmão vizinho tem chaves sobrando, uma chave gira pelo pai.</div>
<div class="card"><b>Funde</b>Se nenhum irmão pode emprestar, o filho, o irmão e a chave separadora do pai viram um só nó.</div>
</div>
<p>Com t = 100 e 1 bilhão de chaves, a altura é no máximo 5. Por isso árvores B (e B+) estão em todo banco de dados e sistema de arquivos (NTFS, ext4, APFS).</p>`}
],
codigo:{nota:'Árvore B de grau mínimo T = 2 (cada nó tem de 1 a 3 chaves): busca e inserção com divisão preventiva.',
c:`#include <stdio.h>
#include <stdlib.h>
#define T 2
#define MAXK (2 * T - 1)

typedef struct No {
    int n, folha;
    int chave[MAXK];
    struct No *filho[MAXK + 1];
} No;

No *novo_no(int folha) {
    No *x = calloc(1, sizeof(No));
    x->folha = folha;
    return x;
}

No *buscar(No *x, int k, int *pos) {
    int i = 0;
    while (i < x->n && k > x->chave[i]) i++;
    if (i < x->n && k == x->chave[i]) { *pos = i; return x; }
    return x->folha ? NULL : buscar(x->filho[i], k, pos);
}

/* divide o filho cheio y = x->filho[i] */
void dividir(No *x, int i) {
    No *y = x->filho[i], *z = novo_no(y->folha);
    z->n = T - 1;
    for (int j = 0; j < T - 1; j++) z->chave[j] = y->chave[j + T];
    if (!y->folha)
        for (int j = 0; j < T; j++) z->filho[j] = y->filho[j + T];
    y->n = T - 1;
    for (int j = x->n; j > i; j--) x->filho[j + 1] = x->filho[j];
    x->filho[i + 1] = z;
    for (int j = x->n - 1; j >= i; j--) x->chave[j + 1] = x->chave[j];
    x->chave[i] = y->chave[T - 1];                 /* a do meio sobe */
    x->n++;
}

void inserir_nao_cheio(No *x, int k) {
    int i = x->n - 1;
    if (x->folha) {
        while (i >= 0 && k < x->chave[i]) { x->chave[i + 1] = x->chave[i]; i--; }
        x->chave[i + 1] = k;
        x->n++;
    } else {
        while (i >= 0 && k < x->chave[i]) i--;
        i++;
        if (x->filho[i]->n == MAXK) {
            dividir(x, i);
            if (k > x->chave[i]) i++;
        }
        inserir_nao_cheio(x->filho[i], k);
    }
}

No *inserir(No *raiz, int k) {
    if (raiz->n == MAXK) {                         /* a árvore cresce aqui */
        No *s = novo_no(0);
        s->filho[0] = raiz;
        dividir(s, 0);
        inserir_nao_cheio(s, k);
        return s;
    }
    inserir_nao_cheio(raiz, k);
    return raiz;
}

void imprimir(No *x, int nivel) {
    printf("%*s[", nivel * 2, "");
    for (int i = 0; i < x->n; i++) printf(i ? " %d" : "%d", x->chave[i]);
    printf("]\\n");
    if (!x->folha) for (int i = 0; i <= x->n; i++) imprimir(x->filho[i], nivel + 1);
}

void liberar(No *x) {
    if (!x->folha) for (int i = 0; i <= x->n; i++) liberar(x->filho[i]);
    free(x);
}

int main(void) {
    No *raiz = novo_no(1);
    for (int k = 1; k <= 10; k++) raiz = inserir(raiz, k);
    imprimir(raiz, 0);
    int p;
    printf("7 %s\\n", buscar(raiz, 7, &p) ? "achado" : "ausente");
    liberar(raiz);
    return 0;
}`,
py:`T = 2
MAXK = 2 * T - 1


class No:
    def __init__(self, folha=True):
        self.folha = folha
        self.chaves = []
        self.filhos = []


def buscar(x, k):
    i = 0
    while i < len(x.chaves) and k > x.chaves[i]:
        i += 1
    if i < len(x.chaves) and k == x.chaves[i]:
        return x, i
    return None if x.folha else buscar(x.filhos[i], k)


def dividir(x, i):
    y = x.filhos[i]
    z = No(y.folha)
    meio = y.chaves[T - 1]
    z.chaves = y.chaves[T:]
    y.chaves = y.chaves[:T - 1]
    if not y.folha:
        z.filhos = y.filhos[T:]
        y.filhos = y.filhos[:T]
    x.chaves.insert(i, meio)        # a do meio sobe
    x.filhos.insert(i + 1, z)


def inserir_nao_cheio(x, k):
    i = len(x.chaves) - 1
    if x.folha:
        while i >= 0 and k < x.chaves[i]:
            i -= 1
        x.chaves.insert(i + 1, k)
        return
    while i >= 0 and k < x.chaves[i]:
        i -= 1
    i += 1
    if len(x.filhos[i].chaves) == MAXK:
        dividir(x, i)
        if k > x.chaves[i]:
            i += 1
    inserir_nao_cheio(x.filhos[i], k)


def inserir(raiz, k):
    if len(raiz.chaves) == MAXK:    # a árvore cresce pela raiz
        s = No(folha=False)
        s.filhos.append(raiz)
        dividir(s, 0)
        inserir_nao_cheio(s, k)
        return s
    inserir_nao_cheio(raiz, k)
    return raiz


def imprimir(x, nivel=0):
    print("  " * nivel + str(x.chaves))
    for f in x.filhos:
        imprimir(f, nivel + 1)


raiz = No()
for k in range(1, 11):
    raiz = inserir(raiz, k)
imprimir(raiz)
print("7", "achado" if buscar(raiz, 7) else "ausente")`},
custo:[['Buscar','O(t · log_t n)','O(log_t n) leituras de disco'],['Inserir','O(t · log_t n)','Divisões só no caminho'],['Remover','O(t · log_t n)','Empréstimos e fusões no caminho'],['Altura','≤ log_t((n+1)/2)','t = 100, n = 10⁹ → altura ≤ 5']],
pratica:[
{t:'Encha a raiz', d:'Comece vazia e insira três chaves (t = 2).', obs:'A raiz está cheia. O que acontece com a quarta inserção? Qual chave subiu?'},
{t:'Faça a altura crescer', d:'Continue inserindo até a árvore ganhar um terceiro nível.', obs:'Em qual nó a altura aumentou: numa folha ou na raiz?'},
{t:'Remova com empréstimo', d:'Remova de uma folha com 1 chave cujo irmão tem 2 ou 3.', obs:'Qual chave desceu do pai e qual subiu do irmão?'},
{t:'Remova com fusão', d:'Remova de uma folha com 1 chave cujo irmão também tem 1.', obs:'Quantos nós sobraram depois da fusão? O pai perdeu uma chave?'}
],
quiz:[
{q:'Numa árvore B com t = 3, quantas chaves no máximo cabem num nó?', ops:['3','5','6','2'], ok:1, exp:'2t − 1 = 5.'},
{q:'E no mínimo (fora a raiz)?', ops:['1','2','3','0'], ok:1, exp:'t − 1 = 2.'},
{q:'Onde a altura de uma árvore B aumenta?', ops:['Na folha mais funda','Na raiz, quando ela é dividida','Em qualquer nó cheio','Nunca'], ok:1, exp:'É por isso que todas as folhas ficam sempre no mesmo nível.'},
{q:'Um nó interno com 4 chaves tem quantos filhos?', ops:['4','5','3','8'], ok:1, exp:'k chaves separam k + 1 faixas.'},
{q:'Por que a árvore B é preferida para dados em disco?', ops:['Ocupa menos memória','Tem altura pequena: poucas leituras de bloco','É mais fácil de programar','Não precisa de ordem'], ok:1, exp:'O custo dominante é o número de acessos ao disco, igual à altura.'}
],
prog:[
{t:'Menor e maior chave', enun:'Escreva funções que devolvem a menor e a maior chave da árvore B.', dica:'A menor está na folha mais à esquerda; a maior, na folha mais à direita.',
c:`typedef struct No { int n, folha; int chave[3]; struct No *filho[4]; } No;

int menor(const No *x) {
    while (!x->folha) x = x->filho[0];
    return x->chave[0];
}

int maior(const No *x) {
    while (!x->folha) x = x->filho[x->n];
    return x->chave[x->n - 1];
}`,
py:`def menor(x):
    while not x.folha:
        x = x.filhos[0]
    return x.chaves[0]


def maior(x):
    while not x.folha:
        x = x.filhos[-1]
    return x.chaves[-1]`},
{t:'Percurso em ordem', enun:'Liste todas as chaves da árvore B em ordem crescente.', dica:'Intercale: filho 0, chave 0, filho 1, chave 1, ..., último filho.',
c:`#include <stdio.h>
typedef struct No { int n, folha; int chave[3]; struct No *filho[4]; } No;

void em_ordem(const No *x) {
    for (int i = 0; i < x->n; i++) {
        if (!x->folha) em_ordem(x->filho[i]);
        printf("%d ", x->chave[i]);
    }
    if (!x->folha) em_ordem(x->filho[x->n]);
}`,
py:`def em_ordem(x, saida=None):
    saida = [] if saida is None else saida
    for i, k in enumerate(x.chaves):
        if not x.folha:
            em_ordem(x.filhos[i], saida)
        saida.append(k)
    if not x.folha:
        em_ordem(x.filhos[-1], saida)
    return saida`}
]
});

MODS.push({
id:'arvore-bmais', n:13, era:3, titulo:'Árvore B+', sub:'Dados só nas folhas, folhas encadeadas',
viz:'viz/arvore-bmais.html',
slides:[
{t:'O que muda em relação à B', h:`
<p class="lead">Na B+, os nós internos servem só para <b>rotear</b> a busca. Todos os dados ficam nas <b>folhas</b>, e cada folha aponta para a próxima, formando uma lista ordenada.</p>
<div class="cards">
<div class="card"><b>Internos mais largos</b>Sem dados, cabem mais chaves por bloco e a árvore fica ainda mais baixa.</div>
<div class="card"><b>Busca uniforme</b>Toda busca desce até uma folha: custo previsível.</div>
<div class="card"><b>Intervalos baratos</b>Desce uma vez até o início e depois só anda pela lista de folhas.</div>
</div>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>inserir com divisão de folha (a chave é <b>copiada</b> para cima) e de nó interno (a chave <b>sobe</b>);</li><li>responder consultas por intervalo em O(log n + k).</li></ul></div>`},
{t:'Copiar × subir', h:`
<p>Quando uma <b>folha</b> estoura, ela se divide em duas e a primeira chave da nova folha é <b>copiada</b> para o pai: ela continua existindo na folha, porque é lá que o dado mora.</p>
<p>Quando um <b>nó interno</b> estoura, a chave do meio <b>sobe</b> e sai do nó, como na árvore B.</p>
<pre>folha cheia [10 20 30] + 25
→ [10 20] → [25 30]     pai recebe cópia de 25</pre>
<div class="analogia"><b>Analogia</b>Uma biblioteca: as placas nos corredores (nós internos) só dizem para onde ir. Os livros (dados) estão todos nas estantes (folhas), lado a lado, e dá para passar de uma estante à seguinte sem voltar ao corredor.</div>`},
{t:'Onde ela está', h:`
<p>Praticamente todo índice de banco de dados relacional é uma B+: MySQL/InnoDB, PostgreSQL, SQLite, SQL Server. Uma consulta como</p>
<pre>SELECT * FROM vendas WHERE data BETWEEN '2026-01-01' AND '2026-01-31';</pre>
<p>desce a árvore uma vez até a primeira data e depois percorre as folhas encadeadas até passar da última.</p>
<div class="free">Sistemas de arquivos (XFS, Btrfs, NTFS) também usam variações de B+ para diretórios e extents.</div>`}
],
codigo:{nota:'B+ com no máximo MAX = 3 chaves por nó: busca, inserção com divisão e consulta por intervalo.',
c:`#include <stdio.h>
#include <stdlib.h>
#define MAX 3

typedef struct No {
    int folha, n;
    int chave[MAX + 1];                 /* +1: espaço para estourar */
    struct No *filho[MAX + 2];
    struct No *prox;                    /* só nas folhas */
} No;

No *novo(int folha) { No *x = calloc(1, sizeof(No)); x->folha = folha; return x; }

static int indice_filho(No *x, int k) { /* primeira chave > k */
    int i = 0;
    while (i < x->n && k >= x->chave[i]) i++;
    return i;
}

No *folha_de(No *x, int k) {
    while (!x->folha) x = x->filho[indice_filho(x, k)];
    return x;
}

int buscar(No *raiz, int k) {
    No *f = folha_de(raiz, k);
    for (int i = 0; i < f->n; i++) if (f->chave[i] == k) return 1;
    return 0;
}

/* insere em x; se x estourar, devolve o novo irmão e a chave separadora */
No *inserir_rec(No *x, int k, int *sep) {
    if (x->folha) {
        int i = x->n;
        while (i > 0 && x->chave[i - 1] > k) { x->chave[i] = x->chave[i - 1]; i--; }
        x->chave[i] = k; x->n++;
        if (x->n <= MAX) return NULL;
        No *z = novo(1);
        int m = x->n / 2;
        z->n = x->n - m;
        for (int j = 0; j < z->n; j++) z->chave[j] = x->chave[m + j];
        x->n = m;
        z->prox = x->prox; x->prox = z;
        *sep = z->chave[0];                       /* copiada para cima */
        return z;
    }
    int i = indice_filho(x, k), s;
    No *novo_filho = inserir_rec(x->filho[i], k, &s);
    if (!novo_filho) return NULL;
    for (int j = x->n; j > i; j--) { x->chave[j] = x->chave[j - 1]; x->filho[j + 1] = x->filho[j]; }
    x->chave[i] = s; x->filho[i + 1] = novo_filho; x->n++;
    if (x->n <= MAX) return NULL;
    No *z = novo(0);
    int m = x->n / 2;
    *sep = x->chave[m];                           /* sobe e sai do nó */
    z->n = x->n - m - 1;
    for (int j = 0; j < z->n; j++) z->chave[j] = x->chave[m + 1 + j];
    for (int j = 0; j <= z->n; j++) z->filho[j] = x->filho[m + 1 + j];
    x->n = m;
    return z;
}

No *inserir(No *raiz, int k) {
    if (buscar(raiz, k)) return raiz;
    int sep;
    No *z = inserir_rec(raiz, k, &sep);
    if (!z) return raiz;
    No *r = novo(0);                              /* nova raiz */
    r->n = 1; r->chave[0] = sep; r->filho[0] = raiz; r->filho[1] = z;
    return r;
}

void intervalo(No *raiz, int a, int b) {
    for (No *f = folha_de(raiz, a); f; f = f->prox)
        for (int i = 0; i < f->n; i++) {
            if (f->chave[i] > b) return;
            if (f->chave[i] >= a) printf("%d ", f->chave[i]);
        }
}

void liberar(No *x) {
    if (!x->folha) for (int i = 0; i <= x->n; i++) liberar(x->filho[i]);
    free(x);
}

int main(void) {
    No *raiz = novo(1);
    int ks[] = {10, 20, 30, 25, 5, 15, 40, 35, 50, 45};
    for (int i = 0; i < 10; i++) raiz = inserir(raiz, ks[i]);
    printf("intervalo [15, 40]: ");
    intervalo(raiz, 15, 40);                      /* 15 20 25 30 35 40 */
    printf("| 45 %s\\n", buscar(raiz, 45) ? "achado" : "ausente");
    liberar(raiz);
    return 0;
}`,
py:`from bisect import bisect_right, insort

MAX = 3


class No:
    def __init__(self, folha):
        self.folha = folha
        self.chaves = []
        self.filhos = []
        self.prox = None


def folha_de(x, k):
    while not x.folha:
        x = x.filhos[bisect_right(x.chaves, k)]
    return x


def buscar(raiz, k):
    return k in folha_de(raiz, k).chaves


def _inserir(x, k):
    """Insere k em x; se x estourar, devolve (separador, novo_irmao)."""
    if x.folha:
        insort(x.chaves, k)
        if len(x.chaves) <= MAX:
            return None
        m = len(x.chaves) // 2
        z = No(True)
        z.chaves, x.chaves = x.chaves[m:], x.chaves[:m]
        z.prox, x.prox = x.prox, z
        return z.chaves[0], z                 # copiada para cima
    i = bisect_right(x.chaves, k)
    r = _inserir(x.filhos[i], k)
    if r is None:
        return None
    sep, novo_filho = r
    x.chaves.insert(i, sep)
    x.filhos.insert(i + 1, novo_filho)
    if len(x.chaves) <= MAX:
        return None
    m = len(x.chaves) // 2
    z = No(False)
    sobe = x.chaves[m]                        # sobe e sai do nó
    z.chaves, z.filhos = x.chaves[m + 1:], x.filhos[m + 1:]
    x.chaves, x.filhos = x.chaves[:m], x.filhos[:m + 1]
    return sobe, z


def inserir(raiz, k):
    if buscar(raiz, k):
        return raiz
    r = _inserir(raiz, k)
    if r is None:
        return raiz
    nova = No(False)
    nova.chaves = [r[0]]
    nova.filhos = [raiz, r[1]]
    return nova


def intervalo(raiz, a, b):
    saida, f = [], folha_de(raiz, a)
    while f:
        for k in f.chaves:
            if k > b:
                return saida
            if k >= a:
                saida.append(k)
        f = f.prox
    return saida


raiz = No(True)
for k in (10, 20, 30, 25, 5, 15, 40, 35, 50, 45):
    raiz = inserir(raiz, k)
print("intervalo [15, 40]:", intervalo(raiz, 15, 40), "| 45 achado?", buscar(raiz, 45))`},
custo:[['Buscar','O(log n)','Sempre até uma folha'],['Inserir / remover','O(log n)',''],['Consulta por intervalo','O(log n + k)','k = quantidade de resultados'],['Percorrer tudo em ordem','O(n)','Só pela lista de folhas']],
pratica:[
{t:'Divida uma folha', d:'Comece com <b>↺ Nova árvore aleatória</b> e insira até uma folha estourar.', obs:'A chave que foi para o pai continua na folha? Compare com a árvore B.'},
{t:'Divida um nó interno', d:'Continue inserindo até um nó interno estourar.', obs:'Agora a chave do meio continua no nó ou sai dele?'},
{t:'Consulta por intervalo', d:'Use <b>🔗 Buscar intervalo</b> com uma faixa que cubra várias folhas.', obs:'Quantos nós internos foram visitados? E quantas folhas?'},
{t:'Busque uma chave que está num nó interno', d:'Busque um valor que aparece como separador.', obs:'A busca parou no nó interno ou desceu até a folha? Por quê?'}
],
quiz:[
{q:'Na árvore B+, onde ficam os dados?', ops:['Em todos os nós','Só na raiz','Só nas folhas','Nos nós internos'], ok:2, exp:'Os nós internos só guiam a busca.'},
{q:'Quando uma folha se divide, a chave separadora é:', ops:['Removida da folha e enviada ao pai','Copiada para o pai e mantida na folha','Descartada','Enviada ao irmão'], ok:1, exp:'O dado precisa continuar na folha.'},
{q:'Uma consulta por intervalo que devolve k resultados custa:', ops:['O(k)','O(log n + k)','O(n)','O(k log n)'], ok:1, exp:'Desce uma vez e anda pelas folhas encadeadas.'},
{q:'Por que os nós internos da B+ cabem mais chaves por bloco que os da B?', ops:['Usam compressão','Não guardam os dados, só chaves e ponteiros','Têm grau menor','Não têm ponteiros'], ok:1, exp:'Sem os registros, sobra espaço para mais chaves.'},
{q:'Qual destes sistemas usa B+ nos índices?', ops:['Redis (só hash)','PostgreSQL','Uma calculadora','O DNS'], ok:1, exp:'Os índices padrão do PostgreSQL são B+ (btree).'}
],
prog:[
{t:'Contar as chaves pelas folhas', enun:'Conte quantas chaves a árvore B+ guarda, sem recursão.', dica:'Desça sempre pelo primeiro filho até a folha mais à esquerda e depois siga <code>prox</code>.',
c:`#include <stddef.h>
typedef struct No { int folha, n; int chave[4]; struct No *filho[5]; struct No *prox; } No;

int contar(const No *raiz) {
    const No *f = raiz;
    while (!f->folha) f = f->filho[0];
    int total = 0;
    for (; f; f = f->prox) total += f->n;
    return total;
}`,
py:`def contar(raiz):
    f = raiz
    while not f.folha:
        f = f.filhos[0]
    total = 0
    while f:
        total += len(f.chaves)
        f = f.prox
    return total`},
{t:'Os k menores', enun:'Devolva as <code>k</code> menores chaves da árvore em ordem crescente.', dica:'Comece na folha mais à esquerda e pare quando tiver coletado k chaves.',
c:`#include <stddef.h>
typedef struct No { int folha, n; int chave[4]; struct No *filho[5]; struct No *prox; } No;

int k_menores(const No *raiz, int k, int *saida) {
    const No *f = raiz;
    while (!f->folha) f = f->filho[0];
    int c = 0;
    for (; f && c < k; f = f->prox)
        for (int i = 0; i < f->n && c < k; i++) saida[c++] = f->chave[i];
    return c;
}`,
py:`def k_menores(raiz, k):
    f = raiz
    while not f.folha:
        f = f.filhos[0]
    saida = []
    while f and len(saida) < k:
        saida.extend(f.chaves[:k - len(saida)])
        f = f.prox
    return saida`}
]
});
