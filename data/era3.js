/* Era 03: Árvores de busca */
MODS.push({
id:'bst', n:10, era:2, titulo:'Árvore Binária de Busca', sub:'Cada nó divide o espaço de busca ao meio',
viz:'viz/bst.html',
slides:[
{t:'A regra da ABB', h:`
<p class="lead">Numa árvore binária de busca, para todo nó: tudo à <b>esquerda é menor</b> e tudo à <b>direita é maior</b>. Buscar vira um jogo de "maior ou menor?".</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul>
<li>buscar, inserir e remover numa ABB;</li>
<li>tratar os três casos de remoção;</li>
<li>explicar por que a altura decide tudo: O(log n) ou O(n).</li></ul></div>
<div class="analogia"><b>Analogia</b>Adivinhar um número de 1 a 100 com dicas "maior" e "menor". Começando pelo meio, você acerta em no máximo 7 tentativas. A ABB é esse jogo guardado na memória.</div>`},
{t:'Remover: três casos', h:`
<div class="cards">
<div class="card"><b>1. Folha</b>Simplesmente remove.</div>
<div class="card"><b>2. Um filho</b>O filho ocupa o lugar do nó removido.</div>
<div class="card"><b>3. Dois filhos</b>Copia o <b>sucessor</b> (menor da subárvore direita) para o nó e remove o sucessor, que tem no máximo um filho.</div>
</div>
<p>O predecessor (maior da subárvore esquerda) também funciona. O importante é que o substituto mantenha a regra esquerda &lt; nó &lt; direita.</p>
<h3>Percurso em ordem</h3>
<p>Esquerda, nó, direita. Numa ABB, esse percurso devolve as chaves <b>em ordem crescente</b>, o que é um jeito rápido de verificar se a árvore está correta.</p>`},
{t:'O pior caso', h:`
<p>Inserir 1, 2, 3, 4, 5 nessa ordem gera uma árvore em que cada nó só tem filho à direita: uma lista encadeada disfarçada. A altura vira <code>n</code> e a busca, O(n).</p>
<pre>1
 \\
  2
   \\
    3      altura 5 com 5 nós
     \\
      4
       \\
        5</pre>
<div class="alerta">A ABB simples não se protege disso. As próximas três estruturas (AVL, rubro-negra e splay) são três respostas diferentes para esse problema.</div>`}
],
codigo:{nota:'ABB com busca, inserção, remoção (três casos) e percurso em ordem.',
c:`#include <stdio.h>
#include <stdlib.h>

typedef struct No { int chave; struct No *esq, *dir; } No;

No *novo(int k) {
    No *n = malloc(sizeof(No));
    n->chave = k; n->esq = n->dir = NULL;
    return n;
}

No *buscar(No *r, int k) {
    while (r && r->chave != k)
        r = k < r->chave ? r->esq : r->dir;
    return r;
}

No *inserir(No *r, int k) {
    if (!r) return novo(k);
    if (k < r->chave) r->esq = inserir(r->esq, k);
    else if (k > r->chave) r->dir = inserir(r->dir, k);
    return r;                              /* duplicata: ignora */
}

No *remover(No *r, int k) {
    if (!r) return NULL;
    if (k < r->chave) r->esq = remover(r->esq, k);
    else if (k > r->chave) r->dir = remover(r->dir, k);
    else {
        if (!r->esq || !r->dir) {          /* casos 1 e 2 */
            No *filho = r->esq ? r->esq : r->dir;
            free(r);
            return filho;
        }
        No *s = r->dir;                    /* caso 3: sucessor */
        while (s->esq) s = s->esq;
        r->chave = s->chave;
        r->dir = remover(r->dir, s->chave);
    }
    return r;
}

void em_ordem(No *r) {
    if (!r) return;
    em_ordem(r->esq); printf("%d ", r->chave); em_ordem(r->dir);
}

void liberar(No *r) { if (r) { liberar(r->esq); liberar(r->dir); free(r); } }

int main(void) {
    int ks[] = {50, 30, 70, 20, 40, 60, 80};
    No *raiz = NULL;
    for (int i = 0; i < 7; i++) raiz = inserir(raiz, ks[i]);
    raiz = remover(raiz, 30);               /* dois filhos */
    em_ordem(raiz);                         /* 20 40 50 60 70 80 */
    printf("| 60 %s\\n", buscar(raiz, 60) ? "achado" : "ausente");
    liberar(raiz);
    return 0;
}`,
py:`class No:
    def __init__(self, chave):
        self.chave = chave
        self.esq = self.dir = None


def buscar(r, k):
    while r is not None and r.chave != k:
        r = r.esq if k < r.chave else r.dir
    return r


def inserir(r, k):
    if r is None:
        return No(k)
    if k < r.chave:
        r.esq = inserir(r.esq, k)
    elif k > r.chave:
        r.dir = inserir(r.dir, k)
    return r


def remover(r, k):
    if r is None:
        return None
    if k < r.chave:
        r.esq = remover(r.esq, k)
    elif k > r.chave:
        r.dir = remover(r.dir, k)
    else:
        if r.esq is None:
            return r.dir
        if r.dir is None:
            return r.esq
        s = r.dir                      # sucessor
        while s.esq is not None:
            s = s.esq
        r.chave = s.chave
        r.dir = remover(r.dir, s.chave)
    return r


def em_ordem(r, saida):
    if r:
        em_ordem(r.esq, saida)
        saida.append(r.chave)
        em_ordem(r.dir, saida)
    return saida


raiz = None
for k in (50, 30, 70, 20, 40, 60, 80):
    raiz = inserir(raiz, k)
raiz = remover(raiz, 30)
print(em_ordem(raiz, []), "| 60 achado?", buscar(raiz, 60) is not None)`},
custo:[['Buscar / inserir / remover','O(h)','h = altura'],['Caso médio (chaves aleatórias)','O(log n)','h ≈ 1,39 log₂ n'],['Pior caso (chaves ordenadas)','O(n)','A árvore vira lista'],['Percurso em ordem','O(n)','Visita cada nó uma vez']],
pratica:[
{t:'Construa uma árvore aleatória', d:'Use <b>↺ Nova árvore aleatória</b> e busque um valor que existe.', obs:'Quantas comparações foram feitas? Compare com a altura mostrada no medidor.'},
{t:'Remova nos três casos', d:'Remova uma folha, depois um nó com um filho, depois um nó com dois filhos.', obs:'No terceiro caso, qual nó subiu para ocupar o lugar? Ele era mesmo o menor da subárvore direita?'},
{t:'Degenere a árvore', d:'Clique em <b>⚠ Sequência ordenada (pior caso)</b>.', obs:'Qual é a altura agora? Quantas comparações uma busca pelo maior valor precisa?'},
{t:'Insira um valor repetido', d:'Tente inserir uma chave que já existe.', obs:'O que o visualizador faz com duplicatas? O código ao lado faz o mesmo?'}
],
quiz:[
{q:'Inserindo 50, 30, 70, 20, 40 nessa ordem, qual é o filho esquerdo de 30?', ops:['20','40','50','Nenhum'], ok:0, exp:'20 &lt; 50 vai à esquerda, e 20 &lt; 30 vai à esquerda de 30.'},
{q:'O percurso em ordem de uma ABB devolve as chaves:', ops:['Na ordem de inserção','Em ordem crescente','Por nível','Em ordem aleatória'], ok:1, exp:'Esquerda (menores), nó, direita (maiores).'},
{q:'Ao remover um nó com dois filhos, o sucessor é:', ops:['O pai do nó','O maior da subárvore esquerda','O menor da subárvore direita','A raiz'], ok:2, exp:'É a menor chave maior que a removida.'},
{q:'Qual sequência de inserção gera o pior caso?', ops:['50, 25, 75, 10','10, 20, 30, 40','40, 20, 60, 10','Qualquer uma'], ok:1, exp:'Chaves já ordenadas criam uma árvore torta para a direita.'},
{q:'Altura mínima de uma ABB com 15 nós (contando níveis):', ops:['3','4','8','15'], ok:1, exp:'Uma árvore cheia com 4 níveis tem 1 + 2 + 4 + 8 = 15 nós.'}
],
prog:[
{t:'Altura da árvore', enun:'Escreva uma função que devolve a altura da árvore (número de níveis; árvore vazia tem altura 0).', dica:'Altura = 1 + o maior entre a altura da esquerda e a da direita.',
c:`#include <stddef.h>
typedef struct No { int chave; struct No *esq, *dir; } No;

int altura(const No *r) {
    if (!r) return 0;
    int he = altura(r->esq), hd = altura(r->dir);
    return 1 + (he > hd ? he : hd);
}`,
py:`def altura(r):
    if r is None:
        return 0
    return 1 + max(altura(r.esq), altura(r.dir))`},
{t:'É mesmo uma ABB?', enun:'Dada uma árvore binária qualquer, diga se ela respeita a regra da ABB.', dica:'Não basta comparar com os filhos diretos. Passe um intervalo (mínimo, máximo) permitido para cada subárvore.',
c:`#include <limits.h>
#include <stddef.h>
typedef struct No { int chave; struct No *esq, *dir; } No;

static int valida(const No *r, long min, long max) {
    if (!r) return 1;
    if (r->chave <= min || r->chave >= max) return 0;
    return valida(r->esq, min, r->chave) && valida(r->dir, r->chave, max);
}

int eh_abb(const No *r) { return valida(r, LONG_MIN, LONG_MAX); }`,
py:`def eh_abb(r, minimo=float("-inf"), maximo=float("inf")):
    if r is None:
        return True
    if not minimo < r.chave < maximo:
        return False
    return eh_abb(r.esq, minimo, r.chave) and eh_abb(r.dir, r.chave, maximo)`}
]
});

