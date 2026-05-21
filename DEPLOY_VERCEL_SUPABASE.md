# Publicar no Vercel + Supabase

## 1. Criar o banco no Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Cole e execute o conteudo do arquivo `supabase.sql`.
4. Copie a URL do projeto.
5. Copie a chave secreta do servidor, chamada `service_role` ou `secret key`.

Nunca coloque a chave `service_role` dentro do navegador ou em arquivo publico.

## 2. Configurar o projeto na Vercel

Na Vercel, publique esta pasta `app` como projeto.

Configure estas variaveis de ambiente:

- `SUPABASE_URL`: URL do projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: chave secreta do Supabase.
- `ADMIN_PASSWORD`: senha usada para entrar como administrador.
- `ADMIN_TOKEN`: texto secreto grande para liberar salvamento.

Exemplo de `ADMIN_TOKEN`: uma frase grande misturada com numeros.

## 3. Usar os links

Link publico:

```text
https://seu-projeto.vercel.app/
```

Link administrador:

```text
https://seu-projeto.vercel.app/?admin=1
```

O publico ve apenas a aba Visualizacao. O administrador entra com senha e pode editar.
