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
id:'struct', n:2, era:0, titulo:'Struct (Registros)', sub:'Vários campos de tipos diferentes num tipo só',
viz:'viz/struct.html',
slides:[
{t:'Por que agrupar campos', h:`
<p class="lead">Um aluno tem nome, matrícula e nota. Guardar isso em três variáveis soltas, ou em três vetores paralelos, funciona até o dia em que alguém ordena um vetor e esquece os outros dois. A <b>struct</b> junta os campos num único tipo, que anda inteiro pelo programa.</p>
<div class="cards">
<div class="card"><b>Vetores paralelos</b><code>nomes[i]</code>, <code>mats[i]</code> e <code>notas[i]</code> só ficam alinhados se você mexer nos três sempre juntos.</div>
<div class="card"><b>Struct</b><code>turma[i]</code> é um aluno completo: trocar, copiar ou passar para uma função leva todos os campos.</div>
</div>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul>
<li>declarar structs com <code>typedef</code> e acessar campos com <code>.</code> e <code>-&gt;</code>;</li>
<li>saber quando uma atribuição copia os dados e quando só copia a referência;</li>
<li>passar structs para funções por valor e por ponteiro;</li>
<li>prever o <code>sizeof</code> de uma struct, com o preenchimento (<i>padding</i>).</li></ul></div>
<div class="analogia"><b>Analogia</b>Uma ficha cadastral: cada linha é um campo com um tipo (texto, número, data), e a ficha inteira é guardada, copiada ou entregue de uma vez.</div>`},
{t:'Declarar e usar', h:`
<div class="duo"><pre data-l="c">typedef struct {
    char  nome[40];
    int   matricula;
    float nota;
} Aluno;

Aluno a = {"Ana", 2024001, 8.5f};
a.nota = 9.0f;                    // ponto: acessa um campo
printf("%s tirou %.1f\\n", a.nome, a.nota);</pre><pre data-l="py">from dataclasses import dataclass

@dataclass
class Aluno:
    nome: str
    matricula: int
    nota: float

a = Aluno("Ana", 2024001, 8.5)
a.nota = 9.0                      # ponto: acessa um campo
print(f"{a.nome} tirou {a.nota:.1f}")</pre></div>
<div class="cards">
<div class="card"><b>Com ou sem typedef</b><code>struct Aluno { … };</code> obriga a escrever <code>struct Aluno a;</code>. O <code>typedef</code> cria o apelido <code>Aluno</code>.</div>
<div class="card"><b>Em Python</b>Não há struct, mas uma <code>@dataclass</code> cumpre o mesmo papel: declara os campos e gera o construtor.</div>
</div>`},
{t:'Ponto, seta e cópia', h:`
<p>Com a variável, use <b>ponto</b>. Com um ponteiro para a struct, use <b>seta</b>: <code>p-&gt;nota</code> é o mesmo que <code>(*p).nota</code>.</p>
<div class="duo"><pre data-l="c">Aluno b = a;        // COPIA todos os campos (até o vetor nome)
b.nota = 0;         // a.nota continua 9.0

Aluno *p = &amp;a;
p-&gt;nota = 10;       // muda a.nota: o mesmo que (*p).nota = 10</pre><pre data-l="py">b = a               # NÃO copia: b é outro nome para o mesmo objeto
b.nota = 0          # a.nota também virou 0!

from copy import copy
c = copy(a)         # agora sim, um objeto independente
c.nota = 5          # a.nota não muda</pre></div>
<div class="alerta"><b>A grande diferença.</b> Em C, <code>b = a</code> com structs copia os bytes. Em Python, toda variável é uma referência, então <code>b = a</code> só cria outro nome para o mesmo objeto. Em Python, o ponteiro <code>p</code> do C se parece mais com o <code>b</code> do que com uma cópia.</div>
<div class="free">Por que <code>*p.nota</code> não funciona? O ponto tem precedência maior que o asterisco: o compilador lê <code>*(p.nota)</code>. A seta existe para evitar os parênteses.</div>`},
{t:'Structs e funções', h:`
<div class="duo"><pre data-l="c">void zerar_copia(Aluno a)  { a.nota = 0; }    // recebe uma cópia
void zerar(Aluno *a)       { a-&gt;nota = 0; }   // recebe o endereço
float ler(const Aluno *a)  { return a-&gt;nota; } // const: só leitura

zerar_copia(x);   // x.nota não muda
zerar(&amp;x);        // x.nota vira 0</pre><pre data-l="py">def zerar(a):
    a.nota = 0      # a função recebe a referência

zerar(x)            # x.nota vira 0

def zerar_copia(a):
    a = copy(a)     # só com cópia explícita
    a.nota = 0      # o original fica intacto</pre></div>
<div class="cards">
<div class="card"><b>Por valor</b>A função ganha uma cópia de <code>sizeof(Aluno)</code> bytes. Mudanças se perdem ao voltar.</div>
<div class="card"><b>Por ponteiro</b>Só 8 bytes (o endereço) são copiados, e a função pode alterar o original. Com <code>const</code>, promete que não vai.</div>
</div>
<p>Na prática, structs grandes quase sempre são passadas por ponteiro, mesmo quando a função só lê.</p>`},
{t:'Struct na memória: sizeof e padding', h:`
<p>Os campos ficam em sequência, na ordem em que foram declarados. Mas cada tipo gosta de começar num endereço múltiplo do seu tamanho (<b>alinhamento</b>): <code>int</code> de 4 em 4, <code>double</code> e ponteiros de 8 em 8. Para isso, o compilador insere bytes vazios, o <b>padding</b>.</p>
<pre>struct { char c; int i; char d; }      // 1 + 4 + 1 = 6 bytes de dados
c . . . i i i i d . . .                // sizeof = 12 (6 de padding)

struct { int i; char c; char d; }      // os mesmos campos, reordenados
i i i i c d . .                        // sizeof = 8</pre>
<div class="cards">
<div class="card"><b>Padding interno</b>Antes de um campo, para ele começar alinhado.</div>
<div class="card"><b>Padding final</b>No fim, para que num vetor de structs o próximo elemento também comece alinhado.</div>
<div class="card"><b>Regra prática</b>Declare os campos do maior para o menor alinhamento e o desperdício cai.</div>
</div>
<div class="free">Os números valem para as plataformas de 64 bits mais comuns. Use sempre <code>sizeof</code> e <code>offsetof</code> (de <code>&lt;stddef.h&gt;</code>) em vez de somar na mão.</div>`},
{t:'Vetores de structs e o nó das listas', h:`
<div class="duo"><pre data-l="c">Aluno turma[30];
turma[2].nota = 7.5f;           // índice primeiro, campo depois

typedef struct No {             // o nome No já existe aqui dentro...
    int valor;
    struct No *prox;            // ...para o campo apontar outro No
} No;</pre><pre data-l="py">turma = [Aluno("Ana", 1, 8.5), Aluno("Bia", 2, 6.0)]
turma[1].nota = 7.5             # índice primeiro, campo depois

@dataclass
class No:
    valor: int
    prox: "No | None" = None    # referência para outro No</pre></div>
<p>Uma struct pode conter outra struct, um vetor ou um ponteiro para o próprio tipo. Esse último caso, a struct <b>autorreferenciada</b>, é o tijolo de listas encadeadas, árvores e grafos: todos os próximos módulos usam um <code>struct No</code>.</p>
<div class="alerta"><b>Erro comum.</b> <code>typedef struct { int valor; No *prox; } No;</code> não compila: dentro das chaves, o apelido <code>No</code> ainda não existe. Por isso a struct ganha o nome <code>struct No</code> antes das chaves.</div>`}
],
codigo:{nota:'Uma turma num vetor de structs: cópia, alteração por ponteiro, média e melhor aluno.',
c:`#include <stdio.h>

typedef struct {
    char  nome[20];
    int   matricula;
    float nota;
} Aluno;

void bonificar(Aluno *a, float bonus) {     /* por ponteiro: altera o original */
    a->nota += bonus;
    if (a->nota > 10.0f) a->nota = 10.0f;
}

float media(const Aluno v[], int n) {       /* const: só lê */
    float soma = 0;
    for (int i = 0; i < n; i++) soma += v[i].nota;
    return n ? soma / n : 0;
}

const Aluno *melhor(const Aluno v[], int n) {
    const Aluno *m = &v[0];
    for (int i = 1; i < n; i++)
        if (v[i].nota > m->nota) m = &v[i];
    return m;
}

int main(void) {
    Aluno turma[] = {
        {"Ana",   101, 8.5f},
        {"Bruno", 102, 6.0f},
        {"Carla", 103, 9.5f},
    };
    int n = sizeof turma / sizeof turma[0];

    Aluno copia = turma[1];        /* cópia campo a campo */
    copia.nota = 0;                /* turma[1] não muda */
    bonificar(&turma[1], 1.5f);    /* turma[1] muda */

    printf("Bruno: %.1f (cópia: %.1f)\\n", turma[1].nota, copia.nota);
    printf("Média: %.2f\\n", media(turma, n));
    printf("Melhor: %s\\n", melhor(turma, n)->nome);
    printf("sizeof(Aluno) = %zu bytes\\n", sizeof(Aluno));
    return 0;
}`,
py:`from copy import copy
from dataclasses import dataclass


@dataclass
class Aluno:
    nome: str
    matricula: int
    nota: float


def bonificar(a, bonus):           # recebe a referência: altera o original
    a.nota = min(10.0, a.nota + bonus)


def media(turma):
    return sum(a.nota for a in turma) / len(turma) if turma else 0.0


def melhor(turma):
    return max(turma, key=lambda a: a.nota)


turma = [Aluno("Ana", 101, 8.5), Aluno("Bruno", 102, 6.0), Aluno("Carla", 103, 9.5)]

c = copy(turma[1])                 # em Python, cópia só quando você pede
c.nota = 0
bonificar(turma[1], 1.5)

print(f"Bruno: {turma[1].nota:.1f} (cópia: {c.nota:.1f})")
print(f"Média: {media(turma):.2f}")
print(f"Melhor: {melhor(turma).nome}")`},
custo:[['Acessar um campo (a.x ou p->x)','O(1)','Endereço da struct + deslocamento fixo do campo'],['Copiar uma struct (b = a)','O(tamanho)','Copia todos os bytes, inclusive vetores internos'],['Passar por valor','O(tamanho)','A função recebe uma cópia'],['Passar por ponteiro','O(1)','Só o endereço é copiado'],['Buscar num vetor de structs','O(n)','Compara um campo de cada elemento']],
pratica:[
{t:'A struct Aluno na memória', d:'Escolha o modelo <b>Aluno</b> e clique em cada campo do quadro de bytes.', obs:'Qual é o deslocamento (<code>offsetof</code>) de cada campo? O <code>sizeof</code> é a soma dos tamanhos?'},
{t:'Onde aparece o padding', d:'Escolha o modelo <b>char · int · char</b>.', obs:'Quantos bytes de preenchimento surgiram, e onde? Por que o <code>int</code> não começa no byte 1?'},
{t:'Reordene os campos', d:'Clique em <b>Ordenar por alinhamento</b>.', obs:'Quanto o <code>sizeof</code> diminuiu? Os campos são os mesmos?'},
{t:'Um nó de lista e um vetor de structs', d:'Escolha o modelo <b>No (lista)</b>, depois marque <b>Mostrar vetor[2]</b>.', obs:'Onde começa o campo <code>prox</code>? Por que o padding final importa quando há duas structs seguidas?'}
],
quiz:[
{q:'<code>p</code> é um <code>Aluno *</code>. Como mudar a nota do aluno apontado?', ops:['<code>p.nota = 9;</code>','<code>p-&gt;nota = 9;</code>','<code>*p.nota = 9;</code>','<code>&amp;p.nota = 9;</code>'], ok:1, exp:'A seta acessa o campo pelo ponteiro. <code>*p.nota</code> é lido como <code>*(p.nota)</code>, porque o ponto tem precedência maior.'},
{q:'Em C, depois de <code>Aluno b = a; b.nota = 0;</code>, o que acontece com <code>a.nota</code>?', ops:['Vira 0','Continua igual: b é uma cópia','Erro de compilação','Depende do compilador'], ok:1, exp:'Atribuir structs em C copia todos os bytes. <code>a</code> e <code>b</code> são independentes.'},
{q:'Em Python, com uma dataclass, depois de <code>b = a; b.nota = 0</code>:', ops:['a.nota continua igual','a.nota também vira 0: é o mesmo objeto','dá erro','o Python cria uma cópia automaticamente'], ok:1, exp:'Em Python, <code>b = a</code> só cria outro nome para o mesmo objeto. Para copiar, use <code>copy(a)</code>.'},
{q:'Numa plataforma de 64 bits típica, quanto vale <code>sizeof(struct { char c; int i; char d; })</code>?', ops:['6','8','12','16'], ok:2, exp:'c no byte 0, 3 bytes de padding, i nos bytes 4 a 7, d no 8, e mais 3 de padding final para o tamanho ser múltiplo de 4.'},
{q:'Por que o nó de lista é declarado como <code>typedef struct No { int valor; struct No *prox; } No;</code>?', ops:['Só por estética','Dentro das chaves o apelido No ainda não existe, então prox precisa usar struct No','Para o malloc funcionar','Para os campos ficarem ordenados'], ok:1, exp:'O <code>typedef</code> só termina no ponto e vírgula. Dentro das chaves, o nome disponível é <code>struct No</code>.'}
],
prog:[
{t:'Ponto médio e distância', enun:'Declare <code>Ponto</code> com <code>x</code> e <code>y</code> (<code>double</code>). Escreva <code>distancia(a, b)</code> e <code>medio(a, b)</code>, que devolve um <b>novo</b> Ponto.', dica:'Uma função pode devolver uma struct inteira: monte um <code>Ponto m</code>, preencha os campos e faça <code>return m;</code>. Use <code>sqrt</code> de <code>&lt;math.h&gt;</code>.',
c:`#include <math.h>

typedef struct { double x, y; } Ponto;

double distancia(Ponto a, Ponto b) {
    double dx = a.x - b.x, dy = a.y - b.y;
    return sqrt(dx * dx + dy * dy);
}

Ponto medio(Ponto a, Ponto b) {
    Ponto m = { (a.x + b.x) / 2, (a.y + b.y) / 2 };
    return m;                       /* devolve uma cópia da struct */
}`,
py:`from dataclasses import dataclass
from math import hypot


@dataclass
class Ponto:
    x: float
    y: float


def distancia(a, b):
    return hypot(a.x - b.x, a.y - b.y)


def medio(a, b):
    return Ponto((a.x + b.x) / 2, (a.y + b.y) / 2)`},
{t:'Buscar por matrícula', enun:'Dado um vetor de <code>Aluno</code>, devolva um <b>ponteiro</b> para o aluno com a matrícula pedida, ou <code>NULL</code> se não existir. Em Python, devolva o objeto ou <code>None</code>.', dica:'É uma busca sequencial (o módulo de Busca aprofunda o assunto), comparando só o campo <code>matricula</code>. Devolva <code>&amp;v[i]</code>, não <code>v[i]</code>, para quem chamou poder alterar o aluno.',
c:`#include <stddef.h>   /* NULL */

typedef struct { char nome[20]; int matricula; float nota; } Aluno;

Aluno *buscar_matricula(Aluno v[], int n, int mat) {
    for (int i = 0; i < n; i++)
        if (v[i].matricula == mat)
            return &v[i];           /* endereço do aluno dentro do vetor */
    return NULL;
}`,
py:`def buscar_matricula(turma, mat):
    for a in turma:
        if a.matricula == mat:
            return a                # a própria referência: pode ser alterada
    return None`},
{t:'Ordenar a turma por nota', enun:'Ordene o vetor de alunos da <b>maior</b> para a <b>menor</b> nota usando inserção (insertion sort). Os alunos devem se mover inteiros.', dica:'Guarde <code>Aluno atual = v[i]</code>, desloque para a direita os alunos com nota menor e coloque <code>atual</code> no buraco. Atribuir struct copia todos os campos de uma vez.',
c:`typedef struct { char nome[20]; int matricula; float nota; } Aluno;

void ordenar_por_nota(Aluno v[], int n) {
    for (int i = 1; i < n; i++) {
        Aluno atual = v[i];             /* cópia da struct inteira */
        int j = i - 1;
        while (j >= 0 && v[j].nota < atual.nota) {
            v[j + 1] = v[j];            /* move o aluno inteiro */
            j--;
        }
        v[j + 1] = atual;
    }
}`,
py:`def ordenar_por_nota(turma):
    for i in range(1, len(turma)):
        atual = turma[i]               # referência: nada é copiado
        j = i - 1
        while j >= 0 and turma[j].nota < atual.nota:
            turma[j + 1] = turma[j]
            j -= 1
        turma[j + 1] = atual
    # na prática: turma.sort(key=lambda a: a.nota, reverse=True)`}
]
});

