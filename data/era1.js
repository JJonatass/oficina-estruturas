/* Oficina de Estruturas de Dados · profjon
   Era 01: Fundamentos. Cada módulo:
   { id, n, era, titulo, sub, viz, slides:[{t,h}], codigo:{c,py,nota}, custo:[[op,custo,nota]],
     pratica:[{t,d,obs}], quiz:[{q,ops,ok,exp}], prog:[{t,enun,dica,c,py}] } */
window.MODS = window.MODS || [];
window.ERAS = [
  {n:'01', t:'Fundamentos', s:'De onde vêm os dados'},
  {n:'02', t:'Estruturas lineares', s:'Acesso disciplinado às pontas'},
  {n:'03', t:'Árvores de busca', s:'Dividir o espaço de busca'},
  {n:'04', t:'Árvores multi-via', s:'Quando o disco custa caro'},
  {n:'05', t:'Heaps e ordenação', s:'O topo sempre à mão'},
  {n:'06', t:'Estruturas especializadas', s:'Três jeitos de indexar rápido'},
  {n:'07', t:'Conjuntos e grafos', s:'A estrutura mais geral de todas'}
];

MODS.push({
id:'ponteiros', n:1, era:0, titulo:'Ponteiros em C', sub:'Endereços de memória, não valores',
viz:'viz/ponteiros.html',
slides:[
{t:'Por que começar por ponteiros', h:`
<p class="lead">Toda estrutura de dados é, no fundo, uma forma de organizar <b>endereços de memória</b>. Antes de listas, árvores e grafos, precisamos entender o que é um endereço e como guardá-lo numa variável.</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul>
<li>diferenciar o <b>valor</b> de uma variável do seu <b>endereço</b>;</li>
<li>usar <code>&amp;</code>, <code>*</code> e <code>-&gt;</code> com segurança;</li>
<li>alocar e liberar nós com <code>malloc</code> e <code>free</code>;</li>
<li>entender como o Python esconde tudo isso por trás de <b>referências</b>.</li></ul></div>
<div class="analogia"><b>Analogia</b>A memória é uma rua enorme de casas numeradas. Uma variável comum é uma casa com algo dentro. Um ponteiro é um papel com o <i>número de uma casa</i> anotado: ele não guarda o objeto, guarda onde o objeto mora.</div>`},
{t:'Os três operadores', h:`
<div class="cards">
<div class="card"><b><code>&amp;x</code> · endereço de</b>Devolve onde <code>x</code> mora na memória.</div>
<div class="card"><b><code>*p</code> · desreferência</b>Vai até o endereço guardado em <code>p</code> e lê ou escreve o valor de lá.</div>
<div class="card"><b><code>p-&gt;campo</code></b>Atalho para <code>(*p).campo</code>, usado o tempo todo com <code>struct</code>.</div>
</div>
<h3>Exemplo mínimo</h3>
<pre>int x = 10;
int *p = &amp;x;   // p guarda o endereço de x
*p = 42;       // escreve 42 "lá onde p aponta"
printf("%d", x); // 42</pre>
<p>Mudar <code>*p</code> muda <code>x</code>, porque os dois nomes falam da mesma casa. Já mudar <code>p</code> (sem asterisco) só troca o papel de lugar: agora ele aponta para outra casa.</p>`},
{t:'Nós alocados dinamicamente', h:`
<p>Listas, árvores e grafos são feitos de <b>nós</b>: pequenos blocos com um dado e um ou mais ponteiros para outros nós.</p>
<pre>typedef struct No {
    int valor;
    struct No *prox;   // endereço do próximo nó (ou NULL)
} No;

No *n = malloc(sizeof(No)); // pede memória ao sistema
n-&gt;valor = 7;
n-&gt;prox = NULL;
free(n);                    // devolve quando não precisar mais</pre>
<div class="alerta"><b>Os três erros clássicos.</b> (1) Usar um ponteiro depois do <code>free</code> (<i>dangling pointer</i>). (2) Esquecer o <code>free</code> e vazar memória. (3) Desreferenciar <code>NULL</code>, que derruba o programa com <i>segmentation fault</i>.</div>`},
{t:'E no Python?', h:`
<p>O Python não tem <code>&amp;</code> nem <code>*</code>, mas <b>toda variável é uma referência</b>. Quando você escreve <code>b = a</code> com uma lista, os dois nomes apontam para o mesmo objeto, exatamente como dois ponteiros em C.</p>
<pre>a = [1, 2, 3]
b = a          # b é outro "ponteiro" para a mesma lista
b.append(4)
print(a)       # [1, 2, 3, 4]
print(id(a) == id(b))  # True: mesmo endereço</pre>
<p>A memória é liberada sozinha pelo <b>coletor de lixo</b> quando nenhum nome aponta mais para o objeto. Por isso, nos códigos em Python desta oficina, <code>None</code> faz o papel de <code>NULL</code> e não existe <code>free</code>.</p>
<div class="free">Na aba <b>Prática</b>, o visualizador executa o mesmo <code>removeTail</code> em lista simples e dupla, linha por linha, mostrando cada ponteiro mudando.</div>`}
],
codigo:{nota:'Criar três nós, ligá-los e percorrer a cadeia. Repare que em C cada nó precisa ser liberado.',
c:`#include <stdio.h>
#include <stdlib.h>

typedef struct No {
    int valor;
    struct No *prox;
} No;

No *novo_no(int v) {
    No *n = malloc(sizeof(No));
    if (!n) { perror("malloc"); exit(1); }
    n->valor = v;
    n->prox = NULL;
    return n;
}

int main(void) {
    int x = 10;
    int *p = &x;
    *p = 42;
    printf("x = %d (mudado via ponteiro)\\n", x);

    No *a = novo_no(1), *b = novo_no(2), *c = novo_no(3);
    a->prox = b;
    b->prox = c;

    for (No *it = a; it != NULL; it = it->prox)
        printf("%d -> ", it->valor);
    printf("NULL\\n");

    while (a) {               /* libera um por um */
        No *tmp = a->prox;
        free(a);
        a = tmp;
    }
    return 0;
}`,
py:`class No:
    def __init__(self, valor):
        self.valor = valor
        self.prox = None       # None faz o papel de NULL


def main():
    a = [1, 2, 3]
    b = a                      # mesma lista, dois nomes
    b.append(4)
    print("a =", a, "| mesmo objeto?", a is b)

    n1, n2, n3 = No(1), No(2), No(3)
    n1.prox = n2
    n2.prox = n3

    it = n1
    while it is not None:
        print(it.valor, end=" -> ")
        it = it.prox
    print("None")
    # sem free: o coletor de lixo libera quando ninguém aponta


if __name__ == "__main__":
    main()`},
custo:[['Ler/escrever via ponteiro','O(1)','Um acesso direto ao endereço'],['malloc / free','O(1)*','Depende do alocador; tratamos como constante'],['Seguir k ponteiros','O(k)','Cada salto é um acesso à memória']],
pratica:[
{t:'Execute o removeTail na lista simples', d:'Deixe o modo <b>Lista Simples</b> e use <b>Próximo ▶</b> linha por linha.', obs:'Quantos passos o laço precisa para achar o penúltimo nó? Por que não dá para voltar a partir do último?'},
{t:'Troque para a lista dupla', d:'Clique em <b>Lista Dupla</b> e execute o mesmo <code>removeTail</code>.', obs:'Compare o número de passos. Qual ponteiro (<code>prev</code>) evita o laço inteiro?'},
{t:'Observe o momento do free', d:'Pare exatamente na linha do <code>free</code> nos dois modos.', obs:'Algum ponteiro ainda aponta para o nó liberado nesse instante? Se sim, ele vira um dangling pointer.'},
{t:'Desafio: preveja antes de clicar', d:'Reinicie e, antes de cada passo, diga em voz alta qual ponteiro vai mudar.', obs:'Acertou todos? Se errou algum, volte com <b>◀ Anterior</b> e descubra por quê.'}
],
quiz:[
{q:'Depois de <code>int x=5; int *p=&amp;x; *p = *p + 1;</code>, quanto vale <code>x</code>?', ops:['5','6','O endereço de x','Erro de compilação'], ok:1, exp:'<code>*p</code> é o próprio <code>x</code>; somar 1 em <code>*p</code> soma 1 em <code>x</code>.'},
{q:'O que <code>p-&gt;prox</code> significa?', ops:['O endereço de p','(*p).prox','p + 1','prox convertido em ponteiro'], ok:1, exp:'A seta é só um atalho para desreferenciar e acessar o campo.'},
{q:'Qual destas linhas gera um <i>dangling pointer</i>?', ops:['No *n = malloc(sizeof(No));','free(n); printf("%d", n-&gt;valor);','n = NULL;','No *m = n;'], ok:1, exp:'Depois do <code>free</code>, a memória não é mais sua: ler <code>n-&gt;valor</code> é comportamento indefinido.'},
{q:'Em Python, depois de <code>a=[1]; b=a; b.append(2)</code>, o que é <code>a</code>?', ops:['[1]','[1, 2]','[2]','Erro'], ok:1, exp:'<code>a</code> e <code>b</code> referenciam o mesmo objeto lista.'},
{q:'Qual o equivalente de <code>NULL</code> nos códigos em Python?', ops:['0','False','None','[]'], ok:2, exp:'<code>None</code> representa "não aponta para nada".'}
],
prog:[
{t:'Trocar dois inteiros', enun:'Escreva <code>troca(a, b)</code> que troca os valores de duas variáveis. Em C use ponteiros; em Python, devolva o par trocado (por quê não dá para fazer igual?).', dica:'Em C a função precisa receber <code>int *a, int *b</code> e usar uma variável temporária.',
c:`#include <stdio.h>

void troca(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void) {
    int x = 1, y = 2;
    troca(&x, &y);
    printf("%d %d\\n", x, y);   /* 2 1 */
    return 0;
}`,
py:`# Inteiros são imutáveis em Python: a função não consegue
# alterar a variável de quem chamou, então devolvemos o par.
def troca(a, b):
    return b, a


x, y = 1, 2
x, y = troca(x, y)
print(x, y)   # 2 1`},
{t:'Contar nós de uma cadeia', enun:'Dado o primeiro nó de uma cadeia de <code>No</code>, devolva quantos nós existem até chegar em <code>NULL</code>/<code>None</code>.', dica:'Um ponteiro auxiliar que avança com <code>it = it-&gt;prox</code> e um contador.',
c:`#include <stddef.h>

typedef struct No { int valor; struct No *prox; } No;

int conta(const No *inicio) {
    int total = 0;
    for (const No *it = inicio; it != NULL; it = it->prox)
        total++;
    return total;
}`,
py:`def conta(inicio):
    total = 0
    it = inicio
    while it is not None:
        total += 1
        it = it.prox
    return total`}
]
});

