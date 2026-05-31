package com.hydrasense.schydrasense.dto;

import java.time.LocalDateTime;

public record SessaoTreinoResponseDTO(
        Long id,
        LocalDateTime dataHoraInicio,
        LocalDateTime dataHoraFim,
        String modalidade,
        Integer duracaoSegundos,
        Float pesoPre,
        Float pesoPos,
        Integer hidratacaoMl,
        Float taxaSudorese,
        Float balancoHidrico,
        String statusHidratacao
) {}
