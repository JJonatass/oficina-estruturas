/* Era 07: Conjuntos e grafos */
MODS.push({
id:'union-find', n:21, era:6, titulo:'Union-Find', sub:'Conjuntos disjuntos em tempo quase constante',
viz:'viz/union-find.html',
slides:[
{t:'Quem está com quem?', h:`
<p class="lead">O Union-Find (ou DSU, <i>Disjoint Set Union</i>) mantém elementos divididos em grupos e responde a duas perguntas: <b>"x e y estão no mesmo grupo?"</b> e <b>"junte os grupos de x e y"</b>.</p>
<div class="cards">
<div class="card"><b><code>find(x)</code></b>Devolve o representante (raiz) do grupo de x.</div>
<div class="card"><b><code>union(x, y)</code></b>Pendura a raiz de um grupo na raiz do outro.</div>
</div>
<p>Cada grupo é uma árvore guardada num vetor <code>pai[]</code>: <code>pai[x] == x</code> significa que x é raiz.</p>
<div class="analogia"><b>Analogia</b>Ilhas sendo ligadas por pontes. Cada ilha conhece só "a quem ela responde". Para saber se duas ilhas estão conectadas, basta ver se respondem ao mesmo chefe.</div>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>implementar find e union com as duas otimizações;</li><li>usar a estrutura para detectar ciclos.</li></ul></div>`},
{t:'As duas otimizações', h:`
<div class="cards">
<div class="card"><b>União por tamanho</b>Sempre pendure a árvore <b>menor</b> na maior. A altura fica O(log n).</div>
<div class="card"><b>Compressão de caminho</b>Durante o <code>find</code>, faça cada nó do caminho apontar direto para a raiz. As próximas buscas ficam quase instantâneas.</div>
</div>
<p>Com as duas juntas, cada operação custa <b>O(α(n))</b>, onde α é a inversa da função de Ackermann: para qualquer n que caiba no universo, α(n) ≤ 4. Na prática, constante.</p>
<div class="alerta"><b>Limite.</b> O Union-Find só junta. Separar um grupo (desfazer uma união) não é suportado de forma eficiente.</div>`},
{t:'Onde se usa', h:`
<div class="cards">
<div class="card"><b>Kruskal</b>Decide em O(α(n)) se uma aresta fecharia um ciclo (módulo 24).</div>
<div class="card"><b>Componentes conexos</b>Quantas "ilhas" um grafo tem, à medida que arestas chegam.</div>
<div class="card"><b>Redes sociais</b>Agrupar contas que são da mesma pessoa.</div>
<div class="card"><b>Processamento de imagens</b>Rotular regiões conectadas de pixels.</div>
</div>`}
],
codigo:{nota:'Union-Find com união por tamanho e compressão de caminho.',
c:`#include <stdio.h>
#define N 10

int pai[N], tam[N];

void iniciar(int n) {
    for (int i = 0; i < n; i++) { pai[i] = i; tam[i] = 1; }
}

int find(int x) {
    if (pai[x] != x) pai[x] = find(pai[x]);     /* compressão de caminho */
    return pai[x];
}

int unir(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return 0;                       /* já estavam juntos */
    if (tam[a] < tam[b]) { int t = a; a = b; b = t; }
    pai[b] = a;                                 /* menor embaixo da maior */
    tam[a] += tam[b];
    return 1;
}

int conectados(int a, int b) { return find(a) == find(b); }

int main(void) {
    iniciar(N);
    unir(0, 1); unir(2, 3); unir(1, 3); unir(5, 6);
    printf("0 e 2 conectados? %d\\n", conectados(0, 2));   /* 1 */
    printf("0 e 5 conectados? %d\\n", conectados(0, 5));   /* 0 */
    printf("unir(0, 3) criou ligação nova? %d\\n", unir(0, 3)); /* 0: seria ciclo */
    int grupos = 0;
    for (int i = 0; i < N; i++) grupos += find(i) == i;
    printf("grupos: %d\\n", grupos);                       /* 6 */
    return 0;
}`,
py:`class UnionFind:
    def __init__(self, n):
        self.pai = list(range(n))
        self.tam = [1] * n
        self.grupos = n

    def find(self, x):
        raiz = x
        while self.pai[raiz] != raiz:
            raiz = self.pai[raiz]
        while self.pai[x] != raiz:            # compressão de caminho
            self.pai[x], x = raiz, self.pai[x]
        return raiz

    def unir(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b:
            return False
        if self.tam[a] < self.tam[b]:
            a, b = b, a
        self.pai[b] = a                        # menor embaixo da maior
        self.tam[a] += self.tam[b]
        self.grupos -= 1
        return True

    def conectados(self, a, b):
        return self.find(a) == self.find(b)


uf = UnionFind(10)
for a, b in [(0, 1), (2, 3), (1, 3), (5, 6)]:
    uf.unir(a, b)
print("0 e 2 conectados?", uf.conectados(0, 2))
print("0 e 5 conectados?", uf.conectados(0, 5))
print("unir(0, 3) criou ligação nova?", uf.unir(0, 3))
print("grupos:", uf.grupos)`},
custo:[['find / union (com as duas otimizações)','O(α(n))','α(n) ≤ 4 na prática'],['Só união por tamanho','O(log n)',''],['Sem otimizações','O(n)','A árvore pode virar uma lista'],['Memória','O(n)','Dois vetores']],
pratica:[
{t:'Faça uniões', d:'Comece com <b>Desfazer tudo</b> e faça <code>União(0,1)</code>, <code>União(2,3)</code> e <code>União(1,3)</code>.', obs:'Qual raiz ficou por cima na última união? Por quê (compare os tamanhos)?'},
{t:'Veja a compressão de caminho', d:'Use <b>🎲 Uniões aleatórias</b> e depois <b>Find(x)</b> num nó fundo.', obs:'Desenhe a árvore antes e depois do find. Quais nós passaram a apontar direto para a raiz?'},
{t:'Pergunte se estão conectados', d:'Use <b>Conectados(x, y)?</b> com pares de grupos diferentes e do mesmo grupo.', obs:'Quantos finds cada pergunta faz?'},
{t:'Detecte um ciclo', d:'Una dois elementos que já estão no mesmo grupo.', obs:'O que o visualizador responde? Como isso ajuda o algoritmo de Kruskal?'}
],
quiz:[
{q:'Depois de unir(0,1), unir(1,2) e unir(3,4), quantos grupos existem entre 0..5?', ops:['2','3','4','6'], ok:1, exp:'{0,1,2}, {3,4} e {5}.'},
{q:'O que <code>pai[x] == x</code> indica?', ops:['x está sozinho no grupo','x é a raiz do seu grupo','x foi removido','Erro'], ok:1, exp:'A raiz é o representante; o grupo pode ter outros elementos.'},
{q:'Na união por tamanho, qual árvore fica por baixo?', ops:['A maior','A menor','A que tem raiz menor','Tanto faz'], ok:1, exp:'Assim a altura cresce o mínimo possível.'},
{q:'unir(a, b) devolve "já estavam juntos". Num grafo, adicionar essa aresta criaria:', ops:['Um novo componente','Um ciclo','Uma árvore','Nada'], ok:1, exp:'Já existe um caminho entre a e b; a aresta fecharia um ciclo.'},
{q:'Qual operação o Union-Find não faz eficientemente?', ops:['Juntar grupos','Descobrir o grupo de x','Separar um grupo em dois','Contar grupos'], ok:2, exp:'A estrutura só sabe unir.'}
],
prog:[
{t:'Contar ilhas numa grade', enun:'Numa grade de 0s (água) e 1s (terra), conte as ilhas (terras ligadas na horizontal ou vertical) usando Union-Find.', dica:'Numere a célula (i, j) como i·colunas + j. Una cada terra com a terra à direita e abaixo. Conte as raízes que são terra.',
c:`#define L 4
#define C 5
static int pai[L * C];

static int find(int x) { return pai[x] == x ? x : (pai[x] = find(pai[x])); }
static void unir(int a, int b) { pai[find(a)] = find(b); }

int ilhas(int g[L][C]) {
    for (int i = 0; i < L * C; i++) pai[i] = i;
    for (int i = 0; i < L; i++)
        for (int j = 0; j < C; j++) {
            if (!g[i][j]) continue;
            if (j + 1 < C && g[i][j + 1]) unir(i * C + j, i * C + j + 1);
            if (i + 1 < L && g[i + 1][j]) unir(i * C + j, (i + 1) * C + j);
        }
    int total = 0;
    for (int i = 0; i < L; i++)
        for (int j = 0; j < C; j++)
            if (g[i][j] && find(i * C + j) == i * C + j) total++;
    return total;
}`,
py:`# usa a classe UnionFind do código do módulo
def ilhas(g):
    L, C = len(g), len(g[0])
    uf = UnionFind(L * C)
    for i in range(L):
        for j in range(C):
            if not g[i][j]:
                continue
            if j + 1 < C and g[i][j + 1]:
                uf.unir(i * C + j, i * C + j + 1)
            if i + 1 < L and g[i + 1][j]:
                uf.unir(i * C + j, (i + 1) * C + j)
    return len({uf.find(i * C + j) for i in range(L) for j in range(C) if g[i][j]})


print(ilhas([[1, 1, 0, 0, 0],
             [1, 0, 0, 1, 1],
             [0, 0, 0, 1, 0],
             [1, 0, 1, 0, 1]]))   # 5`},
{t:'Tamanho do maior grupo', enun:'Depois de uma sequência de uniões, devolva o tamanho do maior grupo.', dica:'O vetor <code>tam</code> só é confiável nas raízes.',
c:`#define N 10
extern int pai[N], tam[N];
int find(int x);

int maior_grupo(int n) {
    int m = 0;
    for (int i = 0; i < n; i++)
        if (find(i) == i && tam[i] > m) m = tam[i];
    return m;
}`,
py:`def maior_grupo(uf):
    return max(uf.tam[i] for i in range(len(uf.pai)) if uf.find(i) == i)`}
]
});