MODS.push({
id:'vetor', n:2, era:0, titulo:'Lista Sequencial (Vetor)', sub:'Acesso direto por índice, inserção cara no meio',
viz:'viz/lista-vetor.html',
slides:[
{t:'Uma sequência em memória contígua', h:`
<p class="lead">A lista sequencial guarda os elementos <b>um ao lado do outro</b>, num vetor de capacidade fixa, e uma variável <code>tamanho</code> diz quantos estão em uso.</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul>
<li>explicar por que o acesso <code>v[i]</code> é O(1);</li>
<li>implementar inserção e remoção com deslocamento;</li>
<li>prever o custo de inserir no início, no meio e no fim.</li></ul></div>
<div class="analogia"><b>Analogia</b>Uma fileira de cadeiras numeradas num cinema. Achar a cadeira 7 é imediato. Mas, para alguém sentar na cadeira 2, todo mundo da 2 em diante precisa se levantar e andar uma cadeira para a direita.</div>`},
{t:'Por que o acesso é O(1)', h:`
<p>Se o vetor começa no endereço <code>base</code> e cada elemento ocupa <code>t</code> bytes, o elemento <code>i</code> está em:</p>
<pre>endereço(v[i]) = base + i × t</pre>
<p>Uma conta, um acesso. Não importa se o vetor tem 10 ou 10 milhões de elementos.</p>
<h3>O preço: deslocar</h3>
<p>Inserir na posição <code>p</code> exige mover <code>tamanho − p</code> elementos uma casa para a direita, <b>de trás para frente</b> (senão você sobrescreve o que ainda não moveu). Remover faz o inverso: puxa todo mundo uma casa para a esquerda.</p>`},
{t:'Casos que caem em prova', h:`
<div class="cards">
<div class="card"><b>Inserir no fim</b>Nenhum deslocamento: O(1), se houver espaço.</div>
<div class="card"><b>Inserir no início</b>Desloca todos os n elementos: O(n).</div>
<div class="card"><b>Buscar um valor</b>Sem ordem, precisa olhar um por um: O(n).</div>
<div class="card"><b>Vetor cheio</b>Na versão estática, a inserção falha. Na dinâmica, aloca o dobro e copia.</div>
</div>
<div class="alerta"><b>Erro comum.</b> Deslocar da esquerda para a direita (<code>for i = p; i &lt; n</code>): o primeiro passo sobrescreve <code>v[p+1]</code> antes de ele ser copiado, e o mesmo valor se espalha pelo vetor.</div>
<div class="free">No Python, <code>list</code> já é um vetor dinâmico: <code>insert(0, x)</code> é O(n) pelo mesmo motivo, e <code>append</code> é O(1) amortizado.</div>`}
],
codigo:{nota:'Lista sequencial estática com capacidade fixa. As funções devolvem 1 em sucesso e 0 em falha.',
c:`#include <stdio.h>
#define CAP 10

typedef struct {
    int dados[CAP];
    int tamanho;
} Lista;

int inserir(Lista *l, int pos, int valor) {
    if (l->tamanho == CAP || pos < 0 || pos > l->tamanho) return 0;
    for (int i = l->tamanho; i > pos; i--)   /* de trás pra frente */
        l->dados[i] = l->dados[i - 1];
    l->dados[pos] = valor;
    l->tamanho++;
    return 1;
}

int remover(Lista *l, int pos) {
    if (pos < 0 || pos >= l->tamanho) return 0;
    for (int i = pos; i < l->tamanho - 1; i++)
        l->dados[i] = l->dados[i + 1];
    l->tamanho--;
    return 1;
}

int buscar(const Lista *l, int valor) {
    for (int i = 0; i < l->tamanho; i++)
        if (l->dados[i] == valor) return i;
    return -1;
}

int main(void) {
    Lista l = { .tamanho = 0 };
    inserir(&l, 0, 30); inserir(&l, 0, 10); inserir(&l, 1, 20);
    remover(&l, 0);
    for (int i = 0; i < l.tamanho; i++) printf("%d ", l.dados[i]);
    printf("| 30 está em %d\\n", buscar(&l, 30));   /* 20 30 | 1 */
    return 0;
}`,
py:`class ListaSequencial:
    def __init__(self, capacidade=10):
        self.dados = [None] * capacidade
        self.tamanho = 0

    def inserir(self, pos, valor):
        if self.tamanho == len(self.dados) or not 0 <= pos <= self.tamanho:
            return False
        for i in range(self.tamanho, pos, -1):   # de trás pra frente
            self.dados[i] = self.dados[i - 1]
        self.dados[pos] = valor
        self.tamanho += 1
        return True

    def remover(self, pos):
        if not 0 <= pos < self.tamanho:
            return False
        for i in range(pos, self.tamanho - 1):
            self.dados[i] = self.dados[i + 1]
        self.tamanho -= 1
        self.dados[self.tamanho] = None
        return True

    def buscar(self, valor):
        for i in range(self.tamanho):
            if self.dados[i] == valor:
                return i
        return -1


l = ListaSequencial()
l.inserir(0, 30); l.inserir(0, 10); l.inserir(1, 20)
l.remover(0)
print(l.dados[:l.tamanho], "| 30 está em", l.buscar(30))  # [20, 30] | 1`},
custo:[['Acessar v[i]','O(1)','Conta de endereço'],['Inserir/remover no fim','O(1)','Sem deslocamento'],['Inserir/remover no início ou meio','O(n)','Desloca até n elementos'],['Buscar valor (sem ordem)','O(n)','Busca linear'],['Buscar valor (ordenado)','O(log n)','Busca binária']],
pratica:[
{t:'Preencha e insira no início', d:'Use <b>🎲 Preencher aleatoriamente</b> e depois <b>+ Inserir no início</b>.', obs:'Conte quantos elementos andaram. Bate com o tamanho da lista?'},
{t:'Insira no fim', d:'Agora use <b>+ Inserir no fim</b>.', obs:'Quantos deslocamentos aconteceram? Compare com o passo anterior.'},
{t:'Remova do meio', d:'Escolha uma posição central em <b>− Remover posição</b> e avance passo a passo.', obs:'Em que direção os elementos se movem? E em que ordem?'},
{t:'Encha até o limite', d:'Continue inserindo até a lista ficar cheia.', obs:'O que o visualizador faz quando não há mais espaço? Como um vetor dinâmico resolveria?'}
],
quiz:[
{q:'Numa lista com 8 elementos, quantos deslocamentos são feitos para inserir na posição 3?', ops:['3','5','8','4'], ok:1, exp:'Movem-se os elementos das posições 3 a 7: 8 − 3 = 5.'},
{q:'Por que o deslocamento para inserir é feito de trás para frente?', ops:['Por desempenho','Para não sobrescrever valores ainda não copiados','Porque o C exige','Para manter a ordem decrescente'], ok:1, exp:'Copiando do fim, cada casa só é sobrescrita depois de ter sido copiada.'},
{q:'Qual operação é O(1) numa lista sequencial?', ops:['Inserir no início','Buscar valor','Acessar a posição i','Remover do início'], ok:2, exp:'O acesso por índice é uma conta de endereço.'},
{q:'Se a lista estiver ordenada, buscar um valor pode custar:', ops:['O(1)','O(log n)','O(n²)','O(n log n)'], ok:1, exp:'Com ordem, dá para usar busca binária.'},
{q:'Em Python, <code>lista.insert(0, x)</code> custa:', ops:['O(1)','O(log n)','O(n)','Depende do x'], ok:2, exp:'<code>list</code> é um vetor: inserir no início desloca todos.'}
],
prog:[
{t:'Remover todas as ocorrências', enun:'Remova da lista todas as ocorrências de <code>valor</code> em <b>uma única passada</b> (O(n)), sem chamar <code>remover</code> várias vezes.', dica:'Use dois índices: <code>i</code> lê, <code>j</code> escreve. Só avance <code>j</code> quando o elemento lido for diferente de <code>valor</code>.',
c:`#define CAP 10
typedef struct { int dados[CAP]; int tamanho; } Lista;

int remover_todos(Lista *l, int valor) {
    int j = 0;
    for (int i = 0; i < l->tamanho; i++)
        if (l->dados[i] != valor)
            l->dados[j++] = l->dados[i];
    int removidos = l->tamanho - j;
    l->tamanho = j;
    return removidos;
}`,
py:`def remover_todos(dados, tamanho, valor):
    """Compacta dados[:tamanho]; devolve o novo tamanho."""
    j = 0
    for i in range(tamanho):
        if dados[i] != valor:
            dados[j] = dados[i]
            j += 1
    for k in range(j, tamanho):
        dados[k] = None
    return j`},
{t:'Inserir mantendo a ordem', enun:'A lista está em ordem crescente. Insira <code>valor</code> na posição correta para que ela continue ordenada.', dica:'Comece do fim: enquanto o elemento à esquerda for maior que <code>valor</code>, desloque-o para a direita.',
c:`#define CAP 10
typedef struct { int dados[CAP]; int tamanho; } Lista;

int inserir_ordenado(Lista *l, int valor) {
    if (l->tamanho == CAP) return 0;
    int i = l->tamanho;
    while (i > 0 && l->dados[i - 1] > valor) {
        l->dados[i] = l->dados[i - 1];
        i--;
    }
    l->dados[i] = valor;
    l->tamanho++;
    return 1;
}`,
py:`def inserir_ordenado(dados, tamanho, valor):
    """dados tem espaço livre; devolve o novo tamanho."""
    if tamanho == len(dados):
        return tamanho
    i = tamanho
    while i > 0 and dados[i - 1] > valor:
        dados[i] = dados[i - 1]
        i -= 1
    dados[i] = valor
    return tamanho + 1`}
]
});

