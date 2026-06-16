package com.hydrasense.schydrasense.dto;

import java.util.List;

public record RelatorioGeralDTO(
        Long sessaoId,
        String dataGeracao,
        String mediaDesidratacao,
        String aderenciaGeral,
        Integer totalAtletasAtivos,
        Integer atletasCriticos,
        List<EquipeRankingRecord> rankingEquipes
) {
    public record EquipeRankingRecord(
            String nome,
            Integer adequacao
    ) {}
}
