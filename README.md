Sistema Avaliativo de Candidatos e Pesquisa

Cadastro local de pesquisas, fontes públicas e evidências documentais

Autor: Iraê César Brandão - 17/out/2026
https://irae-cesar-brandao.github.io/avaliacao_candidatos_eleicao/

<section class="card">
  <details>
    <summary style="color: blue;">README — metodologia, cálculos e limites</summary>

    <h3>Armazenamento local</h3>
    <p>Este arquivo usa o armazenamento local do navegador (<code>localStorage</code>). Os dados permanecem no perfil do navegador, não são automaticamente sincronizados entre dispositivos e podem ser apagados se o usuário limpar os dados do navegador. Não é armazenamento de servidor nem um mecanismo de backup.</p>

    <h3>Como os dados são organizados</h3>
    <p>Cada pesquisa recebe um identificador local. Cada fonte ou evidência fica vinculada a uma pesquisa, com eixo temático, tipo de registro, data de consulta, referência, resumo e limitações.</p>

    <h3>Camadas separadas: pesquisa, evidência e aferição</h3>
    <p>O protocolo de pesquisa registra eixo, estratégia/consulta, período, fontes, data, suficiência e limitações. O registro de evidência armazena polaridade, relevância, confiabilidade, impacto, relação com a pessoa pesquisada, situação, contrapontos e grupo de independência.</p>

    <h3>Fórmula exploratória e limites</h3>
    <p>Para cada evidência elegível, o peso é (relevância/5) × (confiabilidade/5) × (impacto/5) × fator de relação × fator de situação. Relação direta=1; indireta=0,6; não demonstrada=0. Situação confirmada=1; contestada=0,5; em apuração=0,25; refutada=0. Polaridade positiva soma peso e negativa subtrai peso. O indicador de balanço é 5 + 5 × (positivos − negativos)/(positivos + negativos), limitado a 0–10. Sem evidências elegíveis, a nota não é calculada. Esta escala é provisória e exige validação metodológica antes de uso real.</p>

    <p>A cobertura é a proporção de eixos com protocolo marcado como suficiente; parcial conta como 0,5 e insuficiente/não investigado como 0. A confiança documental é um indicador separado, baseado no peso médio de confiabilidade e no percentual de evidências confirmadas. Nenhum desses indicadores substitui revisão humana independente. O agrupamento de independência ajuda a identificar duplicações, mas não garante detecção automática de notícias repetidas.</p>

    <h3>Como interpretar os registros</h3>
    <ul>
      <li>Uma fonte pode estar incompleta, desatualizada ou contestada;</li>
      <li>Uma alegação não equivale a um fato comprovado; procure documentos primários e decisões definitivas quando aplicável;</li>
      <li>A quantidade de registros não mede a veracidade, a relevância nem o mérito de uma pessoa;</li>
      <li>Registre data, cenário, detalhes e limitações para permitir que outra pessoa reavalie a informação.</li>
    </ul>

    <h3>Privacidade e segurança</h3>
    <p>Não há envio de dados pelo código desta página. Ainda assim, outros programas, extensões ou pessoas com acesso ao perfil do dispositivo podem acessar dados locais. Evite guardar informações sensíveis e mantenha backups protegidos.</p>

    <h3>Natureza experimental e finalidade acadêmica</h3>
    <p>Este sistema constitui um projeto experimental, de caráter didático, acadêmico e metodológico, desenvolvido sem fins lucrativos. Sua finalidade é explorar procedimentos de organização, registro, estruturação e análise de informações e evidências documentais. O sistema não representa, por si só, uma metodologia científica validada, um instrumento oficial de avaliação eleitoral ou um serviço profissional de auditoria, consultoria ou certificação.</p>

    <h3>Responsabilidade pela inserção e pela qualidade dos dados</h3>
    <p>A seleção, a inserção, a classificação, a contextualização, a atualização e a interpretação dos dados são realizadas sob a responsabilidade dos usuários que alimentam ou utilizam o sistema, de acordo com sua participação efetiva. Cabe a cada usuário verificar a procedência, a atualidade, a integridade e a pertinência das fontes, registrar as limitações relevantes e corrigir eventuais erros identificados.</p>

    <p>A inclusão de uma informação no sistema não significa que ela tenha sido verificada, aprovada ou endossada pelo autor ou desenvolvedor. O usuário que inserir, alterar, interpretar ou divulgar registros deverá responder por sua própria conduta, observadas as circunstâncias concretas e a legislação aplicável. Não se deve atribuir ao autor a autoria ou a validação de informações inseridas por terceiros apenas pelo fato de o sistema disponibilizar os campos e os cálculos utilizados para organizá-las.</p>

    <h3>Limitações dos resultados e ausência de avaliação definitiva</h3>
    <p>Os cálculos, indicadores, pontuações, classificações e comparações produzidos pelo sistema têm caráter exploratório e experimental. Dependem da qualidade e da abrangência dos dados inseridos, da seleção das fontes e dos critérios adotados pelos usuários. Por essa razão, não constituem, isoladamente, comprovação de fatos, julgamento definitivo sobre qualquer pessoa, previsão eleitoral, recomendação de voto ou diretriz para decisões políticas, profissionais, institucionais ou pessoais.</p>

    <p>Os resultados não devem ser apresentados como conclusões científicas definitivas sem documentação das fontes, explicitação dos critérios, avaliação das limitações, verificação independente e revisão crítica por pessoas qualificadas. Quando pertinente, recomenda-se revisão por pares e validação metodológica. Mesmo essas etapas não garantem certeza absoluta, mas contribuem para aumentar a transparência e a qualidade da análise.</p>

    <h3>Uso responsável e proteção de terceiros</h3>
    <p>Os usuários devem distinguir fatos documentados, alegações, opiniões e informações contestadas, evitando afirmações sem suporte documental e conclusões precipitadas. Devem também respeitar a privacidade, os direitos de terceiros, a legislação de proteção de dados pessoais e as demais normas aplicáveis. A finalidade acadêmica ou experimental não autoriza, por si só, a divulgação irrestrita de dados pessoais nem elimina os deveres legais de quem os trata ou divulga.</p>

    <h3>Limitação de responsabilidade e ressalva jurídica</h3>
    <p>Na medida permitida pela legislação aplicável, o autor ou desenvolvedor não assume responsabilidade pela exatidão, completude, atualidade ou veracidade de dados inseridos por usuários, nem pelas conclusões, decisões, publicações ou consequências decorrentes do uso que terceiros façam dessas informações. O autor ou desenvolvedor não deve ser considerado automaticamente responsável pela seleção, inserção, alteração ou divulgação de registros realizados autonomamente por usuários, sem prejuízo da análise de sua participação efetiva em cada situação.</p>

    <p>Esta declaração esclarece a finalidade do projeto e busca delimitar as responsabilidades relacionadas à utilização do sistema, mas não constitui isenção absoluta de responsabilidade jurídica nem afasta obrigações que sejam impostas pela legislação. A responsabilidade de cada pessoa deverá ser apreciada conforme sua conduta, sua participação e as circunstâncias do caso concreto.</p>

    <p>O uso do sistema implica o reconhecimento de seu caráter experimental e de suas limitações metodológicas. Recomenda-se revisão jurídica antes de sua disponibilização pública, especialmente se houver tratamento de dados pessoais, informações sobre pessoas identificáveis ou divulgação pública de análises e avaliações.</p>
  </details>
</section>

