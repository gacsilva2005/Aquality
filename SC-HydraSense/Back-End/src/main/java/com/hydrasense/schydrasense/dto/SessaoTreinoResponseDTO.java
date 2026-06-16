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
        String statusHidratacao,
        String sintomasPre,
        String sintomasPos,
        Integer urinaPre,
        Integer urinaPos,
        Integer sedePre,
        Integer sedePos,
        Boolean usouEquipamento,
        Float pesoKitKg,
        String nomeKit,
        Boolean checklistBexiga,
        Boolean checklistBalancaCorreta,
        Boolean checklistSuperficiePlana,
        Boolean checklistVestimentaCorreta,
        Boolean checklistSemCalcados
) {}