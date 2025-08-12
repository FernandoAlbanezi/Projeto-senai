// Dados iniciais e variáveis globais
let lotes = [];
let activities = [];
let recentScans = [];

document.addEventListener('DOMContentLoaded', () => {
  inicializarDados();
  atualizarTabelaLotes();
  atualizarAtividadesRecentes();

  // Botões modais
  document.getElementById('btnAddLote').addEventListener('click', abrirModalAddLote);
  document.getElementById('closeAddLote').addEventListener('click', fecharModalAddLote);
  document.getElementById('cancelAddLote').addEventListener('click', fecharModalAddLote);
  document.getElementById('addLoteForm').addEventListener('submit', adicionarLote);
  document.getElementById('closeLoteDetails').addEventListener('click', fecharModalDetalhes);

  // Botão abrir receptor vídeo do celular
  document.getElementById('btnOpenReceiver').addEventListener('click', () => {
    window.open('receiver.html', '_blank');
  });
});

function inicializarDados() {
  lotes = [
    {
      id: 'LT001',
      produto: 'Produto A',
      status: 'producao',
      localizacao: 'Linha de Produção 1',
      validade: '2024-06-15',
      dataEntrada: '2024-01-15',
      imagens: ['https://placehold.co/300x200'],
      historico: [
        { data: '2024-01-15 09:00', acao: 'Entrada no estoque', local: 'Armazém A' },
        { data: '2024-01-20 14:00', acao: 'Início da produção', local: 'Linha de Produção 1' }
      ]
    }
  ];

  activities = [
    { data: '2024-01-25 15:30', acao: 'Lote LT001 movido para Linha de Produção 1', tipo: 'movimento' }
  ];
}

function atualizarTabelaLotes() {
  const tbody = document.getElementById('lotesTableBody');
  tbody.innerHTML = lotes.map(lote => `
    <tr>
      <td>${lote.id}</td>
      <td>${lote.produto}</td>
      <td><span class="${getStatusClass(lote.status)}">${getStatusText(lote.status)}</span></td>
      <td>${lote.localizacao}</td>
      <td>${formatarData(lote.validade)}</td>
      <td>${formatarData(lote.dataEntrada)}</td>
      <td>
        <button class="btn-action" onclick="mostrarDetalhesLote('${lote.id}')"><i class="fas fa-eye"></i></button>
      </td>
    </tr>
  `).join('');
}

function atualizarAtividadesRecentes() {
  const ul = document.getElementById('recentActivityList');
  ul.innerHTML = activities.map(act => `<li>${act.data} - ${act.acao}</li>`).join('');
}

function abrirModalAddLote() {
  document.getElementById('addLoteModal').classList.remove('hidden');
}

function fecharModalAddLote() {
  document.getElementById('addLoteModal').classList.add('hidden');
}

function adicionarLote(event) {
  event.preventDefault();
  const produto = document.getElementById('newLoteProduto').value;
  const localizacao = document.getElementById('newLoteLocalizacao').value;
  const validade = document.getElementById('newLoteValidade').value;

  const novoLote = {
    id: `LT${(lotes.length + 1).toString().padStart(3, '0')}`,
    produto,
    status: 'estoque',
    localizacao,
    validade,
    dataEntrada: new Date().toISOString().slice(0, 10),
    imagens: ['https://placehold.co/300x200'],
    historico: [{ data: new Date().toISOString().slice(0, 16).replace('T', ' '), acao: 'Lote registrado', local: localizacao }]
  };

  lotes.push(novoLote);
  activities.unshift({ data: new Date().toISOString().slice(0, 16).replace('T', ' '), acao: `Novo lote ${novoLote.id} registrado` });

  atualizarTabelaLotes();
  atualizarAtividadesRecentes();
  fecharModalAddLote();

  alert('Lote adicionado com sucesso!');
}

function mostrarDetalhesLote(loteId) {
  const lote = lotes.find(l => l.id === loteId);
  if (!lote) return alert('Lote não encontrado.');

  const container = document.getElementById('loteDetailsContent');
  container.innerHTML = `
    <h3>Detalhes do Lote ${lote.id}</h3>
    <p><strong>Produto:</strong> ${lote.produto}</p>
    <p><strong>Status:</strong> ${getStatusText(lote.status)}</p>
    <p><strong>Localização:</strong> ${lote.localizacao}</p>
    <p><strong>Validade:</strong> ${formatarData(lote.validade)}</p>
    <p><strong>Data Entrada:</strong> ${formatarData(lote.dataEntrada)}</p>
    <h4>Histórico</h4>
    <ul>
      ${lote.historico.map(h => `<li>${h.data} - ${h.acao} (${h.local})</li>`).join('')}
    </ul>
  `;

  document.getElementById('loteDetailsModal').classList.remove('hidden');
}

function fecharModalDetalhes() {
  document.getElementById('loteDetailsModal').classList.add('hidden');
}

function getStatusClass(status) {
  switch (status) {
    case 'producao': return 'status-producao';
    case 'inspecao': return 'status-inspecao';
    case 'estoque': return 'status-estoque';
    case 'transporte': return 'status-transporte';
    case 'finalizado': return 'status-finalizado';
    default: return '';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'producao': return 'Produção';
    case 'inspecao': return 'Inspeção';
    case 'estoque': return 'Estoque';
    case 'transporte': return 'Transporte';
    case 'finalizado': return 'Finalizado';
    default: return 'Desconhecido';
  }
}

function formatarData(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR');
}
