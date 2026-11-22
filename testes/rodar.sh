#!/usr/bin/env bash
# Compila (gcc, C11, com sanitizadores) e executa os códigos extraídos.
# Arquivos sem main são só compilados; trechos que dependem do código do módulo podem falhar sozinhos.
cd "$(dirname "$0")/out" || exit 1
for f in *.c; do
  if grep -q 'int main' "$f"; then
    gcc -std=c11 -Wall -Wextra -O1 -fsanitize=address,undefined "$f" -o /tmp/oficina_bin 2>/tmp/oficina_err && { echo "== $f"; /tmp/oficina_bin; } || { echo "!! $f"; cat /tmp/oficina_err; }
  else
    gcc -std=c11 -Wall -Wextra -c "$f" -o /tmp/oficina_obj.o 2>/tmp/oficina_err && [ ! -s /tmp/oficina_err ] || { echo "!! $f"; cat /tmp/oficina_err; }
  fi
done
for f in *.py; do python3 -m py_compile "$f" || echo "!! $f"; done
