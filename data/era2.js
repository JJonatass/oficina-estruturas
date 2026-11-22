/* Era 02: Estruturas lineares */
MODS.push({
id:'pilha-fila-deque', n:6, era:1, titulo:'Pilha, Fila e Deque', sub:'Três disciplinas de acesso sobre a mesma estrutura',
viz:'viz/pilha-fila-deque.html',
slides:[
{t:'Regras de acesso, não estruturas novas', h:`
<p class="lead">Pilha, fila e deque guardam uma sequência, como uma lista. O que muda é <b>por onde</b> se pode inserir e remover.</p>
<div class="cards">
<div class="card"><b>Pilha · LIFO</b>O último a entrar é o primeiro a sair. Uma ponta só: <code>push</code> e <code>pop</code> no topo.</div>
<div class="card"><b>Fila · FIFO</b>O primeiro a entrar é o primeiro a sair. Entra pelo fim, sai pela frente.</div>
<div class="card"><b>Deque</b>"Double-ended queue": insere e remove nas duas pontas.</div>
</div>
<div class="analogia"><b>Analogia</b>Pilha é a pilha de pratos na pia. Fila é a fila do banco. Deque é uma fila em que, por exceção, alguém pode entrar ou sair pela frente também.</div>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>implementar as três com custo O(1) por operação;</li><li>reconhecer qual delas um problema pede;</li><li>ver por que o deque contém pilha e fila "de graça".</li></ul></div>`},
{t:'Onde cada uma aparece', h:`
<table class="cmp"><tr><th>Estrutura</th><th>Uso típico</th></tr>
<tr><td>Pilha</td><td>Chamadas de função, desfazer (Ctrl+Z), conferir parênteses, DFS, avaliar expressões pós-fixas</td></tr>
<tr><td>Fila</td><td>Fila de impressão, atendimento, BFS, buffers entre produtor e consumidor</td></tr>
<tr><td>Deque</td><td>Janela deslizante, histórico com limite, escalonador com roubo de tarefas</td></tr></table>
<h3>Como implementar</h3>
<p>Pilha: um vetor e um índice <code>topo</code>. Fila e deque: um <b>vetor circular</b> com <code>frente</code> e <code>tamanho</code>, para que remover da frente não precise deslocar nada (é o assunto do próximo módulo).</p>
<div class="free">Em Python: pilha é <code>list</code> com <code>append</code>/<code>pop</code>; fila e deque são <code>collections.deque</code>. Evite <code>list.pop(0)</code>, que é O(n).</div>`},
{t:'Exemplo: parênteses balanceados', h:`
<p>Ao ler <code>( [ ] { } )</code>, cada abertura vai para a pilha. Cada fechamento precisa casar com o topo. No final, a pilha tem que estar vazia.</p>
<pre>entrada:  (  [  ]  {  }  )
pilha:    (  ([ (  ({ (  ·   ✓ vazia no fim</pre>
<div class="alerta"><b>Underflow e overflow.</b> Fazer <code>pop</code> numa pilha vazia (underflow) ou <code>push</code> numa pilha cheia de capacidade fixa (overflow) são os dois erros que toda implementação precisa tratar.</div>`}
],
codigo:{nota:'Um deque circular de capacidade fixa. Pilha = usar só o fim; fila = inserir no fim e remover da frente.',
c:`#include <stdio.h>
#define CAP 8

typedef struct { int v[CAP]; int frente, tamanho; } Deque;

int cheio(const Deque *d) { return d->tamanho == CAP; }
int vazio(const Deque *d) { return d->tamanho == 0; }

int push_fim(Deque *d, int x) {
    if (cheio(d)) return 0;
    d->v[(d->frente + d->tamanho) % CAP] = x;
    d->tamanho++;
    return 1;
}

int push_frente(Deque *d, int x) {
    if (cheio(d)) return 0;
    d->frente = (d->frente - 1 + CAP) % CAP;
    d->v[d->frente] = x;
    d->tamanho++;
    return 1;
}

int pop_frente(Deque *d, int *x) {
    if (vazio(d)) return 0;
    *x = d->v[d->frente];
    d->frente = (d->frente + 1) % CAP;
    d->tamanho--;
    return 1;
}

int pop_fim(Deque *d, int *x) {
    if (vazio(d)) return 0;
    d->tamanho--;
    *x = d->v[(d->frente + d->tamanho) % CAP];
    return 1;
}

int main(void) {
    Deque pilha = {{0}, 0, 0}, fila = {{0}, 0, 0};
    int x;
    for (int i = 1; i <= 3; i++) { push_fim(&pilha, i); push_fim(&fila, i); }
    printf("pilha: ");
    while (pop_fim(&pilha, &x)) printf("%d ", x);     /* 3 2 1 */
    printf("| fila: ");
    while (pop_frente(&fila, &x)) printf("%d ", x);   /* 1 2 3 */
    printf("\\n");
    return 0;
}`,
py:`from collections import deque

# Pilha: list com append/pop no fim
pilha = []
for i in (1, 2, 3):
    pilha.append(i)
print("pilha:", [pilha.pop() for _ in range(3)])   # [3, 2, 1]

# Fila: deque com append no fim e popleft na frente
fila = deque()
for i in (1, 2, 3):
    fila.append(i)
print("fila:", [fila.popleft() for _ in range(3)])  # [1, 2, 3]


# Deque circular "na mão", igual ao código em C
class DequeCircular:
    def __init__(self, cap=8):
        self.v = [None] * cap
        self.frente = 0
        self.tamanho = 0

    def push_fim(self, x):
        if self.tamanho == len(self.v):
            raise OverflowError("deque cheio")
        self.v[(self.frente + self.tamanho) % len(self.v)] = x
        self.tamanho += 1

    def push_frente(self, x):
        if self.tamanho == len(self.v):
            raise OverflowError("deque cheio")
        self.frente = (self.frente - 1) % len(self.v)
        self.v[self.frente] = x
        self.tamanho += 1

    def pop_frente(self):
        if self.tamanho == 0:
            raise IndexError("deque vazio")
        x = self.v[self.frente]
        self.frente = (self.frente + 1) % len(self.v)
        self.tamanho -= 1
        return x

    def pop_fim(self):
        if self.tamanho == 0:
            raise IndexError("deque vazio")
        self.tamanho -= 1
        return self.v[(self.frente + self.tamanho) % len(self.v)]


d = DequeCircular()
d.push_fim(2); d.push_frente(1); d.push_fim(3)
print("deque:", d.pop_frente(), d.pop_fim())   # 1 3`},
custo:[['push / pop (pilha)','O(1)','No topo'],['enqueue / dequeue (fila)','O(1)','Com vetor circular'],['Inserir/remover nas pontas (deque)','O(1)',''],['Ver frente / fim','O(1)','peek'],['Acessar o meio','—','Não faz parte da interface']],
pratica:[
{t:'Modo Pilha', d:'Selecione <b>Pilha (LIFO)</b>, insira 1, 2 e 3 e remova três vezes.', obs:'Em que ordem os valores saíram? Quais botões ficaram desabilitados nesse modo?'},
{t:'Modo Fila', d:'Troque para <b>Fila (FIFO)</b> e repita.', obs:'A ordem de saída mudou? Por qual ponta cada operação acontece?'},
{t:'Modo Deque', d:'Em <b>Deque</b>, insira na frente e no fim alternadamente.', obs:'Acompanhe o índice <code>frente</code>: o que acontece quando ele passa da posição 0?'},
{t:'Provoque underflow e overflow', d:'Esvazie e tente remover; depois encha e tente inserir.', obs:'Como o visualizador avisa cada erro? O que <code>Está vazio?</code> e <code>Está cheio?</code> respondem?'}
],
quiz:[
{q:'Empilhe A, B, C e desempilhe duas vezes. Quem fica no topo?', ops:['A','B','C','Pilha vazia'], ok:0, exp:'Saem C e B; sobra A.'},
{q:'Enfileire A, B, C e desenfileire uma vez. Quem está na frente?', ops:['A','B','C','Fila vazia'], ok:1, exp:'A sai primeiro; B passa a ser a frente.'},
{q:'Qual estrutura a busca em largura (BFS) usa?', ops:['Pilha','Fila','Deque obrigatório','Heap'], ok:1, exp:'BFS visita por camadas: quem foi descoberto primeiro é processado primeiro.'},
{q:'Por que <code>list.pop(0)</code> é uma má fila em Python?', ops:['Não funciona','É O(n): desloca todos os elementos','Remove do fim','Gera exceção'], ok:1, exp:'<code>list</code> é vetor; tirar da frente desloca o resto. Use <code>deque.popleft()</code>.'},
{q:'A expressão <code>( [ ) ]</code> está balanceada?', ops:['Sim','Não'], ok:1, exp:'Ao ler <code>)</code>, o topo é <code>[</code>: não casa.'}
],
prog:[
{t:'Parênteses balanceados', enun:'Diga se uma string com <code>()[]{}</code> está balanceada.', dica:'Empilhe aberturas. Num fechamento, a pilha não pode estar vazia e o topo tem que ser o par correspondente.',
c:`#include <string.h>

int balanceado(const char *s) {
    char pilha[256];
    int topo = 0;
    for (; *s; s++) {
        char c = *s;
        if (c == '(' || c == '[' || c == '{') {
            if (topo == 256) return 0;
            pilha[topo++] = c;
        } else if (c == ')' || c == ']' || c == '}') {
            char esperado = c == ')' ? '(' : c == ']' ? '[' : '{';
            if (topo == 0 || pilha[--topo] != esperado) return 0;
        }
    }
    return topo == 0;
}`,
py:`def balanceado(s):
    pares = {')': '(', ']': '[', '}': '{'}
    pilha = []
    for c in s:
        if c in '([{':
            pilha.append(c)
        elif c in pares:
            if not pilha or pilha.pop() != pares[c]:
                return False
    return not pilha`},
{t:'Avaliar expressão pós-fixa', enun:'Avalie uma expressão em notação pós-fixa com números de um dígito e <code>+ - * /</code>. Exemplo: <code>"23*5+"</code> vale 11.', dica:'Dígito: empilha. Operador: desempilha <code>b</code>, depois <code>a</code>, e empilha <code>a op b</code>. A ordem importa na subtração e na divisão.',
c:`int posfixa(const char *s) {
    int pilha[128], topo = 0;
    for (; *s; s++) {
        if (*s >= '0' && *s <= '9') { pilha[topo++] = *s - '0'; continue; }
        int b = pilha[--topo], a = pilha[--topo];
        switch (*s) {
            case '+': pilha[topo++] = a + b; break;
            case '-': pilha[topo++] = a - b; break;
            case '*': pilha[topo++] = a * b; break;
            case '/': pilha[topo++] = a / b; break;
        }
    }
    return pilha[0];
}`,
py:`def posfixa(s):
    pilha = []
    for c in s:
        if c.isdigit():
            pilha.append(int(c))
            continue
        b, a = pilha.pop(), pilha.pop()
        if c == '+': pilha.append(a + b)
        elif c == '-': pilha.append(a - b)
        elif c == '*': pilha.append(a * b)
        elif c == '/': pilha.append(int(a / b))
    return pilha[0]


print(posfixa("23*5+"))   # 11`}
]
});