MODS.push({
id:'bfs-dfs', n:22, era:6, titulo:'Grafos: BFS e DFS', sub:'Largura com fila, profundidade com pilha',
viz:'viz/bfs-dfs.html',
slides:[
{t:'A estrutura mais geral', h:`
<p class="lead">Um grafo é um conjunto de <b>vértices</b> ligados por <b>arestas</b>. Listas, árvores e redes sociais são todos grafos. Para percorrê-los, há duas estratégias básicas.</p>
<div class="cards">
<div class="card"><b>Lista de adjacência</b>Para cada vértice, a lista dos vizinhos. Memória O(V + E). A mais usada.</div>
<div class="card"><b>Matriz de adjacência</b>Uma matriz V × V com 1 onde há aresta. Memória O(V²), resposta "existe aresta?" em O(1).</div>
</div>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>implementar BFS com fila e DFS com pilha (ou recursão);</li><li>achar o caminho mínimo em número de arestas com BFS;</li><li>marcar visitados para não entrar em ciclos.</li></ul></div>`},
{t:'Duas estratégias, duas estruturas', h:`
<table class="cmp"><tr><th></th><th>BFS (largura)</th><th>DFS (profundidade)</th></tr>
<tr><td>Estrutura</td><td>Fila</td><td>Pilha (ou recursão)</td></tr>
<tr><td>Ordem</td><td>Camada por camada</td><td>Vai fundo e volta</td></tr>
<tr><td>Caminho mínimo sem pesos</td><td>Sim</td><td>Não</td></tr>
<tr><td>Usos</td><td>Menor número de passos, distâncias em redes</td><td>Ciclos, ordenação topológica, labirintos, componentes</td></tr></table>
<div class="analogia"><b>Analogia</b>BFS é uma pedra jogada no lago: as ondas se espalham em círculos. DFS é explorar um labirinto com a mão na parede: segue até o fim de um corredor antes de voltar.</div>
<div class="alerta"><b>Sem o vetor de visitados</b>, qualquer ciclo no grafo faz a busca rodar para sempre.</div>`},
{t:'Caminho mínimo com BFS', h:`
<p>Como a BFS visita por camadas, a primeira vez que ela alcança um vértice é sempre pelo <b>menor número de arestas</b>. Guardando de onde cada vértice foi descoberto (<code>anterior[v]</code>), dá para reconstruir o caminho de trás para frente.</p>
<div class="free">Isso só vale quando todas as arestas "custam" o mesmo. Com pesos diferentes, entra o Dijkstra (próximo módulo).</div>`}
],
codigo:{nota:'Grafo não direcionado em lista de adjacência; BFS com distâncias e DFS recursiva.',
c:`#include <stdio.h>
#define V 7

int adj[V][V], grau[V];

void aresta(int a, int b) { adj[a][grau[a]++] = b; adj[b][grau[b]++] = a; }

void bfs(int s, int dist[]) {
    int fila[V], ini = 0, fim = 0;
    for (int i = 0; i < V; i++) dist[i] = -1;
    dist[s] = 0; fila[fim++] = s;
    while (ini < fim) {
        int u = fila[ini++];
        for (int k = 0; k < grau[u]; k++) {
            int w = adj[u][k];
            if (dist[w] == -1) { dist[w] = dist[u] + 1; fila[fim++] = w; }
        }
    }
}

void dfs(int u, int visitado[]) {
    visitado[u] = 1;
    printf("%d ", u);
    for (int k = 0; k < grau[u]; k++)
        if (!visitado[adj[u][k]]) dfs(adj[u][k], visitado);
}

int main(void) {
    aresta(0, 1); aresta(0, 2); aresta(1, 3); aresta(2, 3);
    aresta(3, 4); aresta(4, 5); aresta(2, 6);
    int dist[V], vis[V] = {0};
    bfs(0, dist);
    printf("BFS a partir de 0, distâncias: ");
    for (int i = 0; i < V; i++) printf("%d:%d ", i, dist[i]);
    printf("\\nDFS a partir de 0: ");
    dfs(0, vis);
    printf("\\n");
    return 0;
}`,
py:`from collections import deque


def bfs(grafo, s):
    dist = {s: 0}
    anterior = {s: None}
    fila = deque([s])
    while fila:
        u = fila.popleft()
        for w in grafo[u]:
            if w not in dist:
                dist[w] = dist[u] + 1
                anterior[w] = u
                fila.append(w)
    return dist, anterior


def dfs(grafo, s):
    visitado, ordem, pilha = set(), [], [s]
    while pilha:
        u = pilha.pop()
        if u in visitado:
            continue
        visitado.add(u)
        ordem.append(u)
        for w in reversed(grafo[u]):       # reversed: mesma ordem da recursiva
            if w not in visitado:
                pilha.append(w)
    return ordem


def caminho(anterior, destino):
    c = []
    while destino is not None:
        c.append(destino)
        destino = anterior[destino]
    return c[::-1]


arestas = [(0, 1), (0, 2), (1, 3), (2, 3), (3, 4), (4, 5), (2, 6)]
grafo = {v: [] for v in range(7)}
for a, b in arestas:
    grafo[a].append(b)
    grafo[b].append(a)

dist, ant = bfs(grafo, 0)
print("BFS a partir de 0, distâncias:", dist)
print("caminho mínimo 0 → 5:", caminho(ant, 5))
print("DFS a partir de 0:", dfs(grafo, 0))`},
custo:[['BFS / DFS (lista de adjacência)','O(V + E)','Cada vértice e aresta uma vez'],['BFS / DFS (matriz)','O(V²)','Varre a linha inteira de cada vértice'],['Memória extra','O(V)','Visitados + fila/pilha'],['Caminho mínimo sem pesos','O(V + E)','Com BFS']],
pratica:[
{t:'Execute a BFS', d:'Clique em <b>Executar BFS</b> e avance passo a passo.', obs:'Acompanhe a fila. Os vértices saem na mesma ordem em que entraram?'},
{t:'Execute a DFS no mesmo grafo', d:'Agora <b>Executar DFS</b>.', obs:'Compare a ordem de visita com a da BFS. Qual estrutura de apoio aparece agora?'},
{t:'Leia as camadas', d:'Volte para a BFS e observe a árvore de descoberta.', obs:'Em qual camada está cada vértice? Isso é a distância em arestas a partir da origem?'},
{t:'Mude o grafo', d:'Use <b>🎲 Novo grafo aleatório</b> e preveja a ordem da BFS antes de rodar.', obs:'Acertou? Onde a ordem dos vizinhos fez diferença?'}
],
quiz:[
{q:'Qual estrutura de apoio a BFS usa?', ops:['Pilha','Fila','Heap','Hash'], ok:1, exp:'Primeiro a ser descoberto, primeiro a ser processado.'},
{q:'Num grafo com V vértices e E arestas em lista de adjacência, a BFS custa:', ops:['O(V)','O(E)','O(V + E)','O(V · E)'], ok:2, exp:'Cada vértice entra na fila uma vez e cada aresta é examinada uma vez (duas, se não direcionado).'},
{q:'Qual busca encontra o caminho com menos arestas?', ops:['DFS','BFS','As duas sempre','Nenhuma'], ok:1, exp:'A BFS alcança cada vértice pela primeira vez na menor camada possível.'},
{q:'Para resolver um labirinto e listar um caminho qualquer até a saída, as duas funcionam. Qual usa menos memória num labirinto largo e raso?', ops:['BFS','DFS'], ok:1, exp:'A fila da BFS guarda uma camada inteira; a pilha da DFS só o caminho atual.'},
{q:'O que acontece se esquecermos de marcar os visitados num grafo com ciclo?', ops:['Nada','A busca fica mais rápida','A busca pode rodar para sempre','A DFS vira BFS'], ok:2, exp:'Ela volta a vértices já vistos indefinidamente.'}
],
prog:[
{t:'Componentes conexos', enun:'Conte quantos componentes conexos um grafo não direcionado tem.', dica:'Para cada vértice ainda não visitado, rode uma DFS (ou BFS) e some 1.',
c:`#define V 7
extern int adj[V][V], grau[V];

static void marca(int u, int *vis) {
    vis[u] = 1;
    for (int k = 0; k < grau[u]; k++)
        if (!vis[adj[u][k]]) marca(adj[u][k], vis);
}

int componentes(void) {
    int vis[V] = {0}, c = 0;
    for (int v = 0; v < V; v++)
        if (!vis[v]) { marca(v, vis); c++; }
    return c;
}`,
py:`def componentes(grafo):
    visitado, c = set(), 0
    for v in grafo:
        if v in visitado:
            continue
        c += 1
        pilha = [v]
        while pilha:
            u = pilha.pop()
            if u in visitado:
                continue
            visitado.add(u)
            pilha.extend(w for w in grafo[u] if w not in visitado)
    return c`},
{t:'O grafo é bipartido?', enun:'Diga se é possível pintar os vértices com duas cores sem que uma aresta ligue vértices da mesma cor.', dica:'BFS pintando cada vizinho com a cor oposta. Se um vizinho já tem a mesma cor do vértice atual, não é bipartido.',
c:`#define V 7
extern int adj[V][V], grau[V];

int bipartido(void) {
    int cor[V], fila[V];
    for (int i = 0; i < V; i++) cor[i] = -1;
    for (int s = 0; s < V; s++) {
        if (cor[s] != -1) continue;
        int ini = 0, fim = 0;
        cor[s] = 0; fila[fim++] = s;
        while (ini < fim) {
            int u = fila[ini++];
            for (int k = 0; k < grau[u]; k++) {
                int w = adj[u][k];
                if (cor[w] == -1) { cor[w] = 1 - cor[u]; fila[fim++] = w; }
                else if (cor[w] == cor[u]) return 0;
            }
        }
    }
    return 1;
}`,
py:`from collections import deque


def bipartido(grafo):
    cor = {}
    for s in grafo:
        if s in cor:
            continue
        cor[s] = 0
        fila = deque([s])
        while fila:
            u = fila.popleft()
            for w in grafo[u]:
                if w not in cor:
                    cor[w] = 1 - cor[u]
                    fila.append(w)
                elif cor[w] == cor[u]:
                    return False
    return True`}
]
});