MODS.push({
id:'alocacao', n:3, era:0, titulo:'Alocação Dinâmica', sub:'malloc, calloc, realloc e free: memória sob demanda',
viz:'viz/alocacao.html',
slides:[
{t:'Pilha e heap', h:`
<p class="lead">Variáveis locais moram na <b>pilha</b>: o tamanho é decidido na compilação e tudo some quando a função termina. Quando o tamanho só é conhecido durante a execução, ou quando o dado precisa sobreviver à função que o criou, pede-se memória ao <b>heap</b>.</p>
<div class="cards">
<div class="card"><b>Pilha (automática)</b><code>int v[100];</code> dentro de uma função. Rápida, liberada sozinha, mas de tamanho fixo e com vida curta.</div>
<div class="card"><b>Heap (dinâmica)</b><code>int *v = malloc(n * sizeof *v);</code> O tamanho vem em tempo de execução e o bloco vive até alguém chamar <code>free</code>.</div>
</div>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul>
<li>usar <code>malloc</code>, <code>calloc</code>, <code>realloc</code> e <code>free</code> corretamente;</li>
<li>montar um vetor que cresce dobrando a capacidade;</li>
<li>reconhecer vazamento, ponteiro pendente e <i>double free</i>.</li></ul></div>
<div class="analogia"><b>Analogia</b>O heap é o guarda-volumes da masmorra: você pede um espaço do tamanho que precisa e recebe um <b>ticket</b> (o ponteiro). Quem perde o ticket nunca mais recupera o espaço; quem devolve o espaço e continua usando o ticket mexe nas coisas de outra pessoa.</div>`},
{t:'malloc e free', h:`
<div class="duo"><pre data-l="c">#include &lt;stdlib.h&gt;

int n = 5;
int *v = malloc(n * sizeof *v);   // n inteiros, conteúdo indefinido (lixo)
if (v == NULL) {                  // sem memória: sempre verifique
    perror("malloc");
    exit(1);
}
for (int i = 0; i &lt; n; i++) v[i] = i * 10;

free(v);                          // devolve o bloco ao heap
v = NULL;                         // evita usar o endereço antigo</pre><pre data-l="py">n = 5
v = [None] * n        # o Python pede a memória por você
for i in range(n):
    v[i] = i * 10

v = None              # nenhum free: quando ninguém mais aponta
                      # para a lista, o coletor de lixo a libera</pre></div>
<div class="cards">
<div class="card"><b>Tamanho em bytes</b><code>malloc</code> recebe bytes. Escreva <code>n * sizeof *v</code>: se o tipo de <code>v</code> mudar, a conta continua certa.</div>
<div class="card"><b>Devolve void *</b>Em C não precisa de <i>cast</i>: o <code>void *</code> se converte sozinho para <code>int *</code>.</div>
<div class="card"><b>Pode falhar</b>Sem memória disponível, devolve <code>NULL</code>.</div>
</div>`},
{t:'calloc e structs no heap', h:`
<div class="duo"><pre data-l="c">int *zeros = calloc(n, sizeof *zeros);   // n inteiros, todos 0

Aluno *a = malloc(sizeof *a);            // uma struct no heap
if (a) {
    strcpy(a-&gt;nome, "Ana");
    a-&gt;nota = 9.5f;
}
free(a);
free(zeros);</pre><pre data-l="py">zeros = [0] * n                           # já nasce zerada

a = Aluno("Ana", 101, 9.5)               # todo objeto Python já vive
                                         # no heap; a é uma referência</pre></div>
<div class="cards">
<div class="card"><b>malloc(total)</b>Um argumento, em bytes. Conteúdo indefinido.</div>
<div class="card"><b>calloc(qtd, tamanho)</b>Dois argumentos. Zera todos os bytes e confere se <code>qtd × tamanho</code> estoura.</div>
</div>
<p>Uma função que cria uma struct com <code>malloc</code> e devolve o ponteiro é o padrão de todo nó de lista ou árvore: o nó continua existindo depois que a função termina.</p>`},
{t:'realloc: mudar o tamanho', h:`
<div class="duo"><pre data-l="c">int *tmp = realloc(v, novo * sizeof *v);
if (tmp == NULL) {
    // falhou: v continua válido e com os dados antigos
} else {
    v = tmp;   // pode ser o mesmo endereço ou um novo
}</pre><pre data-l="py">v.extend([None] * (novo - len(v)))   # crescer
del v[novo:]                         # encolher
# por baixo, a list faz o equivalente a um realloc</pre></div>
<div class="cards">
<div class="card"><b>Cresce no lugar</b>Se os bytes logo depois do bloco estão livres, o bloco só aumenta.</div>
<div class="card"><b>Muda de endereço</b>Senão, aloca outro bloco, <b>copia</b> os dados e libera o antigo. Todo ponteiro para o endereço antigo fica inválido.</div>
<div class="card"><b>Casos especiais</b><code>realloc(NULL, t)</code> é um <code>malloc(t)</code>. Os bytes novos não são zerados.</div>
</div>
<div class="alerta"><b>Erro clássico.</b> <code>v = realloc(v, t);</code> Se o realloc falhar, devolve <code>NULL</code>, você perde o único endereço do bloco antigo e ele vaza. Guarde o resultado numa variável temporária.</div>`},
{t:'O vetor que dobra', h:`
<p>Um vetor dinâmico guarda <code>tamanho</code> (quantos elementos há) e <code>capacidade</code> (quantos cabem). Quando enche, chama <code>realloc</code> com o <b>dobro</b> da capacidade.</p>
<div class="duo"><pre data-l="c">if (v-&gt;tamanho == v-&gt;capacidade) {
    int nova = v-&gt;capacidade ? 2 * v-&gt;capacidade : 1;
    int *tmp = realloc(v-&gt;dados, nova * sizeof *tmp);
    if (!tmp) return 0;
    v-&gt;dados = tmp;
    v-&gt;capacidade = nova;
}
v-&gt;dados[v-&gt;tamanho++] = x;</pre><pre data-l="py">if self.tamanho == len(self.dados):
    nova = 2 * len(self.dados) if self.dados else 1
    novos = [0] * nova
    novos[:self.tamanho] = self.dados
    self.dados = novos
self.dados[self.tamanho] = x
self.tamanho += 1</pre></div>
<table class="cmp"><thead><tr><th>Estratégia</th><th>Cópias para inserir 1.000 elementos</th><th>Custo por inserção</th></tr></thead><tbody>
<tr><td>Crescer de 1 em 1</td><td>499.500</td><td>O(n)</td></tr>
<tr><td>Dobrar a capacidade</td><td>1.023</td><td>O(1) amortizado</td></tr></tbody></table>
<div class="free">É assim que funcionam a <code>list</code> do Python, o <code>vector</code> do C++ e o <code>ArrayList</code> do Java. O Python cresce um pouco menos que o dobro, mas a ideia é a mesma.</div>`},
{t:'Os erros clássicos', h:`
<div class="cards">
<div class="card"><b>Vazamento (memory leak)</b>Perder o último ponteiro de um bloco sem chamar <code>free</code>. O bloco fica ocupado até o programa acabar.</div>
<div class="card"><b>Ponteiro pendente</b>Usar <code>p</code> depois de <code>free(p)</code>. O endereço continua em <code>p</code>, mas o espaço já pode pertencer a outro dado.</div>
<div class="card"><b>Double free</b>Chamar <code>free</code> duas vezes no mesmo bloco. Corrompe o controle do heap.</div>
<div class="card"><b>Tamanho errado</b><code>malloc(n)</code> em vez de <code>malloc(n * sizeof(int))</code> reserva n <b>bytes</b>, não n inteiros.</div>
<div class="card"><b>Não verificar NULL</b>Se a alocação falhar, o próximo acesso derruba o programa.</div>
<div class="card"><b>Ler lixo</b>Usar o conteúdo de um <code>malloc</code> sem inicializar.</div>
</div>
<div class="free">Ferramentas que pegam esses erros: compile com <code>gcc -fsanitize=address -g</code> ou rode com <code>valgrind ./programa</code>. Em Python, vazamento e ponteiro pendente praticamente não existem, porque o coletor de lixo só libera o que ninguém mais referencia.</div>`}
],
codigo:{nota:'Um vetor dinâmico de inteiros: começa com calloc, cresce dobrando com realloc e termina com free.',
c:`#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *dados;
    int tamanho;
    int capacidade;
} Vetor;

int iniciar(Vetor *v, int cap) {
    v->dados = calloc(cap, sizeof *v->dados);    /* começa zerado */
    v->tamanho = 0;
    v->capacidade = v->dados ? cap : 0;
    return v->dados != NULL;
}

int empurrar(Vetor *v, int x) {
    if (v->tamanho == v->capacidade) {
        int nova = v->capacidade ? 2 * v->capacidade : 1;
        int *tmp = realloc(v->dados, nova * sizeof *tmp);
        if (!tmp) return 0;                       /* v->dados continua válido */
        v->dados = tmp;
        v->capacidade = nova;
        printf("  realloc: capacidade %d\\n", nova);
    }
    v->dados[v->tamanho++] = x;
    return 1;
}

void liberar(Vetor *v) {
    free(v->dados);
    v->dados = NULL;
    v->tamanho = v->capacidade = 0;
}

int main(void) {
    Vetor v;
    if (!iniciar(&v, 2)) return 1;
    for (int i = 1; i <= 10; i++) empurrar(&v, i * i);
    printf("tamanho %d, capacidade %d, último %d\\n",
           v.tamanho, v.capacidade, v.dados[v.tamanho - 1]);
    liberar(&v);
    return 0;
}`,
py:`class VetorDinamico:
    def __init__(self, capacidade=2):
        self.dados = [0] * capacidade             # como o calloc: começa zerado
        self.tamanho = 0

    def empurrar(self, x):
        if self.tamanho == len(self.dados):
            nova = 2 * len(self.dados) if self.dados else 1
            novos = [0] * nova                    # "realloc": um bloco maior...
            novos[:self.tamanho] = self.dados     # ...e a cópia do antigo
            self.dados = novos
            print(f"  realloc: capacidade {nova}")
        self.dados[self.tamanho] = x
        self.tamanho += 1


v = VetorDinamico(2)
for i in range(1, 11):
    v.empurrar(i * i)
print(f"tamanho {v.tamanho}, capacidade {len(v.dados)}, último {v.dados[v.tamanho - 1]}")
# na prática, a list já faz tudo isso: v = []; v.append(x)`},
custo:[['malloc / free','O(1)*','Depende do alocador; tratamos como constante'],['calloc(n, t)','O(n)','Além de reservar, zera todos os bytes'],['realloc que muda de endereço','O(n)','Copia o bloco inteiro'],['Inserir no fim, dobrando','O(1) amortizado','As cópias somam menos de 2n'],['Inserir no fim, crescendo de 1 em 1','O(n)','Cada inserção pode copiar tudo']],
pratica:[
{t:'malloc e calloc', d:'Com a variável <b>p</b>, faça <b>malloc</b> de 4 inteiros. Com <b>q</b>, faça <b>calloc</b> de 4.', obs:'O que aparece dentro de cada bloco? Por que o malloc mostra <code>?</code>'},
{t:'realloc no lugar ou mudando', d:'Faça <b>realloc</b> de <b>p</b> para 6. Depois use o cenário <b>realloc que muda</b>.', obs:'Quando o bloco cresceu no lugar e quando mudou de endereço? O que acontece com outro ponteiro que guardava o endereço antigo?'},
{t:'Vazamento', d:'Rode o cenário <b>Vazamento</b> e avance passo a passo.', obs:'Qual bloco ficou sem nenhum ponteiro? Ainda dá para chamar <code>free</code> nele?'},
{t:'Ponteiro pendente e double free', d:'Rode os cenários <b>Usar depois do free</b> e <b>Double free</b>.', obs:'Por que <code>p</code> ainda guarda um endereço depois do free? Como <code>p = NULL</code> evitaria os dois erros?'}
],
quiz:[
{q:'Qual a diferença entre <code>malloc(n * sizeof(int))</code> e <code>calloc(n, sizeof(int))</code>?', ops:['Nenhuma','O calloc zera a memória e confere se a multiplicação estoura','O malloc é mais seguro','O calloc aloca na pilha'], ok:1, exp:'Os dois reservam o mesmo espaço no heap; o calloc entrega tudo zerado.'},
{q:'Por que <code>v = realloc(v, novo);</code> é perigoso?', ops:['Porque é lento','Se o realloc falhar, devolve NULL e o endereço do bloco antigo se perde: vazamento','Porque realloc não pode crescer','Porque apaga os dados'], ok:1, exp:'Guarde o resultado em <code>tmp</code> e só atribua a <code>v</code> se não for NULL.'},
{q:'Logo depois de <code>free(p);</code>, o que <code>p</code> guarda?', ops:['NULL, automaticamente','O mesmo endereço, agora inválido: um ponteiro pendente','Um endereço novo','O valor 0'], ok:1, exp:'O <code>free</code> não mexe na variável. Por isso é boa prática fazer <code>p = NULL</code> em seguida.'},
{q:'Um vetor dinâmico que dobra a capacidade quando enche. Quanto custa inserir n elementos no fim?', ops:['O(n²)','O(n) no total, ou O(1) amortizado por inserção','O(n log n)','O(log n)'], ok:1, exp:'As cópias feitas nos realloc somam 1 + 2 + 4 + … &lt; 2n.'},
{q:'Qual linha reserva espaço para 10 structs <code>Aluno</code>?', ops:['<code>malloc(10)</code>','<code>malloc(sizeof(Aluno))</code>','<code>malloc(10 * sizeof(Aluno))</code>','<code>malloc(sizeof(10 * Aluno))</code>'], ok:2, exp:'<code>malloc</code> recebe bytes: quantidade × tamanho de cada elemento.'}
],
prog:[
{t:'Copiar uma string', enun:'Escreva <code>char *copiar(const char *s)</code>, que devolve uma cópia de <code>s</code> num bloco novo do heap (quem chamar faz o <code>free</code>). Devolva <code>NULL</code> se a alocação falhar. Em Python, faça o equivalente para uma lista: crie uma lista nova e copie elemento a elemento.', dica:'Reserve <code>strlen(s) + 1</code> bytes: o <code>+ 1</code> é para o <code>\\0</code> do fim. Depois use <code>memcpy</code> ou um laço.',
c:`#include <stdlib.h>
#include <string.h>

char *copiar(const char *s) {
    size_t n = strlen(s) + 1;          /* + 1 para o '\\0' */
    char *c = malloc(n);               /* sizeof(char) é sempre 1 */
    if (c == NULL) return NULL;
    memcpy(c, s, n);
    return c;                          /* quem chamou faz free(c) */
}`,
py:`def copiar(v):
    c = [None] * len(v)                # um "bloco" novo
    for i, x in enumerate(v):
        c[i] = x
    return c                           # o mesmo que v[:] ou list(v)`},
{t:'Matriz dinâmica', enun:'Crie uma matriz <code>linhas × colunas</code> de inteiros zerados, com o tamanho lido em tempo de execução, e uma função que a libera.', dica:'Aloque um vetor de <code>linhas</code> ponteiros e, para cada linha, um vetor de <code>colunas</code> inteiros com <code>calloc</code>. Para liberar, faça o caminho inverso: primeiro cada linha, depois o vetor de ponteiros. Em Python, cuidado com <code>[[0] * c] * l</code>: as linhas viram a mesma lista.',
c:`#include <stdlib.h>

void liberar_matriz(int **m, int linhas) {
    if (!m) return;
    for (int i = 0; i < linhas; i++) free(m[i]);
    free(m);
}

int **criar_matriz(int linhas, int colunas) {
    int **m = malloc(linhas * sizeof *m);
    if (!m) return NULL;
    for (int i = 0; i < linhas; i++) {
        m[i] = calloc(colunas, sizeof *m[i]);
        if (!m[i]) {                       /* falhou no meio: desfaz */
            liberar_matriz(m, i);
            return NULL;
        }
    }
    return m;
}`,
py:`def criar_matriz(linhas, colunas):
    # uma lista nova por linha; [[0] * colunas] * linhas repetiria
    # a MESMA lista em todas as linhas
    return [[0] * colunas for _ in range(linhas)]`},
{t:'Filtrar e encolher', enun:'Receba um vetor de <code>n</code> inteiros e devolva um vetor <b>novo</b>, do tamanho exato, só com os números pares. O tamanho do resultado volta por <code>*m</code>.', dica:'Aloque <code>n</code> posições (o pior caso), copie os pares e, no fim, use <code>realloc</code> para encolher até a quantidade usada. Se nenhum par sobrar, libere o bloco e devolva <code>NULL</code>.',
c:`#include <stdlib.h>

int *filtrar_pares(const int *v, int n, int *m) {
    *m = 0;
    if (n <= 0) return NULL;
    int *r = malloc(n * sizeof *r);
    if (!r) return NULL;
    for (int i = 0; i < n; i++)
        if (v[i] % 2 == 0) r[(*m)++] = v[i];
    if (*m == 0) { free(r); return NULL; }
    int *tmp = realloc(r, *m * sizeof *r);   /* encolher quase sempre dá certo */
    return tmp ? tmp : r;
}`,
py:`def filtrar_pares(v):
    r = [None] * len(v)                # pior caso
    m = 0
    for x in v:
        if x % 2 == 0:
            r[m] = x
            m += 1
    del r[m:]                          # "realloc" para o tamanho exato
    return r                           # o mesmo que [x for x in v if x % 2 == 0]`}
]
});