MODS.push({
id:'estatica', n:3, era:0, titulo:'Lista Encadeada Estática', sub:'Ponteiros simulados por índices dentro de um vetor',
viz:'viz/lista-estatica.html',
slides:[
{t:'O meio-termo', h:`
<p class="lead">E se quiséssemos a flexibilidade de uma lista encadeada, mas <b>sem malloc</b>? A lista encadeada estática guarda os nós num vetor e usa o <b>índice</b> do próximo nó no lugar de um ponteiro.</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul>
<li>representar um encadeamento com índices;</li>
<li>gerenciar uma <b>lista livre</b> de posições disponíveis;</li>
<li>inserir e remover sem deslocar nenhum elemento.</li></ul></div>
<div class="analogia"><b>Analogia</b>Um caça ao tesouro numa sala com armários numerados: dentro de cada armário há um prêmio e um bilhete dizendo "o próximo está no armário 5". A ordem dos bilhetes não tem nada a ver com a ordem dos armários.</div>`},
{t:'Duas listas no mesmo vetor', h:`
<p>Cada posição do vetor tem <code>valor</code> e <code>prox</code> (um índice, ou <code>-1</code> para "fim"). Duas "cabeças" convivem no mesmo vetor:</p>
<div class="cards">
<div class="card"><b><code>inicio</code></b>Índice do primeiro nó da lista de dados.</div>
<div class="card"><b><code>livre</code></b>Índice da primeira posição vazia. As vazias também formam uma lista encadeada.</div>
</div>
<h3>Alocar e liberar</h3>
<p><b>Alocar</b> = tirar a primeira posição da lista livre. <b>Liberar</b> = devolver a posição para o começo da lista livre. As duas operações são O(1), e é exatamente isso que um alocador de memória de verdade faz em sistemas embarcados.</p>`},
{t:'Onde isso aparece', h:`
<div class="cards">
<div class="card"><b>Firmware e embarcados</b>Sem heap, ou com heap proibida por norma de segurança.</div>
<div class="card"><b>Pools de objetos</b>Jogos reutilizam projéteis e partículas sem alocar a cada quadro.</div>
<div class="card"><b>Serialização</b>Índices continuam válidos se o vetor for salvo em disco; ponteiros não.</div>
</div>
<div class="alerta"><b>Limite.</b> A capacidade é fixa. Quando a lista livre fica vazia (<code>livre == -1</code>), não há onde inserir.</div>`}
],
codigo:{nota:'Inserção no início e remoção por valor. O índice -1 faz o papel de NULL.',
c:`#include <stdio.h>
#define CAP 8

typedef struct { int valor; int prox; } Celula;
typedef struct { Celula v[CAP]; int inicio, livre; } ListaE;

void iniciar(ListaE *l) {
    l->inicio = -1;
    l->livre = 0;
    for (int i = 0; i < CAP - 1; i++) l->v[i].prox = i + 1;
    l->v[CAP - 1].prox = -1;
}

int alocar(ListaE *l) {
    int i = l->livre;
    if (i != -1) l->livre = l->v[i].prox;
    return i;
}

void liberar(ListaE *l, int i) {
    l->v[i].prox = l->livre;
    l->livre = i;
}

int inserir_inicio(ListaE *l, int valor) {
    int i = alocar(l);
    if (i == -1) return 0;
    l->v[i].valor = valor;
    l->v[i].prox = l->inicio;
    l->inicio = i;
    return 1;
}

int remover(ListaE *l, int valor) {
    int ant = -1, at = l->inicio;
    while (at != -1 && l->v[at].valor != valor) { ant = at; at = l->v[at].prox; }
    if (at == -1) return 0;
    if (ant == -1) l->inicio = l->v[at].prox;
    else l->v[ant].prox = l->v[at].prox;
    liberar(l, at);
    return 1;
}

int main(void) {
    ListaE l; iniciar(&l);
    inserir_inicio(&l, 3); inserir_inicio(&l, 2); inserir_inicio(&l, 1);
    remover(&l, 2);
    for (int i = l.inicio; i != -1; i = l.v[i].prox) printf("%d(slot %d) ", l.v[i].valor, i);
    printf("| livre = %d\\n", l.livre);
    return 0;
}`,
py:`class ListaEstatica:
    def __init__(self, cap=8):
        self.valor = [None] * cap
        self.prox = list(range(1, cap)) + [-1]
        self.inicio = -1
        self.livre = 0

    def _alocar(self):
        i = self.livre
        if i != -1:
            self.livre = self.prox[i]
        return i

    def _liberar(self, i):
        self.valor[i] = None
        self.prox[i] = self.livre
        self.livre = i

    def inserir_inicio(self, v):
        i = self._alocar()
        if i == -1:
            return False
        self.valor[i] = v
        self.prox[i] = self.inicio
        self.inicio = i
        return True

    def remover(self, v):
        ant, at = -1, self.inicio
        while at != -1 and self.valor[at] != v:
            ant, at = at, self.prox[at]
        if at == -1:
            return False
        if ant == -1:
            self.inicio = self.prox[at]
        else:
            self.prox[ant] = self.prox[at]
        self._liberar(at)
        return True


l = ListaEstatica()
for x in (3, 2, 1):
    l.inserir_inicio(x)
l.remover(2)
i = l.inicio
while i != -1:
    print(f"{l.valor[i]}(slot {i})", end=" ")
    i = l.prox[i]
print("| livre =", l.livre)`},
custo:[['Alocar/liberar posição','O(1)','Topo da lista livre'],['Inserir no início','O(1)','Sem deslocamento'],['Inserir no fim','O(n)','Precisa achar o último (ou guardar um índice fim)'],['Buscar/remover por valor','O(n)','Percorre seguindo prox']],
pratica:[
{t:'Observe a lista livre', d:'Comece com <b>↺ Nova lista vazia</b> e insira três valores no início.', obs:'Em quais slots do vetor eles foram parar? A ordem dos slots é a ordem da lista?'},
{t:'Remova e reinsira', d:'Remova o valor do meio e depois insira um novo valor.', obs:'O novo valor reaproveitou o slot liberado? Por quê?'},
{t:'Insira no fim', d:'Use <b>+ Inserir no fim</b> e avance passo a passo.', obs:'Quantos saltos de <code>prox</code> foram necessários até achar o último?'},
{t:'Esgote a capacidade', d:'Preencha até não sobrar slot livre.', obs:'Qual é o valor de <code>livre</code> nesse momento?'}
],
quiz:[
{q:'Na lista encadeada estática, o campo <code>prox</code> guarda:', ops:['Um endereço de memória','O índice do próximo nó no vetor','O valor do próximo nó','O tamanho da lista'], ok:1, exp:'O índice substitui o ponteiro.'},
{q:'O que indica <code>livre == -1</code>?', ops:['A lista está vazia','Não há posições disponíveis','O primeiro slot está livre','Erro de inicialização'], ok:1, exp:'A lista de posições livres acabou: a estrutura está cheia.'},
{q:'Remover um nó do meio exige deslocar elementos do vetor?', ops:['Sim, todos à direita','Sim, metade','Não, só ajusta um prox','Só se for o primeiro'], ok:2, exp:'Basta o anterior "pular" o removido e o slot voltar para a lista livre.'},
{q:'Uma vantagem sobre a lista com malloc é:', ops:['Capacidade ilimitada','Sem fragmentação e memória previsível','Acesso O(1) ao k-ésimo elemento','Busca binária'], ok:1, exp:'Tudo cabe num bloco fixo, sem pedir memória ao sistema.'},
{q:'Liberar um slot coloca ele em que lugar da lista livre?', ops:['No fim','No início','Na posição ordenada','Em lugar nenhum'], ok:1, exp:'Inserir no início da lista livre é O(1).'}
],
prog:[
{t:'Inserir no fim em O(1)', enun:'Acrescente à estrutura um campo <code>fim</code> e escreva <code>inserir_fim</code> em O(1). Lembre de atualizar <code>fim</code> também na remoção.', dica:'Se a lista estiver vazia, o novo nó é <code>inicio</code> e <code>fim</code> ao mesmo tempo. Senão, <code>v[fim].prox = novo</code>.',
c:`#define CAP 8
typedef struct { int valor; int prox; } Celula;
typedef struct { Celula v[CAP]; int inicio, fim, livre; } ListaE;

int inserir_fim(ListaE *l, int valor) {
    int i = l->livre;
    if (i == -1) return 0;
    l->livre = l->v[i].prox;
    l->v[i].valor = valor;
    l->v[i].prox = -1;
    if (l->inicio == -1) l->inicio = i;
    else l->v[l->fim].prox = i;
    l->fim = i;
    return 1;
}`,
py:`def inserir_fim(l, v):
    """l é uma ListaEstatica com o atributo extra l.fim."""
    i = l.livre
    if i == -1:
        return False
    l.livre = l.prox[i]
    l.valor[i] = v
    l.prox[i] = -1
    if l.inicio == -1:
        l.inicio = i
    else:
        l.prox[l.fim] = i
    l.fim = i
    return True`},
{t:'Contar posições livres', enun:'Escreva uma função que devolve quantos slots ainda estão livres, percorrendo a lista livre.', dica:'É o mesmo laço de percorrer a lista de dados, só que começando em <code>livre</code>.',
c:`#define CAP 8
typedef struct { int valor; int prox; } Celula;
typedef struct { Celula v[CAP]; int inicio, livre; } ListaE;

int livres(const ListaE *l) {
    int n = 0;
    for (int i = l->livre; i != -1; i = l->v[i].prox) n++;
    return n;
}`,
py:`def livres(l):
    n, i = 0, l.livre
    while i != -1:
        n += 1
        i = l.prox[i]
    return n`}
]
});

