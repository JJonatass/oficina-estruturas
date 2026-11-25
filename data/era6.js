/* Era 06: Estruturas especializadas */
MODS.push({
id:'trie', n:20, era:5, titulo:'Trie', sub:'Uma árvore por caractere, para buscar prefixos',
viz:'viz/trie.html',
slides:[
{t:'Prefixos compartilhados', h:`
<p class="lead">Na trie (de re<b>trie</b>val), cada aresta é um caractere e cada caminho da raiz até um nó marcado forma uma palavra. Palavras com o mesmo início <b>dividem os mesmos nós</b>.</p>
<pre>        (raiz)
         c
         a
       / | \\
      r  s  f
      ✓  a  é ✓
         ✓
   car, casa, café</pre>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>inserir, buscar e remover palavras;</li><li>diferenciar busca exata de busca por prefixo;</li><li>implementar autocompletar.</li></ul></div>
<div class="analogia"><b>Analogia</b>A agenda telefônica com abas de letras, dentro delas sub-abas para a segunda letra, e assim por diante.</div>`},
{t:'Exata × prefixo', h:`
<div class="cards">
<div class="card"><b>Busca exata</b>Segue os caracteres; no fim, o nó precisa estar <b>marcado como fim de palavra</b>. "ca" existe como caminho, mas não é palavra.</div>
<div class="card"><b>Busca por prefixo</b>Só precisa conseguir seguir o caminho todo.</div>
<div class="card"><b>Autocompletar</b>Vai até o nó do prefixo e lista todas as palavras da subárvore.</div>
<div class="card"><b>Remover</b>Desmarca o fim de palavra e <b>poda</b> os nós que ficaram sem filhos e sem marca.</div>
</div>
<p>Tudo custa O(L), onde L é o tamanho da palavra, <b>independente de quantas palavras</b> existem na trie.</p>`},
{t:'Onde se usa e o custo de memória', h:`
<div class="cards">
<div class="card"><b>Teclados de celular</b>Sugestões enquanto você digita.</div>
<div class="card"><b>Corretores ortográficos</b>Dicionários com prefixos.</div>
<div class="card"><b>Roteadores</b>Maior prefixo comum de endereços IP.</div>
</div>
<div class="alerta"><b>Memória.</b> Com um vetor de 26 filhos por nó, a maioria das posições fica vazia. Usar dicionário (hash) nos filhos ou compactar caminhos sem ramificação (árvore radix) resolve.</div>`}
],
codigo:{nota:'Trie para letras minúsculas a–z: inserir, buscar, prefixo e autocompletar.',
c:`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define ALFA 26

typedef struct No { struct No *filho[ALFA]; int fim; } No;

No *novo(void) { return calloc(1, sizeof(No)); }

void inserir(No *r, const char *p) {
    for (; *p; p++) {
        int c = *p - 'a';
        if (!r->filho[c]) r->filho[c] = novo();
        r = r->filho[c];
    }
    r->fim = 1;
}

static No *descer(No *r, const char *p) {
    for (; *p && r; p++) r = r->filho[*p - 'a'];
    return r;
}

int buscar(No *r, const char *p)  { No *n = descer(r, p); return n && n->fim; }
int prefixo(No *r, const char *p) { return descer(r, p) != NULL; }

static void listar(No *n, char *buf, int tam) {
    if (n->fim) { buf[tam] = '\\0'; printf("%s ", buf); }
    for (int c = 0; c < ALFA; c++)
        if (n->filho[c]) { buf[tam] = 'a' + c; listar(n->filho[c], buf, tam + 1); }
}

void autocompletar(No *r, const char *p) {
    char buf[64];
    No *n = descer(r, p);
    if (!n) return;
    strcpy(buf, p);
    listar(n, buf, strlen(p));
}

void liberar(No *n) {
    for (int c = 0; c < ALFA; c++) if (n->filho[c]) liberar(n->filho[c]);
    free(n);
}

int main(void) {
    No *r = novo();
    const char *ps[] = {"car", "casa", "cafe", "cama", "dado"};
    for (int i = 0; i < 5; i++) inserir(r, ps[i]);
    printf("ca é palavra? %d | ca é prefixo? %d\\n", buscar(r, "ca"), prefixo(r, "ca"));
    printf("autocompletar 'ca': ");
    autocompletar(r, "ca");                     /* cafe cama car casa */
    printf("\\n");
    liberar(r);
    return 0;
}`,
py:`class No:
    def __init__(self):
        self.filhos = {}        # dicionário: só guarda letras que existem
        self.fim = False


class Trie:
    def __init__(self):
        self.raiz = No()

    def inserir(self, palavra):
        n = self.raiz
        for c in palavra:
            n = n.filhos.setdefault(c, No())
        n.fim = True

    def _descer(self, p):
        n = self.raiz
        for c in p:
            n = n.filhos.get(c)
            if n is None:
                return None
        return n

    def buscar(self, p):
        n = self._descer(p)
        return n is not None and n.fim

    def prefixo(self, p):
        return self._descer(p) is not None

    def autocompletar(self, p):
        saida = []

        def listar(n, atual):
            if n.fim:
                saida.append(atual)
            for c in sorted(n.filhos):
                listar(n.filhos[c], atual + c)

        n = self._descer(p)
        if n:
            listar(n, p)
        return saida

    def remover(self, p):
        def rec(n, i):
            if i == len(p):
                if not n.fim:
                    return False
                n.fim = False
            else:
                f = n.filhos.get(p[i])
                if f is None or not rec(f, i + 1):
                    return False
                if not f.fim and not f.filhos:     # poda
                    del n.filhos[p[i]]
            return True
        return rec(self.raiz, 0)


t = Trie()
for w in ("car", "casa", "café", "cama", "dado"):
    t.inserir(w)
print("ca é palavra?", t.buscar("ca"), "| ca é prefixo?", t.prefixo("ca"))
print("autocompletar 'ca':", t.autocompletar("ca"))
t.remover("casa")
print("depois de remover casa:", t.autocompletar("ca"))`},
custo:[['Inserir / buscar / remover','O(L)','L = tamanho da palavra'],['Prefixo existe?','O(L)',''],['Autocompletar','O(L + saída)','Visita a subárvore do prefixo'],['Memória','O(total de caracteres)','× tamanho do nó']],
pratica:[
{t:'Veja os prefixos compartilhados', d:'Use <b>↺ Nova trie de exemplo</b> e insira uma palavra que começa igual a outra já existente.', obs:'Quantos nós novos foram criados? A partir de qual letra?'},
{t:'Exata × prefixo', d:'Busque um prefixo que não é palavra (por exemplo, as duas primeiras letras de uma palavra).', obs:'O caminho existe? Por que a busca exata responde "não"?'},
{t:'Autocompletar', d:'Use <b>✨ Autocompletar</b> com um prefixo de uma letra e depois de três.', obs:'Quantas palavras apareceram em cada caso? Que parte da árvore foi visitada?'},
{t:'Remova com poda', d:'Remova uma palavra que é prefixo de outra e, depois, uma que não compartilha nada.', obs:'Em qual caso nós foram apagados? Por quê?'}
],
quiz:[
{q:'Inserindo "sol", "solar" e "sal" numa trie vazia, quantos nós (sem contar a raiz) são criados?', ops:['11','8','7','6'], ok:2, exp:'"sol" cria s, o, l (3). "solar" reaproveita sol e cria a, r (2). "sal" reaproveita o s e cria a, l (2). Total: 7.'},
{q:'Buscar uma palavra de 5 letras numa trie com 1 milhão de palavras custa:', ops:['O(1 milhão)','O(log 1 milhão)','O(5)','O(5 × 1 milhão)'], ok:2, exp:'O custo depende só do tamanho da palavra.'},
{q:'"ca" foi inserida? A trie contém "casa" e "cama". Busca exata por "ca":', ops:['Verdadeiro','Falso'], ok:1, exp:'O caminho existe, mas o nó "a" não está marcado como fim de palavra.'},
{q:'Ao remover "casa" de uma trie que também contém "cama", quais nós somem?', ops:['c, a, s, a','s, a','só o último a','nenhum'], ok:1, exp:'"c" e "a" continuam servindo a "cama"; "s" e o último "a" ficam sem uso e são podados.'},
{q:'Qual a principal desvantagem da trie com vetor de 26 filhos?', ops:['Busca lenta','Muita memória desperdiçada','Não suporta prefixos','Não ordena'], ok:1, exp:'A maioria das 26 posições de cada nó fica vazia.'}
],
prog:[
{t:'Contar palavras com um prefixo', enun:'Devolva quantas palavras da trie começam com um prefixo dado.', dica:'Desça até o nó do prefixo e conte os nós marcados como fim na subárvore.',
c:`#include <stddef.h>
#define ALFA 26
typedef struct No { struct No *filho[ALFA]; int fim; } No;

static int conta_sub(const No *n) {
    int total = n->fim;
    for (int c = 0; c < ALFA; c++) if (n->filho[c]) total += conta_sub(n->filho[c]);
    return total;
}

int conta_prefixo(const No *r, const char *p) {
    for (; *p && r; p++) r = r->filho[*p - 'a'];
    return r ? conta_sub(r) : 0;
}`,
py:`def conta_prefixo(trie, p):
    def conta(n):
        return n.fim + sum(conta(f) for f in n.filhos.values())
    n = trie._descer(p)
    return conta(n) if n else 0`},
{t:'Maior prefixo comum', enun:'Dada uma lista de palavras, devolva o maior prefixo comum a todas, usando uma trie.', dica:'Insira todas. Desça da raiz enquanto o nó tiver exatamente um filho e não for fim de palavra.',
c:`#include <stdlib.h>
#define ALFA 26
typedef struct No { struct No *filho[ALFA]; int fim; } No;
No *novo(void);
void inserir(No *r, const char *p);

void maior_prefixo(const char **ps, int n, char *saida) {
    No *r = novo();
    for (int i = 0; i < n; i++) inserir(r, ps[i]);
    int tam = 0;
    for (;;) {
        int unico = -1, filhos = 0;
        for (int c = 0; c < ALFA; c++) if (r->filho[c]) { filhos++; unico = c; }
        if (filhos != 1 || r->fim) break;
        saida[tam++] = 'a' + unico;
        r = r->filho[unico];
    }
    saida[tam] = '\\0';
}`,
py:`# usa a classe Trie do código do módulo
def maior_prefixo(palavras):
    t = Trie()
    for w in palavras:
        t.inserir(w)
    n, saida = t.raiz, ""
    while len(n.filhos) == 1 and not n.fim:
        (c, n), = n.filhos.items()
        saida += c
    return saida


print(maior_prefixo(["programa", "progresso", "prova"]))   # pro`}
]
});