MODS.push({
id:'vetor', n:4, era:0, titulo:'Lista Sequencial (Vetor)', sub:'Acesso direto por índice, inserção cara no meio',
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
id:'busca', n:5, era:0, titulo:'Busca Sequencial e Binária', sub:'Olhar um por um ou cortar pela metade',
viz:'viz/busca.html',
slides:[
{t:'Achar um valor num vetor', h:`
<p class="lead">Buscar é responder a pergunta mais comum da computação: <b>o valor x está no vetor? Em que posição?</b> Há dois jeitos clássicos de fazer isso, e a diferença entre eles cresce muito com o tamanho dos dados.</p>
<div class="cards">
<div class="card"><b>Busca sequencial</b>Olha as posições uma por uma, do início ao fim. Funciona em qualquer vetor.</div>
<div class="card"><b>Busca binária</b>Compara com o elemento do meio e descarta metade a cada passo. Exige o vetor <b>ordenado</b>.</div>
</div>
<div class="objetivos"><b>Ao final deste módulo você vai</b><ul>
<li>implementar as duas buscas e contar as comparações de cada uma;</li>
<li>explicar por que a binária faz no máximo ⌊log₂ n⌋ + 1 comparações;</li>
<li>decidir quando vale a pena ordenar para depois buscar.</li></ul></div>
<div class="analogia"><b>Analogia</b>Procurar a prova de um aluno num monte desorganizado: você vira uma por uma. Procurar um nome na lista de chamada em ordem alfabética: você abre no meio, vê se o nome vem antes ou depois e ignora a outra metade.</div>`},
{t:'Busca sequencial', h:`
<p>Percorra o vetor da posição 0 até <code>n − 1</code>. Se achar, devolva a posição; se chegar ao fim, devolva −1.</p>
<div class="duo"><pre data-l="c">int busca_seq(const int v[], int n, int x) {
    for (int i = 0; i &lt; n; i++)
        if (v[i] == x) return i;   // achou: devolve a posição
    return -1;                     // olhou tudo: não está
}</pre><pre data-l="py">def busca_seq(v, x):
    for i in range(len(v)):
        if v[i] == x:
            return i   # achou: devolve a posição
    return -1          # olhou tudo: não está</pre></div>
<div class="cards">
<div class="card"><b>Melhor caso: 1 comparação</b>O valor está na posição 0.</div>
<div class="card"><b>Pior caso: n comparações</b>O valor está no fim ou não existe. É O(n).</div>
<div class="card"><b>Caso médio: cerca de n/2</b>Se o valor existe e pode estar em qualquer posição.</div>
</div>
<div class="free">Se o vetor estiver ordenado, a sequencial pode parar mais cedo quando encontra um valor <b>maior</b> que x. Ajuda nas buscas sem sucesso, mas continua O(n).</div>`},
{t:'Busca binária: a ideia', h:`
<p>Com o vetor ordenado, guarde o intervalo que ainda pode conter x, de <code>ini</code> a <code>fim</code>. Compare x com o elemento do <b>meio</b>:</p>
<div class="cards">
<div class="card"><b>v[meio] == x</b>Achou.</div>
<div class="card"><b>v[meio] &lt; x</b>x só pode estar à direita: <code>ini = meio + 1</code>.</div>
<div class="card"><b>v[meio] &gt; x</b>x só pode estar à esquerda: <code>fim = meio − 1</code>.</div>
</div>
<h3>Exemplo: buscar 34</h3>
<pre>v   =  3  8 12 17 21 26 30 34 40 45 51
pos =  0  1  2  3  4  5  6  7  8  9 10

ini=0 fim=10 meio=5  v[5]=26 &lt; 34  → ini=6
ini=6 fim=10 meio=8  v[8]=40 &gt; 34  → fim=7
ini=6 fim=7  meio=6  v[6]=30 &lt; 34  → ini=7
ini=7 fim=7  meio=7  v[7]=34       → achou na posição 7</pre>
<p>Foram <b>4 comparações</b>. A busca sequencial precisaria de 8. Quando <code>ini</code> passa de <code>fim</code>, o intervalo ficou vazio e o valor não está no vetor.</p>`},
{t:'Busca binária: o código', h:`
<div class="duo"><pre data-l="c">int busca_bin(const int v[], int n, int x) {
    int ini = 0, fim = n - 1;
    while (ini &lt;= fim) {
        int meio = ini + (fim - ini) / 2;  // evita estouro de int
        if (v[meio] == x) return meio;
        if (v[meio] &lt; x) ini = meio + 1;   // descarta a metade esquerda
        else             fim = meio - 1;   // descarta a metade direita
    }
    return -1;
}</pre><pre data-l="py">def busca_bin(v, x):
    ini, fim = 0, len(v) - 1
    while ini &lt;= fim:
        meio = (ini + fim) // 2    # em Python o int não estoura
        if v[meio] == x:
            return meio
        if v[meio] &lt; x:
            ini = meio + 1         # descarta a metade esquerda
        else:
            fim = meio - 1         # descarta a metade direita
    return -1</pre></div>
<div class="alerta"><b>Erros clássicos.</b> (1) <code>while (ini &lt; fim)</code> deixa de olhar o último candidato. (2) <code>ini = meio</code> em vez de <code>meio + 1</code> pode travar num laço infinito. (3) Rodar a binária num vetor <b>desordenado</b>: ela não dá erro, só devolve a resposta errada.</div>`},
{t:'Por que log n', h:`
<p>Cada comparação corta o intervalo pela metade: n → n/2 → n/4 → … → 1. O número de cortes até sobrar um elemento é log₂ n, então a binária faz no máximo <b>⌊log₂ n⌋ + 1</b> comparações.</p>
<table class="cmp"><thead><tr><th>n</th><th>Sequencial (pior caso)</th><th>Binária (pior caso)</th></tr></thead><tbody>
<tr><td>10</td><td>10</td><td>4</td></tr>
<tr><td>1.000</td><td>1.000</td><td>10</td></tr>
<tr><td>1.000.000</td><td>1.000.000</td><td>20</td></tr>
<tr><td>1.000.000.000</td><td>1.000.000.000</td><td>30</td></tr></tbody></table>
<p>Dobrar o tamanho do vetor custa só <b>uma</b> comparação a mais na binária. Na sequencial, dobra o trabalho.</p>
<div class="alerta"><b>O preço é manter a ordem.</b> Ordenar custa O(n log n), e inserir mantendo a ordem custa O(n), porque desloca elementos. Se você vai buscar uma única vez, a sequencial sai mais barata. Se vai buscar muitas vezes, ordene uma vez e use a binária.</div>`},
{t:'Quando usar cada uma', h:`
<div class="cards">
<div class="card"><b>Use a sequencial quando…</b>o vetor não está ordenado, tem poucos elementos, é buscado uma vez só, ou a estrutura é uma <b>lista encadeada</b> (sem acesso por índice, achar o meio já custa O(n)).</div>
<div class="card"><b>Use a binária quando…</b>o vetor está ordenado, tem acesso <code>v[i]</code> em O(1) e vai ser consultado muitas vezes.</div>
</div>
<div class="free">Prontas para usar: em Python, o módulo <code>bisect</code> (<code>bisect_left</code> devolve a posição de inserção). Em C, a função <code>bsearch</code> da <code>&lt;stdlib.h&gt;</code>. A mesma ideia de descartar metade volta na <b>ABB</b>, na Era 03: cada nó faz o papel do meio.</div>`}
],
codigo:{nota:'As duas buscas no mesmo vetor ordenado, contando as comparações (cada visita a um elemento conta uma).',
c:`#include <stdio.h>

int busca_sequencial(const int v[], int n, int x, int *comp) {
    *comp = 0;
    for (int i = 0; i < n; i++) {
        (*comp)++;
        if (v[i] == x) return i;
    }
    return -1;
}

int busca_binaria(const int v[], int n, int x, int *comp) {
    int ini = 0, fim = n - 1;
    *comp = 0;
    while (ini <= fim) {
        int meio = ini + (fim - ini) / 2;
        (*comp)++;
        if (v[meio] == x) return meio;
        if (v[meio] < x) ini = meio + 1;
        else             fim = meio - 1;
    }
    return -1;
}

int main(void) {
    int v[] = {3, 8, 12, 17, 21, 26, 30, 34, 40, 45, 51};
    int n = sizeof v / sizeof v[0];
    int alvos[] = {34, 3, 51, 20};
    for (int k = 0; k < 4; k++) {
        int cs, cb;
        int ps = busca_sequencial(v, n, alvos[k], &cs);
        int pb = busca_binaria(v, n, alvos[k], &cb);
        printf("x=%2d  sequencial: pos %2d em %2d comp. | binária: pos %2d em %d comp.\\n",
               alvos[k], ps, cs, pb, cb);
    }
    return 0;
}`,
py:`def busca_sequencial(v, x):
    comp = 0
    for i, valor in enumerate(v):
        comp += 1
        if valor == x:
            return i, comp
    return -1, comp


def busca_binaria(v, x):
    ini, fim = 0, len(v) - 1
    comp = 0
    while ini <= fim:
        meio = (ini + fim) // 2      # em Python o int não estoura
        comp += 1
        if v[meio] == x:
            return meio, comp
        if v[meio] < x:
            ini = meio + 1           # descarta a metade esquerda
        else:
            fim = meio - 1           # descarta a metade direita
    return -1, comp


v = [3, 8, 12, 17, 21, 26, 30, 34, 40, 45, 51]
for x in (34, 3, 51, 20):
    ps, cs = busca_sequencial(v, x)
    pb, cb = busca_binaria(v, x)
    print(f"x={x:2}  sequencial: pos {ps:2} em {cs:2} comp. | binária: pos {pb:2} em {cb} comp.")`},
custo:[['Sequencial, melhor caso','O(1)','O valor está na primeira posição'],['Sequencial, pior caso','O(n)','Valor no fim ou ausente'],['Binária','O(log n)','No máximo ⌊log₂ n⌋ + 1 comparações'],['Ordenar antes de buscar','O(n log n)','Compensa quando há muitas buscas'],['Memória extra','O(1)','As duas versões iterativas']],
pratica:[
{t:'Busca sequencial passo a passo', d:'Deixe o modo em <b>Sequencial</b>, clique em <b>Alvo no fim</b> e avance com <b>Passo</b>.', obs:'Quantas comparações foram feitas até achar? E com <b>Alvo ausente</b>?'},
{t:'Binária no mesmo vetor', d:'Troque para <b>Binária</b>, repita a busca e acompanhe as setas <b>ini</b>, <b>meio</b> e <b>fim</b>.', obs:'Que parte do vetor fica apagada a cada passo? Quantas comparações foram agora?'},
{t:'Corrida com 63 elementos', d:'Escolha <b>63</b> elementos, o modo <b>Corrida</b> e um <b>Alvo ausente</b>. Clique em <b>Rodar</b>.', obs:'Compare os dois contadores. Quanto dá log₂ 64?'},
{t:'Vetor desordenado', d:'Clique em <b>Embaralhar</b> e rode a <b>Binária</b> com um alvo que está no vetor.', obs:'Ela achou? Por que a sequencial continua funcionando sem ordem?'}
],
quiz:[
{q:'Num vetor ordenado com 1.000 elementos, quantas comparações a busca binária faz no pior caso?', ops:['10','100','500','1.000'], ok:0, exp:'⌊log₂ 1000⌋ + 1 = 9 + 1 = 10.'},
{q:'O que a busca binária exige do vetor?', ops:['Não ter valores repetidos','Estar ordenado e ter acesso por índice em O(1)','Ter tamanho potência de 2','Ter só valores positivos'], ok:1, exp:'Sem ordem, descartar metade não é seguro. Sem acesso por índice, achar o meio já custa O(n).'},
{q:'Em v = [2, 5, 9, 14, 20, 27, 33], buscando 27 com meio = (ini + fim) / 2, quais posições são visitadas?', ops:['3 e 5','3, 5 e 4','3, 4 e 5','Só a 5'], ok:0, exp:'ini=0, fim=6: meio=3 (14 &lt; 27), então ini=4. Agora meio=5 e v[5] = 27: achou.'},
{q:'Por que, em C, se escreve <code>meio = ini + (fim - ini) / 2</code>?', ops:['É mais rápido','Evita estouro de int quando ini + fim passa do limite','Arredonda para cima','Faz funcionar em vetor desordenado'], ok:1, exp:'Com vetores enormes, <code>ini + fim</code> pode passar de INT_MAX. A forma com a diferença nunca estoura.'},
{q:'Buscar um valor numa <b>lista encadeada</b> ordenada custa:', ops:['O(log n), com binária','O(n), porque não há acesso direto ao meio','O(1)','O(n log n)'], ok:1, exp:'Para chegar ao meio de uma lista encadeada é preciso percorrê-la. A ordem ajuda a parar cedo, mas continua O(n).'}
],
prog:[
{t:'Primeira ocorrência', enun:'O vetor está ordenado e pode ter valores <b>repetidos</b>. Devolva a posição da <b>primeira</b> ocorrência de <code>x</code> (ou −1), ainda em O(log n).', dica:'Quando achar x, guarde a posição como resposta e continue procurando à esquerda com <code>fim = meio - 1</code>.',
c:`int primeira_ocorrencia(const int v[], int n, int x) {
    int ini = 0, fim = n - 1, resp = -1;
    while (ini <= fim) {
        int meio = ini + (fim - ini) / 2;
        if (v[meio] == x) {
            resp = meio;          /* candidato; pode haver outro antes */
            fim = meio - 1;
        } else if (v[meio] < x) {
            ini = meio + 1;
        } else {
            fim = meio - 1;
        }
    }
    return resp;
}`,
py:`def primeira_ocorrencia(v, x):
    ini, fim, resp = 0, len(v) - 1, -1
    while ini <= fim:
        meio = (ini + fim) // 2
        if v[meio] == x:
            resp = meio           # candidato; pode haver outro antes
            fim = meio - 1
        elif v[meio] < x:
            ini = meio + 1
        else:
            fim = meio - 1
    return resp`},
{t:'Posição de inserção', enun:'Devolva a posição onde <code>x</code> deveria entrar para o vetor continuar ordenado (a primeira posição com valor ≥ x). Se x for maior que todos, a resposta é <code>n</code>.', dica:'Use o intervalo semiaberto [ini, fim) com <code>fim = n</code>. Se <code>v[meio] &lt; x</code>, faça <code>ini = meio + 1</code>; senão, <code>fim = meio</code>. Pare quando <code>ini == fim</code>.',
c:`int posicao_insercao(const int v[], int n, int x) {
    int ini = 0, fim = n;              /* intervalo [ini, fim) */
    while (ini < fim) {
        int meio = ini + (fim - ini) / 2;
        if (v[meio] < x) ini = meio + 1;
        else             fim = meio;
    }
    return ini;
}`,
py:`def posicao_insercao(v, x):
    ini, fim = 0, len(v)               # intervalo [ini, fim)
    while ini < fim:
        meio = (ini + fim) // 2
        if v[meio] < x:
            ini = meio + 1
        else:
            fim = meio
    return ini                         # igual a bisect.bisect_left(v, x)`},
{t:'Busca binária recursiva', enun:'Reescreva a busca binária de forma <b>recursiva</b>, recebendo <code>ini</code> e <code>fim</code> como parâmetros.', dica:'O caso base é o intervalo vazio (<code>ini &gt; fim</code>): devolva −1. Senão, compare com o meio e chame a função só para a metade que sobra.',
c:`int busca_rec(const int v[], int ini, int fim, int x) {
    if (ini > fim) return -1;              /* intervalo vazio */
    int meio = ini + (fim - ini) / 2;
    if (v[meio] == x) return meio;
    if (v[meio] < x) return busca_rec(v, meio + 1, fim, x);
    return busca_rec(v, ini, meio - 1, x);
}
/* chamada: busca_rec(v, 0, n - 1, x) */`,
py:`def busca_rec(v, x, ini=0, fim=None):
    if fim is None:
        fim = len(v) - 1
    if ini > fim:
        return -1                          # intervalo vazio
    meio = (ini + fim) // 2
    if v[meio] == x:
        return meio
    if v[meio] < x:
        return busca_rec(v, x, meio + 1, fim)
    return busca_rec(v, x, ini, meio - 1)`}
]
});

