
(() => {
  'use strict';
  const KEY = 'irae_pesquisa_eleitoral_v1';
  const $ = id => document.getElementById(id);
  const today = new Date();
  $('consultedAt').value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  if ($('rConsultedAt')) $('rConsultedAt').value = $('consultedAt').value;
  let db = { candidates: [], evidences: [], researches: [] };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.candidates) && Array.isArray(parsed.evidences)) db = { candidates: parsed.candidates, evidences: parsed.evidences.map(normalizeEvidence), researches: Array.isArray(parsed.researches) ? parsed.researches : [] };
      }
      $('storageStatus').textContent = 'Armazenamento local disponível neste navegador.';
    } catch (e) {
      $('storageStatus').textContent = 'Não foi possível ler o armazenamento local. Verifique as permissões do navegador.';
    }
    render();
  }
  function normalizeEvidence(x) {
    return { ...x, polarity: x.polarity || 'inconclusive', relevance: Number(x.relevance || 3),
      reliability: Number(x.reliability || 3), impact: Number(x.impact || 3),
      relation: x.relation || 'direct', status: x.status || 'investigating',
      counterpoints: x.counterpoints || '', independenceKey: x.independenceKey || '' };
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
      $('storageStatus').textContent = 'Dados salvos localmente neste navegador.';
      return true;
    } catch (e) {
      $('storageStatus').textContent = 'Falha ao salvar. O armazenamento pode estar cheio ou bloqueado; exporte um backup e verifique as configurações.';
      alert('Não foi possível salvar no armazenamento local. Exporte os dados existentes e verifique o navegador.');
      return false;
    }
  }
  const id = () => (crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const candidateName = cid => db.candidates.find(c => c.id === cid)?.name || '(pesquisa removida)';
  const fmtDate = d => d ? new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR') : 'Não informada';

  $('candidateForm').addEventListener('submit', e => {
    e.preventDefault();
    const existingId = $('candidateId').value;
    const item = {
      id: existingId || id(),
      name: $('candidateName').value.trim(),
      country: $('country').value.trim(),
      year: $('year').value,
      office: $('office').value,
      state: $('state').value.trim(),
      party: $('party').value.trim(),
      updatedAt: new Date().toISOString()
    };
    if (!item.name || !item.country || !item.year || !item.office) return;
    const idx = db.candidates.findIndex(c => c.id === item.id);
    if (idx >= 0) db.candidates[idx] = item; else db.candidates.push(item);
    if (save()) { $('candidateForm').reset(); $('candidateId').value = ''; $('country').value = 'Brasil'; render(); }
  });
  $('clearCandidate').addEventListener('click', () => { $('candidateForm').reset(); $('candidateId').value=''; $('country').value='Brasil'; });

  $('evidenceForm').addEventListener('submit', e => {
    e.preventDefault();
    const existingId = $('evidenceId').value;
    const item = {
      id: existingId || id(),
      candidateId: $('eCandidate').value,
      axis: $('axis').value,
      type: $('evidenceType').value,
      consultedAt: $('consultedAt').value,
      title: $('sourceTitle').value.trim(),
      url: $('sourceUrl').value.trim(),
      summary: $('summary').value.trim(),
      caveat: $('caveat').value.trim(),
      polarity: $('polarity').value,
      relevance: Number($('relevance').value),
      reliability: Number($('reliability').value),
      impact: Number($('impact').value),
      relation: $('relation').value,
      status: $('eStatus').value,
      counterpoints: $('counterpoints').value.trim(),
      independenceKey: $('independenceKey').value.trim(),
      updatedAt: new Date().toISOString()
    };
    if (!item.candidateId || !item.title || !item.summary || !item.consultedAt) return;
    const idx = db.evidences.findIndex(x => x.id === item.id);
    if (idx >= 0) db.evidences[idx] = item; else db.evidences.push(item);
    if (save()) {
      $('evidenceForm').reset(); $('evidenceId').value = '';
      $('consultedAt').value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
      render();
    }
  });
  $('clearEvidence').addEventListener('click', () => {
    $('evidenceForm').reset(); $('evidenceId').value='';
    $('consultedAt').value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  });


  const axes = [
    'Ética institucional','Transparência e prestação de contas','Empatia e escuta pública',
    'Cidadania e participação','Direitos humanos e bem-estar social',
    'Conduta institucional e regras democráticas','Integridade e possíveis irregularidades',
    'Proteção social e tratamento de grupos vulneráveis','Constituição e participação popular',
    'Prioridades orçamentárias e impactos sociais'
  ];
  const polarityLabel = v => ({positive:'Positiva',negative:'Negativa',neutral:'Neutra',inconclusive:'Inconclusiva'}[v] || 'Inconclusiva');
  const relationLabel = v => ({direct:'Direta',indirect:'Indireta',unproven:'Não demonstrada'}[v] || 'Não informada');
  const statusLabel = v => ({confirmed:'Confirmada/documentada',contested:'Contestada',investigating:'Em apuração',refuted:'Refutada'}[v] || 'Em apuração');
  const statusFactor = v => ({confirmed:1,contested:.5,investigating:.25,refuted:0}[v] ?? 0);
  const relationFactor = v => ({direct:1,indirect:.6,unproven:0}[v] ?? 0);
  function evidenceWeight(x) {
    if (x.polarity !== 'positive' && x.polarity !== 'negative') return 0;
    return (Number(x.relevance||3)/5) * (Number(x.reliability||3)/5) * (Number(x.impact||3)/5) *
      relationFactor(x.relation || 'direct') * statusFactor(x.status || 'investigating');
  }
  function independentEvidence(es) {
    // Para evitar somar notícias que repetem o mesmo fato, conserva o maior peso por grupo informado.
    const groups = new Map(), ungrouped = [];
    es.forEach(x => {
      const w = evidenceWeight(x);
      if (!w) return;
      const key = (x.independenceKey || '').trim().toLocaleLowerCase('pt-BR');
      if (!key) { ungrouped.push({x,w}); return; }
      const prev = groups.get(key);
      if (!prev || w > prev.w) groups.set(key,{x,w});
    });
    return [...ungrouped, ...groups.values()];
  }
  function assessCandidate(cid) {
    const all = db.evidences.filter(x => x.candidateId === cid).map(normalizeEvidence);
    const eligible = independentEvidence(all);
    const pos = eligible.filter(z=>z.x.polarity==='positive').reduce((s,z)=>s+z.w,0);
    const neg = eligible.filter(z=>z.x.polarity==='negative').reduce((s,z)=>s+z.w,0);
    const total = pos + neg;
    const score = total > 0 ? Math.max(0,Math.min(10,5 + 5*(pos-neg)/total)) : null;
    const rs = db.researches.filter(r=>r.candidateId===cid);
    const latestByAxis = new Map();
    rs.forEach(r => { const old=latestByAxis.get(r.axis); if(!old || (r.updatedAt||'')>(old.updatedAt||'')) latestByAxis.set(r.axis,r); });
    const coverage = axes.length ? axes.reduce((s,a)=>s+({sufficient:1,partial:.5,insufficient:0,not_searched:0}[latestByAxis.get(a)?.status]||0),0)/axes.length : 0;
    const reliabilityAvg = eligible.length ? eligible.reduce((s,z)=>s+Number(z.x.reliability||3)/5,0)/eligible.length : 0;
    const confirmedRate = eligible.length ? eligible.filter(z=>z.x.status==='confirmed').length/eligible.length : 0;
    const confidence = eligible.length ? 100*(.6*reliabilityAvg+.4*confirmedRate) : 0;
    return {all,eligible,pos,neg,total,score,coverage,confidence,researched:latestByAxis.size,rs};
  }
  function renderResearch() {
    $('researchList').innerHTML = db.researches.length ? db.researches.slice().sort((a,b)=>(b.consultedAt||'').localeCompare(a.consultedAt||'')).map(r=>`
      <article class="record"><div class="record-head"><div><strong>${esc(candidateName(r.candidateId))}</strong> <span class="pill">${esc(r.axis)}</span>
      <p><strong>Suficiência:</strong> ${esc(({sufficient:'Suficiente',partial:'Parcial',insufficient:'Insuficiente',not_searched:'Não investigado'})[r.status]||r.status)} · <strong>Consulta:</strong> ${fmtDate(r.consultedAt)} · <strong>Período:</strong> ${esc(r.period||'Não informado')}</p>
      <p><strong>Estratégia:</strong> ${esc(r.query)} </p>${r.sources?`<p><strong>Fontes:</strong> ${esc(r.sources)}</p>`:''}${r.reason?`<p><strong>Lacunas/justificativa:</strong> ${esc(r.reason)}</p>`:''}</div>
      <div class="actions"><button class="danger" data-del-r="${esc(r.id)}">Excluir</button></div></div></article>`).join('') : '<p class="muted">Nenhum protocolo registrado.</p>';
  }
  $('researchForm').addEventListener('submit', e => {
    e.preventDefault();
    const r = {id:id(), candidateId:$('rCandidate').value, axis:$('rAxis').value, status:$('rStatus').value,
      period:$('rPeriod').value.trim(), consultedAt:$('rConsultedAt').value, query:$('rQuery').value.trim(),
      sources:$('rSources').value.trim(), reason:$('rReason').value.trim(), updatedAt:new Date().toISOString()};
    if(!r.candidateId || !r.consultedAt || !r.query) return;
    db.researches.push(r);
    if(save()){ $('researchForm').reset(); $('rConsultedAt').value=$('consultedAt').value; render(); }
  });
  $('clearResearch').addEventListener('click',()=>{ $('researchForm').reset(); $('rConsultedAt').value=$('consultedAt').value; });
  $('researchList').addEventListener('click',e=>{
    const del=e.target.closest('[data-del-r]'); if(!del)return;
    if(confirm('Excluir este protocolo de pesquisa?')){db.researches=db.researches.filter(r=>r.id!==del.dataset.delR);if(save())render();}
  });

  function renderSelect(select, firstLabel, selected='') {
    const old = selected || select.value;
    select.innerHTML = `<option value="">${esc(firstLabel)}</option>` + db.candidates
      .slice().sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'))
      .map(c=>`<option value="${esc(c.id)}">${esc(c.name)} — ${esc(c.year)} · ${esc(c.office)}</option>`).join('');
    if (db.candidates.some(c=>c.id===old)) select.value = old;
  }
  function render() {
    renderSelect($('eCandidate'),'Selecione uma pesquisa');
    renderSelect($('rCandidate'),'Selecione uma pesquisa');
    renderSelect($('filterCandidate'),'Todas as pesquisas');
    document.querySelectorAll('.compareSelect').forEach(s=>renderSelect(s,'Selecione...'));
    const axes = [...new Set(db.evidences.map(x=>x.axis))].sort();
    const oldAxis = $('filterAxis').value;
    $('filterAxis').innerHTML = '<option value="">Todos os eixos</option>' + axes.map(a=>`<option>${esc(a)}</option>`).join('');
    if (axes.includes(oldAxis)) $('filterAxis').value = oldAxis;

    renderResearch();
    $('candidateList').innerHTML = db.candidates.length ? db.candidates.map(c => {
      const count = db.evidences.filter(x=>x.candidateId===c.id).length;
      return `<article class="record"><div class="record-head"><div><strong>${esc(c.name)}</strong> <span class="pill">${count} registro(s)</span><p>${esc(c.country)} · ${esc(c.year)} · ${esc(c.office)}${c.state ? ' · '+esc(c.state):''}${c.party ? ' · Partido: '+esc(c.party):''}</p></div><div class="actions"><button class="secondary" data-edit-c="${esc(c.id)}">Editar</button><button class="danger" data-del-c="${esc(c.id)}">Excluir</button></div></div></article>`;
    }).join('') : '<p class="muted">Nenhuma pesquisa cadastrada ainda.</p>';

    const fc = $('filterCandidate').value, fa = $('filterAxis').value;
    const filtered = db.evidences.filter(x=>(!fc||x.candidateId===fc)&&(!fa||x.axis===fa))
      .sort((a,b)=>(b.consultedAt||'').localeCompare(a.consultedAt||''));
    $('evidenceList').innerHTML = filtered.length ? filtered.map(x => `<article class="record">
      <div class="record-head"><div><strong>${esc(x.title)}</strong><p><span class="pill">${esc(x.axis)}</span> <span class="pill">${esc(x.type)}</span></p></div>
      <div class="actions"><button class="secondary" data-edit-e="${esc(x.id)}">Editar</button><button class="danger" data-del-e="${esc(x.id)}">Excluir</button></div></div>
      <p><strong>Pesquisa:</strong> ${esc(candidateName(x.candidateId))} · <strong>Consulta:</strong> ${fmtDate(x.consultedAt)}</p>
      ${x.url ? `<p><strong>Fonte:</strong> <a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.url)}</a></p>`:''}
      <p><strong>Classificação:</strong> ${esc(polarityLabel(x.polarity))} · <strong>Relevância:</strong> ${Number(x.relevance||3)}/5 · <strong>Confiabilidade:</strong> ${Number(x.reliability||3)}/5 · <strong>Impacto:</strong> ${Number(x.impact||3)}/5</p>
      <p><strong>Relação:</strong> ${esc(relationLabel(x.relation))} · <strong>Situação:</strong> ${esc(statusLabel(x.status))}${x.independenceKey ? ' · <strong>Grupo:</strong> '+esc(x.independenceKey):''}</p>
      <p>${esc(x.summary).replace(/\n/g,'<br>')}</p>${x.counterpoints?`<p><strong>Contrapontos:</strong> ${esc(x.counterpoints).replace(/\n/g,'<br>')}</p>`:''}${x.caveat?`<p><strong>Limitações/contexto:</strong> ${esc(x.caveat).replace(/\n/g,'<br>')}</p>`:''}
    </article>`).join('') : '<p class="muted">Nenhum registro corresponde aos filtros selecionados.</p>';
  }

  $('candidateList').addEventListener('click', e => {
    const edit = e.target.closest('[data-edit-c]'), del = e.target.closest('[data-del-c]');
    if (edit) {
      const c = db.candidates.find(x=>x.id===edit.dataset.editC); if(!c)return;
      $('candidateId').value=c.id; $('candidateName').value=c.name; $('country').value=c.country;
      $('year').value=c.year; $('office').value=c.office; $('state').value=c.state||''; $('party').value=c.party||'';
      $('candidateForm').scrollIntoView({behavior:'smooth',block:'start'});
    }
    if (del) {
      const c = db.candidates.find(x=>x.id===del.dataset.delC); if(!c)return;
      if(confirm(`Excluir a pesquisa "${c.name}" e todos os registros de evidência associados?`)) {
        db.candidates=db.candidates.filter(x=>x.id!==c.id);
        db.evidences=db.evidences.filter(x=>x.candidateId!==c.id);
        db.researches=db.researches.filter(r=>r.candidateId!==c.id);
        if(save()) render();
      }
    }
  });
  $('evidenceList').addEventListener('click', e => {
    const edit = e.target.closest('[data-edit-e]'), del = e.target.closest('[data-del-e]');
    if (edit) {
      const x=db.evidences.find(y=>y.id===edit.dataset.editE); if(!x)return;
      $('evidenceId').value=x.id; $('eCandidate').value=x.candidateId; $('axis').value=x.axis;
      $('evidenceType').value=x.type; $('consultedAt').value=x.consultedAt; $('sourceTitle').value=x.title;
      $('sourceUrl').value=x.url||''; $('summary').value=x.summary; $('caveat').value=x.caveat||''; $('polarity').value=x.polarity||'inconclusive'; $('relevance').value=String(x.relevance||3); $('reliability').value=String(x.reliability||3); $('impact').value=String(x.impact||3); $('relation').value=x.relation||'direct'; $('eStatus').value=x.status||'investigating'; $('counterpoints').value=x.counterpoints||''; $('independenceKey').value=x.independenceKey||'';
      $('evidenceForm').scrollIntoView({behavior:'smooth',block:'start'});
    }
    if (del) {
      const x=db.evidences.find(y=>y.id===del.dataset.delE); if(!x)return;
      if(confirm('Excluir este registro de fonte/evidência?')) {
        db.evidences=db.evidences.filter(y=>y.id!==x.id);
        if(save()) render();
      }
    }
  });
  $('filterCandidate').addEventListener('change', render);
  $('filterAxis').addEventListener('change', render);

  $('compareBtn').addEventListener('click', () => {
    const ids=[...new Set(['compare1','compare2','compare3'].map(k=>$(k).value).filter(Boolean))];
    if(!ids.length){$('comparison').innerHTML='<p class="muted">Selecione pelo menos uma pesquisa.</p>';return;}
    const rows=ids.map(cid=>{
      const c=db.candidates.find(x=>x.id===cid); if(!c)return '';
      const es=db.evidences.filter(x=>x.candidateId===cid);
      const axisCounts={}; es.forEach(x=>axisCounts[x.axis]=(axisCounts[x.axis]||0)+1);
      const a=assessCandidate(cid);
       return `<tr><th>${esc(c.name)}</th><td>${esc(c.country)}</td><td>${esc(c.year)}</td><td>${esc(c.office)}</td><td>${esc(c.state||'—')}</td><td>${es.length}</td><td>${a.all.filter(x=>x.polarity==='positive').length}</td><td>${a.all.filter(x=>x.polarity==='negative').length}</td><td>${Object.entries(axisCounts).map(([ax,n])=>`${esc(ax)}: ${n}`).join('<br>')||'Nenhum registro'}</td></tr>`;
    }).join('');
    $('comparison').innerHTML=`<table><thead><tr><th>Pesquisa</th><th>País</th><th>Ano</th><th>Cargo</th><th>Estado</th><th>Total de registros</th><th>Positivas</th><th>Negativas</th><th>Registros por eixo</th></tr></thead><tbody>${rows}</tbody></table>`;
    const assessments=ids.map(cid=>{
      const c=db.candidates.find(x=>x.id===cid); if(!c)return '';
      const a=assessCandidate(cid);
      const scoreLabel=a.score===null?'Não calculável':a.score.toFixed(2).replace('.',',')+'/10';
      const coveragePct=Math.round(a.coverage*100);
      const confidencePct=Math.round(a.confidence);
      return `<article class="record"><h3>${esc(c.name)}</h3><div class="metric-grid">
        <div class="metric"><span class="muted">Balanço exploratório</span><strong>${scoreLabel}</strong><span class="muted">${a.total ? 'Positivo/negativo ponderado' : 'Sem evidências elegíveis'}</span></div>
        <div class="metric"><span class="muted">Cobertura da investigação</span><strong>${coveragePct}%</strong><div class="bar"><span style="width:${coveragePct}%"></span></div><span class="muted">${a.researched} eixo(s) com protocolo registrado; ${axes.length} eixos no protocolo-base</span></div>
        <div class="metric"><span class="muted">Confiança documental</span><strong>${confidencePct}%</strong><span class="muted">Indicador de qualidade dos registros, não probabilidade de estar correto</span></div>
      </div><p><strong>Peso positivo:</strong> ${a.pos.toFixed(2)} · <strong>Peso negativo:</strong> ${a.neg.toFixed(2)} · <strong>Registros:</strong> ${a.all.length} · <strong>Grupos independentes/evidências elegíveis:</strong> ${a.eligible.length}</p>
      ${a.coverage<.8?'<p class="notice">Cobertura abaixo de 80%: não interprete o balanço como comparação suficientemente abrangente.</p>':''}
      ${a.score===null?'<p class="notice">Não há base elegível para calcular o balanço. Isso não significa desempenho neutro ou positivo.</p>':''}</article>`;
    }).join('');
    $('assessment').innerHTML='<h3>Indicadores separados — não são um ranking automático</h3>'+assessments+'<p class="muted">Nota metodológica: a fórmula é provisória. Os indicadores não demonstram causalidade, não corrigem diferenças na disponibilidade de informação e não substituem auditoria humana independente.</p>';
  });

  $('exportBtn').addEventListener('click', () => {
    const blob=new Blob([JSON.stringify({...db, exportedAt:new Date().toISOString(), formatVersion:2},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url; a.download=`backup-pesquisa-eleitoral-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });
  $('importFile').addEventListener('change', async e => {
    const file=e.target.files && e.target.files[0]; if(!file)return;
    try {
      const parsed=JSON.parse(await file.text());
      if(!parsed || !Array.isArray(parsed.candidates)||!Array.isArray(parsed.evidences)) throw new Error('Formato inválido');
      if(!confirm('A importação substituirá os dados locais atuais. Exporte um backup antes de continuar. Deseja prosseguir?')) return;
      db={candidates:parsed.candidates,evidences:parsed.evidences.map(normalizeEvidence),researches:Array.isArray(parsed.researches)?parsed.researches:[]};
      if(save()) render();
    } catch(err) { alert('Não foi possível importar: o arquivo não parece ser um backup válido deste sistema.'); }
    finally { e.target.value=''; }
  });
  $('deleteAll').addEventListener('click', () => {
    if(confirm('Isso apagará todas as pesquisas e evidências salvas neste navegador. Esta ação não pode ser desfeita sem backup. Continuar?')) {
      db={candidates:[],evidences:[],researches:[]};
      if(save()) render();
    }
  });
  load();
})();

  /*==========================================
 TRAVAR A CÓPIA CONTEÚDO COM REF. AUTOR 
      bY: IRAÊ CÉSAR BRANDÃO - 05-2026
 ==========================================*/


//---------- BLOQUEAR CLIQUE DIREITO ----------
document.addEventListener('contextmenu', function(e) {
    e.preventDefault(); // Bloqueia o menu do botão direito
    alert("Copiar conteúdo não é permitido sem referência ao autor '© 2026 Iraê César Brandão' .");
});

// ---------- BLOQUEAR CTRL+C E CTRL+X ----------
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'x')) {
        e.preventDefault(); // Bloqueia copiar e recortar
        alert("Copiar/Recortar desativado. Cite o autor! '© 2026 Iraê César Brandão'");
    }
});