MODS.push({
id:'avl', n:11, era:2, titulo:'Árvore AVL', sub:'Rotações mantêm a altura em O(log n)',
viz:'viz/avl.html',
slides:[
{t:'Balanceamento estrito', h:`
<p class="lead">A AVL (Adelson-Velsky e Landis, 1962) guarda em cada nó o <b>fator de balanceamento</b>: altura da esquerda menos altura da direita. Ele só pode ser <b>−1, 0 ou +1</b>.</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul>
<li>calcular o fator de balanceamento;</li>
<li>identificar os casos LL, RR, LR e RL;</li>
<li>aplicar rotações simples e duplas.</li></ul></div>
<div class="analogia"><b>Analogia</b>Um móbile de berço: quando um lado fica pesado demais, você gira o ponto de apoio para redistribuir o peso, sem tirar nenhuma peça.</div>`},
{t:'Os quatro casos', h:`
<table class="cmp"><tr><th>Caso</th><th>Situação</th><th>Correção</th></tr>
<tr><td>LL</td><td>FB = +2 e inseriu na esquerda da esquerda</td><td>Rotação simples à direita</td></tr>
<tr><td>RR</td><td>FB = −2 e inseriu na direita da direita</td><td>Rotação simples à esquerda</td></tr>
<tr><td>LR</td><td>FB = +2 e inseriu na direita da esquerda</td><td>Esquerda no filho, depois direita no nó</td></tr>
<tr><td>RL</td><td>FB = −2 e inseriu na esquerda da direita</td><td>Direita no filho, depois esquerda no nó</td></tr></table>
<h3>Rotação à direita em y</h3>
<pre>      y              x
     / \\            / \\
    x   C   →     A   y
   / \\                / \\
  A   B              B   C</pre>
<p>Só três ponteiros mudam e a ordem A &lt; x &lt; B &lt; y &lt; C é preservada.</p>`},
{t:'Custo e comparação', h:`
<p>A altura de uma AVL com n nós é no máximo cerca de <b>1,44 log₂ n</b>. Busca, inserção e remoção são O(log n) no pior caso.</p>
<div class="cards">
<div class="card"><b>Inserção</b>No máximo uma rotação (simples ou dupla) resolve.</div>
<div class="card"><b>Remoção</b>Pode exigir rotações em vários níveis, até a raiz.</div>
<div class="card"><b>Quando escolher</b>Muitas buscas e poucas alterações: a AVL é mais baixa que a rubro-negra.</div>
</div>`}
],
codigo:{nota:'Inserção AVL com atualização de altura e os quatro casos de rotação.',
c:`#include <stdio.h>
#include <stdlib.h>

typedef struct No { int chave, alt; struct No *esq, *dir; } No;

int alt(No *n) { return n ? n->alt : 0; }
int maior(int a, int b) { return a > b ? a : b; }
void atualiza(No *n) { n->alt = 1 + maior(alt(n->esq), alt(n->dir)); }
int fb(No *n) { return alt(n->esq) - alt(n->dir); }

No *rot_dir(No *y) {
    No *x = y->esq;
    y->esq = x->dir;
    x->dir = y;
    atualiza(y); atualiza(x);
    return x;
}

No *rot_esq(No *x) {
    No *y = x->dir;
    x->dir = y->esq;
    y->esq = x;
    atualiza(x); atualiza(y);
    return y;
}

No *balancear(No *n) {
    atualiza(n);
    if (fb(n) > 1) {                       /* pesado à esquerda */
        if (fb(n->esq) < 0) n->esq = rot_esq(n->esq);   /* LR */
        return rot_dir(n);                               /* LL */
    }
    if (fb(n) < -1) {                      /* pesado à direita */
        if (fb(n->dir) > 0) n->dir = rot_dir(n->dir);   /* RL */
        return rot_esq(n);                               /* RR */
    }
    return n;
}

No *inserir(No *r, int k) {
    if (!r) {
        No *n = malloc(sizeof(No));
        n->chave = k; n->alt = 1; n->esq = n->dir = NULL;
        return n;
    }
    if (k < r->chave) r->esq = inserir(r->esq, k);
    else if (k > r->chave) r->dir = inserir(r->dir, k);
    else return r;
    return balancear(r);
}

void pre_ordem(No *r) {
    if (!r) return;
    printf("%d(fb %d) ", r->chave, fb(r));
    pre_ordem(r->esq); pre_ordem(r->dir);
}

void liberar(No *r) { if (r) { liberar(r->esq); liberar(r->dir); free(r); } }

int main(void) {
    No *raiz = NULL;
    for (int k = 1; k <= 7; k++) raiz = inserir(raiz, k);  /* pior caso da ABB */
    pre_ordem(raiz);
    printf("| altura %d\\n", alt(raiz));                    /* 3, não 7 */
    liberar(raiz);
    return 0;
}`,
py:`class No:
    def __init__(self, chave):
        self.chave = chave
        self.alt = 1
        self.esq = self.dir = None


def alt(n):
    return n.alt if n else 0


def atualiza(n):
    n.alt = 1 + max(alt(n.esq), alt(n.dir))


def fb(n):
    return alt(n.esq) - alt(n.dir)


def rot_dir(y):
    x = y.esq
    y.esq, x.dir = x.dir, y
    atualiza(y); atualiza(x)
    return x


def rot_esq(x):
    y = x.dir
    x.dir, y.esq = y.esq, x
    atualiza(x); atualiza(y)
    return y


def balancear(n):
    atualiza(n)
    if fb(n) > 1:
        if fb(n.esq) < 0:
            n.esq = rot_esq(n.esq)     # LR
        return rot_dir(n)              # LL
    if fb(n) < -1:
        if fb(n.dir) > 0:
            n.dir = rot_dir(n.dir)     # RL
        return rot_esq(n)              # RR
    return n


def inserir(r, k):
    if r is None:
        return No(k)
    if k < r.chave:
        r.esq = inserir(r.esq, k)
    elif k > r.chave:
        r.dir = inserir(r.dir, k)
    else:
        return r
    return balancear(r)


def pre_ordem(r, s):
    if r:
        s.append(f"{r.chave}(fb {fb(r)})")
        pre_ordem(r.esq, s); pre_ordem(r.dir, s)
    return s


raiz = None
for k in range(1, 8):
    raiz = inserir(raiz, k)
print(" ".join(pre_ordem(raiz, [])), "| altura", alt(raiz))`},
custo:[['Buscar','O(log n)','Altura ≤ 1,44 log₂ n'],['Inserir','O(log n)','No máximo 1 rotação (simples ou dupla)'],['Remover','O(log n)','Até O(log n) rotações'],['Rotação','O(1)','3 ponteiros + 2 alturas']],
pratica:[
{t:'Provoque um caso RR', d:'Comece vazia e insira 10, 20, 30.', obs:'Em qual nó o fator chegou a −2? Qual rotação aconteceu?'},
{t:'Provoque um caso LR', d:'Nova árvore: insira 30, 10, 20.', obs:'Por que uma rotação simples não resolveria? Acompanhe as duas rotações.'},
{t:'Insira 1 a 7 em ordem', d:'Insira as chaves de 1 a 7, uma por uma.', obs:'Compare a altura final com a ABB do módulo anterior para a mesma sequência.'},
{t:'Remova e acompanhe a subida', d:'Numa árvore aleatória, remova uma folha do lado mais baixo.', obs:'A correção acontece em mais de um nível? Em quais?'}
],
quiz:[
{q:'Quais valores o fator de balanceamento pode ter numa AVL válida?', ops:['0 e 1','−1, 0 e +1','−2 a +2','Qualquer inteiro'], ok:1, exp:'A diferença de alturas entre as subárvores é no máximo 1.'},
{q:'Inserindo 10, 20, 30 numa AVL vazia, qual rotação ocorre?', ops:['Direita (LL)','Esquerda (RR)','Dupla LR','Nenhuma'], ok:1, exp:'O nó 10 fica com FB −2 e a inserção foi na direita da direita.'},
{q:'Inserindo 30, 10, 20, qual é o caso?', ops:['LL','RR','LR','RL'], ok:2, exp:'30 fica com FB +2 e 20 entrou na direita do filho esquerdo.'},
{q:'Depois de inserir 1 a 7 em ordem numa AVL, qual é a raiz?', ops:['1','4','7','3'], ok:1, exp:'A AVL fica perfeitamente balanceada com 4 na raiz.'},
{q:'Quantos ponteiros mudam numa rotação, contando o do pai da subárvore?', ops:['1','2','3','Depende da altura'], ok:2, exp:'Na rotação à direita mudam <code>y-&gt;esq</code>, <code>x-&gt;dir</code> e o ponteiro do pai, que passa a apontar para x.'}
],
prog:[
{t:'Verificar se é AVL', enun:'Dada uma árvore binária, diga se ela está balanceada no sentido AVL, em O(n).', dica:'Devolva a altura da subárvore, ou −1 se ela já estiver desbalanceada, para não recalcular alturas.',
c:`#include <stdlib.h>
typedef struct No { int chave, alt; struct No *esq, *dir; } No;

static int checa(const No *r) {           /* altura, ou -1 se inválida */
    if (!r) return 0;
    int he = checa(r->esq); if (he < 0) return -1;
    int hd = checa(r->dir); if (hd < 0) return -1;
    if (abs(he - hd) > 1) return -1;
    return 1 + (he > hd ? he : hd);
}

int eh_avl(const No *r) { return checa(r) >= 0; }`,
py:`def eh_avl(r):
    def checa(n):
        if n is None:
            return 0
        he = checa(n.esq)
        if he < 0:
            return -1
        hd = checa(n.dir)
        if hd < 0 or abs(he - hd) > 1:
            return -1
        return 1 + max(he, hd)
    return checa(r) >= 0`},
{t:'Contar rotações', enun:'Modifique a inserção para contar quantas rotações simples foram feitas no total (uma dupla conta como duas). Teste inserindo 1 a 15 em ordem.', dica:'Uma variável global (C) ou um atributo/contador externo (Python) incrementado dentro de <code>rot_esq</code> e <code>rot_dir</code>.',
c:`/* Acrescente ao código do módulo: */
int rotacoes = 0;
/* e no início de rot_dir e de rot_esq:  rotacoes++;
   Inserindo 1..15 em ordem, rotacoes termina em 11. */`,
py:`# Acrescente ao código do módulo:
rotacoes = 0
# e em rot_dir e rot_esq:
#     global rotacoes
#     rotacoes += 1
# Inserindo 1..15 em ordem, rotacoes termina em 11.`}
]
});

