package com.hydrasense.schydrasense.dto;

import java.time.LocalDateTime;

public record RelatorioPdfDTO(
        Long sessaoId,
        String modalidade,
        LocalDateTime dataHoraInicio,
        LocalDateTime dataHoraFim,
        
        // Estruturas Aninhadas
        PreSessaoRecord preSessao,
        DuranteRecord durante,
        PosSessaoRecord posSessao,
        
        // Dados Calculados / Riscos
        MotorSudoreseRecord motorSudorese,
        EstatisticaLongitudinalRecord estatistica,
        
        // Recursos em Base64 (Para renderização offline segura)
        // Recursos em Base64 (Para renderização offline segura)
        String equipeLogoBase64,
        
        // Dados do Atleta
        AtletaRecord atleta,
        
        // Data formatada para o cabecalho
        String dataGeracao
) {

    public record AtletaRecord(
            String nome,
            String identificacao,
            String modalidade,
            String fotoBase64
    ) {}

    public record PreSessaoRecord(
            Float pesoInicial,
            Float temperatura,
            Integer umidade,
            String corUrinaBasal,
            Boolean checklistVestimenta,
            Boolean checklistBexigaVazia,
            Boolean checklistBalancaCorreta
    ) {}

    public record DuranteRecord(
            Integer duracaoSegundos,
            Integer hidratacaoTotalMl,
            Integer intensidadeRpe,
            Integer volumeUrinarioMl
    ) {}

    public record PosSessaoRecord(
            Float pesoFinal,
            Float variacaoAbsolutaKg,
            String sintomasRelatados,
            String tolerancia
    ) {}

    public record MotorSudoreseRecord(
            Float taxaSudoreseEstimada,
            Float variacaoPercentualMassa,
            Float balancoHidrico,
            
            // Flags de Risco (Engine)
            String statusHidratacao, 
            Boolean isRiscoSuperingestao,
            Boolean isRiscoDesidratacaoSevera,
            String acaoRecomendada
    ) {}

    public record EstatisticaLongitudinalRecord(
            Float mediaTaxaSudorese,
            Float medianaTaxaSudorese,
            Float desvioPadraoTaxaSudorese,
            // Vetores para o Chart.js
            String[] ultimasSessoesDatas,
            Float[] ultimasSessoesTaxas
    ) {}
}