MODS.push({
id:'dijkstra', n:23, era:6, titulo:'Dijkstra: caminho mínimo', sub:'BFS com pesos e uma fila de prioridade',
viz:'viz/dijkstra.html',
slides:[
{t:'Quando as arestas têm custo', h:`
<p class="lead">Numa rede de ruas, cada aresta tem uma distância. O caminho com menos arestas não é necessariamente o mais curto. O algoritmo de Dijkstra (1959) encontra o menor custo da origem até todos os vértices.</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>aplicar o relaxamento de arestas;</li><li>usar um heap como fila de prioridade;</li><li>entender por que pesos negativos quebram o algoritmo.</li></ul></div>
<div class="analogia"><b>Analogia</b>Água escorrendo a partir da origem por canos de comprimentos diferentes: ela chega primeiro aos lugares mais próximos, e cada lugar é "molhado" uma única vez, pela menor distância.</div>`},
{t:'A ideia gulosa', h:`
<ol>
<li>Distância da origem = 0; de todos os outros = ∞.</li>
<li>Pegue o vértice <b>não finalizado</b> de menor distância (o heap faz isso em O(log V)).</li>
<li><b>Relaxe</b> cada aresta (u, w, peso): se <code>dist[u] + peso &lt; dist[w]</code>, atualize <code>dist[w]</code> e guarde <code>anterior[w] = u</code>.</li>
<li>Marque u como finalizado e repita.</li>
</ol>
<p>Quando um vértice sai do heap, sua distância é definitiva: nenhum caminho por vértices ainda mais distantes poderia melhorá-la, <b>desde que não existam pesos negativos</b>.</p>
<div class="alerta"><b>Pesos negativos.</b> Uma aresta negativa poderia baratear um caminho depois que o vértice já foi finalizado. Nesse caso, use Bellman-Ford.</div>`},
{t:'Onde se usa', h:`
<div class="cards">
<div class="card"><b>GPS e mapas</b>Com variações como A*, que usa uma estimativa da distância ao destino.</div>
<div class="card"><b>Roteamento de internet</b>O protocolo OSPF roda Dijkstra em cada roteador.</div>
<div class="card"><b>Jogos</b>Movimento de personagens em terrenos com custos diferentes.</div>
</div>
<div class="free">Repare na família: BFS usa fila, DFS usa pilha, Dijkstra usa <b>fila de prioridade</b>. A estrutura de apoio define o algoritmo.</div>`}
],
codigo:{nota:'Dijkstra com matriz de pesos e seleção linear do mínimo (O(V²), simples em C); em Python, com heapq (O((V+E) log V)).',
c:`#include <stdio.h>
#include <limits.h>
#define V 6
#define INF INT_MAX

void dijkstra(int peso[V][V], int s, int dist[], int ant[]) {
    int final[V] = {0};
    for (int i = 0; i < V; i++) { dist[i] = INF; ant[i] = -1; }
    dist[s] = 0;
    for (int it = 0; it < V; it++) {
        int u = -1;
        for (int i = 0; i < V; i++)                    /* menor não finalizado */
            if (!final[i] && dist[i] != INF && (u == -1 || dist[i] < dist[u])) u = i;
        if (u == -1) break;
        final[u] = 1;
        for (int w = 0; w < V; w++)                    /* relaxamento */
            if (peso[u][w] && !final[w] && dist[u] + peso[u][w] < dist[w]) {
                dist[w] = dist[u] + peso[u][w];
                ant[w] = u;
            }
    }
}

void imprimir_caminho(int ant[], int v) {
    if (ant[v] != -1) imprimir_caminho(ant, ant[v]);
    printf("%c ", 'A' + v);
}

int main(void) {
    int p[V][V] = {0};
    int arestas[][3] = {{0,1,7},{0,2,9},{0,5,14},{1,2,10},{1,3,15},
                        {2,3,11},{2,5,2},{3,4,6},{4,5,9}};
    for (int i = 0; i < 9; i++) {
        p[arestas[i][0]][arestas[i][1]] = arestas[i][2];
        p[arestas[i][1]][arestas[i][0]] = arestas[i][2];
    }
    int dist[V], ant[V];
    dijkstra(p, 0, dist, ant);
    for (int v = 0; v < V; v++) printf("%c:%d ", 'A' + v, dist[v]);
    printf("\\ncaminho A → E: ");
    imprimir_caminho(ant, 4);                           /* A C F E */
    printf("\\n");
    return 0;
}`,
py:`import heapq


def dijkstra(grafo, s):
    dist = {v: float("inf") for v in grafo}
    anterior = {v: None for v in grafo}
    dist[s] = 0
    heap = [(0, s)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue                      # entrada antiga no heap: ignora
        for w, peso in grafo[u]:
            if d + peso < dist[w]:        # relaxamento
                dist[w] = d + peso
                anterior[w] = u
                heapq.heappush(heap, (dist[w], w))
    return dist, anterior


arestas = [("A", "B", 7), ("A", "C", 9), ("A", "F", 14), ("B", "C", 10),
           ("B", "D", 15), ("C", "D", 11), ("C", "F", 2), ("D", "E", 6),
           ("E", "F", 9)]
grafo = {v: [] for v in "ABCDEF"}
for a, b, p in arestas:
    grafo[a].append((b, p))
    grafo[b].append((a, p))

dist, ant = dijkstra(grafo, "A")
print(dist)
v, caminho = "E", []
while v:
    caminho.append(v)
    v = ant[v]
print("caminho A → E:", " ".join(reversed(caminho)))   # A C F E`},
custo:[['Com heap binário','O((V + E) log V)','A versão usual'],['Com vetor (busca linear do mínimo)','O(V²)','Boa para grafos densos'],['Relaxar uma aresta','O(1) + push no heap',''],['Pesos negativos','Não funciona','Use Bellman-Ford: O(V · E)']],
pratica:[
{t:'Execute e observe a fila de prioridade', d:'Clique em <b>Executar Dijkstra</b> e avance passo a passo.', obs:'Qual vértice sai do heap a cada passo? É sempre o de menor distância provisória?'},
{t:'Flagre um relaxamento', d:'Pare num passo em que uma distância diminui.', obs:'Qual era o valor antigo e qual o novo? Por qual vértice passa o caminho melhor?'},
{t:'Compare com a BFS', d:'No mesmo tipo de grafo, pense no caminho com menos arestas até um vértice distante.', obs:'Ele é o mais barato? O visualizador mostra um caminho diferente?'},
{t:'Novo grafo', d:'Use <b>🎲 Novo grafo aleatório</b> e tente prever a ordem de finalização.', obs:'Onde sua previsão falhou e por quê?'}
],
quiz:[
{q:'Qual estrutura de dados torna o Dijkstra eficiente?', ops:['Pilha','Fila simples','Fila de prioridade (heap)','Trie'], ok:2, exp:'Ela entrega o vértice de menor distância em O(log V).'},
{q:'Relaxar a aresta (u, w) com peso 4, sendo dist[u] = 10 e dist[w] = 16, resulta em:', ops:['dist[w] = 16','dist[w] = 14','dist[w] = 4','dist[u] = 12'], ok:1, exp:'10 + 4 = 14 &lt; 16: atualiza.'},
{q:'E se dist[w] fosse 13?', ops:['dist[w] = 14','dist[w] continua 13','dist[w] = 17','Erro'], ok:1, exp:'14 não é menor que 13: nada muda.'},
{q:'Por que o Dijkstra falha com pesos negativos?', ops:['O heap não aceita negativos','Um vértice finalizado poderia ainda ficar mais barato','Entra em loop sempre','Não falha'], ok:1, exp:'A garantia gulosa depende de que caminhos só aumentem de custo.'},
{q:'No grafo do código, qual é a distância de A até F?', ops:['14','11','9','20'], ok:1, exp:'A → C (9) → F (2) = 11, mais barato que a aresta direta de 14.'}
],
prog:[
{t:'Número de arestas do caminho', enun:'Além da distância, devolva quantas arestas tem o caminho mínimo até cada vértice.', dica:'Junto com <code>dist[w]</code>, atualize <code>arestas[w] = arestas[u] + 1</code> no relaxamento.',
c:`/* No relaxamento do código do módulo, acrescente um vetor arestas[V]:
       arestas[s] = 0;   (no início)
       if (... dist[u] + peso[u][w] < dist[w]) {
           dist[w] = dist[u] + peso[u][w];
           ant[w] = u;
           arestas[w] = arestas[u] + 1;
       }                                                  */`,
py:`import heapq


def dijkstra_arestas(grafo, s):
    dist = {v: float("inf") for v in grafo}
    arestas = {v: None for v in grafo}
    dist[s], arestas[s] = 0, 0
    heap = [(0, s)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for w, p in grafo[u]:
            if d + p < dist[w]:
                dist[w] = d + p
                arestas[w] = arestas[u] + 1
                heapq.heappush(heap, (dist[w], w))
    return dist, arestas`},
{t:'Parar no destino', enun:'Se só interessa a distância até um destino, o algoritmo pode parar mais cedo. Escreva essa versão.', dica:'Quando o destino sair do heap, a distância dele já é definitiva.',
c:`/* No laço principal do código do módulo, logo após escolher u:
       if (u == destino) break;
   A distância de 'destino' já é final nesse momento. */`,
py:`import heapq


def distancia(grafo, s, destino):
    dist = {s: 0}
    heap = [(0, s)]
    while heap:
        d, u = heapq.heappop(heap)
        if u == destino:
            return d
        if d > dist.get(u, float("inf")):
            continue
        for w, p in grafo[u]:
            if d + p < dist.get(w, float("inf")):
                dist[w] = d + p
                heapq.heappush(heap, (d + p, w))
    return float("inf")`}
]
});