MODS.push({
id:'rubro-negra', n:12, era:2, titulo:'Árvore Rubro-Negra', sub:'Equilíbrio por cores, com menos rotações',
viz:'viz/rubro-negra.html',
slides:[
{t:'As cinco regras', h:`
<p class="lead">Em vez de alturas exatas, cada nó tem uma <b>cor</b>. Cinco regras garantem que o caminho mais longo nunca passa do dobro do mais curto.</p>
<ol>
<li>Todo nó é vermelho ou preto.</li>
<li>A raiz é preta.</li>
<li>Toda folha nula (NIL) é preta.</li>
<li>Um nó vermelho não tem filho vermelho.</li>
<li>Todo caminho de um nó até as folhas NIL passa pelo <b>mesmo número de nós pretos</b>.</li>
</ol>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>verificar as regras numa árvore;</li><li>corrigir uma inserção com recoloração e rotação;</li><li>comparar a rubro-negra com a AVL.</li></ul></div>`},
{t:'Corrigindo a inserção', h:`
<p>Todo nó novo entra <b>vermelho</b> (isso nunca quebra a regra 5). Se o pai também for vermelho, a regra 4 quebra. Olhe o <b>tio</b>:</p>
<div class="cards">
<div class="card"><b>Tio vermelho</b>Recolore: pai e tio ficam pretos, avô fica vermelho. O problema pode subir para o avô.</div>
<div class="card"><b>Tio preto, "joelho"</b>O nó está do lado de dentro: rotaciona no pai para virar o caso "linha".</div>
<div class="card"><b>Tio preto, "linha"</b>Rotaciona no avô e troca as cores de pai e avô. Resolvido.</div>
</div>
<p>No final, a raiz é pintada de preto.</p>`},
{t:'Rubro-negra × AVL', h:`
<table class="cmp"><tr><th></th><th>AVL</th><th>Rubro-negra</th></tr>
<tr><td>Altura máxima</td><td>≈ 1,44 log₂ n</td><td>≤ 2 log₂(n+1)</td></tr>
<tr><td>Rotações na inserção</td><td>até 2</td><td>até 2</td></tr>
<tr><td>Rotações na remoção</td><td>até O(log n)</td><td>até 3</td></tr>
<tr><td>Melhor para</td><td>Muitas buscas</td><td>Muitas inserções e remoções</td></tr></table>
<div class="free">É a árvore por trás do <code>std::map</code> do C++, do <code>TreeMap</code> do Java e do escalonador CFS do Linux.</div>`}
],
codigo:{nota:'Inserção rubro-negra com ponteiro para o pai e os três casos de correção.',
c:`#include <stdio.h>
#include <stdlib.h>

enum { VERMELHO, PRETO };
typedef struct No { int chave, cor; struct No *esq, *dir, *pai; } No;

static No *raiz = NULL;

static void rot_esq(No *x) {
    No *y = x->dir;
    x->dir = y->esq;
    if (y->esq) y->esq->pai = x;
    y->pai = x->pai;
    if (!x->pai) raiz = y;
    else if (x == x->pai->esq) x->pai->esq = y;
    else x->pai->dir = y;
    y->esq = x; x->pai = y;
}

static void rot_dir(No *x) {
    No *y = x->esq;
    x->esq = y->dir;
    if (y->dir) y->dir->pai = x;
    y->pai = x->pai;
    if (!x->pai) raiz = y;
    else if (x == x->pai->dir) x->pai->dir = y;
    else x->pai->esq = y;
    y->dir = x; x->pai = y;
}

static int cor(No *n) { return n ? n->cor : PRETO; }   /* NIL é preto */

static void corrigir(No *z) {
    while (cor(z->pai) == VERMELHO) {
        No *p = z->pai, *avo = p->pai;
        if (p == avo->esq) {
            No *tio = avo->dir;
            if (cor(tio) == VERMELHO) {                 /* recolore */
                p->cor = tio->cor = PRETO; avo->cor = VERMELHO; z = avo;
            } else {
                if (z == p->dir) { z = p; rot_esq(z); p = z->pai; } /* joelho */
                p->cor = PRETO; avo->cor = VERMELHO; rot_dir(avo);  /* linha */
            }
        } else {                                        /* espelhado */
            No *tio = avo->esq;
            if (cor(tio) == VERMELHO) {
                p->cor = tio->cor = PRETO; avo->cor = VERMELHO; z = avo;
            } else {
                if (z == p->esq) { z = p; rot_dir(z); p = z->pai; }
                p->cor = PRETO; avo->cor = VERMELHO; rot_esq(avo);
            }
        }
    }
    raiz->cor = PRETO;
}

void inserir(int k) {
    No *pai = NULL, *at = raiz;
    while (at) {
        pai = at;
        if (k == at->chave) return;
        at = k < at->chave ? at->esq : at->dir;
    }
    No *z = malloc(sizeof(No));
    z->chave = k; z->cor = VERMELHO; z->esq = z->dir = NULL; z->pai = pai;
    if (!pai) raiz = z;
    else if (k < pai->chave) pai->esq = z;
    else pai->dir = z;
    corrigir(z);
}

static void pre_ordem(No *r) {
    if (!r) return;
    printf("%d%c ", r->chave, r->cor == PRETO ? 'P' : 'V');
    pre_ordem(r->esq); pre_ordem(r->dir);
}

static void liberar(No *r) { if (r) { liberar(r->esq); liberar(r->dir); free(r); } }

int main(void) {
    for (int k = 1; k <= 8; k++) inserir(k);
    pre_ordem(raiz); printf("\\n");     /* 4P 2V 1P 3P 6V 5P 7P 8V */
    liberar(raiz);
    return 0;
}`,
py:`VERMELHO, PRETO = "V", "P"


class No:
    def __init__(self, chave, pai=None):
        self.chave, self.cor = chave, VERMELHO
        self.esq = self.dir = None
        self.pai = pai


def cor(n):
    return n.cor if n else PRETO          # NIL é preto


class RubroNegra:
    def __init__(self):
        self.raiz = None

    def _troca_no_pai(self, x, y):
        y.pai = x.pai
        if x.pai is None:
            self.raiz = y
        elif x is x.pai.esq:
            x.pai.esq = y
        else:
            x.pai.dir = y

    def _rot_esq(self, x):
        y = x.dir
        x.dir = y.esq
        if y.esq:
            y.esq.pai = x
        self._troca_no_pai(x, y)
        y.esq, x.pai = x, y

    def _rot_dir(self, x):
        y = x.esq
        x.esq = y.dir
        if y.dir:
            y.dir.pai = x
        self._troca_no_pai(x, y)
        y.dir, x.pai = x, y

    def inserir(self, k):
        pai, at = None, self.raiz
        while at:
            if k == at.chave:
                return
            pai, at = at, (at.esq if k < at.chave else at.dir)
        z = No(k, pai)
        if pai is None:
            self.raiz = z
        elif k < pai.chave:
            pai.esq = z
        else:
            pai.dir = z
        self._corrigir(z)

    def _corrigir(self, z):
        while cor(z.pai) == VERMELHO:
            p = z.pai
            avo = p.pai
            esquerda = p is avo.esq
            tio = avo.dir if esquerda else avo.esq
            if cor(tio) == VERMELHO:                     # recolore
                p.cor = tio.cor = PRETO
                avo.cor = VERMELHO
                z = avo
                continue
            if esquerda and z is p.dir:                  # joelho
                z = p; self._rot_esq(z); p = z.pai
            elif not esquerda and z is p.esq:
                z = p; self._rot_dir(z); p = z.pai
            p.cor, avo.cor = PRETO, VERMELHO             # linha
            self._rot_dir(avo) if esquerda else self._rot_esq(avo)
        self.raiz.cor = PRETO


def pre_ordem(n, s):
    if n:
        s.append(f"{n.chave}{n.cor}")
        pre_ordem(n.esq, s); pre_ordem(n.dir, s)
    return s


t = RubroNegra()
for k in range(1, 9):
    t.inserir(k)
print(" ".join(pre_ordem(t.raiz, [])))   # 4P 2V 1P 3P 6V 5P 7P 8V`},
custo:[['Buscar','O(log n)','Altura ≤ 2 log₂(n+1)'],['Inserir','O(log n)','O(log n) recolorações + até 2 rotações'],['Remover','O(log n)','Até 3 rotações'],['Memória extra','1 bit de cor','+ ponteiro para o pai, em geral']],
pratica:[
{t:'Caso tio vermelho', d:'Insira 10, 5, 15 e depois 1.', obs:'Houve rotação ou só recoloração? Quem mudou de cor?'},
{t:'Caso linha', d:'Árvore nova: insira 10, 5 e 1.', obs:'Qual rotação aconteceu e em qual nó? Que cores pai e avô terminaram?'},
{t:'Caso joelho', d:'Árvore nova: insira 10, 5 e 7.', obs:'Por que foram necessárias duas rotações?'},
{t:'Confira as regras', d:'Gere uma árvore aleatória e escolha uma folha qualquer.', obs:'Conte os nós pretos da raiz até duas folhas diferentes. Os números batem (regra 5)?'}
],
quiz:[
{q:'Com que cor um nó novo é inserido?', ops:['Preto','Vermelho','A cor do pai','A cor do tio'], ok:1, exp:'Vermelho não altera a contagem de pretos (regra 5); no máximo quebra a regra 4, que é corrigível localmente.'},
{q:'Se o pai e o tio do nó novo são vermelhos, o que se faz?', ops:['Rotação no avô','Recoloração: pai e tio pretos, avô vermelho','Remove o nó','Nada'], ok:1, exp:'É o caso de recoloração; o problema pode subir para o avô.'},
{q:'Qual regra garante que o caminho mais longo não passa do dobro do mais curto?', ops:['Só a 2','As regras 4 e 5 juntas','Só a 1','Só a 3'], ok:1, exp:'Caminhos têm a mesma quantidade de pretos e não podem ter dois vermelhos seguidos.'},
{q:'Em relação à AVL, a rubro-negra costuma ser:', ops:['Mais baixa','Mais alta, mas com menos rotações em remoções','Igual em tudo','Mais lenta para inserir'], ok:1, exp:'Ela tolera mais desequilíbrio em troca de manutenção mais barata.'},
{q:'A raiz de uma árvore rubro-negra é sempre:', ops:['Vermelha','Preta','Da cor do último inserido','Sem cor'], ok:1, exp:'Regra 2; a correção sempre termina pintando a raiz de preto.'}
],
prog:[
{t:'Validar as regras 4 e 5', enun:'Escreva uma função que devolve a "altura negra" da árvore (quantos nós pretos há de um nó até as folhas, contando a folha NIL como 1) ou −1 se alguma das regras 4 ou 5 for violada.', dica:'Recursão: calcule a altura negra das duas subárvores; se forem diferentes ou se houver vermelho com filho vermelho, devolva −1.',
c:`#include <stddef.h>
enum { VERMELHO, PRETO };
typedef struct No { int chave, cor; struct No *esq, *dir, *pai; } No;

int altura_negra(const No *n) {
    if (!n) return 1;                              /* NIL é preto */
    if (n->cor == VERMELHO &&
        ((n->esq && n->esq->cor == VERMELHO) || (n->dir && n->dir->cor == VERMELHO)))
        return -1;                                 /* regra 4 */
    int e = altura_negra(n->esq), d = altura_negra(n->dir);
    if (e < 0 || d < 0 || e != d) return -1;       /* regra 5 */
    return e + (n->cor == PRETO);
}`,
py:`def altura_negra(n):
    if n is None:
        return 1
    if n.cor == "V" and any(f and f.cor == "V" for f in (n.esq, n.dir)):
        return -1
    e, d = altura_negra(n.esq), altura_negra(n.dir)
    if e < 0 or d < 0 or e != d:
        return -1
    return e + (n.cor == "P")`},
{t:'Contar nós vermelhos', enun:'Insira as chaves de 1 a 100 em ordem e conte quantos nós terminam vermelhos.', dica:'Percorra a árvore e some 1 para cada nó com cor vermelha. Compare o resultado com colegas: deve ser o mesmo para a mesma sequência.',
c:`#include <stddef.h>
enum { VERMELHO, PRETO };
typedef struct No { int chave, cor; struct No *esq, *dir, *pai; } No;

int vermelhos(const No *n) {
    if (!n) return 0;
    return (n->cor == VERMELHO) + vermelhos(n->esq) + vermelhos(n->dir);
}`,
py:`def vermelhos(n):
    if n is None:
        return 0
    return (n.cor == "V") + vermelhos(n.esq) + vermelhos(n.dir)`}
]
});