MODS.push({
id:'fila-circular', n:7, era:1, titulo:'Fila Circular', sub:'Um buffer fixo que dá a volta',
viz:'viz/fila-circular.html',
slides:[
{t:'O problema da fila no vetor', h:`
<p class="lead">Numa fila em vetor simples, cada <code>dequeue</code> deixa um buraco no início. Ou você desloca todo mundo (O(n)), ou desperdiça espaço até a fila "acabar" mesmo com casas livres.</p>
<p>A fila circular resolve com aritmética modular: depois da última casa vem a primeira.</p>
<div class="duo"><pre data-l="c">rear  = (rear + 1)  % CAP;   // depois de enfileirar
front = (front + 1) % CAP;   // depois de desenfileirar</pre><pre data-l="py">rear  = (rear + 1)  % CAP    # depois de enfileirar
front = (front + 1) % CAP    # depois de desenfileirar</pre></div>
<div class="analogia"><b>Analogia</b>Os assentos de uma roda-gigante: as pessoas entram e saem sempre no mesmo ponto, mas a roda gira, então nenhum assento fica permanentemente vazio.</div>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul><li>implementar enqueue e dequeue em O(1);</li><li>resolver a ambiguidade "vazia ou cheia";</li><li>calcular posições com módulo.</li></ul></div>`},
{t:'front == rear: vazia ou cheia?', h:`
<p>Se a fila guarda só <code>front</code> e <code>rear</code>, as duas situações deixam os índices iguais. Há três soluções clássicas:</p>
<div class="cards">
<div class="card"><b>Contador</b>Guardar <code>tamanho</code>. Vazia: 0. Cheia: CAP. É a usada aqui.</div>
<div class="card"><b>Casa sacrificada</b>Considerar cheia quando <code>(rear+1)%CAP == front</code>. Usa CAP−1 posições.</div>
<div class="card"><b>Flag</b>Um booleano "cheia" atualizado nas operações.</div>
</div>
<div class="alerta"><b>Cuidado com o módulo negativo em C.</b> <code>(-1) % 8</code> é <code>-1</code> em C, mas <code>7</code> em Python. Para recuar um índice em C, use <code>(i - 1 + CAP) % CAP</code>.</div>`},
{t:'Onde está em produção', h:`
<div class="cards">
<div class="card"><b>Áudio e vídeo</b>O decodificador escreve, a placa de som lê, cada um no seu ritmo.</div>
<div class="card"><b>Teclado</b>O buffer de teclas do sistema operacional.</div>
<div class="card"><b>Logs recentes</b>Guardar só as últimas N mensagens, sobrescrevendo as mais antigas.</div>
<div class="card"><b>Redes</b>Filas de pacotes nas placas de rede (ring buffers).</div>
</div>
<div class="free">Memória fixa, sem alocação durante a execução e tudo O(1): por isso é a estrutura preferida em sistemas de tempo real.</div>`}
],
codigo:{nota:'Fila circular com front, rear e tamanho.',
c:`#include <stdio.h>
#define CAP 5

typedef struct { int v[CAP]; int front, rear, tamanho; } Fila;

void iniciar(Fila *f) { f->front = 0; f->rear = 0; f->tamanho = 0; }

int enqueue(Fila *f, int x) {
    if (f->tamanho == CAP) return 0;           /* cheia */
    f->v[f->rear] = x;
    f->rear = (f->rear + 1) % CAP;
    f->tamanho++;
    return 1;
}

int dequeue(Fila *f, int *x) {
    if (f->tamanho == 0) return 0;             /* vazia */
    *x = f->v[f->front];
    f->front = (f->front + 1) % CAP;
    f->tamanho--;
    return 1;
}

int main(void) {
    Fila f; iniciar(&f);
    int x;
    for (int i = 1; i <= 5; i++) enqueue(&f, i);
    dequeue(&f, &x); dequeue(&f, &x);           /* sai 1 e 2 */
    enqueue(&f, 6); enqueue(&f, 7);             /* dão a volta */
    printf("front=%d rear=%d: ", f.front, f.rear);
    while (dequeue(&f, &x)) printf("%d ", x);   /* 3 4 5 6 7 */
    printf("\\n");
    return 0;
}`,
py:`class FilaCircular:
    def __init__(self, cap=5):
        self.v = [None] * cap
        self.front = self.rear = self.tamanho = 0

    def cheia(self):
        return self.tamanho == len(self.v)

    def vazia(self):
        return self.tamanho == 0

    def enqueue(self, x):
        if self.cheia():
            return False
        self.v[self.rear] = x
        self.rear = (self.rear + 1) % len(self.v)
        self.tamanho += 1
        return True

    def dequeue(self):
        if self.vazia():
            return None
        x = self.v[self.front]
        self.v[self.front] = None
        self.front = (self.front + 1) % len(self.v)
        self.tamanho -= 1
        return x


f = FilaCircular()
for i in range(1, 6):
    f.enqueue(i)
f.dequeue(); f.dequeue()
f.enqueue(6); f.enqueue(7)
print(f"front={f.front} rear={f.rear}:", [f.dequeue() for _ in range(5)])`},
custo:[['enqueue','O(1)','Escreve em rear e avança'],['dequeue','O(1)','Lê em front e avança'],['Vazia? / Cheia?','O(1)','Pelo contador'],['Memória','CAP fixa','Sem alocação em execução']],
pratica:[
{t:'Encha a fila', d:'Use <b>+ Enfileirar</b> até a fila ficar cheia.', obs:'Onde estão <code>front</code> e <code>rear</code>? Eles são iguais?'},
{t:'Faça a fila dar a volta', d:'Desenfileire dois e enfileire dois novos valores.', obs:'Em quais posições do vetor os novos valores entraram? Veja o anel e o vetor ao mesmo tempo.'},
{t:'Esvazie a fila', d:'Desenfileire até ficar vazia.', obs:'<code>front</code> e <code>rear</code> estão iguais de novo. Como a estrutura sabe que agora está vazia, e não cheia?'},
{t:'Pergunte à fila', d:'Use <b>Ver frente</b>, <b>Ver fim</b>, <b>Está vazia?</b> e <b>Está cheia?</b> em estados diferentes.', obs:'Calcule a posição do último elemento a partir de <code>rear</code>. Qual fórmula você usou?'}
],
quiz:[
{q:'Com CAP = 5, rear = 4. Depois de um enqueue, rear vale:', ops:['5','0','4','1'], ok:1, exp:'(4 + 1) % 5 = 0: dá a volta.'},
{q:'Numa fila circular com contador, quando <code>front == rear</code> a fila está:', ops:['Sempre vazia','Sempre cheia','Vazia ou cheia: o contador decide','Corrompida'], ok:2, exp:'Os índices coincidem nos dois casos; <code>tamanho</code> desfaz a dúvida.'},
{q:'Usando a técnica da casa sacrificada com CAP = 8, quantos elementos cabem?', ops:['8','7','9','4'], ok:1, exp:'Uma casa fica sempre vazia para distinguir cheia de vazia.'},
{q:'Em C, <code>(0 - 1) % 8</code> vale:', ops:['7','-1','1','0'], ok:1, exp:'Em C o resto acompanha o sinal do dividendo. Use <code>(i - 1 + CAP) % CAP</code>.'},
{q:'Com front = 3, tamanho = 4 e CAP = 5, em que posição está o último elemento?', ops:['6','1','2','4'], ok:1, exp:'(front + tamanho − 1) % CAP = (3 + 4 − 1) % 5 = 1.'}
],
prog:[
{t:'Ver o fim', enun:'Escreva <code>ver_fim</code>, que devolve o último elemento enfileirado sem removê-lo.', dica:'O último está uma casa antes de <code>rear</code>. Cuidado com o módulo negativo em C.',
c:`#define CAP 5
typedef struct { int v[CAP]; int front, rear, tamanho; } Fila;

int ver_fim(const Fila *f, int *x) {
    if (f->tamanho == 0) return 0;
    *x = f->v[(f->rear - 1 + CAP) % CAP];
    return 1;
}`,
py:`def ver_fim(f):
    if f.vazia():
        return None
    return f.v[(f.rear - 1) % len(f.v)]   # em Python o módulo já é positivo`},
{t:'Buffer que sobrescreve', enun:'Modifique o enqueue para que, com a fila cheia, ele <b>sobrescreva o elemento mais antigo</b> (como um histórico das últimas N mensagens).', dica:'Se estiver cheia, avance <code>front</code> antes de escrever e não incremente <code>tamanho</code>.',
c:`#define CAP 5
typedef struct { int v[CAP]; int front, rear, tamanho; } Fila;

void enqueue_sobrescreve(Fila *f, int x) {
    if (f->tamanho == CAP)
        f->front = (f->front + 1) % CAP;   /* descarta o mais antigo */
    else
        f->tamanho++;
    f->v[f->rear] = x;
    f->rear = (f->rear + 1) % CAP;
}`,
py:`def enqueue_sobrescreve(f, x):
    cap = len(f.v)
    if f.tamanho == cap:
        f.front = (f.front + 1) % cap
    else:
        f.tamanho += 1
    f.v[f.rear] = x
    f.rear = (f.rear + 1) % cap`}
]
});