MODS.push({
id:'estatica', n:6, era:0, titulo:'Lista Encadeada Estática', sub:'Ponteiros simulados por índices dentro de um vetor',
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
id:'simples', n:7, era:0, titulo:'Lista Encadeada (Simples)', sub:'Nós ligados por ponteiros, sem posição fixa',
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
<div class="duo"><pre data-l="c">novo-&gt;prox = head;
head = novo;</pre><pre data-l="py">novo.prox = head
head = novo</pre></div>
<p>A ordem importa: se você fizer <code>head = novo</code> primeiro, perde o resto da lista.</p>
<h3>Remover por valor: O(n)</h3>
<p>Ande com dois ponteiros, <code>ant</code> e <code>at</code>. Quando <code>at</code> achar o valor, faça <code>ant-&gt;prox = at-&gt;prox</code> e libere <code>at</code>. Se o valor estiver na cabeça, não há <code>ant</code>: atualize <code>head</code>.</p>
<div class="alerta"><b>Remover o último é O(n)</b>, mesmo guardando um ponteiro <code>tail</code>: para atualizar o penúltimo, você precisa encontrá-lo, e não dá para andar para trás.</div>`},
{t:'Reverter com três ponteiros', h:`
<div class="duo"><pre data-l="c">ant = NULL; at = head;
while (at) {
    prox = at-&gt;prox;  // 1. guarda o resto
    at-&gt;prox = ant;   // 2. vira a seta
    ant = at;         // 3. avança os dois
    at = prox;
}
head = ant;</pre><pre data-l="py">ant, at = None, head
while at:
    prox = at.prox    # 1. guarda o resto
    at.prox = ant     # 2. vira a seta
    ant = at          # 3. avança os dois
    at = prox
head = ant</pre></div>
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
id:'dupla', n:8, era:0, titulo:'Lista Duplamente Encadeada', sub:'Navegação nos dois sentidos',
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
<div class="duo"><pre data-l="c">if (n-&gt;prev) n-&gt;prev-&gt;prox = n-&gt;prox;
else         head = n-&gt;prox;
if (n-&gt;prox) n-&gt;prox-&gt;prev = n-&gt;prev;
else         tail = n-&gt;prev;
free(n);</pre><pre data-l="py">if n.prev: n.prev.prox = n.prox
else:      head = n.prox
if n.prox: n.prox.prev = n.prev
else:      tail = n.prev
# sem free: o coletor de lixo libera n</pre></div>
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
{t:'Remova o fim e conte os passos', d:'Use <b>Remover fim · O(1)</b>.', obs:'Compare com o mesmo botão na lista simples (módulo 7). Qual ponteiro tornou isso possível?'},
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