MODS.push({
id:'splay', n:13, era:2, titulo:'Árvore Splay', sub:'O último acessado sobe para a raiz',
viz:'viz/splay.html',
slides:[
{t:'Auto-ajuste em vez de regras', h:`
<p class="lead">A splay não guarda altura nem cor. A cada acesso (busca, inserção ou remoção), o nó acessado é levado até a raiz por uma sequência de rotações chamada <b>splay</b>.</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>aplicar zig, zig-zig e zig-zag;</li><li>entender o custo <b>amortizado</b> O(log n);</li><li>reconhecer quando a localidade de acesso favorece a splay.</li></ul></div>
<div class="analogia"><b>Analogia</b>A mesa de trabalho: o documento que você acabou de usar fica por cima da pilha. Os que você usa sempre estão sempre à mão.</div>`},
{t:'Os três movimentos', h:`
<div class="cards">
<div class="card"><b>Zig</b>O pai de x é a raiz: uma rotação simples.</div>
<div class="card"><b>Zig-zig</b>x e o pai estão do mesmo lado: rotaciona <b>primeiro o avô</b>, depois o pai.</div>
<div class="card"><b>Zig-zag</b>x e o pai estão em lados opostos: rotaciona o pai e depois o avô (como a rotação dupla da AVL).</div>
</div>
<div class="alerta"><b>Atenção ao zig-zig.</b> Rotacionar x duas vezes (pai e depois avô) também leva x à raiz, mas perde a garantia amortizada. A ordem avô-primeiro é o que achata o caminho.</div>`},
{t:'Custo amortizado', h:`
<p>Uma operação isolada pode custar O(n) (por exemplo, acessar a folha mais funda de uma árvore degenerada). Mas qualquer sequência de <b>m</b> operações custa O(m log n): em média, O(log n) cada.</p>
<div class="cards">
<div class="card"><b>Brilha em</b>Caches, compressão, roteamento: poucos itens "quentes" acessados muitas vezes.</div>
<div class="card"><b>Sofre em</b>Sistemas de tempo real, que precisam de garantia por operação, e leituras concorrentes (toda busca altera a árvore).</div>
</div>`}
],
codigo:{nota:'Splay recursivo (bottom-up) e inserção por divisão da árvore.',
c:`#include <stdio.h>
#include <stdlib.h>

typedef struct No { int chave; struct No *esq, *dir; } No;

static No *rot_dir(No *x) { No *y = x->esq; x->esq = y->dir; y->dir = x; return y; }
static No *rot_esq(No *x) { No *y = x->dir; x->dir = y->esq; y->esq = x; return y; }

/* Leva a chave k (ou o último nó visitado) até a raiz */
No *splay(No *r, int k) {
    if (!r || r->chave == k) return r;
    if (k < r->chave) {
        if (!r->esq) return r;
        if (k < r->esq->chave) {                       /* zig-zig */
            r->esq->esq = splay(r->esq->esq, k);
            r = rot_dir(r);
        } else if (k > r->esq->chave) {                /* zig-zag */
            r->esq->dir = splay(r->esq->dir, k);
            if (r->esq->dir) r->esq = rot_esq(r->esq);
        }
        return r->esq ? rot_dir(r) : r;                /* zig */
    } else {
        if (!r->dir) return r;
        if (k > r->dir->chave) {                       /* zig-zig */
            r->dir->dir = splay(r->dir->dir, k);
            r = rot_esq(r);
        } else if (k < r->dir->chave) {                /* zig-zag */
            r->dir->esq = splay(r->dir->esq, k);
            if (r->dir->esq) r->dir = rot_dir(r->dir);
        }
        return r->dir ? rot_esq(r) : r;
    }
}

No *inserir(No *r, int k) {
    if (!r) { No *n = calloc(1, sizeof(No)); n->chave = k; return n; }
    r = splay(r, k);
    if (r->chave == k) return r;
    No *n = calloc(1, sizeof(No));
    n->chave = k;
    if (k < r->chave) { n->dir = r; n->esq = r->esq; r->esq = NULL; }
    else              { n->esq = r; n->dir = r->dir; r->dir = NULL; }
    return n;
}

void liberar(No *r) { if (r) { liberar(r->esq); liberar(r->dir); free(r); } }

int main(void) {
    No *raiz = NULL;
    int ks[] = {50, 30, 70, 20, 40, 60, 80};
    for (int i = 0; i < 7; i++) raiz = inserir(raiz, ks[i]);
    printf("raiz após inserções: %d\\n", raiz->chave);   /* 80 */
    raiz = splay(raiz, 20);                             /* uma busca */
    printf("raiz após buscar 20: %d\\n", raiz->chave);   /* 20 */
    liberar(raiz);
    return 0;
}`,
py:`class No:
    def __init__(self, chave):
        self.chave = chave
        self.esq = self.dir = None


def rot_dir(x):
    y = x.esq
    x.esq, y.dir = y.dir, x
    return y


def rot_esq(x):
    y = x.dir
    x.dir, y.esq = y.esq, x
    return y


def splay(r, k):
    if r is None or r.chave == k:
        return r
    if k < r.chave:
        if r.esq is None:
            return r
        if k < r.esq.chave:                       # zig-zig
            r.esq.esq = splay(r.esq.esq, k)
            r = rot_dir(r)
        elif k > r.esq.chave:                     # zig-zag
            r.esq.dir = splay(r.esq.dir, k)
            if r.esq.dir:
                r.esq = rot_esq(r.esq)
        return rot_dir(r) if r.esq else r         # zig
    else:
        if r.dir is None:
            return r
        if k > r.dir.chave:
            r.dir.dir = splay(r.dir.dir, k)
            r = rot_esq(r)
        elif k < r.dir.chave:
            r.dir.esq = splay(r.dir.esq, k)
            if r.dir.esq:
                r.dir = rot_dir(r.dir)
        return rot_esq(r) if r.dir else r


def inserir(r, k):
    if r is None:
        return No(k)
    r = splay(r, k)
    if r.chave == k:
        return r
    n = No(k)
    if k < r.chave:
        n.dir, n.esq, r.esq = r, r.esq, None
    else:
        n.esq, n.dir, r.dir = r, r.dir, None
    return n


raiz = None
for k in (50, 30, 70, 20, 40, 60, 80):
    raiz = inserir(raiz, k)
print("raiz após inserções:", raiz.chave)   # 80
raiz = splay(raiz, 20)
print("raiz após buscar 20:", raiz.chave)   # 20`},
custo:[['Buscar / inserir / remover','O(log n) amortizado','Sequência de m operações: O(m log n)'],['Uma operação isolada','O(n) no pior caso',''],['Acessar de novo o mesmo item','O(1)','Ele já está na raiz'],['Memória extra','Nenhuma','Nem altura, nem cor']],
pratica:[
{t:'Observe a raiz mudar', d:'Gere uma árvore aleatória e busque uma folha funda.', obs:'Quem virou raiz? Quantas rotações foram feitas e de que tipo?'},
{t:'Identifique um zig-zig', d:'Busque um nó que seja filho esquerdo de um filho esquerdo.', obs:'Qual nó rotacionou primeiro: o pai ou o avô?'},
{t:'Identifique um zig-zag', d:'Busque um nó que seja filho direito de um filho esquerdo.', obs:'Compare com a rotação dupla LR da AVL.'},
{t:'Acesso repetido', d:'Busque o mesmo valor três vezes seguidas.', obs:'Quanto custou a segunda busca? E a terceira?'}
],
quiz:[
{q:'Depois de buscar a chave 20 numa splay que a contém, onde está o 20?', ops:['Na posição original','Na raiz','Numa folha','Depende da altura'], ok:1, exp:'Todo acesso leva o nó acessado à raiz.'},
{q:'No zig-zig, qual rotação acontece primeiro?', ops:['No pai','No avô','Em x','Tanto faz'], ok:1, exp:'Rotacionar o avô primeiro é o que garante o custo amortizado.'},
{q:'O custo O(log n) da splay é:', ops:['De pior caso','Amortizado','De melhor caso','Esperado com aleatoriedade'], ok:1, exp:'Uma operação pode custar O(n), mas a média numa sequência é O(log n).'},
{q:'Que informação extra a splay guarda em cada nó?', ops:['Altura','Cor','Fator de balanceamento','Nenhuma'], ok:3, exp:'O equilíbrio vem só dos movimentos de splay.'},
{q:'Em qual cenário a splay é uma má escolha?', ops:['Cache com itens quentes','Sistema de tempo real com prazo por operação','Compressão de dados','Tabela de símbolos de compilador'], ok:1, exp:'Ela não garante o custo de cada operação isoladamente.'}
],
prog:[
{t:'Buscar com splay', enun:'Escreva <code>buscar(r, k)</code> que faz o splay e informa se a chave existe. Lembre que a raiz muda.', dica:'Faça <code>r = splay(r, k)</code> e verifique se <code>r-&gt;chave == k</code>. Devolva a nova raiz.',
c:`#include <stddef.h>
typedef struct No { int chave; struct No *esq, *dir; } No;
No *splay(No *r, int k);                 /* do código do módulo */

No *buscar(No *r, int k, int *achou) {
    r = splay(r, k);
    *achou = r && r->chave == k;
    return r;                            /* nova raiz */
}`,
py:`def buscar(r, k):
    """Devolve (nova_raiz, achou)."""
    r = splay(r, k)
    return r, r is not None and r.chave == k`},
{t:'Remover por junção', enun:'Para remover k: faça splay de k; se estiver na raiz, junte as duas subárvores fazendo splay do <b>maior</b> elemento da esquerda e pendurando a direita nele.', dica:'Depois do splay do maior da esquerda, ele vira raiz da esquerda e não tem filho direito.',
c:`#include <stdlib.h>
typedef struct No { int chave; struct No *esq, *dir; } No;
No *splay(No *r, int k);

No *remover(No *r, int k) {
    if (!r) return NULL;
    r = splay(r, k);
    if (r->chave != k) return r;
    No *esq = r->esq, *dir = r->dir;
    free(r);
    if (!esq) return dir;
    esq = splay(esq, k);                 /* k é maior que todos da esquerda */
    esq->dir = dir;
    return esq;
}`,
py:`def remover(r, k):
    if r is None:
        return None
    r = splay(r, k)
    if r.chave != k:
        return r
    esq, dir_ = r.esq, r.dir
    if esq is None:
        return dir_
    esq = splay(esq, k)      # traz o maior da esquerda para a raiz
    esq.dir = dir_
    return esq`}
]
});
