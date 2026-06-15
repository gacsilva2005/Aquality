package com.hydrasense.schydrasense.service;

import org.springframework.stereotype.Component;

@Component
public class CalculadoraFisiologica {

    public Float calcularTaxaSudorese(Float pesoPre, Float pesoPos, Integer hidratacaoMl, Double duracaoMinutos) {
        if (pesoPre == null || pesoPos == null) {
            return 0.0f;
        }
        float duracaoHoras = (duracaoMinutos != null && duracaoMinutos > 0) ? (float) (duracaoMinutos / 60.0) : 1.0f;
        float hidratacaoL = (hidratacaoMl != null) ? (float) hidratacaoMl / 1000.0f : 0.0f;

        // Perda de líquido = (Peso Pré - Peso Pós) + Ingestão
        float perdaLiquido = (pesoPre - pesoPos) + hidratacaoL;

        // Taxa de Sudorese = Perda / Horas
        return Math.max(0.0f, perdaLiquido / duracaoHoras);
    }

    public Float calcularBalancoHidrico(Float pesoPre, Float pesoPos) {
        if (pesoPre == null || pesoPos == null) {
            return 0.0f;
        }
        // Balanço hídrico = Peso Pós - Peso Pré
        return pesoPos - pesoPre;
    }

    public Float calcularPercentualVariacaoMassa(Float pesoPre, Float pesoPos) {
        if (pesoPre == null || pesoPos == null || pesoPre <= 0) {
            return 0.0f;
        }
        // Variação = ((Peso Pós - Peso Pré) / Peso Pré) * 100
        return ((pesoPos - pesoPre) / pesoPre) * 100.0f;
    }

    public String classificarStatusHidratacao(Float pesoPre, Float pesoPos) {
        if (pesoPre == null || pesoPos == null || pesoPre <= 0) {
            return "OPTIMAL";
        }
        
        float percentualVariacao = calcularPercentualVariacaoMassa(pesoPre, pesoPos);

        if (percentualVariacao > 1.0f) {
            // Ganho de peso superior a 1% -> Risco crítico de superingestão (Hiponatremia)
            return "OVER_HYDRATION_CRITICAL";
        } else if (percentualVariacao > 0.0f) {
            // Qualquer ganho de peso -> Atenção para superingestão
            return "OVER_HYDRATION_WARNING";
        } else if (percentualVariacao >= -1.0f) {
            // Perda de 0 a 1% -> Ideal
            return "OPTIMAL";
        } else if (percentualVariacao >= -2.0f) {
            // Perda de 1 a 2% -> Atenção
            return "WARNING";
        } else {
            // Perda > 2% -> Crítico
            return "CRITICAL";
        }
    }
}
