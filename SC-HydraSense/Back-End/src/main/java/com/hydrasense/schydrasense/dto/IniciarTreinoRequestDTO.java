package com.hydrasense.schydrasense.dto;

public record IniciarTreinoRequestDTO(
        Long atletaId,
        String modalidade,
        Float pesoPreTreino
) {}
