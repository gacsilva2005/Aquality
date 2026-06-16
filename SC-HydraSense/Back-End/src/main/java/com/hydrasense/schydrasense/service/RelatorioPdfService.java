package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.dto.RelatorioPdfDTO;
import com.hydrasense.schydrasense.dto.RelatorioEquipeDTO;
import com.hydrasense.schydrasense.dto.RelatorioGeralDTO;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.repository.EstatisticasProjection;
import com.hydrasense.schydrasense.repository.SessaoDeTreinoRepository;
import org.springframework.stereotype.Service;

@Service
public class RelatorioPdfService {

    private final SessaoDeTreinoService sessaoService;
    private final SessaoDeTreinoRepository sessaoRepository;
    private final PdfResourceService pdfResourceService;
    private final CalculadoraFisiologica calculadora;

    public RelatorioPdfService(
            SessaoDeTreinoService sessaoService,
            SessaoDeTreinoRepository sessaoRepository,
            PdfResourceService pdfResourceService,
            CalculadoraFisiologica calculadora) {
        this.sessaoService = sessaoService;
        this.sessaoRepository = sessaoRepository;
        this.pdfResourceService = pdfResourceService;
        this.calculadora = calculadora;
    }

    public RelatorioPdfDTO gerarPayloadRelatorio(Long sessaoId) {
        // 1. Busca os dados brutos
        SessaoDeTreino sessao = sessaoRepository.findById(sessaoId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada para PDF"));
        
        Atleta atleta = sessao.getAtleta();
        Long atletaId = atleta.getId();

        // 2. Cálculo Exato de Variação (Segurança Fisiológica)
        Float pesoPre = sessao.getPesagemPre() != null ? sessao.getPesagemPre().getPeso() : 0f;
        Float pesoPos = sessao.getPesagemPos() != null ? sessao.getPesagemPos().getPeso() : 0f;
        Float variacaoPercentual = calculadora.calcularPercentualVariacaoMassa(pesoPre, pesoPos);
        String statusRisco = calculadora.classificarStatusHidratacao(pesoPre, pesoPos);

        Boolean isSuperingestao = variacaoPercentual > 0.0f;
        Boolean isDesidratacaoSevera = variacaoPercentual <= -2.0f;

        // 3. Imagens Offline (Base64) - Fallback transparente embutido de 2.5s timeout
        String fotoAtletaBase64 = pdfResourceService.convertUrlToBase64(atleta.getFotoPerfil());

        // 4. Estatísticas Agregadas Direto no MySQL (Prevenção OOM)
        EstatisticasProjection estatisticaBD = sessaoRepository.getEstatisticasAtleta(atletaId);
        
        // Tratar dados ausentes para evitar NullPointerException e falhas de renderização
        Float mediaTaxa = estatisticaBD != null && estatisticaBD.getMediaTaxaSudorese() != null ? estatisticaBD.getMediaTaxaSudorese() : 0f;
        Float desvioPadrao = estatisticaBD != null && estatisticaBD.getDesvioPadraoTaxaSudorese() != null ? estatisticaBD.getDesvioPadraoTaxaSudorese() : 0f;

        // Montagem do Contrato Aninhado Estrito
        RelatorioPdfDTO.PreSessaoRecord preSessao = new RelatorioPdfDTO.PreSessaoRecord(
                pesoPre,
                sessao.getCondicaoAmbiental() != null && sessao.getCondicaoAmbiental().getTemperatura() != null ? sessao.getCondicaoAmbiental().getTemperatura() : 25f,
                sessao.getCondicaoAmbiental() != null && sessao.getCondicaoAmbiental().getUmidade() != null ? sessao.getCondicaoAmbiental().getUmidade().intValue() : 50,
                sessao.getAvaliacaoBasalPre() != null ? (sessao.getAvaliacaoBasalPre().getUrina() != null ? String.valueOf(sessao.getAvaliacaoBasalPre().getUrina()) : sessao.getAvaliacaoBasalPre().getCorUrina()) : "3",
                sessao.getChecklistVestimentaCorreta(),
                sessao.getChecklistBexiga(),
                sessao.getChecklistBalancaCorreta()
        );

        RelatorioPdfDTO.DuranteRecord durante = new RelatorioPdfDTO.DuranteRecord(
                (int) sessao.calcularDuracaoTotal() * 60,
                sessao.getRegistroDeHidratacao() != null ? sessao.getRegistroDeHidratacao().getVolume().intValue() : 0,
                sessao.getIntensidadePercebida() != null ? Integer.parseInt(sessao.getIntensidadePercebida().replaceAll("\\D", "")) : 5,
                0 // Volume urinário fixo em zero por enquanto
        );

        RelatorioPdfDTO.PosSessaoRecord pos = new RelatorioPdfDTO.PosSessaoRecord(
                pesoPos,
                sessao.getBalancoHidrico(),
                sessao.getRegistroDeSintomaPos() != null ? sessao.getRegistroDeSintomaPos().getSintomas() : (sessao.getRegistroDeSintomaPre() != null ? sessao.getRegistroDeSintomaPre().getSintomas() : "Nenhum"),
                "Boa" // Placeholder
        );

        RelatorioPdfDTO.MotorSudoreseRecord motor = new RelatorioPdfDTO.MotorSudoreseRecord(
                sessao.getTaxaSudorese(),
                variacaoPercentual,
                sessao.getBalancoHidrico(),
                statusRisco,
                isSuperingestao,
                isDesidratacaoSevera,
                "Recomendada ingestão hídrica imediata."
        );

        RelatorioPdfDTO.EstatisticaLongitudinalRecord estatisticas = new RelatorioPdfDTO.EstatisticaLongitudinalRecord(
                mediaTaxa,
                mediaTaxa, // Mediana aproximada temporária
                desvioPadrao,
                new String[]{"10 Jun", "11 Jun", "12 Jun", "14 Jun", "15 Jun"}, // Stub Chart.js
                new Float[]{1.1f, 1.2f, 1.4f, 1.0f, sessao.getTaxaSudorese()} // Stub Chart.js
        );

        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String dataGeracao = java.time.LocalDateTime.now().format(formatter);

        RelatorioPdfDTO.AtletaRecord atletaRecord = new RelatorioPdfDTO.AtletaRecord(
                atleta.getNome() != null ? atleta.getNome() : "Desconhecido",
                "ID-" + atleta.getId(),
                atleta.getModalidade() != null ? atleta.getModalidade() : sessao.getModalidade(),
                fotoAtletaBase64
        );

        return new RelatorioPdfDTO(
                sessao.getId(),
                sessao.getModalidade(),
                sessao.getDataHoraInicio(),
                sessao.getDataHoraFim(),
                preSessao,
                durante,
                pos,
                motor,
                estatisticas,
                null, // Logo Equipe offline stub
                atletaRecord,
                dataGeracao
        );
    }

    public RelatorioGeralDTO gerarPayloadGeral(Long clubeId) {
        return new RelatorioGeralDTO(
            System.currentTimeMillis(),
            LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            "1.5%",
            "87%",
            124,
            8,
            List.of(
                new RelatorioGeralDTO.EquipeRankingRecord("Sub-20", 95),
                new RelatorioGeralDTO.EquipeRankingRecord("Profissional B", 88),
                new RelatorioGeralDTO.EquipeRankingRecord("Feminino A", 85)
            )
        );
    }

    public RelatorioEquipeDTO gerarPayloadEquipe(Long equipeId) {
        // Retornando os dados mockados que seguem o formato do novo DTO de Equipe
        List<RelatorioEquipeDTO.AtletaResumoRecord> atletas = List.of(
            new RelatorioEquipeDTO.AtletaResumoRecord("João Silva", "Ideal", 0.5f, 1.1f),
            new RelatorioEquipeDTO.AtletaResumoRecord("Carlos Souza", "Atenção", -1.2f, 1.5f),
            new RelatorioEquipeDTO.AtletaResumoRecord("Fernando Reis", "Crítico", -2.5f, 2.1f)
        );

        return new RelatorioEquipeDTO(
            System.currentTimeMillis(),
            "Equipe Principal " + equipeId,
            LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            atletas
        );
    }

    public Object gerarPayloadSessao(Long sessaoId) {
        // Delega para o método existente de sessão
        return gerarPayloadRelatorio(sessaoId);
    }
}