MODS.push({
id:'arvore-decisao', n:21, era:5, titulo:'Árvore de Decisão (Gini)', sub:'Perguntas sucessivas que separam os dados',
viz:'viz/arvore-decisao.html',
slides:[
{t:'Uma árvore que aprende', h:`
<p class="lead">Até aqui as árvores organizavam chaves. A árvore de decisão organiza <b>perguntas</b>: cada nó interno testa um atributo ("peso &lt; 150 g?") e cada folha dá uma resposta (uma classe).</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>calcular a impureza de Gini;</li><li>escolher a melhor divisão de um atributo numérico;</li><li>reconhecer underfitting e overfitting.</li></ul></div>
<div class="analogia"><b>Analogia</b>O jogo "Quem é?": cada pergunta boa ("usa óculos?") elimina o máximo de candidatos possível. A árvore de decisão escolhe sempre a pergunta que mais separa.</div>`},
{t:'A impureza de Gini', h:`
<p>Para um grupo com proporções p₁, p₂, ... de cada classe:</p>
<pre>Gini = 1 − (p₁² + p₂² + ...)</pre>
<div class="cards">
<div class="card"><b>Gini = 0</b>Grupo puro: todos da mesma classe.</div>
<div class="card"><b>Gini = 0,5</b>Duas classes meio a meio: o pior caso com 2 classes.</div>
</div>
<h3>Escolhendo a divisão</h3>
<p>Para cada limiar possível, divide os dados em esquerda e direita e calcula o Gini <b>ponderado</b>:</p>
<pre>G = (nₑ/n)·Gini(esq) + (n_d/n)·Gini(dir)</pre>
<p>O limiar com <b>menor G</b> (maior ganho) vence. Depois, o mesmo processo se repete em cada lado, recursivamente.</p>`},
{t:'Quando parar', h:`
<div class="cards">
<div class="card"><b>Árvore rasa demais</b>Viés alto (underfitting): erra até nos dados de treino.</div>
<div class="card"><b>Árvore funda demais</b>Variância alta (overfitting): decora o treino, inclusive o ruído, e erra em dados novos.</div>
</div>
<p>Critérios de parada comuns: profundidade máxima, mínimo de amostras por folha, ou ganho mínimo.</p>
<div class="free">É o algoritmo CART, usado pelo <code>DecisionTreeClassifier</code> do scikit-learn. Florestas aleatórias e gradient boosting são conjuntos de árvores como esta.</div>`}
],
codigo:{nota:'Gini de um grupo e busca do melhor limiar para um atributo numérico com duas classes (0 e 1).',
c:`#include <stdio.h>

double gini(int n0, int n1) {
    int n = n0 + n1;
    if (n == 0) return 0.0;
    double p0 = (double)n0 / n, p1 = (double)n1 / n;
    return 1.0 - (p0 * p0 + p1 * p1);
}

/* x ordenado de forma crescente; y em {0, 1}. Devolve o melhor limiar. */
double melhor_limiar(const double *x, const int *y, int n, double *g_melhor) {
    int tot0 = 0, tot1 = 0;
    for (int i = 0; i < n; i++) { if (y[i]) tot1++; else tot0++; }
    int e0 = 0, e1 = 0;
    double melhor = x[0];
    *g_melhor = 2.0;
    for (int i = 0; i < n - 1; i++) {
        if (y[i]) e1++; else e0++;
        if (x[i] == x[i + 1]) continue;              /* limiar só entre valores distintos */
        int ne = e0 + e1, nd = n - ne;
        double g = (double)ne / n * gini(e0, e1)
                 + (double)nd / n * gini(tot0 - e0, tot1 - e1);
        if (g < *g_melhor) { *g_melhor = g; melhor = (x[i] + x[i + 1]) / 2; }
    }
    return melhor;
}

int main(void) {
    /* peso (g) de frutas: 0 = limão, 1 = laranja */
    double peso[] = {60, 70, 80, 95, 110, 140, 150, 160, 180};
    int classe[]  = { 0,  0,  0,  0,   1,   0,   1,   1,   1};
    double g;
    double lim = melhor_limiar(peso, classe, 9, &g);
    printf("Gini inicial: %.3f\\n", gini(5, 4));
    printf("melhor pergunta: peso < %.1f ? (Gini ponderado %.3f)\\n", lim, g);
    return 0;
}`,
py:`def gini(rotulos):
    n = len(rotulos)
    if n == 0:
        return 0.0
    return 1.0 - sum((rotulos.count(c) / n) ** 2 for c in set(rotulos))


def melhor_limiar(x, y):
    """Testa os pontos médios entre valores distintos; devolve (limiar, gini)."""
    pares = sorted(zip(x, y))
    melhor = (None, float("inf"))
    for i in range(len(pares) - 1):
        if pares[i][0] == pares[i + 1][0]:
            continue
        limiar = (pares[i][0] + pares[i + 1][0]) / 2
        esq = [c for v, c in pares if v < limiar]
        dir_ = [c for v, c in pares if v >= limiar]
        n = len(pares)
        g = len(esq) / n * gini(esq) + len(dir_) / n * gini(dir_)
        if g < melhor[1]:
            melhor = (limiar, g)
    return melhor


peso = [60, 70, 80, 95, 110, 140, 150, 160, 180]
fruta = ["limão"] * 4 + ["laranja", "limão", "laranja", "laranja", "laranja"]
print(f"Gini inicial: {gini(fruta):.3f}")
lim, g = melhor_limiar(peso, fruta)
print(f"melhor pergunta: peso < {lim} ? (Gini ponderado {g:.3f})")`},
custo:[['Gini de um grupo','O(n)','Contar as classes'],['Melhor limiar (1 atributo)','O(n log n)','Ordenar + varrer com contadores'],['Treinar a árvore','O(d · n log n · prof.)','d atributos'],['Classificar um exemplo','O(profundidade)','Uma pergunta por nível']],
pratica:[
{t:'Acompanhe a primeira divisão', d:'Use <b>↺ Novo conjunto de dados</b> e avance até a raiz ser escolhida.', obs:'Quais limiares foram testados? Qual teve o menor Gini ponderado?'},
{t:'Construa a árvore toda', d:'Continue com <b>▶ Reproduzir</b> até o fim.', obs:'Todas as folhas ficaram puras (Gini 0)? Qual é a profundidade final?'},
{t:'Classifique um exemplo', d:'Use <b>◆ Classificar</b> com um ponto novo.', obs:'Que caminho ele percorreu? Quantas perguntas foram feitas?'},
{t:'Pense em overfitting', d:'Observe folhas com pouquíssimos exemplos.', obs:'Se esses exemplos fossem ruído, o que aconteceria com dados novos naquela região?'}
],
quiz:[
{q:'Qual é o Gini de um grupo com 10 exemplos, todos da mesma classe?', ops:['0','0,5','1','0,1'], ok:0, exp:'1 − 1² = 0: grupo puro.'},
{q:'E de um grupo com 5 de cada uma de duas classes?', ops:['0','0,25','0,5','1'], ok:2, exp:'1 − (0,5² + 0,5²) = 0,5.'},
{q:'Um grupo com 3 de classe A e 1 de classe B tem Gini:', ops:['0,25','0,375','0,5','0,75'], ok:1, exp:'1 − (0,75² + 0,25²) = 1 − 0,625 = 0,375.'},
{q:'A divisão escolhida é a que tem:', ops:['Maior Gini ponderado','Menor Gini ponderado','Mais exemplos à esquerda','O limiar do meio'], ok:1, exp:'Menor impureza resultante, ou seja, maior ganho.'},
{q:'Uma árvore que acerta 100% no treino e 60% em dados novos provavelmente está:', ops:['Com underfitting','Com overfitting','Perfeita','Com dados demais'], ok:1, exp:'Decorou o treino: variância alta.'}
],
prog:[
{t:'Gini para várias classes', enun:'Escreva <code>gini</code> para um vetor de contagens de k classes.', dica:'Some os quadrados das proporções e subtraia de 1.',
c:`double gini_k(const int *cont, int k) {
    int n = 0;
    for (int i = 0; i < k; i++) n += cont[i];
    if (n == 0) return 0.0;
    double s = 0.0;
    for (int i = 0; i < k; i++) {
        double p = (double)cont[i] / n;
        s += p * p;
    }
    return 1.0 - s;
}`,
py:`def gini_k(contagens):
    n = sum(contagens)
    if n == 0:
        return 0.0
    return 1.0 - sum((c / n) ** 2 for c in contagens)


print(gini_k([3, 1]))        # 0.375
print(gini_k([2, 2, 2]))     # 0.666...`},
{t:'Classe majoritária da folha', enun:'Quando a árvore para de dividir, a folha responde com a classe mais frequente. Escreva essa função.', dica:'Conte cada classe e devolva a de maior contagem.',
c:`int majoritaria(const int *y, int n, int k) {
    int cont[16] = {0};
    for (int i = 0; i < n; i++) cont[y[i]]++;
    int melhor = 0;
    for (int c = 1; c < k; c++) if (cont[c] > cont[melhor]) melhor = c;
    return melhor;
}`,
py:`from collections import Counter


def majoritaria(rotulos):
    return Counter(rotulos).most_common(1)[0][0]


print(majoritaria(["limão", "laranja", "laranja"]))   # laranja`}
]
});

