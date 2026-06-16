package com.hydrasense.schydrasense.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardProfissionalDTO {

    // 1. VISÃO GERAL
    private int totalAtletas;
    private int sessoesUltimos7Dias;
    private double taxaMediaSudorese;
    private double variacaoMediaMassa;

    // 2. CLIMA ATUAL
    private Double temperaturaAtual;
    private Double umidadeAtual;
    private String descricaoClima;
    private Double aumentoSudoresePercent;
    private Double aguaRecomendadaLitros;

    // 3. RANKING PERFORMANCE
    private List<RankingAtletaRecord> rankingPerformance;

    // 4. MAPA DE RISCO
    private int atletasCriticos;
    private int atletasAtencao;
    private int atletasIdeais;
    private int atletasSuperingestao;
    private List<AtletaRiscoRecord> mapaRisco;

    // 5. SINTOMAS RECORRENTES
    private List<SintomaFrequenciaRecord> sintomasRecorrentes;

    // 6. ALERTAS OUTLIERS
    private List<AlertaOutlierRecord> alertasOutliers;


    // 8. TENDÊNCIA SEMANAL
    private List<TendenciaDiariaRecord> tendenciaSemanal;

    // ─── INNER RECORDS ───

    @Getter @Setter
    public static class RankingAtletaRecord {
        private Long id;
        private String nome;
        private String avatar;
        private int totalSessoes;
        private int sessoesIdeais;
        private double percentualIdeal;

        public RankingAtletaRecord(Long id, String nome, String avatar, int totalSessoes, int sessoesIdeais, double percentualIdeal) {
            this.id = id;
            this.nome = nome;
            this.avatar = avatar;
            this.totalSessoes = totalSessoes;
            this.sessoesIdeais = sessoesIdeais;
            this.percentualIdeal = percentualIdeal;
        }
    }

    @Getter @Setter
    public static class AtletaRiscoRecord {
        private Long id;
        private String nome;
        private String avatar;
        private String status;
        private String statusColor;
        private Float variacaoMassa;
        private Float taxaSudorese;
        private String alerta;

        public AtletaRiscoRecord(Long id, String nome, String avatar, String status, String statusColor, Float variacaoMassa, Float taxaSudorese, String alerta) {
            this.id = id;
            this.nome = nome;
            this.avatar = avatar;
            this.status = status;
            this.statusColor = statusColor;
            this.variacaoMassa = variacaoMassa;
            this.taxaSudorese = taxaSudorese;
            this.alerta = alerta;
        }
    }

    @Getter @Setter
    public static class SintomaFrequenciaRecord {
        private String sintoma;
        private int ocorrencias;
        private double percentual;

        public SintomaFrequenciaRecord(String sintoma, int ocorrencias, double percentual) {
            this.sintoma = sintoma;
            this.ocorrencias = ocorrencias;
            this.percentual = percentual;
        }
    }

    @Getter @Setter
    public static class AlertaOutlierRecord {
        private Long sessaoId;
        private Long atletaId;
        private String nomeAtleta;
        private String tipo;
        private String descricao;
        private String dataHora;

        public AlertaOutlierRecord(Long sessaoId, Long atletaId, String nomeAtleta, String tipo, String descricao, String dataHora) {
            this.sessaoId = sessaoId;
            this.atletaId = atletaId;
            this.nomeAtleta = nomeAtleta;
            this.tipo = tipo;
            this.descricao = descricao;
            this.dataHora = dataHora;
        }
    }


    @Getter @Setter
    public static class TendenciaDiariaRecord {
        private String dia;
        private double mediaBalancoHidrico;
        private double mediaTaxaSudorese;
        private int totalSessoes;

        public TendenciaDiariaRecord(String dia, double mediaBalancoHidrico, double mediaTaxaSudorese, int totalSessoes) {
            this.dia = dia;
            this.mediaBalancoHidrico = mediaBalancoHidrico;
            this.mediaTaxaSudorese = mediaTaxaSudorese;
            this.totalSessoes = totalSessoes;
        }
    }
}