MODS.push({
id:'agm', n:24, era:6, titulo:'Árvore Geradora Mínima', sub:'Kruskal e Prim: dois caminhos gulosos, mesmo resultado',
viz:'viz/agm.html',
slides:[
{t:'Ligar tudo gastando o mínimo', h:`
<p class="lead">Dado um grafo conexo com pesos, a <b>árvore geradora mínima</b> (AGM, ou MST) é o conjunto de arestas que liga <b>todos os vértices</b>, sem ciclos, com a <b>menor soma de pesos</b>. Ela sempre tem exatamente V − 1 arestas.</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>executar Kruskal com Union-Find;</li><li>executar Prim com heap;</li><li>saber quando cada um é mais adequado.</li></ul></div>
<div class="analogia"><b>Analogia</b>Levar fibra ótica a todos os bairros de uma cidade: não precisa de caminho direto entre cada par de bairros, só que todos estejam conectados, gastando o mínimo de cabo.</div>`},
{t:'Duas estratégias gulosas', h:`
<div class="cards">
<div class="card"><b>Kruskal: pelas arestas</b>Ordena todas as arestas pelo peso. Pega da mais barata para a mais cara, <b>pulando as que fechariam ciclo</b> (o Union-Find decide). Começa com uma floresta que vai se juntando.</div>
<div class="card"><b>Prim: pelos vértices</b>Começa num vértice e, a cada passo, adiciona a aresta mais barata que liga a árvore a um vértice <b>de fora</b> (o heap decide). A árvore cresce como uma mancha.</div>
</div>
<p>Se todos os pesos forem distintos, a AGM é única e os dois encontram exatamente a mesma árvore.</p>`},
{t:'Esparso × denso', h:`
<table class="cmp"><tr><th></th><th>Kruskal</th><th>Prim (heap)</th></tr>
<tr><td>Custo</td><td>O(E log E)</td><td>O((V + E) log V)</td></tr>
<tr><td>Estrutura de apoio</td><td>Union-Find</td><td>Fila de prioridade</td></tr>
<tr><td>Melhor em</td><td>Grafos esparsos, arestas já em lista</td><td>Grafos densos, lista de adjacência</td></tr></table>
<div class="free">Este módulo fecha a trilha juntando quase tudo: ordenação, heap, Union-Find e grafos.</div>`}
],
codigo:{nota:'Kruskal (com Union-Find) e Prim (com heap) sobre o mesmo grafo.',
c:`#include <stdio.h>
#include <stdlib.h>
#define V 6
#define E 9

typedef struct { int a, b, p; } Aresta;

static int pai[V];
static int find(int x) { return pai[x] == x ? x : (pai[x] = find(pai[x])); }

static int cmp(const void *x, const void *y) {
    return ((const Aresta *)x)->p - ((const Aresta *)y)->p;
}

int kruskal(Aresta *ar, int e) {
    for (int i = 0; i < V; i++) pai[i] = i;
    qsort(ar, e, sizeof(Aresta), cmp);
    int total = 0, usadas = 0;
    for (int i = 0; i < e && usadas < V - 1; i++) {
        int ra = find(ar[i].a), rb = find(ar[i].b);
        if (ra == rb) continue;                    /* fecharia ciclo */
        pai[ra] = rb;
        total += ar[i].p; usadas++;
        printf("%c-%c(%d) ", 'A' + ar[i].a, 'A' + ar[i].b, ar[i].p);
    }
    return total;
}

int prim(int peso[V][V]) {                         /* versão O(V²) */
    int na_arvore[V] = {0}, melhor[V], total = 0;
    for (int i = 0; i < V; i++) melhor[i] = 1 << 30;
    melhor[0] = 0;
    for (int it = 0; it < V; it++) {
        int u = -1;
        for (int i = 0; i < V; i++)
            if (!na_arvore[i] && (u == -1 || melhor[i] < melhor[u])) u = i;
        na_arvore[u] = 1;
        total += melhor[u];
        for (int w = 0; w < V; w++)
            if (peso[u][w] && !na_arvore[w] && peso[u][w] < melhor[w]) melhor[w] = peso[u][w];
    }
    return total;
}

int main(void) {
    Aresta ar[E] = {{0,1,7},{0,2,9},{0,5,14},{1,2,10},{1,3,15},
                    {2,3,11},{2,5,2},{3,4,6},{4,5,9}};
    int p[V][V] = {0};
    for (int i = 0; i < E; i++) p[ar[i].a][ar[i].b] = p[ar[i].b][ar[i].a] = ar[i].p;
    printf("Kruskal: ");
    int k = kruskal(ar, E);
    printf("= %d\\nPrim: %d\\n", k, prim(p));       /* os dois dão 33 */
    return 0;
}`,
py:`import heapq


def kruskal(vertices, arestas):
    pai = {v: v for v in vertices}

    def find(x):
        while pai[x] != x:
            pai[x] = pai[pai[x]]          # compressão (versão iterativa)
            x = pai[x]
        return x

    arvore = []
    for p, a, b in sorted((p, a, b) for a, b, p in arestas):
        ra, rb = find(a), find(b)
        if ra != rb:                       # não fecha ciclo
            pai[ra] = rb
            arvore.append((a, b, p))
    return arvore


def prim(grafo, inicio):
    na_arvore = {inicio}
    heap = [(p, inicio, w) for w, p in grafo[inicio]]
    heapq.heapify(heap)
    arvore = []
    while heap and len(na_arvore) < len(grafo):
        p, u, w = heapq.heappop(heap)
        if w in na_arvore:
            continue
        na_arvore.add(w)
        arvore.append((u, w, p))
        for x, px in grafo[w]:
            if x not in na_arvore:
                heapq.heappush(heap, (px, w, x))
    return arvore


arestas = [("A", "B", 7), ("A", "C", 9), ("A", "F", 14), ("B", "C", 10),
           ("B", "D", 15), ("C", "D", 11), ("C", "F", 2), ("D", "E", 6),
           ("E", "F", 9)]
grafo = {v: [] for v in "ABCDEF"}
for a, b, p in arestas:
    grafo[a].append((b, p))
    grafo[b].append((a, p))

k = kruskal("ABCDEF", arestas)
pr = prim(grafo, "A")
print("Kruskal:", k, "=", sum(p for *_, p in k))
print("Prim:   ", pr, "=", sum(p for *_, p in pr))`},
custo:[['Kruskal','O(E log E)','Dominado pela ordenação'],['Prim com heap','O((V + E) log V)',''],['Prim com vetor','O(V²)','Bom para grafos densos'],['Arestas na AGM','V − 1','Sempre']],
pratica:[
{t:'Rode o Kruskal', d:'Clique em <b>Executar Kruskal</b> e avance passo a passo.', obs:'Em que ordem as arestas foram consideradas? Alguma foi rejeitada? Por quê?'},
{t:'Rode o Prim', d:'Agora <b>Executar Prim</b> no mesmo grafo.', obs:'A ordem em que as arestas entram é diferente? O custo total é o mesmo?'},
{t:'Conte as arestas', d:'Ao final de cada algoritmo, conte as arestas escolhidas.', obs:'Bate com V − 1?'},
{t:'Outro grafo', d:'Use <b>🎲 Novo grafo aleatório</b> e tente montar a AGM no papel antes de rodar.', obs:'Qual dos dois métodos foi mais fácil de fazer à mão?'}
],
quiz:[
{q:'Uma AGM de um grafo com 8 vértices tem quantas arestas?', ops:['8','7','16','Depende dos pesos'], ok:1, exp:'Toda árvore com V vértices tem V − 1 arestas.'},
{q:'No Kruskal, como se decide se uma aresta fecha ciclo?', ops:['Com BFS a cada aresta','Com Union-Find: as pontas já estão no mesmo grupo?','Pelo peso','Com uma pilha'], ok:1, exp:'O find das duas pontas devolve a mesma raiz.'},
{q:'O Prim começa:', ops:['Pela aresta mais barata do grafo','Por um vértice qualquer','Pelo vértice de maior grau','Ordenando todas as arestas'], ok:1, exp:'A árvore cresce a partir de um vértice inicial.'},
{q:'Qual é o custo total da AGM do grafo do código?', ops:['33','35','38','45'], ok:0, exp:'C-F (2) + D-E (6) + A-B (7) + A-C (9) + E-F (9) = 33.'},
{q:'Para um grafo muito esparso com as arestas já numa lista, qual costuma ser mais simples?', ops:['Kruskal','Prim','Dijkstra','DFS'], ok:0, exp:'Ordenar a lista e usar Union-Find é direto.'}
],
prog:[
{t:'O grafo é conexo?', enun:'A AGM só existe se o grafo for conexo. Use o Kruskal para verificar: conte quantas arestas foram aceitas.', dica:'Se ao final foram aceitas V − 1 arestas, o grafo é conexo.',
c:`/* No código do módulo, kruskal() conta 'usadas'.
   Basta devolver também esse valor e testar:
       conexo = (usadas == V - 1);                  */`,
py:`def conexo(vertices, arestas):
    return len(kruskal(vertices, arestas)) == len(vertices) - 1`},
{t:'Árvore geradora máxima', enun:'E se quiséssemos a árvore de <b>maior</b> soma? Adapte o Kruskal.', dica:'Basta ordenar as arestas em ordem decrescente de peso. O resto não muda.',
c:`/* Troque o comparador do qsort por:
static int cmp_desc(const void *x, const void *y) {
    return ((const Aresta *)y)->p - ((const Aresta *)x)->p;
}                                                   */`,
py:`def kruskal_max(vertices, arestas):
    pai = {v: v for v in vertices}

    def find(x):
        while pai[x] != x:
            x = pai[x]
        return x

    arvore = []
    for p, a, b in sorted(((p, a, b) for a, b, p in arestas), reverse=True):
        ra, rb = find(a), find(b)
        if ra != rb:
            pai[ra] = rb
            arvore.append((a, b, p))
    return arvore`}
]
});