MODS.push({
id:'simples', n:4, era:0, titulo:'Lista Encadeada (Simples)', sub:'Nós ligados por ponteiros, sem posição fixa',
viz:'viz/lista-simples.html',
slides:[
{t:'Nós espalhados pela memória', h:`
<p class="lead">Cada nó guarda um valor e o endereço do próximo. A lista inteira é acessada a partir de um único ponteiro: a <b>cabeça</b> (<code>head</code>).</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul>
<li>inserir no início e no fim;</li>
<li>remover por valor usando o par <code>anterior/atual</code>;</li>
<li>reverter a lista no lugar, com três ponteiros.</li></ul></div>
<div class="analogia"><b>Analogia</b>Uma corrente de clipes: para chegar ao quinto clipe, você passa pelos quatro primeiros. Mas para colocar um clipe novo na frente, basta engatar um só.</div>`},
{t:'Inserir e remover', h:`
<h3>Inserir no início: O(1)</h3>
<pre>novo-&gt;prox = head;
head = novo;</pre>
<p>A ordem importa: se você fizer <code>head = novo</code> primeiro, perde o resto da lista.</p>
<h3>Remover por valor: O(n)</h3>
<p>Ande com dois ponteiros, <code>ant</code> e <code>at</code>. Quando <code>at</code> achar o valor, faça <code>ant-&gt;prox = at-&gt;prox</code> e libere <code>at</code>. Se o valor estiver na cabeça, não há <code>ant</code>: atualize <code>head</code>.</p>
<div class="alerta"><b>Remover o último é O(n)</b>, mesmo guardando um ponteiro <code>tail</code>: para atualizar o penúltimo, você precisa encontrá-lo, e não dá para andar para trás.</div>`},
{t:'Reverter com três ponteiros', h:`
<pre>ant = NULL; at = head;
while (at) {
    prox = at-&gt;prox;  // 1. guarda o resto
    at-&gt;prox = ant;   // 2. vira a seta
    ant = at;         // 3. avança os dois
    at = prox;
}
head = ant;</pre>
<p>Cada nó tem sua seta invertida exatamente uma vez: O(n) de tempo e O(1) de memória extra.</p>
<div class="free">Esse algoritmo é pergunta clássica de entrevista. No visualizador, use <b>⇄ Reverter lista</b> e acompanhe os três ponteiros.</div>`}
],
codigo:{nota:'Lista simples com head, inserção no início e no fim, remoção por valor e reversão.',
c:`#include <stdio.h>
#include <stdlib.h>

typedef struct No { int valor; struct No *prox; } No;

No *inserir_inicio(No *head, int v) {
    No *n = malloc(sizeof(No));
    n->valor = v;
    n->prox = head;
    return n;                         /* nova cabeça */
}

No *inserir_fim(No *head, int v) {
    No *n = malloc(sizeof(No));
    n->valor = v; n->prox = NULL;
    if (!head) return n;
    No *it = head;
    while (it->prox) it = it->prox;
    it->prox = n;
    return head;
}

No *remover(No *head, int v) {
    No *ant = NULL, *at = head;
    while (at && at->valor != v) { ant = at; at = at->prox; }
    if (!at) return head;             /* não achou */
    if (!ant) head = at->prox;
    else ant->prox = at->prox;
    free(at);
    return head;
}

No *reverter(No *head) {
    No *ant = NULL, *at = head, *prox;
    while (at) { prox = at->prox; at->prox = ant; ant = at; at = prox; }
    return ant;
}

void imprimir(const No *h) {
    for (; h; h = h->prox) printf("%d -> ", h->valor);
    printf("NULL\\n");
}

int main(void) {
    No *h = NULL;
    h = inserir_fim(h, 2); h = inserir_fim(h, 3); h = inserir_inicio(h, 1);
    imprimir(h);
    h = remover(h, 2);
    h = reverter(h);
    imprimir(h);                      /* 3 -> 1 -> NULL */
    while (h) { No *t = h->prox; free(h); h = t; }
    return 0;
}`,
py:`class No:
    def __init__(self, valor, prox=None):
        self.valor = valor
        self.prox = prox


class ListaSimples:
    def __init__(self):
        self.head = None

    def inserir_inicio(self, v):
        self.head = No(v, self.head)

    def inserir_fim(self, v):
        novo = No(v)
        if self.head is None:
            self.head = novo
            return
        it = self.head
        while it.prox is not None:
            it = it.prox
        it.prox = novo

    def remover(self, v):
        ant, at = None, self.head
        while at is not None and at.valor != v:
            ant, at = at, at.prox
        if at is None:
            return False
        if ant is None:
            self.head = at.prox
        else:
            ant.prox = at.prox
        return True

    def reverter(self):
        ant, at = None, self.head
        while at is not None:
            prox = at.prox
            at.prox = ant
            ant, at = at, prox
        self.head = ant

    def __str__(self):
        partes, it = [], self.head
        while it:
            partes.append(str(it.valor))
            it = it.prox
        return " -> ".join(partes + ["None"])


l = ListaSimples()
l.inserir_fim(2); l.inserir_fim(3); l.inserir_inicio(1)
print(l)
l.remover(2); l.reverter()
print(l)   # 3 -> 1 -> None`},
custo:[['Inserir no início','O(1)','Só muda head'],['Inserir no fim','O(n) ou O(1)','O(1) se guardar tail'],['Remover do início','O(1)',''],['Remover do fim','O(n)','Precisa achar o penúltimo'],['Buscar / acessar k-ésimo','O(n)','Sem acesso por índice'],['Reverter','O(n)','O(1) de memória extra']],
pratica:[
{t:'Insira no início e no fim', d:'Comece com <b>↺ Nova lista aleatória</b>, insira um valor no início e outro no fim.', obs:'Qual das duas operações percorreu a lista? Quantos passos?'},
{t:'Remova o primeiro e o último', d:'Use <b>Remover início</b> e depois <b>Remover fim</b>.', obs:'Por que remover o fim precisa andar até o penúltimo?'},
{t:'Reverta a lista', d:'Clique em <b>⇄ Reverter lista</b> e avance passo a passo.', obs:'Acompanhe <code>ant</code>, <code>at</code> e <code>prox</code>. Em que momento a cabeça muda?'},
{t:'Remova um valor inexistente', d:'Tente <b>− Remover valor</b> com um número que não está na lista.', obs:'Até onde o ponteiro <code>at</code> chega antes de desistir?'}
],
quiz:[
{q:'Qual a ordem correta para inserir <code>novo</code> no início?', ops:['head = novo; novo->prox = head;','novo->prox = head; head = novo;','head->prox = novo;','novo->prox = NULL; head = novo;'], ok:1, exp:'Primeiro ligue o novo ao resto, depois mova a cabeça. Ao contrário, o resto se perde.'},
{q:'Remover o último nó de uma lista simples com ponteiro <code>tail</code> custa:', ops:['O(1)','O(log n)','O(n)','O(n²)'], ok:2, exp:'É preciso achar o penúltimo para virar o novo tail, e só dá para andar para frente.'},
{q:'Ao reverter a lista 1→2→3, qual é a cabeça no final?', ops:['1','2','3','NULL'], ok:2, exp:'O último vira o primeiro.'},
{q:'Quanto de memória extra a reversão com três ponteiros usa?', ops:['O(1)','O(log n)','O(n)','Depende da lista'], ok:0, exp:'Só três variáveis, independente do tamanho.'},
{q:'Por que não existe acesso O(1) ao k-ésimo elemento?', ops:['Os nós não são contíguos na memória','O C não permite','Falta um campo índice','Por causa do free'], ok:0, exp:'Não há fórmula de endereço: é preciso seguir os ponteiros.'}
],
prog:[
{t:'Achar o nó do meio', enun:'Devolva o valor do nó do meio da lista em <b>uma única passada</b>. Com número par de nós, devolva o segundo do meio.', dica:'Dois ponteiros: o lento anda 1, o rápido anda 2. Quando o rápido chegar ao fim, o lento está no meio.',
c:`#include <stddef.h>
typedef struct No { int valor; struct No *prox; } No;

int meio(const No *head) {          /* lista não vazia */
    const No *lento = head, *rapido = head;
    while (rapido && rapido->prox) {
        lento = lento->prox;
        rapido = rapido->prox->prox;
    }
    return lento->valor;
}`,
py:`def meio(head):
    lento = rapido = head
    while rapido is not None and rapido.prox is not None:
        lento = lento.prox
        rapido = rapido.prox.prox
    return lento.valor`},
{t:'Detectar ciclo', enun:'Uma lista pode ter um erro em que o último nó aponta de volta para um nó anterior. Escreva uma função que diz se existe ciclo, sem usar memória extra.', dica:'Algoritmo da tartaruga e da lebre (Floyd): se houver ciclo, o ponteiro rápido alcança o lento.',
c:`#include <stddef.h>
typedef struct No { int valor; struct No *prox; } No;

int tem_ciclo(const No *head) {
    const No *lento = head, *rapido = head;
    while (rapido && rapido->prox) {
        lento = lento->prox;
        rapido = rapido->prox->prox;
        if (lento == rapido) return 1;
    }
    return 0;
}`,
py:`def tem_ciclo(head):
    lento = rapido = head
    while rapido is not None and rapido.prox is not None:
        lento = lento.prox
        rapido = rapido.prox.prox
        if lento is rapido:
            return True
    return False`}
]
});

