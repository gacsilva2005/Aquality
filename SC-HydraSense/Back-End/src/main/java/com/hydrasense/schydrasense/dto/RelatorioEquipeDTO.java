package com.hydrasense.schydrasense.dto;

import java.util.List;

public record RelatorioEquipeDTO(
        Long sessaoId,
        String nomeEquipe,
        String dataGeracao,
        List<AtletaResumoRecord> atletas
) {
    public record AtletaResumoRecord(
            String nome,
            String status,
            Float variacao,
            Float taxa
    ) {}
}
