# Novidade: importação da apostila em PDF

Na página **Programações**, selecione **Importar apostila PDF**, escolha a apostila oficial e aguarde a prévia.
Confira as datas, leitura bíblica e imagens e marque as semanas desejadas. No seletor, escolha se quer **manter semanas existentes**, **atualizar apenas a imagem** ou **atualizar imagem e conteúdo**. Clique em **Confirmar importação** e aguarde a confirmação do salvamento.

## Cuidados
- Antes de atualizar a publicação na Vercel, faça backup no menu **Configurações > Exportar backup**. Não remova a base Supabase.
- As semanas de **março–abril de 2027** já estão incluídas com imagens e conteúdo básico das reuniões da apostila recebida. A semana de **22 a 28 de março** não tem programação semanal na apostila fornecida.
- O PDF é processado localmente no navegador, mas o leitor PDF.js é carregado do CDN jsDelivr. A primeira utilização precisa de acesso à internet. Caso o CDN esteja bloqueado, a importação informará o erro. Não envie PDFs com dados privados.
- A extração automática de futuras apostilas identifica as semanas, a leitura bíblica e as imagens; partes e cânticos podem exigir conferência manual. O conteúdo já preparado de março–abril de 2027 é mais completo porque foi revisado com a apostila enviada.
- A importação de imagens codifica as miniaturas em JPEG no estado sincronizado. PDFs muito extensos podem aumentar o espaço ocupado no navegador e no banco de dados.
- A opção de atualizar conteúdo **não exclui designações salvas**. Se você alterar quantidades ou numeração das partes, revise as designações após a importação.
- A capa de **11–17 de janeiro de 2027** foi corrigida para a imagem que você enviou.