MODS.push({
id:'dupla', n:5, era:0, titulo:'Lista Duplamente Encadeada', sub:'Navegação nos dois sentidos',
viz:'viz/lista-dupla.html',
slides:[
{t:'Um ponteiro a mais', h:`
<p class="lead">Cada nó agora tem <code>prev</code> e <code>prox</code>. Guardando também <code>tail</code>, remover o último deixa de ser O(n) e passa a ser O(1).</p>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul>
<li>manter <code>head</code> e <code>tail</code> consistentes;</li>
<li>remover um nó conhecido em O(1);</li>
<li>percorrer a lista de trás para frente.</li></ul></div>
<div class="analogia"><b>Analogia</b>Os vagões de um trem com engates nas duas pontas: dá para andar para a frente ou para trás, e soltar um vagão do meio só exige mexer nos dois vizinhos.</div>`},
{t:'Remover um nó qualquer em O(1)', h:`
<pre>if (n-&gt;prev) n-&gt;prev-&gt;prox = n-&gt;prox;
else         head = n-&gt;prox;
if (n-&gt;prox) n-&gt;prox-&gt;prev = n-&gt;prev;
else         tail = n-&gt;prev;
free(n);</pre>
<p>Quatro ponteiros possíveis mudam, mas nenhum laço: se você já tem o endereço do nó, a remoção é constante. Isso não vale para <b>achar</b> o nó por valor, que continua O(n).</p>
<div class="alerta"><b>Erro comum.</b> Esquecer os casos de borda: remover a cabeça (sem <code>prev</code>), a cauda (sem <code>prox</code>) ou o único nó (os dois).</div>`},
{t:'Onde isso aparece de verdade', h:`
<div class="cards">
<div class="card"><b>Cache LRU</b>Hash + lista dupla: mover o item usado para a frente e descartar o do fim, tudo em O(1).</div>
<div class="card"><b>Desfazer/refazer</b>Andar para trás e para frente no histórico.</div>
<div class="card"><b>Navegador</b>Botões Voltar e Avançar.</div>
<div class="card"><b><code>collections.deque</code></b>Em Python, é implementado com blocos duplamente encadeados.</div>
</div>
<p>O custo é memória: um ponteiro extra por nó.</p>`}
],
codigo:{nota:'Lista dupla com head e tail. remover_no recebe o endereço do nó e é O(1).',
c:`#include <stdio.h>
#include <stdlib.h>

typedef struct No { int valor; struct No *prev, *prox; } No;
typedef struct { No *head, *tail; int tamanho; } ListaD;

No *inserir_fim(ListaD *l, int v) {
    No *n = malloc(sizeof(No));
    n->valor = v; n->prox = NULL; n->prev = l->tail;
    if (l->tail) l->tail->prox = n; else l->head = n;
    l->tail = n; l->tamanho++;
    return n;
}

void inserir_inicio(ListaD *l, int v) {
    No *n = malloc(sizeof(No));
    n->valor = v; n->prev = NULL; n->prox = l->head;
    if (l->head) l->head->prev = n; else l->tail = n;
    l->head = n; l->tamanho++;
}

void remover_no(ListaD *l, No *n) {       /* O(1) */
    if (n->prev) n->prev->prox = n->prox; else l->head = n->prox;
    if (n->prox) n->prox->prev = n->prev; else l->tail = n->prev;
    free(n); l->tamanho--;
}

int main(void) {
    ListaD l = {NULL, NULL, 0};
    inserir_fim(&l, 2);
    No *tres = inserir_fim(&l, 3);
    inserir_fim(&l, 4);
    inserir_inicio(&l, 1);
    remover_no(&l, tres);
    for (No *it = l.tail; it; it = it->prev) printf("%d ", it->valor);
    printf("(de trás pra frente)\\n");       /* 4 2 1 */
    while (l.head) remover_no(&l, l.head);
    return 0;
}`,
py:`class No:
    def __init__(self, valor):
        self.valor = valor
        self.prev = None
        self.prox = None


class ListaDupla:
    def __init__(self):
        self.head = self.tail = None
        self.tamanho = 0

    def inserir_fim(self, v):
        n = No(v)
        n.prev = self.tail
        if self.tail:
            self.tail.prox = n
        else:
            self.head = n
        self.tail = n
        self.tamanho += 1
        return n

    def inserir_inicio(self, v):
        n = No(v)
        n.prox = self.head
        if self.head:
            self.head.prev = n
        else:
            self.tail = n
        self.head = n
        self.tamanho += 1

    def remover_no(self, n):          # O(1)
        if n.prev:
            n.prev.prox = n.prox
        else:
            self.head = n.prox
        if n.prox:
            n.prox.prev = n.prev
        else:
            self.tail = n.prev
        self.tamanho -= 1

    def de_tras_pra_frente(self):
        it, saida = self.tail, []
        while it:
            saida.append(it.valor)
            it = it.prev
        return saida


l = ListaDupla()
l.inserir_fim(2); tres = l.inserir_fim(3); l.inserir_fim(4); l.inserir_inicio(1)
l.remover_no(tres)
print(l.de_tras_pra_frente())   # [4, 2, 1]`},
custo:[['Inserir/remover no início ou fim','O(1)','Com head e tail'],['Remover nó conhecido','O(1)','Já tem o endereço'],['Buscar por valor','O(n)',''],['Percorrer ao contrário','O(n)','Seguindo prev'],['Memória por nó','2 ponteiros','O dobro da lista simples']],
pratica:[
{t:'Remova o fim e conte os passos', d:'Use <b>Remover fim · O(1)</b>.', obs:'Compare com o mesmo botão na lista simples (módulo 4). Qual ponteiro tornou isso possível?'},
{t:'Percorra de trás para frente', d:'Clique em <b>◀◀ Percorrer de trás pra frente</b>.', obs:'De qual ponteiro o percurso começa?'},
{t:'Insira numa posição do meio', d:'Use <b>Inserir na posição</b> com um índice central.', obs:'Quantos ponteiros mudaram? Liste cada um.'},
{t:'Reverta a lista dupla', d:'Use <b>⇄ Reverter lista</b>.', obs:'Reverter aqui é trocar <code>prev</code> e <code>prox</code> de cada nó. O que acontece com head e tail?'}
],
quiz:[
{q:'Para remover um nó do meio de uma lista dupla, quantos ponteiros de <b>outros nós</b> mudam?', ops:['0','1','2','4'], ok:2, exp:'O <code>prox</code> do anterior e o <code>prev</code> do seguinte.'},
{q:'Qual operação melhora de O(n) para O(1) em relação à lista simples com tail?', ops:['Inserir no fim','Remover do fim','Buscar valor','Inserir no início'], ok:1, exp:'Com <code>tail-&gt;prev</code>, o penúltimo é encontrado na hora.'},
{q:'Ao remover o único nó de uma lista dupla, o que acontece?', ops:['Só head vira NULL','Só tail vira NULL','head e tail viram NULL','Nada muda'], ok:2, exp:'O nó não tem prev nem prox: os dois ramos de borda são executados.'},
{q:'Qual estrutura clássica combina hash com lista dupla?', ops:['Heap','Cache LRU','Trie','Árvore B'], ok:1, exp:'O hash acha o nó, a lista dupla o move ou remove em O(1).'},
{q:'O custo extra da lista dupla é principalmente:', ops:['Tempo de busca','Um ponteiro a mais por nó','Não dá para usar free','Precisa de vetor'], ok:1, exp:'Memória: cada nó carrega prev.'}
],
prog:[
{t:'Verificar se é palíndromo', enun:'Usando <code>head</code> e <code>tail</code>, diga se a sequência de valores é igual lida nos dois sentidos.', dica:'Dois ponteiros vindo das pontas até se encontrarem ou se cruzarem.',
c:`#include <stddef.h>
typedef struct No { int valor; struct No *prev, *prox; } No;

int palindromo(const No *head, const No *tail) {
    while (head && tail && head != tail && tail->prox != head) {
        if (head->valor != tail->valor) return 0;
        head = head->prox;
        tail = tail->prev;
    }
    return 1;
}`,
py:`def palindromo(head, tail):
    while head and tail and head is not tail and tail.prox is not head:
        if head.valor != tail.valor:
            return False
        head, tail = head.prox, tail.prev
    return True`},
{t:'Mover para a frente (base do LRU)', enun:'Escreva <code>mover_para_frente(l, n)</code> que tira o nó <code>n</code> da posição atual e o coloca como cabeça, em O(1), sem liberar memória.', dica:'É um <code>remover_no</code> sem o <code>free</code>, seguido de um <code>inserir_inicio</code> reaproveitando o nó.',
c:`#include <stddef.h>
typedef struct No { int valor; struct No *prev, *prox; } No;
typedef struct { No *head, *tail; } ListaD;

void mover_para_frente(ListaD *l, No *n) {
    if (l->head == n) return;
    n->prev->prox = n->prox;                 /* n não é a cabeça */
    if (n->prox) n->prox->prev = n->prev; else l->tail = n->prev;
    n->prev = NULL;
    n->prox = l->head;
    l->head->prev = n;
    l->head = n;
}`,
py:`def mover_para_frente(l, n):
    if l.head is n:
        return
    n.prev.prox = n.prox
    if n.prox:
        n.prox.prev = n.prev
    else:
        l.tail = n.prev
    n.prev = None
    n.prox = l.head
    l.head.prev = n
    l.head = n`}
]
});
