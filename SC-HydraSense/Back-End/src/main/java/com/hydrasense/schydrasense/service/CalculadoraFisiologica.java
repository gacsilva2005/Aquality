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

    public String classificarStatusHidratacao(Float pesoPre, Float pesoPos) {
        if (pesoPre == null || pesoPos == null || pesoPre <= 0) {
            return "OPTIMAL";
        }
        float perdaPeso = pesoPre - pesoPos;
        if (perdaPeso <= 0) {
            return "OPTIMAL";
        }
        float percentualPerda = (perdaPeso / pesoPre) * 100.0f;

        if (percentualPerda < 1.0f) {
            return "OPTIMAL";
        } else if (percentualPerda <= 2.0f) {
            return "WARNING";
        } else {
            return "CRITICAL";
        }
    }
}