MODS.push({
id:'hash', n:22, era:5, titulo:'Tabela Hash', sub:'Acesso O(1) em média, até as colisões',
viz:'viz/hash.html',
slides:[
{t:'Do valor direto para a posição', h:`
<p class="lead">Uma <b>função de hash</b> transforma a chave num número; o resto da divisão pelo tamanho da tabela dá a posição. Buscar, inserir e remover viram O(1) em média.</p>
<pre>posição = hash(chave) % tamanho</pre>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>tratar colisões com encadeamento e com sondagem linear;</li><li>calcular o fator de carga;</li><li>explicar o rehash e seu custo amortizado.</li></ul></div>
<div class="analogia"><b>Analogia</b>O guarda-volumes do supermercado: o número da sua senha diz exatamente qual armário abrir, sem procurar.</div>`},
{t:'Duas formas de guardar colisões', h:`
<p>Duas chaves diferentes podem cair na mesma posição: é uma <b>colisão</b>, e ela é inevitável.</p>
<div class="cards">
<div class="card"><b>Encadeamento separado</b>Cada posição guarda uma lista. Colidiu? Entra na lista. Simples e tolera fator de carga acima de 1.</div>
<div class="card"><b>Endereçamento aberto</b>Tudo fica no próprio vetor. Colidiu? Tenta a próxima posição (sondagem linear). Ótimo para cache, mas exige fator de carga baixo.</div>
</div>
<div class="alerta"><b>Remoção no endereçamento aberto.</b> Não dá para simplesmente esvaziar a casa: isso quebraria a cadeia de sondagem de outras chaves. Marca-se uma <b>lápide</b> (tombstone).</div>`},
{t:'Fator de carga e rehash', h:`
<pre>α = elementos / posições</pre>
<p>Quando α passa de um limite (por exemplo 0,75), a tabela <b>dobra de tamanho</b> e todas as chaves são reinseridas, porque <code>% tamanho</code> mudou. Esse rehash custa O(n), mas acontece tão raramente que o custo <b>amortizado</b> por inserção continua O(1).</p>
<table class="cmp"><tr><th>Linguagem</th><th>Implementação</th></tr>
<tr><td>Python</td><td><code>dict</code> e <code>set</code>: endereçamento aberto</td></tr>
<tr><td>Java</td><td><code>HashMap</code>: encadeamento (vira árvore rubro-negra em listas longas)</td></tr>
<tr><td>C++</td><td><code>unordered_map</code>: encadeamento</td></tr></table>
<div class="free">Sem ordem: para listar as chaves em ordem ou buscar por intervalo, use uma árvore de busca.</div>`}
],
codigo:{nota:'Hash com encadeamento separado para strings, usando a função djb2 e rehash quando α > 0,75.',
c:`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Item { char *chave; int valor; struct Item *prox; } Item;
typedef struct { Item **b; int cap, n; } Hash;

unsigned long djb2(const char *s) {
    unsigned long h = 5381;
    while (*s) h = h * 33 + (unsigned char)*s++;
    return h;
}

static char *copia(const char *s) {
    char *c = malloc(strlen(s) + 1);
    strcpy(c, s);
    return c;
}

Hash *criar(int cap) {
    Hash *t = malloc(sizeof(Hash));
    t->cap = cap; t->n = 0;
    t->b = calloc(cap, sizeof(Item *));
    return t;
}

static void rehash(Hash *t) {
    int velha = t->cap;
    Item **b = t->b;
    t->cap *= 2;
    t->b = calloc(t->cap, sizeof(Item *));
    for (int i = 0; i < velha; i++)
        for (Item *it = b[i], *prox; it; it = prox) {
            prox = it->prox;
            int j = djb2(it->chave) % t->cap;     /* nova posição */
            it->prox = t->b[j]; t->b[j] = it;
        }
    free(b);
}

void inserir(Hash *t, const char *k, int v) {
    int i = djb2(k) % t->cap;
    for (Item *it = t->b[i]; it; it = it->prox)
        if (strcmp(it->chave, k) == 0) { it->valor = v; return; }
    Item *novo = malloc(sizeof(Item));
    novo->chave = copia(k); novo->valor = v;
    novo->prox = t->b[i]; t->b[i] = novo;
    if (++t->n > t->cap * 3 / 4) rehash(t);
}

int *buscar(Hash *t, const char *k) {
    for (Item *it = t->b[djb2(k) % t->cap]; it; it = it->prox)
        if (strcmp(it->chave, k) == 0) return &it->valor;
    return NULL;
}

void liberar(Hash *t) {
    for (int i = 0; i < t->cap; i++)
        for (Item *it = t->b[i], *p; it; it = p) { p = it->prox; free(it->chave); free(it); }
    free(t->b); free(t);
}

int main(void) {
    Hash *t = criar(4);
    const char *frutas[] = {"maçã", "banana", "uva", "caju", "manga", "pitanga"};
    for (int i = 0; i < 6; i++) inserir(t, frutas[i], i * 10);
    int *v = buscar(t, "caju");
    printf("caju -> %d | capacidade %d | fator %.2f\\n", v ? *v : -1, t->cap, (double)t->n / t->cap);
    liberar(t);
    return 0;
}`,
py:`class TabelaHash:
    """Endereçamento aberto com sondagem linear e lápides."""
    _LAPIDE = object()

    def __init__(self, cap=8):
        self.chaves = [None] * cap
        self.valores = [None] * cap
        self.n = 0

    def _sondar(self, k):
        cap = len(self.chaves)
        i = hash(k) % cap
        primeira_lapide = None
        for _ in range(cap):
            atual = self.chaves[i]
            if atual is None:
                return (primeira_lapide if primeira_lapide is not None else i), False
            if atual is self._LAPIDE:
                if primeira_lapide is None:
                    primeira_lapide = i
            elif atual == k:
                return i, True
            i = (i + 1) % cap
        return primeira_lapide, False

    def inserir(self, k, v):
        i, achou = self._sondar(k)
        if not achou:
            self.n += 1
        self.chaves[i], self.valores[i] = k, v
        if self.n > 0.75 * len(self.chaves):
            self._rehash()

    def buscar(self, k):
        i, achou = self._sondar(k)
        return self.valores[i] if achou else None

    def remover(self, k):
        i, achou = self._sondar(k)
        if achou:
            self.chaves[i], self.valores[i] = self._LAPIDE, None
            self.n -= 1
        return achou

    def _rehash(self):
        pares = [(k, v) for k, v in zip(self.chaves, self.valores)
                 if k is not None and k is not self._LAPIDE]
        self.chaves = [None] * (2 * len(self.chaves))
        self.valores = [None] * len(self.chaves)
        self.n = 0
        for k, v in pares:
            self.inserir(k, v)


t = TabelaHash(4)
for i, f in enumerate(["maçã", "banana", "uva", "caju", "manga", "pitanga"]):
    t.inserir(f, i * 10)
t.remover("uva")
print("caju ->", t.buscar("caju"), "| uva ->", t.buscar("uva"),
      "| capacidade", len(t.chaves))`},
custo:[['Buscar / inserir / remover (média)','O(1)','Com fator de carga controlado'],['Pior caso','O(n)','Todas as chaves colidem'],['Rehash','O(n)','Raro: O(1) amortizado por inserção'],['Listar em ordem','O(n log n)','Precisa ordenar: hash não guarda ordem']],
pratica:[
{t:'Provoque colisões no encadeamento', d:'No modo <b>Encadeamento separado</b>, insira chaves até duas caírem na mesma posição.', obs:'O que a função de hash calculou para cada uma? Como a lista daquela posição cresceu?'},
{t:'Compare com sondagem linear', d:'Troque para <b>Endereçamento aberto</b> e insira as mesmas chaves.', obs:'Para onde foi a chave que colidiu? Forma-se um "aglomerado"?'},
{t:'Acompanhe o rehash', d:'Continue inserindo até o medidor de fator de carga passar do limite.', obs:'O tamanho dobrou? As chaves continuaram nas mesmas posições?'},
{t:'Remova no endereçamento aberto', d:'Remova uma chave que está no meio de um aglomerado e busque a seguinte.', obs:'Por que a busca ainda encontra a chave seguinte? O que ficou na posição removida?'}
],
quiz:[
{q:'Com 6 elementos numa tabela de 8 posições, o fator de carga é:', ops:['0,75','1,33','0,6','8'], ok:0, exp:'6 / 8 = 0,75.'},
{q:'Com sondagem linear e tamanho 7, a chave com hash 12 tenta primeiro qual posição?', ops:['12','5','6','0'], ok:1, exp:'12 % 7 = 5.'},
{q:'Se a posição 5 estiver ocupada, a próxima tentativa é:', ops:['4','6','0','10'], ok:1, exp:'Sondagem linear: (5 + 1) % 7 = 6.'},
{q:'Por que o rehash precisa reinserir todas as chaves?', ops:['Para ordená-las','Porque a posição depende de hash % tamanho, e o tamanho mudou','Para remover lápides apenas','Não precisa'], ok:1, exp:'Com outro tamanho, o resto da divisão muda.'},
{q:'Qual destas tarefas a tabela hash NÃO faz bem?', ops:['Verificar se uma chave existe','Contar frequência de palavras','Listar chaves entre 10 e 20','Eliminar duplicatas'], ok:2, exp:'Consultas por intervalo pedem ordem; hash espalha as chaves.'}
],
prog:[
{t:'Frequência de palavras', enun:'Conte quantas vezes cada palavra aparece num texto e mostre as 3 mais frequentes.', dica:'Em Python, um <code>dict</code> (que é uma tabela hash). Em C, reutilize a tabela do módulo: busque; se existir, incremente, senão insira com 1.',
c:`#include <stdio.h>
#include <string.h>
typedef struct Hash Hash;
void inserir(Hash *t, const char *k, int v);
int *buscar(Hash *t, const char *k);

void contar_palavras(Hash *t, char *texto) {
    for (char *p = strtok(texto, " .,;!?\\n"); p; p = strtok(NULL, " .,;!?\\n")) {
        int *c = buscar(t, p);
        if (c) (*c)++;
        else inserir(t, p, 1);
    }
}`,
py:`def top3(texto):
    freq = {}
    for p in texto.lower().split():
        p = p.strip(".,;!?")
        freq[p] = freq.get(p, 0) + 1
    return sorted(freq.items(), key=lambda kv: -kv[1])[:3]


print(top3("o rato roeu a roupa do rei de roma e o rei riu do rato"))`},
{t:'Dois números que somam alvo', enun:'Dado um vetor e um alvo, devolva os índices de dois números que somam o alvo, em O(n).', dica:'Para cada número x, verifique se <code>alvo − x</code> já foi visto. Guarde valor → índice numa tabela hash.',
c:`/* Versão com tabela de endereçamento direto para valores de 0 a 9999 */
#include <string.h>

int dois_somam(const int *v, int n, int alvo, int *i1, int *i2) {
    static int visto[10000];
    memset(visto, -1, sizeof visto);
    for (int i = 0; i < n; i++) {
        int falta = alvo - v[i];
        if (falta >= 0 && falta < 10000 && visto[falta] != -1) {
            *i1 = visto[falta]; *i2 = i;
            return 1;
        }
        if (v[i] >= 0 && v[i] < 10000) visto[v[i]] = i;
    }
    return 0;
}`,
py:`def dois_somam(v, alvo):
    visto = {}
    for i, x in enumerate(v):
        if alvo - x in visto:
            return visto[alvo - x], i
        visto[x] = i
    return None


print(dois_somam([2, 7, 11, 15], 9))   # (0, 1)`}
]
});
